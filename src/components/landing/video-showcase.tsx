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

  // Mobile: autoplay when the video section scrolls into view
  useEffect(() => {
    if (playing) return;
    const el = sectionRef.current;
    if (!el || window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [playing]);

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
      const isMobile = window.innerWidth < 768;
      const maxW = window.innerWidth - 40;
      const t = clamp01(window.scrollY / lvh);
      const w = isMobile ? maxW : Math.min(lerp(SM_W, LG_W, t), maxW);
      const h = w * (LG_H / LG_W);
      const r = isMobile ? SM_R : lerp(SM_R, LG_R, t);

      vid.style.width = `${w}px`;
      vid.style.height = `${h}px`;
      vid.style.borderRadius = `${r}px`;

      if (isMobile) {
        const vidTop = Math.max(72, (560 - h) / 2);
        vid.style.top = `${vidTop}px`;
        const label = labelRef.current;
        if (label) {
          label.style.top = `${vidTop - 44}px`;
          label.style.opacity = "1";
        }
        dark.style.opacity = "0";
        light.style.opacity = "0";
        if (btn) {
          btn.style.opacity = "1";
          btn.style.transform = "scale(1)";
        }
        return;
      }

      const topStart = lvh - PEEK_PX;
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
      className="relative z-[15] pointer-events-none h-[200vh] -mt-[100vh] max-md:h-[560px] max-md:mt-0 max-md:bg-black"
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

      <div className="sticky top-0 h-screen max-md:relative max-md:h-[560px]">
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
            top: 72,
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
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={() => setPlaying(true)}
              aria-label="Play video"
            >
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
                <div className="w-[120px] h-[120px] rounded-full bg-black/50 backdrop-blur-[12px] flex items-center justify-center max-md:w-[64px] max-md:h-[64px]">
                  <Play
                    size={48}
                    className="text-white fill-white ml-1.5 max-md:size-6 max-md:ml-1"
                  />
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
