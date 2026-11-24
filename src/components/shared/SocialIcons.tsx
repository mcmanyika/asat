import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6l.4-3H14V9z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M6.5 9.5H4V20h2.5V9.5zM5.2 4A1.5 1.5 0 1 0 5.2 7a1.5 1.5 0 0 0 0-3zM20 20h-2.5v-5.6c0-1.6-.6-2.4-1.8-2.4-1 0-1.5.6-1.8 1.3-.1.2-.1.6-.1.9V20H11V9.5h2.4v1.4c.5-.8 1.5-1.7 3.3-1.7 2.3 0 3.3 1.5 3.3 4.4V20z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5zM17.2 7.3a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23 12.2s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2C18.8 5 12 5 12 5s-6.8 0-8.6.5a2.9 2.9 0 0 0-2 2C1 9 1 12.2 1 12.2s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2C5.2 19.4 12 19.4 12 19.4s6.8 0 8.6-.5a2.9 2.9 0 0 0 2-2c.4-1.5.4-4.7.4-4.7zM9.8 15.3V9.1l5.5 3.1-5.5 3.1z" />
    </svg>
  );
}
