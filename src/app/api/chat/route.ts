import OpenAI from "openai";
import { z } from "zod";
import { asatChatSystemPrompt } from "@/lib/chat/system-prompt";
import {
  chatEnquiryToolSchema,
  saveEnquiryTool,
} from "@/lib/chat/enquiry-tool";
import { saveEnquiry } from "@/lib/supabase/enquiries";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
});

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return Response.json(
      {
        error:
          "OpenAI chat is not configured. Add OPENAI_API_KEY to your environment.",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid chat payload." }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });
  const model = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: asatChatSystemPrompt },
    ...parsed.data.messages,
  ];

  try {
    let enquirySaved = false;
    let enquiryId: string | undefined;

    // Allow one tool round-trip for enquiry capture, then a final reply.
    for (let step = 0; step < 2; step += 1) {
      const completion = await openai.chat.completions.create({
        model,
        temperature: 0.4,
        max_tokens: 700,
        tools: [saveEnquiryTool],
        tool_choice: step === 0 ? "auto" : "none",
        messages,
      });

      const choice = completion.choices[0];
      const assistantMessage = choice?.message;

      if (!assistantMessage) {
        return Response.json(
          { error: "No response generated. Please try again." },
          { status: 500 },
        );
      }

      const toolCalls = assistantMessage.tool_calls || [];

      if (toolCalls.length === 0) {
        const message =
          assistantMessage.content?.trim() ||
          "How else can I help you with ASAT Technologies today?";

        return Response.json({
          message,
          enquirySaved,
          enquiryId,
        });
      }

      messages.push({
        role: "assistant",
        content: assistantMessage.content,
        tool_calls: toolCalls,
      });

      for (const toolCall of toolCalls) {
        if (
          toolCall.type !== "function" ||
          toolCall.function.name !== "save_enquiry"
        ) {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              ok: false,
              error: "Unsupported tool requested.",
            }),
          });
          continue;
        }

        let args: unknown;
        try {
          args = JSON.parse(toolCall.function.arguments || "{}");
        } catch {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              ok: false,
              error: "Invalid enquiry payload.",
            }),
          });
          continue;
        }

        const enquiry = chatEnquiryToolSchema.safeParse(args);
        if (!enquiry.success) {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              ok: false,
              error:
                "Missing or invalid enquiry fields. Ask the visitor for the remaining required details and privacy consent.",
              details: enquiry.error.flatten(),
            }),
          });
          continue;
        }

        const saved = await saveEnquiry({
          type: enquiry.data.type,
          full_name: enquiry.data.fullName,
          company_name: enquiry.data.companyName,
          email: enquiry.data.email,
          telephone: enquiry.data.telephone,
          interest: enquiry.data.interest,
          subject: enquiry.data.subject?.trim() || null,
          message: enquiry.data.message,
          privacy_consent: enquiry.data.privacyConsent,
          source: "chatbot",
        });

        if (saved.ok) {
          enquirySaved = true;
          enquiryId = saved.id;
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              ok: true,
              id: saved.id,
              message: "Enquiry saved successfully.",
            }),
          });
        } else {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              ok: false,
              error: saved.error,
            }),
          });
        }
      }
    }

    return Response.json({
      message:
        "Thanks for your details. If anything else is needed, our team will follow up shortly.",
      enquirySaved,
      enquiryId,
    });
  } catch (error) {
    console.error("OpenAI chat error:", error);
    return Response.json(
      { error: "Unable to generate a response right now. Please try again." },
      { status: 500 },
    );
  }
}
