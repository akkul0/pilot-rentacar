import { createFileRoute } from "@tanstack/react-router";

import { BookingProvider } from "@/components/pilot/pilot-booking";
import {
  BookingBar,
  ClosingPlate,
  Faq,
  Fleet,
  Footer,
  MobileDock,
  Places,
  SiteNav,
  Steps,
  Ticker,
  Why,
} from "@/components/pilot/pilot-sections";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubConnectors, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  component: Index,
});

// The journey is the spine: the scrub controller owns media time while every
// chapter stays server-rendered. The sections below it are the things a guest
// needs settled before the key can change hands; the booking dialog can be
// opened from any of them.
export function Index() {
  return (
    <BookingProvider>
      <main className="pilot" id="ust">
        <SiteNav />
        <ScrollScrub
          className="pilot-journey"
          scenes={scrollScrubScenes}
          connectors={scrollScrubConnectors}
          theme={scrollScrubTheme}
        />
        <BookingBar />
        <Ticker />
        <Fleet />
        <Why />
        <Places />
        <Steps />
        <Faq />
        <ClosingPlate />
        <Footer />
        <MobileDock />
      </main>
    </BookingProvider>
  );
}
