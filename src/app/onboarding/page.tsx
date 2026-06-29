"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Fragment,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BanknoteIcon,
  BookIcon,
  CarIcon,
  CheckIcon,
  CpuIcon,
  EyeIcon,
  GamepadIcon,
  GraduationIcon,
  HeartIcon,
  ImageUserCheckIcon,
  LightbulbIcon,
  MegaphoneIcon,
  MusicIcon,
  PaletteIcon,
  PlaneIcon,
  PresentationIcon,
  RocketIcon,
  SearchIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
  type GhlIconComponent,
} from "@/components/icons/ghl-icons";

type Intent = "create" | "learn";
type BuildChoice = "course" | "community" | "both";
type LearnChoice = "courses" | "communities" | "creators" | "all";
// The flow now signs the user up FIRST, then runs the onboarding steps:
//   account (signup form) → verify (OTP, email signups only) → onboarding.
type Phase = "account" | "verify" | "onboarding";
type SignupMethod = "email" | "google";
type DomainValue =
  | "finance"
  | "travel"
  | "technology"
  | "productivity"
  | "cars"
  | "creative"
  | "gaming"
  | "marketing"
  | "wellness"
  | "music"
  | "leadership"
  | "teaching";

type GhlIconName = keyof typeof GHL_ICON_MAP;

const OTP_LENGTH = 6;

// Onboarding (post-signup) is three steps: intent → build/learn choice →
// categories. The header renders one progress dot per step.
const ONBOARDING_STEPS = 3;

const createEmptyOtpDigits = () => Array<string>(OTP_LENGTH).fill("");

interface Choice<T extends string> {
  value: T;
  title: string;
  description: string;
  icon: GhlIconName;
}

interface DomainChoice {
  value: DomainValue;
  label: string;
  icon: GhlIconName;
}

// Semantic name → real GHL icon component. Each glyph is the exact GHL icon
// the Figma onboarding designs specify (file lSuVFjWScTgFMplHt0JsQK); the GHL
// file name is noted beside each entry. Components inherit color via
// `currentColor` and size via the `size` prop, so swapping these in keeps the
// existing onboarding sizes/colors and only changes the glyph shape.
const GHL_ICON_MAP = {
  arrowLeft: ArrowLeftIcon, // arrow-left
  arrowRight: ArrowRightIcon, // arrow-right
  badge: ImageUserCheckIcon, // image-user-check (Creators)
  banknote: BanknoteIcon, // bank-note-01 (Finance)
  book: BookIcon, // book-closed (Discover / learn)
  car: CarIcon, // directions_car (Cars)
  check: CheckIcon, // check
  cpu: CpuIcon, // cpu-chip-01 (Technology)
  eye: EyeIcon, // eye
  gamepad: GamepadIcon, // gaming-pad-01 (Gaming)
  graduation: GraduationIcon, // graduation-hat-02 (Course)
  heart: HeartIcon, // activity-heart (Wellness)
  lightbulb: LightbulbIcon, // lightbulb-02 (Productivity)
  megaphone: MegaphoneIcon, // announcement-02 (Marketing)
  music: MusicIcon, // music-note-01 (Music)
  palette: PaletteIcon, // color_lens (Creative)
  plane: PlaneIcon, // plane (Travel)
  presentation: PresentationIcon, // stand (Teaching)
  rocket: RocketIcon, // rocket-02 (Create / launch)
  search: SearchIcon, // search-md
  sparkles: SparklesIcon, // stars-02
  trophy: TrophyIcon, // trophy-01 (Leadership)
  users: UsersIcon, // users-02 (Community)
} satisfies Record<string, GhlIconComponent>;

const intentChoices: Choice<Intent>[] = [
  {
    value: "create",
    title: "I want to create and sell",
    description: "Build courses, grow communities, and earn on your terms.",
    icon: "rocket",
  },
  {
    value: "learn",
    title: "I want to discover and learn",
    description: "Find courses, join communities, and level up your skills.",
    icon: "book",
  },
];

const buildChoices: Choice<BuildChoice>[] = [
  {
    value: "course",
    title: "Course",
    description: "Structured lessons, modules, quizzes and drip content.",
    icon: "graduation",
  },
  {
    value: "community",
    title: "Community",
    description: "Discussions, live sessions, events and memberships.",
    icon: "users",
  },
];

const learnChoices: Choice<LearnChoice>[] = [
  {
    value: "courses",
    title: "Course",
    description: "Structured lessons, modules, quizzes and drip content.",
    icon: "graduation",
  },
  {
    value: "communities",
    title: "Community",
    description: "Discussions, live sessions, events and memberships.",
    icon: "users",
  },
  {
    value: "creators",
    title: "Creators",
    description: "Experts, builders and operators you can keep following.",
    icon: "badge",
  },
];

// Categories and their exact GHL icons match Figma node 2918:85007 /
// 2907:60915 (Finance→bank-note-01, Travel→plane, Technology→cpu-chip-01,
// Productivity→lightbulb-02, Cars→directions_car, Creative→color_lens,
// Gaming→gaming-pad-01, Marketing→announcement-02, Wellness→activity-heart,
// Music→music-note-01, Leadership→trophy-01, Teaching→stand).
const domainChoices: DomainChoice[] = [
  { value: "finance", label: "Finance", icon: "banknote" },
  { value: "travel", label: "Travel", icon: "plane" },
  { value: "technology", label: "Technology", icon: "cpu" },
  { value: "productivity", label: "Productivity", icon: "lightbulb" },
  { value: "cars", label: "Cars", icon: "car" },
  { value: "creative", label: "Creative", icon: "palette" },
  { value: "gaming", label: "Gaming", icon: "gamepad" },
  { value: "marketing", label: "Marketing", icon: "megaphone" },
  { value: "wellness", label: "Wellness", icon: "heart" },
  { value: "music", label: "Music", icon: "music" },
  { value: "leadership", label: "Leadership", icon: "trophy" },
  { value: "teaching", label: "Teaching", icon: "presentation" },
];

const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.32, ease: [0.22, 0.85, 0.25, 1] as const },
};

const optionListMotion = {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.08,
        staggerChildren: 0.07,
      },
    },
  },
};

const optionCardMotion = {
  variants: {
    hidden: {
      opacity: 0,
      y: 16,
      scale: 0.98,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.46,
        ease: [0.22, 0.85, 0.25, 1] as const,
      },
    },
  },
};

// --- Subtle, asset-free sound cues via Web Audio API ---
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedAudioContext) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      sharedAudioContext = new Ctor();
    }
    if (sharedAudioContext.state === "suspended") {
      void sharedAudioContext.resume();
    }
    return sharedAudioContext;
  } catch {
    return null;
  }
}

function playNotes(
  notes: { freq: number; start: number; dur: number }[],
  peak = 0.05,
) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = note.freq;
      const t0 = now + note.start;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + note.dur + 0.03);
    }
  } catch {
    // Web Audio unavailable or blocked — fail silently.
  }
}

// Gentle two-note rise when moving to the next step.
function playAdvanceChime() {
  playNotes(
    [
      { freq: 587.33, start: 0, dur: 0.16 },
      { freq: 880.0, start: 0.07, dur: 0.2 },
    ],
    0.045,
  );
}

