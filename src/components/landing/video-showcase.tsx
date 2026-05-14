"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

const YOUTUBE_ID = "WlyzITzan4M";
const YOUTUBE_START = 58;
const THUMB_URL = `https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`;

const SM_W = 375;
const SM_H = 211;
const SM_R = 8;
const LG_W = 1242;
const LG_H = 699;
const LG_R = 16;
const PEEK_PX = 15;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function VideoShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const vid = vidRef.current;
    const dark = darkRef.current;
    const light = lightRef.current;
    const btn = btnRef.current;
    if (!section || !vid || !dark || !light) return;

    let raf = 0;
    // Cached largest viewport height. Only updates on actual resize /
    // orientation change — NOT on iOS Safari URL-bar retract — so the
    // animation stays smooth and never jumps mid-scroll.
    let lvh = Math.max(
      window.innerHeight,
      document.documentElement.clientHeight,
    );

    const tick = () => {
      const t = clamp01(window.scrollY / lvh);

      const maxW = window.innerWidth - 40;
      const w = Math.min(lerp(SM_W, LG_W, t), maxW);
      const h = w * (LG_H / LG_W);
      const r = lerp(SM_R, LG_R, t);

      vid.style.width = `${w}px`;
      vid.style.height = `${h}px`;
      vid.style.borderRadius = `${r}px`;

      // Mobile keeps the video fully off-screen at the top of the page so
      // it never crowds the hero. We use the LARGEST possible viewport
      // height (layout viewport) plus a generous buffer to clear iOS
      // Safari's translucent bottom toolbar even when the URL bar
      // retracts. All animation values use the same lvh so chrome state
      // changes never cause jumps.
      const isMobile = window.innerWidth < 768;
      const topStart = isMobile ? lvh + 160 : lvh - PEEK_PX;
      const topEnd = (lvh - h) / 2;
      const vidTop = lerp(topStart, topEnd, t);
      vid.style.top = `${vidTop}px`;

      const label = labelRef.current;
      if (label) {
        label.style.top = `${vidTop - 48}px`;
        if (isMobile) {
          // Fade label in only after the video has clearly started moving up.
          const fadeIn = clamp01((t - 0.18) / 0.12);
          const fadeOut = 1 - clamp01((t - 0.5) / 0.2);
          label.style.opacity = `${fadeIn * fadeOut}`;
        } else {
          label.style.opacity = `${1 - clamp01(t / 0.15)}`;
        }
      }

      dark.style.opacity = `${clamp01(t / 0.5)}`;
      light.style.opacity = `${clamp01((t - 0.35) / 0.5)}`;

      if (btn) {
        btn.style.opacity = `${clamp01((t - 0.4) / 0.3)}`;
        const scale = lerp(0.6, 1, clamp01((t - 0.4) / 0.6));
        btn.style.transform = `scale(${scale})`;
      }

      if (t >= 0.92 && !playing) setPlaying(true);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      lvh = Math.max(
        window.innerHeight,
        document.documentElement.clientHeight,
      );
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      cancelAnimationFrame(raf);
    };
  }, [playing]);

  return (
    <section
      ref={sectionRef}
      className="relative z-[15] pointer-events-none"
      style={{ height: "200vh", marginTop: "-100vh" }}
    >
      <div
        ref={darkRef}
        className="absolute inset-0 bg-black"
        style={{ opacity: 0 }}
      />
      <div
        ref={lightRef}
        className="absolute inset-0 bg-white"
        style={{ opacity: 0 }}
      />

      <div className="sticky top-0 h-screen">
        <div
          ref={labelRef}
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap"
        >
          <Play size={16} className="text-white fill-white shrink-0" />
          <span className="text-[15px] leading-5 font-semibold text-white">
            Get to know more about Kollab
          </span>
        </div>

        <div
          ref={vidRef}
          className="absolute left-1/2 -translate-x-1/2 overflow-hidden pointer-events-auto"
          style={{
            width: SM_W,
            height: SM_H,
            borderRadius: SM_R,
            top: "calc(100lvh + 160px)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&start=${YOUTUBE_START}&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: "none" }}
            />
          ) : (
            <>
              <img
                src={THUMB_URL}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              <div
                ref={btnRef}
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: 0 }}
              >
                <div className="w-[120px] h-[120px] rounded-full bg-black/50 backdrop-blur-[12px] flex items-center justify-center">
                  <Play
                    size={48}
                    className="text-white fill-white ml-1.5"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
