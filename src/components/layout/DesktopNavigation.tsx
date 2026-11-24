"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { mainNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
      {mainNavigation.map((item) => {
        const active = isActive(pathname, item.href);
        const hasChildren = Boolean(item.children?.length);

        if (!hasChildren) {
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "rounded-[4px] px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "text-corporate-blue"
                  : "text-primary-text hover:text-corporate-blue",
              )}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <div key={`${item.href}-${item.label}`} className="group relative">
            <Link
              href={item.href}
              className={cn(
                "inline-flex items-center gap-1 rounded-[4px] px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "text-corporate-blue"
                  : "text-primary-text hover:text-corporate-blue",
              )}
              aria-haspopup="menu"
            >
              {item.label}
              <ChevronDown
                className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                aria-hidden
              />
            </Link>
            <div className="invisible absolute top-full left-0 z-50 min-w-64 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div
                role="menu"
                className="mt-1 border border-border bg-white py-2 shadow-lg"
              >
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    role="menuitem"
                    className={cn(
                      "block px-4 py-2.5 text-sm transition-colors hover:bg-light-bg hover:text-corporate-blue",
                      isActive(pathname, child.href)
                        ? "bg-light-bg font-medium text-corporate-blue"
                        : "text-primary-text",
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
