"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Globe,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { AppHeader } from "@/components/sections/app-header";

// Flow A result — the prefilled creator workspace shown after the "create"
// personalizing animation. Mirrors Figma node 2940:31039 (course variant):
// minimal header, a Back control, a two-column layout with the create-course
// form on the left and a live course-player preview on the right.
// "Back" / "Cancel" return to the logged-in Discover (the user is now signed in,
// so there is no logged-out landing to return to).

const COURSE_CONTENT = {
  course: {
    heading: "Launch your course in minutes, inspire for a lifetime.",
    title: "Personal Finance 101",
    titleHint: "Give your course a descriptive name.",
    description:
      "Take control of your money with practical lessons on budgeting, saving, and investing. Built for beginners and beyond, this course helps you make smarter financial decisions and build lasting wealth.",
    descriptionHint: "Explain what members will learn from this course.",
    submit: "Create course",
  },
  community: {
    heading: "Launch your community in minutes, grow it for a lifetime.",
    title: "Personal Finance Circle",
    titleHint: "Give your community a descriptive name.",
    description:
      "A space to take control of your money together — share wins, ask questions, and stay accountable. Built for beginners and beyond, this community helps members build lasting wealth, side by side.",
    descriptionHint: "Explain what members will get from this community.",
    submit: "Create community",
  },
} as const;

const POSTER =
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=60";
const COURSE_AVATAR =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&auto=format&fit=crop&q=60";

function WorkspaceScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const choice =
    searchParams.get("choice") === "community" ? "community" : "course";
  const content = COURSE_CONTENT[choice];

  const goToDiscover = () => router.push("/discover?app=1");

  return (
    <main className="relative flex min-h-screen flex-col bg-white text-gray-900">
      <AppHeader variant="minimal" />

      <div className="mx-auto w-full max-w-[1375px] px-6 sm:px-10 lg:px-[22px]">
        {/* Back control (Figma "Header Lite") */}
        <button
          type="button"
          onClick={goToDiscover}
          className="mt-2 inline-flex items-center gap-2 rounded-full px-1.5 py-1 text-[14px] font-semibold leading-5 text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          <ArrowLeft size={18} strokeWidth={1.85} />
          Back
        </button>

        <div className="flex flex-col items-start gap-12 pb-16 pt-10 xl:flex-row xl:gap-16 xl:pt-[72px]">
          {/* Left — create form */}
          <div className="flex w-full max-w-[660px] shrink-0 flex-col gap-4">
            <h1 className="font-montserrat text-[30px] font-semibold leading-[40px] tracking-[-0.6px] text-gray-900 sm:text-[36px] sm:leading-[50px] sm:tracking-[-0.72px]">
              {content.heading}
            </h1>

            <div className="mt-2 flex flex-col gap-6">
              {/* Course title */}
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-[16px] font-medium leading-6 text-gray-700">
                  Course title
                  <span className="text-[#d92d20]">*</span>
                </span>
                <div className="flex h-11 w-full items-center rounded-lg border border-gray-300 bg-white px-3.5 shadow-xs">
                  <span className="text-[16px] leading-6 text-gray-900">
                    {content.title}
                  </span>
                </div>
                <span className="text-[14px] leading-5 text-gray-600">
                  {content.titleHint}
                </span>
              </div>

              {/* Course description */}
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-[16px] font-medium leading-6 text-gray-700">
                  Course description
                  <span className="text-[#d92d20]">*</span>
                </span>
                <div className="flex h-[180px] w-full flex-col rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-xs">
                  <p className="flex-1 text-[16px] leading-6 text-gray-900">
                    {content.description}
                  </p>
                  <div className="flex items-center justify-end gap-0.5 text-[13px] leading-[18px] text-gray-600">
                    <span>150</span>
                    <span>/</span>
                    <span>200</span>
                  </div>
                </div>
                <span className="text-[14px] leading-5 text-gray-600">
                  {content.descriptionHint}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={goToDiscover}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[16px] font-semibold leading-6 text-gray-700 shadow-xs transition-colors hover:bg-gray-50 active:scale-[0.99]"
              >
                Cancel
              </button>
              <div className="flex flex-1 items-center justify-end">
                <button
                  type="button"
                  onClick={goToDiscover}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-600 bg-indigo-600 px-4 py-2.5 text-[16px] font-semibold leading-6 text-white shadow-xs transition-all hover:bg-[#2831D3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.97]"
                >
                  {content.submit}
                  <ArrowRight size={20} strokeWidth={1.85} />
                </button>
              </div>
            </div>
          </div>

          {/* Right — live preview */}
          <div className="flex w-full flex-col items-center gap-2.5 py-2.5">
            <p className="text-[14px] font-medium leading-5 text-gray-700">
              This is how your course will look 👇
            </p>
            <CoursePreview />
          </div>
        </div>
      </div>
    </main>
  );
}

