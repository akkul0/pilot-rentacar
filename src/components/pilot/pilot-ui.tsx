import { useEffect, useRef, useState, type ReactNode } from "react";

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

export function IconPhone({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <path d="M6.6 3.8h2.6l1.4 4-1.9 1.3a11 11 0 0 0 5.2 5.2l1.3-1.9 4 1.4v2.6a2 2 0 0 1-2.2 2A15.6 15.6 0 0 1 4.6 6a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function IconClose({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconCheck({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function IconCalendar({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <rect height="16" rx="2" width="17" x="3.5" y="5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconOrbit({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...box}>
      <ellipse cx="12" cy="12" rx="9" ry="4.2" />
      <path d="m17.6 6.4 1.9 1.7-2.4.8" />
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

export function CtaWhatsApp({ children, href = PILOT_WHATSAPP }: { children: ReactNode; href?: string }) {
  return (
    <a className="pilot-cta-whatsapp" href={href} rel="noreferrer" target="_blank">
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

export function CtaRent({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button className="pilot-cta-rent" onClick={onClick} type="button">
      <span>{children}</span>
      <IconArrow />
    </button>
  );
}

export function CtaPill({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button className="pilot-cta-pill" onClick={onClick} type="button">
      <span className="pilot-cta-pill__dot" />
      <span>{children}</span>
    </button>
  );
}

/* ── Entrance motion — revealed as it scrolls into view ──────────── */

/** Content renders visible (no-JS and SSR safe). Only blocks that start
 *  below the fold are armed, then lifted in when they reach the viewport. */
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState("armed");
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => setState("shown"), delay);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div className={["pilot-rise", className].filter(Boolean).join(" ")} data-state={state} ref={ref}>
      {children}
    </div>
  );
}

/* ── Looping video — loads near the viewport, plays only while seen ─ */

/** Muted inline loop with its exact first frame as poster. Nothing is
 *  fetched until the element nears the viewport; it pauses off screen.
 *  Reduced-motion and data-saver visitors keep the still poster. */
export function LoopVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  /** Omit for decorative footage. */
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.muted = true;
    let attached = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!attached) {
            video.src = src;
            attached = true;
          }
          video.play().catch(() => {});
        } else if (attached) {
          video.pause();
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      if (attached) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [src]);

  return (
    <video
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
      ref={ref}
    />
  );
}
