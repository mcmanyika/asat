import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Staff Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-light-bg">
      {children}
    </div>
  );
}
