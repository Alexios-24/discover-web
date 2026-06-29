"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
  type PanInfo,
} from "framer-motion";

interface RisingCreator {
  id: string;
  name: string;
  image: string;
  /** Bottom gradient tint so the name stays legible on any portrait. */
  gradientColor: string;
}

/*
 * Small / new creators — distinct from the "Top experts" section, which
 * highlights established names. Follower counts are intentionally modest to
 * signal these are rising voices worth discovering early.
 */
const CREATORS: RisingCreator[] = [
  {
    id: "maya-chen",
    name: "Maya Chen-Rodriguez Williamson",
    image: "/creators/creator-1.png",
    gradientColor: "16, 24, 40",
  },
  {
    id: "diego-alvarez",
    name: "Diego Alejandro Hernández Maximiliano",
    image: "/creators/creator-2.png",
    gradientColor: "18, 16, 28",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    image: "/creators/creator-3.png",
    gradientColor: "20, 16, 14",
  },
  {
    id: "liam-obrien",
    name: "Liam O'Brien",
    image: "/creators/creator-4.png",
    gradientColor: "10, 18, 22",
  },
  {
    id: "sofia-rossi",
    name: "Sofia Rossi",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "40, 20, 16",
  },
  {
    id: "noah-williams",
    name: "Noah Williams",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "14, 16, 24",
  },
  {
    id: "aisha-khan",
    name: "Aisha Khan",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "30, 18, 14",
  },
  {
    id: "kenji-tanaka",
    name: "Kenji Tanaka",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "16, 14, 18",
  },
  {
    id: "elena-popova",
    name: "Elena Popova",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "30, 16, 22",
  },
  {
    id: "marcus-bell",
    name: "Marcus Bell",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "18, 16, 16",
  },
  {
    id: "hana-suzuki",
    name: "Hana Suzuki",
    image:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "14, 18, 20",
  },
  {
    id: "theo-martin",
    name: "Theo Martin",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "16, 18, 28",
  },
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=600&auto=format&fit=crop&q=80",
    gradientColor: "26, 16, 20",
  },
];

interface Dims {
  card: number;
  spacing: number;
  panStep: number;
  visible: number;
  height: number;
}

function useDims(): Dims {
  const [dims, setDims] = useState<Dims>({
    card: 240,
    spacing: 96,
    panStep: 110,
    visible: 6,
    height: 293,
  });

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      let card: number;
      let visible: number;
      if (vw < 640) {
        card = Math.min(168, Math.round(vw * 0.46));
        visible = 3;
      } else if (vw < 1024) {
        card = 200;
        visible = 5;
      } else {
        card = 240;
        // Kept below len/2 so the wrap-around seam stays in the culled
        // "dead zone" behind the fan and the loop reads as seamless.
        visible = 5;
      }
      setDims({
        card,
        // Gap between adjacent card centres; also the unit that maps one
        // drag-step / arrow press to one index. Tight so the cards overlap
        // into a closely-stacked fan like the reference.
        spacing: Math.round(card * 0.4),
        // Preserve the original pan sensitivity while allowing the visual
        // card spacing to tighten independently.
        panStep: Math.round(card * 0.46),
        visible,
        // Cards are slightly portrait and vertically center-aligned; the
        // Y-rotation keeps their height constant, so the tallest element is
        // the full-size centre card. Leave room for its shadow.
        height: Math.round(card * 1.22),
      });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return dims;
}

