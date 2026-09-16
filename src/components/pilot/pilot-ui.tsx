import { useEffect, useState, type ReactNode } from "react";

import { PILOT_PHONE_DISPLAY, PILOT_PHONE_TEL, PILOT_WHATSAPP } from "./pilot-content";

/* ── Icon set — hand drawn, 1.5px stroke, inherits currentColor ───── */

const box = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.5,
};

export function IconClock({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </svg>
  );
}

export function IconPin({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <path d="M12 21c4.2-4.4 6.3-7.7 6.3-10.3A6.3 6.3 0 0 0 5.7 10.7C5.7 13.3 7.8 16.6 12 21Z" />
      <circle cx="12" cy="10.4" r="2.3" />
    </svg>
  );
}

export function IconShield({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <path d="M12 3 4.8 5.8v5.6c0 4.2 2.9 7.7 7.2 9.2 4.3-1.5 7.2-5 7.2-9.2V5.8Z" />
      <path d="m9.2 12 2 2.1 3.6-4" />
    </svg>
  );
}

export function IconTransfer({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <path d="M3 15h18M5.4 15l1.5-4.6A2.4 2.4 0 0 1 9.2 8.7h5.6a2.4 2.4 0 0 1 2.3 1.7l1.5 4.6" />
      <path d="M6.4 15v2.4M17.6 15v2.4" />
      <circle cx="8.2" cy="12.2" r="0.1" />
      <circle cx="15.8" cy="12.2" r="0.1" />
    </svg>
  );
}

export function IconWhatsApp({ size = 17 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <path d="M20.2 11.7a8.2 8.2 0 0 1-12.2 7.2L3.8 20.2l1.4-4.1A8.2 8.2 0 1 1 20.2 11.7Z" />
      <path d="M9 9.2c.3 2.2 2.4 4.4 4.7 4.9l1-1.3 1.8.9c-.4 1.2-1.7 1.6-2.9 1.3-2.7-.7-5-3-5.7-5.7-.3-1.2.1-2.4 1.3-2.8l.9 1.8Z" />
    </svg>
  );
}

export function IconArrow({ size = 15 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="pilot-cta-rent__arrow"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...box}
    >
      <path d="M4 12h15m-5.6-5.6L19 12l-5.6 5.6" />
    </svg>
  );
}

export function IconPlus({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="pilot-faq__sign"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...box}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const CLAIM_ICONS = {
  clock: IconClock,
  pin: IconPin,
  shield: IconShield,
  transfer: IconTransfer,
};

export function ClaimIcon({ name }: { name: keyof typeof CLAIM_ICONS }) {
  const Glyph = CLAIM_ICONS[name];
  return <Glyph />;
}

/* ── CTA garments ────────────────────────────────────────────────── */

export function CtaWhatsApp({ children }: { children: ReactNode }) {
  return (
    <a className="pilot-cta-whatsapp" href={PILOT_WHATSAPP} rel="noreferrer" target="_blank">
      <IconWhatsApp />
      <span>{children}</span>
    </a>
  );
}

export function CtaCall() {
  return (
    <a className="pilot-cta-call" href={`tel:${PILOT_PHONE_TEL}`}>
      {PILOT_PHONE_DISPLAY}
    </a>
  );
}

export function CtaRent({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="pilot-cta-rent" href={href} rel="noreferrer" target="_blank">
      <span>{children}</span>
      <IconArrow />
    </a>
  );
}

export function CtaPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="pilot-cta-pill" href={href}>
      <span className="pilot-cta-pill__dot" />
      <span>{children}</span>
    </a>
  );
}

/* ── Entrance motion — transform only, fired on mount ─────────────── */

export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShown(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  return (
    <div className={["pilot-rise", className].filter(Boolean).join(" ")} data-shown={shown}>
      {children}
    </div>
  );
}
