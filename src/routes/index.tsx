import { createFileRoute } from "@tanstack/react-router";

import {
  BookingBar,
  ClosingPlate,
  Faq,
  Fleet,
  Footer,
  Places,
  SiteNav,
  Why,
} from "@/components/pilot/pilot-sections";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubConnectors, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  component: Index,
});

// The journey is the spine: the scrub controller owns media time while every
// chapter stays server-rendered. The sections below it are the things a guest
// needs settled before the key can change hands.
export function Index() {
  return (
    <main className="pilot" id="ust">
      <SiteNav />
      <ScrollScrub
        className="pilot-journey"
        scenes={scrollScrubScenes}
        connectors={scrollScrubConnectors}
        theme={scrollScrubTheme}
      />
      <BookingBar />
      <Fleet />
      <Why />
      <Places />
      <Faq />
      <ClosingPlate />
      <Footer />
    </main>
  );
}
