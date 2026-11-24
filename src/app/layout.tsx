import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { JsonLd } from "@/components/shared/JsonLd";
import { siteConfig } from "@/config/site";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-primary-text">
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ChatWidget />
        <span className="sr-only">{siteConfig.tagline}</span>
      </body>
    </html>
  );
}
