/**
 * Scene data for the scroll-scrub journey.
 *
 * Journey shape: single-shot. ONE continuous 15s take was rendered, then cut
 * into four consecutive encoded segments so the engine can lazily load and
 * scrub them chapter by chapter. There is no generation seam anywhere — each
 * segment begins on the literal next frame of the same unbroken camera move,
 * and every poster is the exact first frame of the encoded clip beside it.
 *
 * Keep this array a module constant. Changing its identity on every render
 * intentionally rebuilds the media controller.
 */
import type {
  ScrollScrubConnector,
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";


/** Brand tokens for the journey layer. Set from app/design-brief.md. */
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#e5302b",
  background: "#0b0d10",
  ink: "#f5f6f7",
  muted: "#8d949c",
};

// Preserve the removed chapter's footage without restoring its text or nav item.
export const scrollScrubConnectors: (ScrollScrubConnector | null)[] = [
  {
    clip: "/assets/world/scene-02.mp4",
    mobileClip: "/assets/world/scene-02-mobile.mp4",
    poster: "/assets/world/scene-02-poster.png",
    mobilePoster: "/assets/world/scene-02-mobile-poster.png",
    scroll: 1.4,
  },
  null,
];

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    body: "Aracınızı Antalya Havalimanı’ndan veya otelinizden teslim alın. Rezervasyon ve teslimat için bizi arayın.",
    clip: "/assets/world/scene-01.mp4",
    id: "scene-01",
    kicker: "Pilot Rent a Car",
    label: "Varış",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    poster: "/assets/world/scene-01-poster.png",
    tags: ["7/24 karşılama", "Havalimanında teslim"],
    title: "Antalya’da araç kiralama",
  },
  {
    body: "Havalimanı, Belek, Lara, Side ve Kemer için teslimat noktasını rezervasyon sırasında belirleyebilirsiniz.",
    clip: "/assets/world/scene-03.mp4",
    id: "scene-03",
    label: "Yol",
    mobileClip: "/assets/world/scene-03-mobile.mp4",
    mobilePoster: "/assets/world/scene-03-mobile-poster.png",
    poster: "/assets/world/scene-03-poster.png",
    tags: ["Sınırsız km seçeneği"],
    title: "Antalya ve çevresinde teslimat",
  },
  {
    body: "Alış ve iade tarihlerinizi iletin. Araç uygunluğunu ve kiralama koşullarını size bildirelim.",
    clip: "/assets/world/scene-04.mp4",
    id: "scene-04",
    kicker: "Teslim",
    label: "Teslim",
    mobileClip: "/assets/world/scene-04-mobile.mp4",
    mobilePoster: "/assets/world/scene-04-mobile-poster.png",
    poster: "/assets/world/scene-04-poster.png",
    tags: ["Otelinize teslim", "WhatsApp ile rezervasyon"],
    title: "Teslimat saatini birlikte belirleyelim",
  },
];
