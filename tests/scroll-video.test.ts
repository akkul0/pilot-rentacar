import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { scrollScrubScenes, scrollScrubConnectors } from "../src/scroll-scrub-scenes";

describe("Pilot video continuity", () => {
  test("plays every source segment in order without restoring the removed heading", () => {
    const clips = scrollScrubScenes.flatMap((scene, index) => [scene.clip, scrollScrubConnectors[index]?.clip].filter(Boolean));
    expect(clips).toEqual([1, 2, 3, 4].map(n => `/assets/world/scene-0${n}.mp4`));
    expect(scrollScrubScenes).toHaveLength(3);
    expect(scrollScrubScenes.some(scene => scene.title.includes("14 araç"))).toBe(false);
    for (const segment of [...scrollScrubScenes, ...scrollScrubConnectors.filter(Boolean)]) {
      for (const asset of [segment!.clip, segment!.mobileClip, segment!.poster, segment!.mobilePoster]) {
        expect(existsSync(`public${asset}`)).toBe(true);
      }
    }
  });
  test("mobile priming can retry and direct MP4 loading remains available", () => {
    const code = readFileSync("src/components/scroll-scrub/scroll-scrub.tsx", "utf8");
    expect(code).toContain("video.src = objectUrl ?? source");
    expect(code).toContain("priming.delete(video)");
    expect(code).not.toMatch(/addEventListener\("touchstart", onFirstGesture, \{\s*once: true/);
    expect(code).toContain("Animasyonu başlat");
  });
});