// Slightly richer ascending arpeggio on completion.
function playCompleteChime() {
  playNotes(
    [
      { freq: 523.25, start: 0, dur: 0.22 },
      { freq: 659.25, start: 0.09, dur: 0.26 },
      { freq: 783.99, start: 0.18, dur: 0.5 },
    ],
    0.055,
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={<main className="min-h-screen w-full bg-[#f7f8fb]" />}
    >
      <OnboardingFlow />
    </Suspense>
  );
}

type OrbVariant = "kollab" | 1 | 2 | 3;
type OrbCenterGlyph = "kollab" | "rocket" | "book";
type HandoffGlyph = Exclude<OrbCenterGlyph, "kollab">;

interface HandoffRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface HandoffState {
  glyph: HandoffGlyph;
  from: HandoffRect;
  to: HandoffRect;
}

const HANDOFF_DURATION_MS = 1120;
const PERSONALIZING_HEADER_HEIGHT = 60;
const PERSONALIZING_ORB_SIZE = 171.5;
const PERSONALIZING_CORE_RATIO = 120 / PERSONALIZING_ORB_SIZE;

const PERSONALIZING_TARGETS = {
  create: {
    width: 735.88,
    height: 564.71,
    maxWidth: 735.88,
    viewportWidthRatio: 0.86,
    viewportHeightRatio: 1.303,
    center: { x: 58.82, y: 95.97, width: 630 },
  },
  learn: {
    width: 1182,
    height: 571,
    maxWidth: 1182,
    viewportWidthRatio: 0.9,
    viewportHeightRatio: 2.07,
    center: { x: 283, y: 152.75, width: 630 },
  },
} satisfies Record<Intent, {
  width: number;
  height: number;
  maxWidth: number;
  viewportWidthRatio: number;
  viewportHeightRatio: number;
  center: { x: number; y: number; width: number };
}>;

