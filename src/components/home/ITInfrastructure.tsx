import Image from "next/image";
import { Shield, ShieldCheck, Network } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { SectionHeading } from "@/components/shared/SectionHeading";

const items = [
  {
    title: "Antivirus Solutions",
    description:
      "Business-focused endpoint protection and malware prevention.",
    icon: ShieldCheck,
    href: "/solutions/antivirus",
  },
  {
    title: "Firewalls",
    description:
      "Network security and protection against unauthorized access.",
    icon: Shield,
    href: "/solutions/firewalls",
  },
  {
    title: "Networking Solutions",
    description:
      "Reliable connectivity, network equipment and business infrastructure.",
    icon: Network,
    href: "/solutions/networking",
  },
] as const;

export function ITInfrastructure() {
  return (
    <section className="bg-light-bg py-16 md:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-4/3 overflow-hidden border border-border bg-navy shadow-sm">
            <Image
              src="/images/solutions/network-server.png"
              alt="Network server and IT infrastructure equipment"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHeading
              title="Keeping Your Business Connected and Protected."
              className="mb-8"
            />
            <div className="space-y-5">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center border border-border bg-white text-corporate-blue">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-text">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-secondary-text">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <ButtonLink href="/solutions">Explore IT Solutions</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
