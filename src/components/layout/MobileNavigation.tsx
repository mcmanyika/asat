"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { mainNavigation } from "@/config/navigation";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [menuPath, setMenuPath] = useState(pathname);
  const panelId = useId();

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center border border-border text-primary-text"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open ? (
        <div
          id={panelId}
          className="fixed inset-x-0 top-[var(--header-offset,112px)] z-40 max-h-[calc(100vh-var(--header-offset,112px))] overflow-y-auto border-t border-border bg-white shadow-lg"
        >
          <nav aria-label="Mobile primary" className="space-y-1 px-4 py-4">
            {mainNavigation.map((item) => {
              const active = isActive(pathname, item.href);
              const hasChildren = Boolean(item.children?.length);
              const isExpanded = expanded === item.href;

              return (
                <div key={item.href} className="border-b border-border py-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex-1 py-3 text-sm font-semibold",
                        active ? "text-corporate-blue" : "text-primary-text",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {hasChildren ? (
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center text-secondary-text"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                        onClick={() =>
                          setExpanded((current) =>
                            current === item.href ? null : item.href,
                          )
                        }
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    ) : null}
                  </div>
                  {hasChildren && isExpanded ? (
                    <div className="mb-3 space-y-1 border-l border-border pl-3">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block py-2 text-sm",
                            isActive(pathname, child.href)
                              ? "font-medium text-corporate-blue"
                              : "text-secondary-text",
                          )}
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div className="pt-4">
              <ButtonLink href="/request-quote" className="w-full">
                Request a Quote
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