function rectFromDomRect(rect: DOMRect): HandoffRect {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function getPersonalizingOrbTarget(intent: Intent): HandoffRect {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (viewportWidth < 640) {
    const size = Math.min(150, Math.max(132, viewportWidth * 0.42));
    return {
      left: viewportWidth / 2 - size / 2,
      top: viewportHeight / 2 - size / 2,
      width: size,
      height: size,
    };
  }

  const target = PERSONALIZING_TARGETS[intent];
  const frameWidth = Math.min(
    viewportWidth * target.viewportWidthRatio,
    target.maxWidth,
    Math.max(320, (viewportHeight - 116) * target.viewportHeightRatio),
  );
  const frameHeight = (frameWidth / target.width) * target.height;
  const frameLeft = (viewportWidth - frameWidth) / 2;
  const stageHeight = viewportHeight - PERSONALIZING_HEADER_HEIGHT;
  const frameTop =
    PERSONALIZING_HEADER_HEIGHT + Math.max(0, (stageHeight - frameHeight) / 2);
  const orbSize = Math.min(
    PERSONALIZING_ORB_SIZE,
    Math.max(132, (PERSONALIZING_ORB_SIZE / target.width) * frameWidth),
  );
  const contentLeft = frameLeft + (target.center.x / target.width) * frameWidth;
  const contentTop = frameTop + (target.center.y / target.height) * frameHeight;
  const contentWidth = (target.center.width / target.width) * frameWidth;

  return {
    left: contentLeft + (contentWidth - orbSize) / 2,
    top: contentTop,
    width: orbSize,
    height: orbSize,
  };
}

function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orbParam = searchParams.get("orb");
  const orbVariant: OrbVariant =
    orbParam === "1"
      ? 1
      : orbParam === "2"
        ? 2
        : orbParam === "3"
          ? 3
          : "kollab";

  const [phase, setPhase] = useState<Phase>("account");
  const [signupMethod, setSignupMethod] = useState<SignupMethod | null>(null);
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [buildChoice, setBuildChoice] = useState<BuildChoice | null>(null);
  const [learnChoice, setLearnChoice] = useState<LearnChoice | null>(null);
  const [domains, setDomains] = useState<DomainValue[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(createEmptyOtpDigits);
  const [handoff, setHandoff] = useState<HandoffState | null>(null);

  const selectedDomains = useMemo(
    () => domains
      .map((value) => domainChoices.find((item) => item.value === value))
      .filter((item): item is DomainChoice => Boolean(item)),
    [domains],
  );

  const domainPreviewLabel = formatDomainSelection(selectedDomains);

  const canCreateAccount =
    name.trim().length > 1 &&
    email.includes("@") &&
    email.includes(".") &&
    password.length >= 8;
  const canVerifyOtp = otpDigits.every((digit) => digit.length === 1);

  const currentPath = intent === "learn" ? "learn" : "create";

  // Tracks the pending auto-advance timer used by the create/launch path's
  // single-select category step so we can cancel it on re-select, navigation,
  // or unmount and never advance twice / set state after unmount.
  const autoAdvanceTimeout = useRef<number | null>(null);
  const handoffTimeout = useRef<number | null>(null);
  const handoffOriginRef = useRef<HTMLDivElement | null>(null);

  const clearAutoAdvance = () => {
    if (autoAdvanceTimeout.current !== null) {
      window.clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
  };

  const clearHandoffTimeout = () => {
    if (handoffTimeout.current !== null) {
      window.clearTimeout(handoffTimeout.current);
      handoffTimeout.current = null;
    }
  };

  useEffect(
    () => () => {
      clearAutoAdvance();
      clearHandoffTimeout();
    },
    [],
  );

  // Going back to a destination step presents that step fresh: it clears the
  // destination step's OWN selection plus everything captured after it, so the
  // right-side ExperiencePanel (orbit highlight, headline, category tags, center
  // glyph) returns to its default non-selected state for the step the user lands
  // on. Each step owns one slice of state: step 0 → intent, step 1 → build/learn
  // choice, step 2 → domains, step 3 → account fields. We clear all slices owned
  // by steps with index >= destination. Decrementing by one keeps multi-level
  // back presses correct: each press resets the step it returns to.
  const resetFromStep = (destination: number) => {
    if (destination <= 2) {
      setDomains([]);
    }
    if (destination <= 1) {
      setBuildChoice(null);
      setLearnChoice(null);
    }
    if (destination <= 0) {
      setIntent(null);
    }
  };

  const goBack = () => {
    if (handoff) return;

    clearAutoAdvance();

    if (phase === "onboarding") {
      if (step > 0) {
        const destination = step - 1;
        resetFromStep(destination);
        setStep(destination);
        return;
      }
      // Step 0 is the first onboarding screen; stepping back returns to the
      // pre-onboarding auth screen the user came through — the OTP screen for
      // email signups, the signup form for Google.
      resetFromStep(0);
      setPhase(signupMethod === "email" ? "verify" : "account");
      return;
    }

    if (phase === "verify") {
      setOtpDigits(createEmptyOtpDigits());
      setPhase("account");
      return;
    }

    window.history.length > 1 ? window.history.back() : (window.location.href = "/");
  };

  const advance = (nextStep: number) => {
    playAdvanceChime();
    window.setTimeout(() => setStep(nextStep), 160);
  };

  const selectIntent = (value: Intent) => {
    setIntent(value);
    setBuildChoice(null);
    setLearnChoice(null);
    setDomains([]);
    advance(1);
  };

  const selectBuildChoice = (value: BuildChoice) => {
    setBuildChoice(value);
    setDomains([]);
    advance(2);
  };

  const selectLearnChoice = (value: LearnChoice) => {
    setLearnChoice(value);
    setDomains([]);
    advance(2);
  };

  // Learner path: multi-select with no category cap. The updated Figma flow
  // lets users pick any number of interests, continue once at least one is
  // selected, or skip the category step entirely.
  const toggleDomain = (value: DomainValue) => {
    setDomains((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }
      return [...current, value];
    });
  };

  // Create/launch path: single-select with no Continue CTA. The picked card
  // shows its selected state briefly, then we auto-advance. Re-selecting before
  // the timer fires cancels the prior timer and reschedules.
  const selectCreateDomain = (value: DomainValue) => {
    setDomains([value]);
    clearAutoAdvance();
    autoAdvanceTimeout.current = window.setTimeout(() => {
      autoAdvanceTimeout.current = null;
      finishOnboarding();
    }, 300);
  };

  // Learner path only (the create path auto-advances on single-select).
  const continueFromDomains = () => {
    if (domains.length === 0) return;
    finishOnboarding();
  };

  const skipDomains = () => {
    setDomains([]);
    finishOnboarding();
  };

  // Final onboarding handoff: once the user finishes the category step we play
  // the completion chime and run the full-screen orb → personalizing
  // transition. The account already exists at this point (created up front).
  const finishOnboarding = () => {
    if (handoff) return;

    playCompleteChime();
    const domainQuery = domains.length ? `&domains=${domains.join(",")}` : "";
    const isLearnIntent = intent === "learn";
    const targetIntent: Intent = isLearnIntent ? "learn" : "create";
    const glyph = isLearnIntent ? "book" : "rocket";
    const href = isLearnIntent
      ? `/personalizing?intent=learn${domainQuery}&handoff=1`
      : `/personalizing?intent=create&choice=${
          buildChoice ?? "course"
        }${domainQuery}&handoff=1`;
    const sourceRect = handoffOriginRef.current?.getBoundingClientRect();
    const fallbackSize = 120;
    const from = sourceRect
      ? rectFromDomRect(sourceRect)
      : {
          left: window.innerWidth * 0.85 - fallbackSize / 2,
          top: window.innerHeight * 0.5 - fallbackSize / 2,
          width: fallbackSize,
          height: fallbackSize,
        };
    const to = getPersonalizingOrbTarget(targetIntent);

    setHandoff({ glyph, from, to });
    handoffTimeout.current = window.setTimeout(() => {
      handoffTimeout.current = null;
      router.replace(href);
    }, HANDOFF_DURATION_MS);
  };

  // Signup now happens before onboarding. Email signups go to the OTP screen
  // first; Google sign-in skips OTP. Both land on the onboarding steps once the
  // account is "created".
  const enterOnboarding = () => {
    setStep(0);
    setPhase("onboarding");
  };

  const submitAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreateAccount) return;
    playAdvanceChime();
    setSignupMethod("email");
    setOtpDigits(createEmptyOtpDigits());
    setPhase("verify");
  };

  const submitOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canVerifyOtp) return;
    playAdvanceChime();
    enterOnboarding();
  };

  const resendOtp = () => {
    playAdvanceChime();
    setOtpDigits(createEmptyOtpDigits());
  };

  const handleGoogleSignIn = () => {
    setSignupMethod("google");
    enterOnboarding();
  };

  // The orb / "Personalizing your space" panel only belongs to the onboarding
  // steps. The signup and OTP screens are centered, full-width, panel-free.
  const showExperiencePanel = phase === "onboarding";

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#f7f8fb] text-gray-900">
      <section className="relative flex min-h-screen flex-col bg-white">
        <Header phase={phase} step={step} totalSteps={ONBOARDING_STEPS} />
        <BackControl onBack={goBack} />

        <div
          className={`flex flex-1 flex-col overflow-y-auto px-5 py-10 sm:px-10 lg:px-[72px] ${
            showExperiencePanel ? "xl:pl-0 xl:pr-[30vw]" : ""
          }`}
        >
          <div
            className={`mx-auto my-auto w-full ${
              phase === "account" || phase === "verify"
                ? "max-w-[483px] -translate-y-[30px]"
                : step === 1 && intent === "learn"
                  ? "max-w-[736px] -translate-y-8"
                  : step <= 1
                    ? "max-w-[666px] -translate-y-8"
                    : "max-w-[640px] -translate-y-8"
            }`}
          >
              <AnimatePresence mode="wait">
                {phase === "account" ? (
                  <motion.div key="account" {...stepMotion}>
                    {/* Signup is the first screen after "Get started" (Figma
                        node 3799:120572). Centered single column, no orb panel,
                        no progress dots — just the heading + account form. */}
                    <div className="mx-auto w-full max-w-[483px]">
                      <div className="mb-8 flex flex-col items-center gap-2 text-center">
                        <h1 className="font-montserrat text-[32px] font-bold leading-[38px] tracking-[-0.5px] text-[#101828] sm:text-[40px] sm:leading-[48px]">
                          Create your account
                        </h1>
                        <p className="text-[18px] leading-7 text-[#475467]">
                          A few quick details and you are in.
                        </p>
                      </div>
                      <AccountForm
                        name={name}
                        email={email}
                        password={password}
                        showPassword={showPassword}
                        canSubmit={canCreateAccount}
                        onNameChange={setName}
                        onEmailChange={setEmail}
                        onPasswordChange={setPassword}
                        onTogglePassword={() => setShowPassword((value) => !value)}
                        onSubmit={submitAccount}
                        onGoogleSignIn={handleGoogleSignIn}
                      />
                    </div>
                  </motion.div>
                ) : phase === "verify" ? (
                  <motion.div key="otp" {...stepMotion}>
                    <OtpStep
                      digits={otpDigits}
                      canSubmit={canVerifyOtp}
                      onDigitsChange={setOtpDigits}
                      onSubmit={submitOtp}
                      onResend={resendOtp}
                    />
                  </motion.div>
                ) : step === 0 ? (
                  <motion.div key="intent" {...stepMotion}>
                    <div className="mb-8">
                      <h1 className="font-montserrat text-[32px] font-bold leading-[38px] tracking-[-0.5px] text-gray-900 sm:whitespace-nowrap sm:text-[40px] sm:leading-[46px]">
                        Where would you like to begin?
                      </h1>
                      <p className="mt-3 max-w-[520px] text-[18px] leading-7 text-[#475467]">
                        You can always do both later.
                      </p>
                    </div>
                    <OptionList columns={2}>
                      {intentChoices.map((choice) => (
                        <OptionCard
                          key={choice.value}
                          choice={choice}
                          onSelect={() => selectIntent(choice.value)}
                        />
                      ))}
                    </OptionList>
                  </motion.div>
                ) : step === 1 && intent === "learn" ? (
                  <motion.div key="learn" {...stepMotion}>
                    <div className="mb-8">
                      <h1 className="font-montserrat text-[32px] font-bold leading-[38px] tracking-[-0.5px] text-gray-900 sm:whitespace-nowrap sm:text-[40px] sm:leading-[46px]">
                        What do you want to discover?
                      </h1>
                      <p className="mt-3 max-w-[520px] text-[18px] leading-7 text-[#475467]">
                        Kollab will tune the recommendations for you.
                      </p>
                    </div>
                    <OptionList columns={3}>
                      {learnChoices.map((choice) => (
                        <OptionCard
                          key={choice.value}
                          choice={choice}
                          onSelect={() => selectLearnChoice(choice.value)}
                        />
                      ))}
                    </OptionList>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div key="build" {...stepMotion}>
                    <div className="mb-8">
                      <h1 className="font-montserrat text-[32px] font-bold leading-[38px] tracking-[-0.5px] text-gray-900 sm:whitespace-nowrap sm:text-[40px] sm:leading-[46px]">
                        What are you building first?
                      </h1>
                      <p className="mt-3 max-w-[520px] text-[18px] leading-7 text-[#475467]">
                        You can build more or both later. Create unlimited products.
                      </p>
                    </div>
                    <OptionList columns={2}>
                      {buildChoices.map((choice) => (
                        <OptionCard
                          key={choice.value}
                          choice={choice}
                          onSelect={() => selectBuildChoice(choice.value)}
                        />
                      ))}
                    </OptionList>
                  </motion.div>
                ) : (
                  <motion.div key="domain" {...stepMotion}>
                    <div className="mb-8">
                      <h1 className="font-montserrat text-[32px] font-bold leading-[38px] tracking-[-0.5px] text-gray-900 sm:whitespace-nowrap sm:text-[40px] sm:leading-[46px]">
                        {currentPath === "learn"
                          ? "Pick your interests"
                          : "What's your area of expertise?"}
                      </h1>
                      <p className="mt-3 text-[18px] leading-7 text-[#475467]">
                        {currentPath === "learn"
                          ? "Choose categories to personalize your experience."
                          : "Choose a category to personalize your workspace."}
                      </p>
                    </div>
                    <DomainGrid
                      mode={currentPath}
                      selected={domains}
                      onSelect={
                        currentPath === "learn"
                          ? toggleDomain
                          : selectCreateDomain
                      }
                      onContinue={continueFromDomains}
                      onSkip={skipDomains}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
      </section>

      {showExperiencePanel ? (
        <ExperiencePanel
          intent={intent}
          buildChoice={buildChoice}
          learnChoice={learnChoice}
          domain={domainPreviewLabel}
          selectedDomains={selectedDomains}
          complete={false}
          variant={orbVariant}
          handoffOriginRef={handoffOriginRef}
          hideCore={Boolean(handoff)}
          centerGlyph={
            intent === "create" && (step === 1 || step === 2)
              ? "rocket"
              : intent === "learn" && (step === 1 || step === 2)
                ? "book"
                : "kollab"
          }
        />
      ) : null}

      <AnimatePresence>
        {handoff ? <OnboardingHandoffOrb handoff={handoff} /> : null}
      </AnimatePresence>
    </main>
  );
}