export function RisingCreatorsSection() {
  const dims = useDims();
  const { card, spacing, panStep, visible, height } = dims;
  const len = CREATORS.length;
  const reduceMotion = useReducedMotion();

  const position = useMotionValue(Math.floor(len / 2));
  const [, setTick] = useState(0);
  useMotionValueEvent(position, "change", () => setTick((t) => (t + 1) % 1e6));

  const controls = useRef<AnimationPlaybackControls | null>(null);
  const dragStart = useRef(0);

  // `target` is unbounded: the deck loops, so the position can drift past
  // either end indefinitely. Circular offset maths keeps the layout correct.
  const goTo = useCallback(
    (target: number) => {
      controls.current?.stop();
      if (reduceMotion) {
        position.set(target);
        return;
      }
      controls.current = animate(position, target, {
        type: "spring",
        stiffness: 220,
        damping: 30,
        restDelta: 0.001,
      });
    },
    [position, reduceMotion],
  );

  // Animate to the nearest copy of card `i` so a click never spins the long
  // way around the loop.
  const goToCard = useCallback(
    (i: number) => {
      const cur = position.get();
      goTo(i + Math.round((cur - i) / len) * len);
    },
    [goTo, len, position],
  );

  // Autoplay pauses while the user is hovering or actively dragging.
  const hoverRef = useRef(false);
  const dragRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      if (hoverRef.current || dragRef.current) return;
      goTo(Math.round(position.get()) + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [reduceMotion, goTo, position]);

  const onPanStart = () => {
    dragRef.current = true;
    controls.current?.stop();
    dragStart.current = position.get();
  };

  const onPan = (_e: unknown, info: PanInfo) => {
    // No clamping: the deck scrolls endlessly in either direction.
    position.set(dragStart.current - info.offset.x / panStep);
  };

  const onPanEnd = (_e: unknown, info: PanInfo) => {
    dragRef.current = false;
    const projected =
      dragStart.current - (info.offset.x + info.velocity.x * 0.18) / panStep;
    goTo(Math.round(projected));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(Math.round(position.get()) - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(Math.round(position.get()) + 1);
    }
  };

  const pos = position.get();
  const activeIndex = ((Math.round(pos) % len) + len) % len;

  return (
    <section className="w-full bg-white pt-16 pb-16 overflow-hidden max-md:pt-12 max-md:pb-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-[54px] text-center max-md:gap-3 max-md:px-4">
        <h2 className="font-montserrat font-semibold text-[36px] leading-normal text-[#101828] max-md:text-[24px] max-md:leading-[32px]">
          Rising creators to watch
        </h2>
      </div>

      <motion.div
        className="relative mx-auto mt-1 w-full max-w-6xl cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing max-md:mt-0"
        style={{ height }}
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Rising creators"
        onKeyDown={onKeyDown}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{ perspective: "1100px", transformStyle: "preserve-3d" }}
        >
          {CREATORS.map((creator, i) => {
            // Nearest circular offset: cards that pass the back of the fan on
            // one side wrap around and reappear on the other, so the left and
            // right stacks always hold the same number of cards (like Circle).
            const half = len / 2;
            let o = i - pos;
            o = ((o % len) + len) % len;
            if (o > half) o -= len;
            const abs = Math.abs(o);
            // Cull beyond the window; the gap between this and `half` is the
            // hidden dead zone where the wrap-around happens off-screen.
            if (abs > visible + 0.75) return null;

            // Coverflow fan (matches the Circle reference): the centre card is
            // flat and full-size; every side card rotates ~33deg around Y so
            // its OUTER edge faces the viewer and its inner edge tucks behind
            // the more-central card — a fanned deck. The apparent "narrowing"
            // of side cards comes mostly from this foreshortening; scale tapers
            // only gently so the side cards stay tall rather than becoming
            // slivers.
            const x = Math.sign(o) * spacing * Math.pow(abs, 0.8);
            const scale = Math.max(0.42, Math.pow(0.85, abs));
            // Tilt ramps in across the first step (so dragging eases the centre
            // card open), then holds at the full fan angle for all side cards.
            // Negative sign(o) so the inner edge rotates away (tucks behind).
            const tilt = -Math.sign(o) * 33 * Math.min(abs, 1);
            // Push side cards back in depth so the centre card pops forward.
            const z = -abs * 16;
            const opacity =
              abs > visible ? Math.max(0, 1 - (abs - visible) * 2) : 1;
            const zIndex = Math.round(1000 - abs * 10);
            const isActive = abs < 0.5;

            return (
              <div
                key={creator.id}
                id={creator.id}
                role="button"
                tabIndex={0}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Show ${creator.name}`}
                onClick={() => goToCard(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToCard(i);
                  }
                }}
                className="absolute outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                style={{
                  width: card,
                  height: Math.round(card * 1.06),
                  zIndex,
                  opacity,
                  transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${tilt}deg) scale(${scale})`,
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                  cursor: isActive ? "grab" : "pointer",
                }}
              >
                <div
                  className="relative h-full w-full overflow-hidden rounded-[26px] ring-1 ring-black/5"
                  style={{
                    boxShadow: isActive
                      ? "0 30px 60px -20px rgba(16,24,40,0.45)"
                      : "0 18px 36px -18px rgba(16,24,40,0.35)",
                  }}
                >
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(${creator.gradientColor}, 0) 42%, rgba(${creator.gradientColor}, 0.55) 68%, rgba(${creator.gradientColor}, 0.95) 100%)`,
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-4 pt-6 text-center">
                    <span
                      title={creator.name}
                      className="block w-full truncate font-montserrat text-[18px] font-semibold leading-[22px] text-white drop-shadow-sm"
                    >
                      {creator.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-4 flex w-full justify-center max-md:mt-3">
        <Link
          href="/discover"
          className="flex items-center gap-2 rounded-[8px] border border-[#F9FAFB] bg-[#F2F4F7] px-3.5 py-2 transition-colors hover:bg-[#E4E7EC]"
        >
          <span className="font-inter text-[14px] font-semibold leading-[20px] text-[#344054]">
            Explore creators
          </span>
          <ChevronRight size={16} strokeWidth={2} className="text-[#344054]" />
        </Link>
      </div>
    </section>
  );
}