// Browser-framed course-player mock (Figma "Details" preview at ~588px wide).
function CoursePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.85, 0.25, 1] }}
      className="w-full max-w-[588px] overflow-hidden rounded-xl border-[0.8px] border-gray-200 bg-[#fcfcfd] shadow-[0px_20px_28px_0px_rgba(96,107,128,0.06),0px_8px_16px_0px_rgba(215,218,223,0.10)]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b-[0.8px] border-gray-200 px-3 py-2">
        <span className="size-[5px] rounded-full bg-[#F97066]" />
        <span className="size-[5px] rounded-full bg-[#FDB022]" />
        <span className="size-[5px] rounded-full bg-[#32D583]" />
      </div>

      {/* Course header */}
      <div className="flex items-start gap-2.5 border-b-[0.8px] border-gray-200 px-3 py-2">
        <img
          src={COURSE_AVATAR}
          alt=""
          className="size-6 shrink-0 rounded-full border border-gray-200 object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-0.5 text-gray-700">
            <p className="truncate font-montserrat text-[11px] font-semibold leading-none tracking-[-0.1px]">
              Your course
            </p>
            <p className="truncate text-[9px] leading-[14px] text-gray-700">
              Learn together, grow together. This space is all about
              knowledge-sharing, problem-solving, and collective wins
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex h-[15px] items-center justify-center gap-0.5 rounded-[9px] bg-[#ecfdf3] px-1">
              <Globe size={11} className="text-[#027a48]" />
              <span className="text-[8px] font-medium leading-[13px] text-[#027a48]">
                Free
              </span>
            </span>
            <span className="flex h-[15px] items-center justify-center rounded-[9px] border-[0.95px] border-gray-300 bg-white px-1">
              <span className="text-[8px] font-medium leading-[13px] text-gray-700">
                Finance
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Body: menu + lesson */}
      <div className="flex items-stretch gap-1 pb-1">
        {/* Module menu */}
        <div className="flex w-[148px] shrink-0 flex-col border-r-[0.8px] border-gray-200 pb-1.5 pt-1">
          <MenuRow label="Module 1" prefix="1." prefixClass="text-gray-500" chevron="up" />
          <div className="flex items-center justify-between bg-[#eff4ff] py-1 pl-6 pr-3">
            <div className="flex min-w-0 flex-1 items-center gap-1 pr-1">
              <span className="text-[9px] font-medium leading-[14px] text-[#155eef]">A.</span>
              <span className="truncate text-[8px] leading-3 text-[#155eef]">Lesson 1</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-1 pl-6 pr-3">
            <div className="flex min-w-0 flex-1 items-center gap-1 pr-1">
              <span className="text-[9px] font-medium leading-[14px] text-gray-500">B.</span>
              <span className="truncate text-[8px] leading-3 text-gray-900">Lesson 2</span>
            </div>
          </div>
          <MenuRow label="Module 2" prefix="2." prefixClass="text-gray-500" chevron="down" />
        </div>

        {/* Lesson content */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 pl-1 pr-2 pt-2">
          {/* Tab + content switcher */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-medium leading-[14px] text-gray-600">
              1.A. Lesson 1
            </span>
            <div className="flex items-center overflow-hidden rounded-[3px] border-[0.6px] border-gray-300">
              <span className="flex size-[15px] items-center justify-center border-r-[0.6px] border-gray-300 bg-white">
                <ArrowLeft size={9} className="text-gray-700" />
              </span>
              <span className="flex h-[15px] items-center gap-0.5 bg-white px-1">
                <ArrowRight size={9} className="text-gray-700" />
                <span className="text-[7px] font-semibold text-gray-700">Next</span>
              </span>
            </div>
          </div>

          {/* Video */}
          <div className="flex flex-col overflow-hidden rounded-[3px]">
            <div className="relative h-[164px] w-full overflow-hidden">
              <img src={POSTER} alt="" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute left-2.5 top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
                <p className="text-[18px] font-semibold leading-7 text-white">Lesson 1</p>
                <span className="flex h-3.5 w-fit items-center justify-center rounded bg-[#f2f4f7] px-1.5">
                  <span className="text-[8px] font-medium leading-3 text-gray-700">Module 1</span>
                </span>
              </div>
              <span className="absolute left-1/2 top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 backdrop-blur-[3px]">
                <Play size={11} className="translate-x-px fill-white text-white" />
              </span>
            </div>
            {/* Control bar */}
            <div className="flex items-center gap-1 rounded-b-[3px] bg-[#1d2939] p-[3px]">
              <SkipBack size={9} className="shrink-0 text-white" />
              <Play size={9} className="shrink-0 fill-white text-white" />
              <SkipForward size={9} className="shrink-0 text-white" />
              <span className="shrink-0 text-[6px] leading-none">
                <span className="text-white">1:29</span>
                <span className="text-gray-300"> / 6:30</span>
              </span>
              <span className="relative mx-1 h-[3px] flex-1 rounded-full bg-white/30">
                <span className="absolute inset-y-0 left-0 w-[20%] rounded-full bg-white" />
              </span>
              <Volume2 size={8} className="shrink-0 text-white" />
              <Settings size={8} className="shrink-0 text-white" />
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col text-gray-900">
            <p className="text-[9px] font-medium leading-[14px]">About this lesson</p>
            <p className="text-[8px] leading-3">
              Welcome to the course! in this opening lesson, we&rsquo;ll set the stage for
              your learning journey. you&rsquo;ll get a quick tour of what to expect, how the
              course is structured, and the tools and resources available to help you
              succeed. let&rsquo;s get started!
            </p>
          </div>

          {/* Offered by */}
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-medium leading-[14px] text-gray-900">Offered by</p>
            <div className="flex items-start gap-2.5">
              <img
                src={COURSE_AVATAR}
                alt=""
                className="size-7 shrink-0 rounded-[5px] object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-[10px] font-semibold leading-[15px] text-gray-700">
                  Katherine moss
                </p>
                <p className="truncate text-[8px] leading-3 text-gray-900">Yoga expert</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MenuRow({
  label,
  prefix,
  prefixClass,
  chevron,
}: {
  label: string;
  prefix: string;
  prefixClass: string;
  chevron: "up" | "down";
}) {
  return (
    <div className="flex items-center justify-between px-3 py-1">
      <div className="flex min-w-0 flex-1 items-center gap-1 pr-1">
        <span className={`text-[9px] font-medium leading-[14px] ${prefixClass}`}>{prefix}</span>
        <span className="truncate text-[9px] font-medium leading-[14px] text-gray-900">
          {label}
        </span>
      </div>
      {chevron === "up" ? (
        <ChevronUp size={10} className="shrink-0 text-gray-500" />
      ) : (
        <ChevronDown size={10} className="shrink-0 text-gray-500" />
      )}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<main className="min-h-screen w-full bg-white" />}>
      <WorkspaceScreen />
    </Suspense>
  );
}
