"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { Container } from "@/components/shared/Container";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { OpenChatButton } from "@/components/shared/OpenChatButton";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["0%", "12%"],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["0%", "6%"],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    reduceMotion ? [1, 1] : [1, 0.55],
  );

  function scrollToNextSection() {
    const next = sectionRef.current?.nextElementSibling;
    if (next instanceof HTMLElement) {
      next.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[calc(100dvh-var(--header-offset,112px))] overflow-hidden bg-navy text-white"
    >
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/hero/hero-background-photo.png"
          alt="Laptop, POS terminal, receipt printer and barcode scanner in a modern business environment"
          fill
          priority
          className="object-cover object-[48%_72%] max-md:object-[42%_70%]"
          sizes="100vw"
          quality={90}
        />
      </motion.div>

      {/* Soft left readability scrim — keeps hardware visible on the right */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(11,22,40,0.88)_0%,rgba(11,22,40,0.72)_28%,rgba(11,22,40,0.35)_52%,rgba(11,22,40,0.08)_72%,transparent_100%)] max-md:bg-[linear-gradient(180deg,rgba(11,22,40,0.82)_0%,rgba(11,22,40,0.62)_48%,rgba(11,22,40,0.45)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left_center,rgba(11,22,40,0.55)_0%,transparent_58%)] max-md:hidden"
        aria-hidden
      />

      <Container className="relative z-10 flex min-h-[calc(100dvh-var(--header-offset,112px))] items-center py-16">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="max-w-xl will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-accent-cyan sm:w-10" aria-hidden />
              <p className="text-xs font-semibold tracking-[0.2em] text-white/95 uppercase sm:text-sm">
                Your Trusted Technology Partner
              </p>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-balance drop-shadow-[0_2px_18px_rgba(11,22,40,0.55)] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
              Empowering Business
              <br />
              Through Technology.
            </h1>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/#solutions" size="lg">
                Explore Our Solutions
              </ButtonLink>
              <OpenChatButton variant="secondary" size="lg">
                Talk to an Expert
              </OpenChatButton>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      <motion.button
        type="button"
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 text-white/85 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 md:bottom-8"
        animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <span className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase">
          Scroll
        </span>
        <ChevronDown className="size-7 stroke-[1.75]" aria-hidden />
      </motion.button>
    </section>
  );
}
