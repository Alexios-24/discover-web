"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function DualSection() {
  return (
    <section className="relative py-32 px-10 bg-white text-ink overflow-hidden">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-gray-500">
          <span className="w-6 h-px bg-lime" />
          <span>Two sides, one home</span>
        </div>
      </div>

      <h2
        className="text-center font-montserrat font-extrabold tracking-[-0.05em] leading-[0.85] mb-20"
        style={{ fontSize: "clamp(56px, 9vw, 160px)" }}
      >
        Community <span className="italic font-medium text-magenta">and</span>
        <br />
        courses. <span className="italic font-medium text-magenta">Together.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
        <CommunitiesCard />
        <CoursesCard />
      </div>
    </section>
  );
}

function CommunitiesCard() {
  return (
    <motion.div
      initial={{ rotate: -1.5 }}
      whileHover={{ rotate: 0, scale: 1.015 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative rounded-[32px] p-12 min-h-[600px] flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F5F3EE, #FFFFFF)",
        border: "1px solid rgba(10,10,10,0.08)",
      }}
    >
      <span className="inline-block self-start bg-lime text-ink font-sans text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-7">
        Communities
      </span>
      <h3
        className="font-montserrat font-extrabold tracking-[-0.04em] leading-[0.95] mb-4"
        style={{ fontSize: "clamp(40px, 4.5vw, 64px)" }}
      >
        A space your members{" "}
        <span className="italic font-medium text-lime-dark">actually</span> show up to.
      </h3>
      <p className="text-gray-600 text-[16px] leading-[1.5] mb-8 max-w-[420px]">
        Feeds, channels, DMs, live events. Built for the kind of community where people stay for years, not weeks.
      </p>

      <div className="mt-auto bg-white border border-ink/10 rounded-[16px] p-4 shadow-sm">
        <FeedPost
          initial="SK"
          color="#D6FF3A"
          name="Sarah K."
          time="2m"
          text="Just hit my first $10k month inside the cohort 🎉"
          likes={47}
          replies={12}
        />
        <FeedPost
          initial="MR"
          color="#FF3EB5"
          name="Marcus R."
          time="8m"
          text="Live class starting in 5 — drop your questions ↓"
          likes={23}
          replies={8}
          textColor="#fff"
        />
        <FeedPost
          initial="JL"
          color="#0A0A0A"
          name="Jamie L."
          time="14m"
          text="New module dropped. The macro nutrition deep-dive is 🔥"
          likes={91}
          replies={24}
          textColor="#fff"
          last
        />
      </div>
    </motion.div>
  );
}

function FeedPost({
  initial,
  color,
  name,
  time,
  text,
  likes,
  replies,
  textColor = "#000",
  last,
}: {
  initial: string;
  color: string;
  name: string;
  time: string;
  text: string;
  likes: number;
  replies: number;
  textColor?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex gap-3 ${last ? "" : "mb-3.5 pb-3.5 border-b border-ink/8"}`}
    >
      <div
        className="w-8 h-8 rounded-full shrink-0 font-montserrat font-extrabold text-[12px] flex items-center justify-center"
        style={{ background: color, color: textColor }}
      >
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-semibold text-ink">{name}</span>
          <span className="text-[11px] text-gray-400 font-sans">{time}</span>
        </div>
        <p className="text-[13px] text-gray-600 mt-0.5 leading-[1.5]">{text}</p>
        <div className="flex gap-3.5 mt-2 text-[11px] text-gray-400 font-sans">
          <span>♡ {likes}</span>
          <span>↳ {replies} replies</span>
        </div>
      </div>
    </div>
  );
}

function CoursesCard() {
  return (
    <motion.div
      initial={{ rotate: 1.5 }}
      whileHover={{ rotate: 0, scale: 1.015 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative rounded-[32px] p-12 min-h-[600px] flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F5F3EE, #FFFFFF)",
        border: "1px solid rgba(10,10,10,0.08)",
      }}
    >
      <span className="inline-block self-start bg-magenta text-cream font-sans text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-7">
        Courses
      </span>
      <h3
        className="font-montserrat font-extrabold tracking-[-0.04em] leading-[0.95] mb-4"
        style={{ fontSize: "clamp(40px, 4.5vw, 64px)" }}
      >
        Lessons that <span className="italic font-medium text-magenta">land</span>. Outcomes that compound.
      </h3>
      <p className="text-gray-600 text-[16px] leading-[1.5] mb-8 max-w-[420px]">
        Build courses with video, audio, quizzes, assignments. Cinema-mode player. Autoplay. Comments inside lessons. Drip schedules.
      </p>

      <div className="mt-auto bg-white border border-ink/10 rounded-[16px] overflow-hidden shadow-sm">
        <div
          className="h-36 relative flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #FF3EB5, #6E1D5E)" }}
        >
          <button className="w-14 h-14 rounded-full bg-cream/95 flex items-center justify-center text-ink hover:scale-110 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </button>
          <span className="absolute top-3 left-3 font-sans text-[11px] bg-ink/60 text-cream px-2 py-1 rounded tracking-[0.08em]">
            CHAPTER 04 · 12:48
          </span>
        </div>
        <div className="p-4">
          <p className="text-[14px] font-semibold text-ink mb-1">
            Building habits that compound
          </p>
          <p className="text-[11px] font-sans text-gray-400">
            Module 4 of 8 · Sarah Khurana
          </p>
          <div className="h-[3px] bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-magenta rounded-full" style={{ width: "64%" }} />
          </div>
          <div className="flex justify-between mt-2 font-sans text-[11px] text-gray-400">
            <span>64% complete</span>
            <span>Next: 03:12</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