function Header({
  phase,
  step,
  totalSteps,
}: {
  phase: Phase;
  step: number;
  totalSteps: number;
}) {
  return (
    <header className="sticky top-0 z-40 h-[60px] border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center px-[54px] max-md:px-4">
        <Link href="/" aria-label="Kollab home" className="flex h-8 items-center">
          <img
            src="/kollab-logo-light.png"
            alt="Kollab"
            width={320}
            height={128}
            className="h-7 w-auto select-none"
            draggable={false}
          />
        </Link>

        {/* Progress dots belong to the onboarding steps only (Figma node
            2890:36689). The signup/OTP screens show no progress. */}
        {phase === "onboarding" ? (
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {Array.from({ length: totalSteps }, (_, index) => (
              <span
                key={index}
                aria-label={`Step ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index <= step ? "w-5 bg-[#343DE5]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function OnboardingHandoffOrb({ handoff }: { handoff: HandoffState }) {
  const iconName: GhlIconName = handoff.glyph === "book" ? "book" : "rocket";
  const iconStartScale = Math.min(1, handoff.from.width / 120);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.01, 0.62, 1] }}
        transition={{
          duration: HANDOFF_DURATION_MS / 1000,
          ease: "easeOut",
          times: [0, 0.18, 0.84, 1],
        }}
      />

      <motion.div
        data-onboarding-handoff-orb
        className="fixed will-change-[left,top,width,height]"
        initial={{
          left: handoff.from.left,
          top: handoff.from.top,
          width: handoff.from.width,
          height: handoff.from.height,
          opacity: 1,
        }}
        animate={{
          left: [handoff.from.left, handoff.from.left, handoff.to.left],
          top: [handoff.from.top, handoff.from.top, handoff.to.top],
          width: [handoff.from.width, handoff.from.width, handoff.to.width],
          height: [handoff.from.height, handoff.from.height, handoff.to.height],
          opacity: 1,
        }}
        transition={{
          duration: HANDOFF_DURATION_MS / 1000,
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.14, 1],
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, rotate: -34 }}
          animate={{ opacity: [0, 0, 1], rotate: [-34, -34, 132] }}
          transition={{
            duration: HANDOFF_DURATION_MS / 1000,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.18, 1],
          }}
        >
          <svg className="size-full" viewBox="0 0 172 172" aria-hidden="true">
            <circle
              cx="86"
              cy="86"
              r="81"
              fill="none"
              stroke="rgba(52,61,229,0.14)"
              strokeWidth="2"
            />
            <circle
              cx="86"
              cy="86"
              r="81"
              fill="none"
              stroke="url(#onboarding-handoff-arc)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="397.1 111.8"
            />
            <defs>
              <linearGradient
                id="onboarding-handoff-arc"
                x1="172"
                y1="0"
                x2="0"
                y2="172"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#7B83F5" />
                <stop offset="34%" stopColor="#5B63F5" stopOpacity="0.92" />
                <stop offset="68%" stopColor="#343DE5" stopOpacity="0.44" />
                <stop offset="100%" stopColor="#343DE5" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <div className="relative flex size-full items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-full"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1, PERSONALIZING_CORE_RATIO] }}
            transition={{
              duration: HANDOFF_DURATION_MS / 1000,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.14, 1],
            }}
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-white/[0.05]"
              style={{
                boxShadow:
                  "0 0 50px 12px #151D8E, inset 0 0 12px 3px rgba(255,255,255,0.50)",
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{
                duration: HANDOFF_DURATION_MS / 1000,
                ease: "easeOut",
                times: [0, 0.22, 1],
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(160deg, #5B63F5 0%, #343DE5 60%, #2831D3 100%)",
                boxShadow:
                  "0 20px 44px rgba(52,61,229,0.42), inset 0 2px 6px rgba(255,255,255,0.45), inset 0 -12px 22px rgba(0,0,0,0.18)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1] }}
              transition={{
                duration: HANDOFF_DURATION_MS / 1000,
                ease: "easeOut",
                times: [0, 0.22, 1],
              }}
            />
          </motion.span>
          <motion.span
            className="relative z-10 text-white"
            initial={{ scale: iconStartScale }}
            animate={{ scale: [iconStartScale, iconStartScale, 0.94] }}
            transition={{
              duration: HANDOFF_DURATION_MS / 1000,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.14, 1],
            }}
          >
            <GhlIcon name={iconName} size={52} />
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BackControl({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute left-1/2 top-20 z-30 w-full max-w-[1440px] -translate-x-1/2 px-[54px] max-md:px-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full px-1.5 py-1 text-[13px] font-medium leading-5 text-gray-400 transition-colors duration-150 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
      >
        <GhlIcon name="arrowLeft" size={15} />
        Back
      </button>
    </div>
  );
}

function OptionList({
  children,
  columns = 1,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}) {
  return (
    <motion.div
      {...optionListMotion}
      className={
        columns === 3
          ? "grid gap-4 md:grid-cols-3"
          : columns === 2
            ? "grid gap-4 md:grid-cols-2"
            : "grid gap-4"
      }
    >
      {children}
    </motion.div>
  );
}

function OptionCard<T extends string>({
  choice,
  onSelect,
}: {
  choice: Choice<T>;
  onSelect: () => void;
}) {
  return (
    <motion.button
      {...optionCardMotion}
      whileTap={{ scale: 0.99 }}
      type="button"
      onClick={onSelect}
      className="group relative flex w-full rounded-[16px] border border-[#eaecf0] bg-white p-4 text-left transition-colors duration-200 hover:border-[#c1c2f9] hover:bg-[#f7f7fe] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.99]"
    >
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[8px] bg-[#f2f4f7] text-[#475467] transition-colors duration-200 group-hover:bg-[#343DE5] group-hover:text-white">
          <GhlIcon name={choice.icon} size={28} />
        </span>

        <span className="flex min-w-0 flex-col justify-center gap-1">
          <span className="block text-[16px] font-semibold leading-6 text-[#101828]">
            {choice.title}
          </span>
          <span className="block text-[14px] leading-5 text-[#475467]">
            {choice.description}
          </span>
        </span>
      </span>

      <GhlIcon
        name="arrowRight"
        size={16}
        className="absolute right-4 top-4 text-[#475467] transition-colors duration-200 group-hover:text-[#343DE5]"
      />
    </motion.button>
  );
}

function DomainGrid({
  mode,
  selected,
  onSelect,
  onContinue,
  onSkip,
}: {
  mode: "create" | "learn";
  selected: DomainValue[];
  onSelect: (value: DomainValue) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  // Create/launch path is single-select with no max-block and no Continue CTA;
  // learner path is uncapped and adds a Skip action. Continue is enabled once
  // at least one category is selected.
  const isCreate = mode === "create";
  const canContinue = selected.length >= 1;

  return (
    <div className="xl:w-[736px]">
      {/* Category cards — Figma component set 2907:60915. Each card is a
          172px tile (16px padding, 16px radius) with an inline 24px icon +
          Inter Medium 16px label. Default / hover / selected / maxed states
          mirror the design tokens exactly. */}
      <div className="flex flex-wrap gap-4">
        {domainChoices.map((choice) => {
          const isSelected = selected.includes(choice.value);

          return (
            <button
              key={choice.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(choice.value)}
              className={`flex w-full flex-col items-center justify-center gap-3 rounded-[16px] border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.99] sm:w-[172px] ${
                isSelected
                  ? "border-[#343DE5] bg-[#eff0fd]"
                  : "border-[#eaecf0] bg-white hover:border-[#c1c2f9] hover:bg-[#f7f7fe]"
              }`}
            >
              <span className="flex w-full items-center gap-2">
                <span
                  className={`flex size-6 shrink-0 items-center justify-center transition-colors duration-200 ${
                    isSelected ? "text-[#343DE5]" : "text-[#101828]"
                  }`}
                >
                  <GhlIcon name={choice.icon} size={24} />
                </span>
                <span
                  className={`truncate text-[16px] font-medium leading-6 transition-colors duration-200 ${
                    isSelected ? "text-[#343DE5]" : "text-[#101828]"
                  }`}
                >
                  {choice.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {!isCreate ? (
        // Figma node 2916:65536: Skip sits left, Continue sits right. Continue
        // remains disabled until at least one category is selected.
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[#f9fafb] bg-[#f9fafb] px-4 py-2.5 text-[16px] font-semibold leading-6 text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all duration-150 hover:border-[#eaecf0] hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-100 active:scale-[0.97]"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="inline-flex shrink-0 items-center justify-center gap-2 overflow-clip rounded-lg border border-[#343DE5] bg-[#343DE5] px-4 py-2.5 text-[16px] font-semibold leading-6 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all duration-150 hover:border-[#2831D3] hover:bg-[#2831D3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:border-[#b2ccff] disabled:bg-[#b2ccff] disabled:shadow-none disabled:hover:border-[#b2ccff] disabled:hover:bg-[#b2ccff] disabled:active:scale-100"
          >
            Continue
            <GhlIcon name="arrowRight" size={20} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function formatDomainSelection(selected: DomainChoice[]) {
  if (selected.length === 0) return undefined;
  if (selected.length === 1) return selected[0].label;
  if (selected.length === 2) {
    return `${selected[0].label}, ${selected[1].label}`;
  }
  return `${selected[0].label}, ${selected[1].label} +${selected.length - 2}`;
}

function OtpStep({
  digits,
  canSubmit,
  onDigitsChange,
  onSubmit,
  onResend,
}: {
  digits: string[];
  canSubmit: boolean;
  onDigitsChange: (digits: string[]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResend: () => void;
}) {
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    otpInputRefs.current[0]?.focus();
  }, []);

  const focusDigit = (index: number) => {
    otpInputRefs.current[index]?.focus();
  };

  const setDigitsFromValue = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "");
    const nextDigits = [...digits];

    if (!value) {
      nextDigits[index] = "";
      onDigitsChange(nextDigits);
      return;
    }

    const incomingDigits = value.slice(0, OTP_LENGTH - index).split("");
    incomingDigits.forEach((digit, offset) => {
      nextDigits[index + offset] = digit;
    });
    onDigitsChange(nextDigits);

    const nextIndex = Math.min(index + incomingDigits.length, OTP_LENGTH - 1);
    focusDigit(nextIndex);
  };

  const handleDigitChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setDigitsFromValue(index, event.target.value);
  };

  const handleDigitKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusDigit(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusDigit(index + 1);
      return;
    }

    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      const nextDigits = [...digits];
      nextDigits[index - 1] = "";
      onDigitsChange(nextDigits);
      focusDigit(index - 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedDigits) return;

    event.preventDefault();
    const nextDigits = createEmptyOtpDigits();
    pastedDigits.split("").forEach((digit, index) => {
      nextDigits[index] = digit;
    });
    onDigitsChange(nextDigits);
    focusDigit(Math.min(pastedDigits.length, OTP_LENGTH - 1));
  };

  return (
    <div className="mx-auto w-full max-w-[483px]">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="font-montserrat text-[32px] font-bold leading-[38px] tracking-[-0.5px] text-[#101828] sm:text-[40px] sm:leading-[48px]">
          Check your inbox
        </h1>
        <p className="text-[18px] leading-7 text-[#475467]">
          Enter the 6 digit secure code sent to your email.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div
          className="flex items-center justify-center gap-2 sm:gap-3"
          aria-label="Secure code"
        >
          {Array.from({ length: OTP_LENGTH }, (_, index) => (
            <Fragment key={index}>
              {/* Figma node 4007:82515 splits the code into two groups of
                  three with a dash in the middle. */}
              {index === 3 ? (
                <span
                  aria-hidden
                  className="px-0.5 text-[32px] font-medium leading-none text-[#d0d5dd] sm:text-[44px]"
                >
                  -
                </span>
              ) : null}
              <input
                ref={(node) => {
                  otpInputRefs.current[index] = node;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digits[index] ?? ""}
                onChange={(event) => handleDigitChange(index, event)}
                onKeyDown={(event) => handleDigitKeyDown(index, event)}
                onPaste={handlePaste}
                aria-label={`Digit ${index + 1}`}
                className="size-12 min-w-0 rounded-lg border border-[#d0d5dd] bg-white text-center text-[28px] font-semibold leading-none text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-all duration-150 placeholder:text-[#667085] focus:border-[#343DE5] focus:ring-4 focus:ring-indigo-100 sm:size-16 sm:text-[40px]"
              />
            </Fragment>
          ))}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-11 w-full items-center justify-center rounded-lg border border-[#343DE5] bg-[#343DE5] px-4 py-2.5 text-[16px] font-semibold leading-6 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all duration-150 hover:border-[#2831D3] hover:bg-[#2831D3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:border-[#b2ccff] disabled:bg-[#b2ccff] disabled:shadow-none disabled:hover:border-[#b2ccff] disabled:hover:bg-[#b2ccff] disabled:active:scale-100"
        >
          Verify and continue
        </button>

        <button
          type="button"
          onClick={onResend}
          className="mx-auto inline-flex h-[30px] items-center justify-center gap-2 rounded-md px-2 text-[13px] font-semibold leading-[18px] text-[#344054] transition-colors duration-150 hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-100 active:scale-[0.97]"
        >
          <RefreshCw aria-hidden="true" size={16} strokeWidth={2} />
          Resend code
        </button>
      </form>
    </div>
  );
}

function AccountForm({
  name,
  email,
  password,
  showPassword,
  canSubmit,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onGoogleSignIn,
}: {
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  canSubmit: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn: () => void;
}) {
  // Figma node 2918:83597 ("Finish your setup"): Google button → divider
  // ("Or sign up with your email") → three required, labelled fields → primary
  // "Create account" CTA → terms line. All blocks sit on a 16px vertical rhythm.

  // Autofocus the Full name field whenever the account step becomes active.
  // AccountForm only mounts on the account step (AnimatePresence remounts it on
  // each navigation back to it), so a mount effect focuses it every time. The
  // optional-chained ref is null-safe and never steals focus on other steps.
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      <button
        type="button"
        onClick={onGoogleSignIn}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#d0d5dd] bg-white px-4 py-2.5 text-[16px] font-semibold leading-6 text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.99]"
      >
        <GoogleGlyph size={20} />
        Continue with Google
      </button>

      <div className="flex items-center gap-1 text-[14px] font-medium leading-5 text-[#475467]">
        <div className="h-px flex-1 bg-[#eaecf0]" />
        Or sign up with your email
        <div className="h-px flex-1 bg-[#eaecf0]" />
      </div>

      <AccountField
        label="Full name"
        value={name}
        onChange={onNameChange}
        placeholder="Enter your name"
        autoComplete="name"
        inputRef={nameInputRef}
      />
      <AccountField
        label="Email"
        value={email}
        onChange={onEmailChange}
        placeholder="Enter your email address"
        autoComplete="email"
        type="email"
      />
      <AccountField
        label="Password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Minimum 8 characters"
        autoComplete="new-password"
        type={showPassword ? "text" : "password"}
        trailing={
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="flex size-6 shrink-0 items-center justify-center rounded text-[#667085] transition-colors duration-150 hover:text-gray-700 focus-visible:outline-none"
          >
            <GhlIcon name="eye" size={16} />
          </button>
        }
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-[#343DE5] px-4 py-2.5 text-[16px] font-semibold leading-6 text-white shadow-[0_14px_30px_rgba(52,61,229,0.22)] transition-all duration-150 hover:bg-[#2831D3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-[#b2ccff] disabled:shadow-none disabled:active:scale-100"
      >
        Create account
      </button>
      <p className="text-center text-[12px] leading-[17px] text-[#475467]">
        By signing in, you agree to the{" "}
        <a href="#" className="underline">
          terms of service
        </a>{" "}
        and have read the{" "}
        <a href="#" className="underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}

function AccountField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  trailing,
  inputRef,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  trailing?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center gap-1">
        <span className="text-[16px] font-medium leading-6 text-[#344054]">
          {label}
        </span>
        <span className="text-[14px] leading-5 text-[#d92d20]">*</span>
      </span>
      <span className="flex h-9 w-full items-center gap-2 rounded-md border border-[#d0d5dd] bg-white px-2 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all duration-150 focus-within:border-[#343DE5] focus-within:ring-4 focus-within:ring-indigo-100">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-gray-900 outline-none placeholder:text-[#667085]"
        />
        {trailing}
      </span>
    </label>
  );
}

// Standard four-colour Google "G" mark for the social sign-in button
// (Figma node 2918:83693 → google logo asset).
function GoogleGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232C18.491 15.92 19.6 13.318 19.6 10.227Z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.964-.895 6.618-2.422l-3.232-2.51c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.596-4.123H1.064v2.59A9.997 9.997 0 0 0 10 20Z"
        fill="#34A853"
      />
      <path
        d="M4.404 11.9A6 6 0 0 1 4.09 10c0-.659.114-1.3.314-1.9V5.51H1.064A9.997 9.997 0 0 0 0 10c0 1.614.386 3.141 1.064 4.49l3.34-2.59Z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0A9.997 9.997 0 0 0 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function ExperiencePanel({
  intent,
  buildChoice,
  learnChoice,
  domain,
  selectedDomains,
  complete,
  variant,
  handoffOriginRef,
  hideCore,
  centerGlyph,
}: {
  intent: Intent | null;
  buildChoice: BuildChoice | null;
  learnChoice: LearnChoice | null;
  domain?: string;
  selectedDomains: DomainChoice[];
  complete: boolean;
  variant: OrbVariant;
  handoffOriginRef: Ref<HTMLDivElement>;
  hideCore: boolean;
  centerGlyph: OrbCenterGlyph;
}) {
  const isLearner = intent === "learn";
  const modeLabel = isLearner ? "Discovery feed" : "Creator workspace";
  const focusLabel = getFocusLabel(intent, buildChoice, learnChoice);
  const hasFocus = isLearner ? learnChoice !== null : buildChoice !== null;

  const accent = "#343DE5";
  const accentSoft = "#343DE5";
  const focusIcon = getFocusIcon(intent, buildChoice, learnChoice);
  const activePillar = getActivePillar(intent, buildChoice, learnChoice);
  const eyebrow = intent ? modeLabel : "Kollab";

  const progress =
    [intent !== null, hasFocus, Boolean(domain), complete].filter(Boolean)
      .length / 4;

  let headline: string;
  if (complete) {
    headline = "Everything's ready.";
  } else if (!intent) {
    headline = "Personalizing your space";
  } else if (!hasFocus) {
    headline = isLearner
      ? "Tuning your discovery feed"
      : "Building your creator workspace";
  } else {
    headline = isLearner ? `${focusLabel} in focus` : `${focusLabel} in motion`;
  }

  return (
    <aside
      className="fixed bottom-0 right-0 top-[60px] z-20 hidden items-center justify-center overflow-hidden px-6 py-10 xl:flex"
      style={{ width: "30vw" }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #151D8E 0%, #000000 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at 50% 38%, ${accent}33, transparent 55%)`,
        }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex scale-[0.8] flex-col items-center text-center 2xl:scale-100">
        {variant === 1 ? (
          <OrbitOrb accent={accent} focusIcon={focusIcon} />
        ) : variant === 2 ? (
          <AuroraOrb accent={accent} accentSoft={accentSoft} focusIcon={focusIcon} />
        ) : variant === 3 ? (
          <HaloOrb accent={accent} focusIcon={focusIcon} progress={progress} />
        ) : (
          <KollabConstellation
            accent={accent}
            activePillar={activePillar}
            centerGlyph={centerGlyph}
            coreRef={handoffOriginRef}
            hideCore={hideCore}
          />
        )}

        <OrbCaption
          accent={accent}
          eyebrow={eyebrow}
          showEyebrow={false}
          headline={headline}
          domains={selectedDomains}
        />
      </div>
    </aside>
  );
}

function OrbCaption({
  accent,
  eyebrow,
  showEyebrow = true,
  headline,
  domains,
}: {
  accent: string;
  eyebrow: string;
  showEyebrow?: boolean;
  headline: string;
  domains: DomainChoice[];
}) {
  return (
    <div className="-mt-4 flex flex-col items-center">
      {showEyebrow ? (
        <AnimatePresence mode="wait">
          <motion.p
            key={eyebrow}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 0.85, 0.25, 1] }}
            className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </motion.p>
        </AnimatePresence>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.h2
          key={headline}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.36, ease: [0.22, 0.85, 0.25, 1] }}
          className="max-w-[360px] text-center text-[20px] font-semibold leading-[30px] tracking-[0px] text-white"
        >
          {headline}
        </motion.h2>
      </AnimatePresence>

      {/* Category tags — Figma node 2916:66759. One chip per selected category
          (no "+N" overflow), laid out in a centered, 12px-gap flex-wrap row
          16px below the headline (Figma caption frame spacing/4 + spacing/3).
          Each chip reuses the launch-flow Tag (node 2911:62292): rgba white 15%
          fill, 1px #475467 border, 2px backdrop blur, fully rounded, px 12 /
          py 6, 4px icon-to-label gap. Label is Inter Medium 16/24 white; the
          leading icon is that category's exact 18px GHL icon in white. Chips
          stagger in on selection. The create path passes a single category, so
          this naturally renders one chip. */}
      <div className="mt-4 flex min-h-9 flex-wrap items-center justify-center gap-3">
        <AnimatePresence>
          {domains.map((domainChoice, index) => (
            <motion.div
              key={domainChoice.value}
              layout
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{
                duration: 0.34,
                ease: [0.22, 0.85, 0.25, 1],
                delay: index * 0.06,
              }}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-[#475467] bg-white/15 px-3 py-1.5 text-[16px] font-medium leading-6 text-white backdrop-blur-[2px]"
            >
              <span className="text-white">
                <GhlIcon name={domainChoice.icon} size={18} />
              </span>
              {domainChoice.label}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

type PillarKey = "courses" | "communities" | "creators";
type PillarIconName = GhlIconName | "creator";

// Exact GHL icons from Figma (file lSuVFjWScTgFMplHt0JsQK):
// Courses → graduation-hat-02 (2907:36912), Communities → users-02
// (2907:36878), Creators → image-user-check (2907:36946, rendered by
// CreatorPillarIcon via the "creator" sentinel).
const KOLLAB_PILLARS: { key: PillarKey; icon: PillarIconName; label: string }[] = [
  { key: "courses", icon: "graduation", label: "Courses" },
  { key: "communities", icon: "users", label: "Communities" },
  { key: "creators", icon: "creator", label: "Creators" },
];

const KOLLAB_PILLAR_NODE_SIZE = 40;
const KOLLAB_PILLAR_ICON_SIZE = 22;
const KOLLAB_PILLAR_RADIUS = 8;

// Default Kollab-native concept: the three fixed pillars (courses,
// communities, creators) orbit the center glyph. The orbiting set is always
// the same KOLLAB_PILLARS and never changes with the user's flow or category
// choice; only the pillar matching the user's selection lights up, while mode
// drives the accent color.
function KollabConstellation({
  accent,
  activePillar,
  centerGlyph = "kollab",
  coreRef,
  hideCore = false,
}: {
  accent: string;
  activePillar: PillarKey | null;
  centerGlyph?: OrbCenterGlyph;
  coreRef?: Ref<HTMLDivElement>;
  hideCore?: boolean;
}) {
  const radius = 125;
  const nodeSize = KOLLAB_PILLAR_NODE_SIZE;

  return (
    <motion.div
      className="relative flex size-[360px] items-center justify-center"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        aria-hidden
        className="absolute size-[130px] rounded-full blur-[48px]"
        animate={{
          backgroundColor: accent,
          scale: [1, 1.08, 1],
          opacity: [0.32, 0.52, 0.32],
        }}
        transition={{
          backgroundColor: { duration: 1.1, ease: "easeOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <div
        aria-hidden
        className="absolute size-[270px] rounded-full border border-white/10"
      />

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {KOLLAB_PILLARS.map((pillar, index) => {
          const angle = index * 120;
          return (
            <div
              key={pillar.key}
              className="absolute left-1/2 top-1/2"
              style={{
                marginLeft: -nodeSize / 2,
                marginTop: -nodeSize / 2,
                transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`,
              }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <PillarNode
                  icon={pillar.icon}
                  active={activePillar === pillar.key}
                  accent={accent}
                  size={nodeSize}
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        ref={coreRef}
        data-onboarding-handoff-origin
        animate={{ opacity: hideCore ? 0 : 1 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      >
        <KollabMarkCore size={120} glyph={centerGlyph} />
      </motion.div>
    </motion.div>
  );
}

function PillarNode({
  icon,
  active,
  accent,
  size,
}: {
  icon: PillarIconName;
  active: boolean;
  accent: string;
  size: number;
}) {
  return (
    <motion.div
      className="flex items-center justify-center text-white"
      style={{ width: size, height: size, borderRadius: KOLLAB_PILLAR_RADIUS }}
      animate={{
        backgroundColor: active ? accent : "#323797",
        scale: 1,
        boxShadow: active ? `0 0 24px ${accent}66` : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.5, ease: [0.22, 0.85, 0.25, 1] }}
    >
      {icon === "creator" ? (
        <CreatorPillarIcon size={KOLLAB_PILLAR_ICON_SIZE} />
      ) : (
        <GhlIcon name={icon} size={KOLLAB_PILLAR_ICON_SIZE} />
      )}
    </motion.div>
  );
}

// Glass orb core. The Kollab "K" brand mark only appears on the intent step.
// Once a flow is chosen the core adopts that flow's glyph for the rest of the
// journey — a rocket on the create/launch steps and a book on the
// learner/discover steps — including the final account ("Finish your setup")
// step, which never reverts to the "K".
function KollabMarkCore({
  size,
  glyph = "kollab",
}: {
  size: number;
  glyph?: OrbCenterGlyph;
}) {
  // Figma node 2890-36702 (ellipse 2890:36383): glass core is a Ø120 circle
  // filled white @ 5%, no stroke, with a blue outer glow drop shadow
  // (#151D8E, blur 50, spread 12) and a white @ 50% inner-shadow rim
  // (blur 12, spread 3). The bright rim is the inner shadow — no top blob.
  return (
    <div
      className="relative flex items-center justify-center rounded-full bg-white/[0.05]"
      style={{
        width: size,
        height: size,
        boxShadow:
          "0 0 50px 12px #151D8E, inset 0 0 12px 3px rgba(255,255,255,0.50)",
      }}
    >
      {glyph === "rocket" ? (
        <span className="relative text-white">
          <GhlIcon name="rocket" size={52} />
        </span>
      ) : glyph === "book" ? (
        <span className="relative text-white">
          <GhlIcon name="book" size={52} />
        </span>
      ) : (
        <img
          src="/kollab-mark.png"
          alt="Kollab"
          width={120}
          height={120}
          className="relative w-[60px] select-none"
          draggable={false}
        />
      )}
    </div>
  );
}

// Creators orbit pillar uses the exact GHL image-user-check glyph
// (Figma node 2907:36946), matching the "badge" mapping used by the Creators
// option card so the two stay in sync.
function CreatorPillarIcon({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return <ImageUserCheckIcon size={size} className={className} />;
}

function OrbCore({
  focusIcon,
  size,
  iconSize,
}: {
  focusIcon: GhlIconName;
  size: number;
  iconSize: number;
}) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-md"
      style={{
        width: size,
        height: size,
        boxShadow:
          "inset 0 2px 3px rgba(255,255,255,0.30), inset 0 -10px 22px rgba(0,0,0,0.35)",
      }}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-[14%] h-1/4 w-1/2 -translate-x-1/2 rounded-full bg-white/35 blur-md"
      />
      <span className="relative">
        <AnimatePresence mode="wait">
          <motion.span
            key={focusIcon}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.32, ease: [0.22, 0.85, 0.25, 1] }}
            className="block"
          >
            <GhlIcon name={focusIcon} size={iconSize} />
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}

// Variant 1 (default): layered "Orbit" — concentric rings at different speeds,
// breathing glow, and a glass core with realistic inner light.
function OrbitOrb({
  accent,
  focusIcon,
}: {
  accent: string;
  focusIcon: GhlIconName;
}) {
  const outerMask = "radial-gradient(closest-side, transparent 78%, #000 80%)";
  const midMask = "radial-gradient(closest-side, transparent 80%, #000 82%)";

  return (
    <motion.div
      className="relative flex size-[280px] items-center justify-center"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ WebkitMaskImage: outerMask, maskImage: outerMask }}
        animate={{
          rotate: 360,
          background: `conic-gradient(from 0deg, transparent 0%, ${accent}00 10%, ${accent} 32%, #ffffff 50%, ${accent} 68%, ${accent}00 90%, transparent 100%)`,
        }}
        transition={{
          rotate: { duration: 32, repeat: Infinity, ease: "linear" },
          background: { duration: 1.1, ease: "easeOut" },
        }}
      />

      <motion.div
        aria-hidden
        className="absolute size-[212px] rounded-full"
        style={{
          WebkitMaskImage: midMask,
          maskImage: midMask,
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 78%, transparent 100%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        aria-hidden
        className="absolute size-[150px] rounded-full blur-[44px]"
        animate={{
          backgroundColor: accent,
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.78, 0.5],
        }}
        transition={{
          backgroundColor: { duration: 1.1, ease: "easeOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <OrbCore focusIcon={focusIcon} size={124} iconSize={36} />
    </motion.div>
  );
}

// Variant 2: "Aurora" — drifting, blurred nebula blobs around a calm bright core.
function AuroraOrb({
  accent,
  accentSoft,
  focusIcon,
}: {
  accent: string;
  accentSoft: string;
  focusIcon: GhlIconName;
}) {
  return (
    <div className="relative flex size-[320px] items-center justify-center">
      <motion.div
        aria-hidden
        className="absolute size-[190px] rounded-full blur-[55px]"
        style={{ top: 26, left: 22 }}
        animate={{
          backgroundColor: accent,
          x: [0, 26, -10, 0],
          y: [0, -18, 14, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          backgroundColor: { duration: 1.2, ease: "easeOut" },
          x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 18, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 14, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        aria-hidden
        className="absolute size-[170px] rounded-full blur-[55px]"
        style={{ bottom: 24, right: 26 }}
        animate={{
          backgroundColor: accentSoft,
          x: [0, -24, 12, 0],
          y: [0, 16, -12, 0],
          scale: [1, 0.92, 1.12, 1],
        }}
        transition={{
          backgroundColor: { duration: 1.2, ease: "easeOut" },
          x: { duration: 19, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 17, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        aria-hidden
        className="absolute size-[140px] rounded-full blur-[50px] opacity-70"
        animate={{
          backgroundColor: "#ffffff",
          x: [0, 14, -16, 0],
          y: [0, 12, -10, 0],
        }}
        transition={{
          x: { duration: 21, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 23, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <OrbCore focusIcon={focusIcon} size={108} iconSize={32} />
      </motion.div>
    </div>
  );
}

// Variant 3: "Halo" — a precise mono ring with a thin accent progress arc
// that fills as the user advances. A leading dot tracks the arc's edge.
function HaloOrb({
  accent,
  focusIcon,
  progress,
}: {
  accent: string;
  focusIcon: GhlIconName;
  progress: number;
}) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      className="relative flex size-[260px] items-center justify-center"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        aria-hidden
        className="absolute size-[150px] rounded-full blur-[46px]"
        animate={{ backgroundColor: accent, opacity: [0.22, 0.4, 0.22] }}
        transition={{
          backgroundColor: { duration: 1.1, ease: "easeOut" },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <svg
        viewBox="0 0 260 260"
        className="absolute inset-0 size-full -rotate-90"
        fill="none"
      >
        <circle
          cx="130"
          cy="130"
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2.5"
        />
        <circle
          cx="130"
          cy="130"
          r="92"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1.5"
        />
        <motion.circle
          cx="130"
          cy="130"
          r={radius}
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{
            strokeDashoffset: circumference * (1 - progress),
            stroke: accent,
          }}
          transition={{ duration: 0.8, ease: [0.22, 0.85, 0.25, 1] }}
        />
      </svg>

      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ rotate: progress * 360 }}
        transition={{ duration: 0.8, ease: [0.22, 0.85, 0.25, 1] }}
      >
        <span
          className="absolute left-1/2 top-[10px] size-2.5 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }}
        />
      </motion.div>

      <OrbCore focusIcon={focusIcon} size={120} iconSize={34} />
    </motion.div>
  );
}

function getFocusIcon(
  intent: Intent | null,
  buildChoice: BuildChoice | null,
  learnChoice: LearnChoice | null,
): GhlIconName {
  if (!intent) return "sparkles";

  if (intent === "learn") {
    if (learnChoice === "communities") return "users";
    if (learnChoice === "creators") return "badge";
    if (learnChoice === "all") return "sparkles";
    if (learnChoice === "courses") return "book";
    return "search";
  }

  if (buildChoice === "community") return "users";
  if (buildChoice === "both") return "sparkles";
  if (buildChoice === "course") return "book";
  return "rocket";
}

// Maps the user's current selection to one of the three fixed orbit pillars so
// the matching pillar can light up. The orbit icons themselves stay constant
// (KOLLAB_PILLARS); only the highlight tracks the selection.
function getActivePillar(
  intent: Intent | null,
  buildChoice: BuildChoice | null,
  learnChoice: LearnChoice | null,
): PillarKey | null {
  if (intent === "learn") {
    if (learnChoice === "courses") return "courses";
    if (learnChoice === "communities") return "communities";
    if (learnChoice === "creators") return "creators";
    return null;
  }

  if (buildChoice === "course") return "courses";
  if (buildChoice === "community") return "communities";
  return null;
}

function GhlIcon({
  name,
  size = 20,
  className,
}: {
  name: GhlIconName;
  size?: number;
  className?: string;
}) {
  const Icon = GHL_ICON_MAP[name];
  return <Icon size={size} className={className} />;
}

function getFocusLabel(
  intent: Intent | null,
  buildChoice: BuildChoice | null,
  learnChoice: LearnChoice | null,
) {
  if (intent === "learn") {
    if (learnChoice === "communities") return "Community discovery";
    if (learnChoice === "creators") return "Creator discovery";
    if (learnChoice === "all") return "Full discovery";
    return "Course discovery";
  }

  if (buildChoice === "community") return "Community launch";
  if (buildChoice === "both") return "Course plus community";
  return "Course launch";
}
