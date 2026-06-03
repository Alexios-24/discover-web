"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  Dumbbell,
  Eye,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  LockKeyhole,
  Mail,
  Megaphone,
  Music,
  Paintbrush,
  Palette,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
  Video,
  type LucideIcon,
} from "lucide-react";

type Intent = "create" | "learn";
type BuildChoice = "course" | "community" | "both";
type LearnChoice = "courses" | "communities" | "creators" | "all";
type DomainValue =
  | "marketing"
  | "ecommerce"
  | "finance"
  | "coaching"
  | "tech"
  | "design"
  | "health"
  | "real-estate"
  | "crypto"
  | "content"
  | "sales"
  | "saas"
  | "consulting"
  | "fitness"
  | "music"
  | "art";

type GhlIconName = keyof typeof GHL_ICON_MAP;

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

const GHL_ICON_MAP = {
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  badge: BadgeCheck,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  check: Check,
  chevronRight: ChevronRight,
  cloud: Cloud,
  coin: CircleDollarSign,
  dumbbell: Dumbbell,
  eye: Eye,
  graduation: GraduationCap,
  heart: HeartPulse,
  home: Home,
  landmark: Landmark,
  laptop: Laptop,
  lock: LockKeyhole,
  mail: Mail,
  megaphone: Megaphone,
  music: Music,
  paintbrush: Paintbrush,
  palette: Palette,
  rocket: Rocket,
  search: Search,
  shopping: ShoppingBag,
  sparkles: Sparkles,
  target: Target,
  user: UserRound,
  users: UsersRound,
  video: Video,
} satisfies Record<string, LucideIcon>;

const intentChoices: Choice<Intent>[] = [
  {
    value: "create",
    title: "Create and sell",
    description: "Launch a course, community, or both from a guided workspace.",
    icon: "rocket",
  },
  {
    value: "learn",
    title: "Learn and discover",
    description: "Find trusted creators, useful courses, and communities worth joining.",
    icon: "graduation",
  },
];

const buildChoices: Choice<BuildChoice>[] = [
  {
    value: "course",
    title: "Course",
    description: "Structured lessons, modules, resources, and progress.",
    icon: "book",
  },
  {
    value: "community",
    title: "Community",
    description: "Discussions, live sessions, events, and memberships.",
    icon: "users",
  },
  {
    value: "both",
    title: "Course plus community",
    description: "A learning product with content and conversation together.",
    icon: "sparkles",
  },
];

const learnChoices: Choice<LearnChoice>[] = [
  {
    value: "courses",
    title: "Courses",
    description: "Deep programs with a clear path and measurable outcomes.",
    icon: "book",
  },
  {
    value: "communities",
    title: "Communities",
    description: "Spaces where members learn together and keep momentum.",
    icon: "users",
  },
  {
    value: "creators",
    title: "Creators",
    description: "Experts, builders, and operators you can keep following.",
    icon: "badge",
  },
  {
    value: "all",
    title: "A little of everything",
    description: "Keep recommendations broad while Kollab learns your taste.",
    icon: "sparkles",
  },
];

const domainChoices: DomainChoice[] = [
  { value: "marketing", label: "Marketing", icon: "megaphone" },
  { value: "ecommerce", label: "E-commerce", icon: "shopping" },
  { value: "finance", label: "Finance", icon: "landmark" },
  { value: "coaching", label: "Coaching", icon: "target" },
  { value: "tech", label: "Tech", icon: "laptop" },
  { value: "design", label: "Design", icon: "palette" },
  { value: "health", label: "Health", icon: "heart" },
  { value: "real-estate", label: "Real Estate", icon: "home" },
  { value: "crypto", label: "Crypto", icon: "coin" },
  { value: "content", label: "Content", icon: "video" },
  { value: "sales", label: "Sales", icon: "search" },
  { value: "saas", label: "SaaS", icon: "cloud" },
  { value: "consulting", label: "Consulting", icon: "briefcase" },
  { value: "fitness", label: "Fitness", icon: "dumbbell" },
  { value: "music", label: "Music", icon: "music" },
  { value: "art", label: "Art", icon: "paintbrush" },
];

const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.32, ease: [0.22, 0.85, 0.25, 1] as const },
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

function OnboardingFlow() {
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

  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [buildChoice, setBuildChoice] = useState<BuildChoice | null>(null);
  const [learnChoice, setLearnChoice] = useState<LearnChoice | null>(null);
  const [domain, setDomain] = useState<DomainValue | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [complete, setComplete] = useState(false);

  const selectedDomain = useMemo(
    () => domainChoices.find((item) => item.value === domain),
    [domain],
  );

  const canCreateAccount =
    name.trim().length > 1 &&
    email.includes("@") &&
    email.includes(".") &&
    password.length >= 8;

  const visibleStep = complete ? 4 : step;
  const currentPath = intent === "learn" ? "learn" : "create";

  const goBack = () => {
    if (complete) {
      setComplete(false);
      setStep(3);
      return;
    }

    if (step > 0) {
      setStep((current) => current - 1);
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
    setDomain(null);
    advance(1);
  };

  const selectBuildChoice = (value: BuildChoice) => {
    setBuildChoice(value);
    setDomain(null);
    advance(2);
  };

  const selectLearnChoice = (value: LearnChoice) => {
    setLearnChoice(value);
    setDomain(null);
    advance(2);
  };

  const selectDomain = (value: DomainValue) => {
    setDomain(value);
    advance(3);
  };

  const submitAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreateAccount) return;
    playCompleteChime();
    setComplete(true);
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#f7f8fb] text-gray-900">
      <section className="relative flex min-h-screen flex-col bg-white">
        <Header step={visibleStep} />
        <BackControl onBack={goBack} />

        <div className="flex flex-1 items-center px-5 py-10 sm:px-10 lg:px-[72px]">
          <div className="mx-auto w-full max-w-[640px]">
              <AnimatePresence mode="wait">
                {complete ? (
                  <CompletionStep
                    key="complete"
                    intent={intent}
                    domain={selectedDomain?.label}
                  />
                ) : step === 0 ? (
                  <motion.div key="intent" {...stepMotion}>
                    <StepHeading
                      label="Kollab onboarding"
                      title="First, what should Kollab shape around?"
                      description="Your first answer decides whether we open with a creator workspace or a discovery feed."
                    />
                    <OptionList>
                      {intentChoices.map((choice) => (
                        <OptionCard
                          key={choice.value}
                          choice={choice}
                          selected={intent === choice.value}
                          onSelect={() => selectIntent(choice.value)}
                        />
                      ))}
                    </OptionList>
                  </motion.div>
                ) : step === 1 && intent === "learn" ? (
                  <motion.div key="learn" {...stepMotion}>
                    <StepHeading
                      label="Discovery fit"
                      title="What do you want to find first?"
                      description="Kollab will tune recommendations around the kind of learning experience you choose here."
                    />
                    <OptionList>
                      {learnChoices.map((choice) => (
                        <OptionCard
                          key={choice.value}
                          choice={choice}
                          selected={learnChoice === choice.value}
                          onSelect={() => selectLearnChoice(choice.value)}
                        />
                      ))}
                    </OptionList>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div key="build" {...stepMotion}>
                    <StepHeading
                      label="Creator fit"
                      title="What are you building first?"
                      description="Start with one product shape. Kollab can add more formats to your workspace later."
                    />
                    <OptionList>
                      {buildChoices.map((choice) => (
                        <OptionCard
                          key={choice.value}
                          choice={choice}
                          selected={buildChoice === choice.value}
                          onSelect={() => selectBuildChoice(choice.value)}
                        />
                      ))}
                    </OptionList>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div key="domain" {...stepMotion}>
                    <StepHeading
                      label={currentPath === "learn" ? "Taste profile" : "Workspace profile"}
                      title={
                        currentPath === "learn"
                          ? "Which lane should your recommendations start with?"
                          : "Which lane best describes your expertise?"
                      }
                      description={
                        currentPath === "learn"
                          ? "This sets up your first saved searches, creator picks, and community suggestions."
                          : "This sets up your product defaults, launch prompts, and starter content blocks."
                      }
                    />
                    <DomainGrid
                      selected={domain}
                      onSelect={selectDomain}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="account" {...stepMotion}>
                    <StepHeading
                      label="Create account"
                      title="Save your setup and enter Kollab."
                      description="Your answers become the starting point for your workspace and recommendations."
                    />
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
                    />
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
      </section>

      <ExperiencePanel
        intent={intent}
        buildChoice={buildChoice}
        learnChoice={learnChoice}
        domain={selectedDomain?.label}
        domainIcon={selectedDomain?.icon}
        complete={complete}
        variant={orbVariant}
      />
    </main>
  );
}

function Header({ step }: { step: number }) {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center border-b border-gray-200 bg-white/90 px-5 backdrop-blur-xl sm:px-10 lg:px-[72px]">
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

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            aria-label={`Step ${index + 1}`}
            className={`h-[3px] rounded-full transition-all duration-200 ${
              index <= Math.min(step, 3)
                ? "w-5 bg-[#343DE5]"
                : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </header>
  );
}

function BackControl({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="absolute left-5 top-24 z-30 inline-flex items-center gap-2 rounded-full px-1.5 py-1 text-[13px] font-medium leading-5 text-gray-400 transition-colors duration-150 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 sm:left-10 lg:left-[72px]"
    >
      <GhlIcon name="arrowLeft" size={15} />
      Back
    </button>
  );
}

function StepHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#343DE5]/70">
        {label}
      </p>
      <h1 className="max-w-[560px] font-montserrat text-[28px] font-bold leading-[34px] tracking-[-0.5px] text-gray-900 sm:text-[34px] sm:leading-[40px]">
        {title}
      </h1>
      <p className="mt-3 max-w-[520px] text-[15px] leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function OptionList({ children }: { children: ReactNode }) {
  return <div className="grid gap-3">{children}</div>;
}

function OptionCard<T extends string>({
  choice,
  selected,
  onSelect,
}: {
  choice: Choice<T>;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition-all duration-200 hover:border-gray-200 hover:bg-gray-50/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.99] ${
        selected
          ? "border-[#343DE5]/40 bg-[#f5f7ff] ring-1 ring-[#343DE5]/15"
          : "border-gray-100"
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
          selected
            ? "bg-[#343DE5] text-white"
            : "bg-gray-50 text-gray-500 group-hover:text-gray-700"
        }`}
      >
        <GhlIcon name={choice.icon} size={20} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-6 text-gray-900">
          {choice.title}
        </span>
        <span className="mt-0.5 block text-[13px] leading-5 text-gray-500">
          {choice.description}
        </span>
      </span>

      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
          selected
            ? "bg-[#343DE5] text-white"
            : "text-transparent group-hover:text-gray-300"
        }`}
      >
        <GhlIcon name="check" size={13} />
      </span>
    </button>
  );
}

function DomainGrid({
  selected,
  onSelect,
}: {
  selected: DomainValue | null;
  onSelect: (value: DomainValue) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
        {domainChoices.map((choice) => (
          <button
            key={choice.value}
            type="button"
            onClick={() => onSelect(choice.value)}
            className={`flex min-h-11 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:border-gray-200 hover:bg-gray-50/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.99] ${
              selected === choice.value
                ? "border-[#343DE5]/40 bg-[#f5f7ff] ring-1 ring-[#343DE5]/15"
                : "border-gray-100 bg-white"
            }`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                selected === choice.value
                  ? "bg-[#343DE5] text-white"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <GhlIcon name={choice.icon} size={15} />
            </span>
            <span className="truncate text-[13px] font-semibold leading-5 text-gray-800">
              {choice.label}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-5 text-[13px] leading-5 text-gray-400">
        You can add more topics from settings later.
      </p>
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
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-[14px] font-semibold leading-5 text-gray-800 shadow-xs transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.99]"
      >
        <span className="text-[16px] font-bold text-[#4285F4]">G</span>
        Continue with Google
      </button>

      <div className="flex items-center gap-4 py-3 text-[13px] font-medium leading-5 text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        or use email
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <TextField
        icon="user"
        value={name}
        onChange={onNameChange}
        placeholder="Full name"
        autoComplete="name"
      />
      <TextField
        icon="mail"
        value={email}
        onChange={onEmailChange}
        placeholder="Email address"
        autoComplete="email"
        type="email"
      />
      <div className="relative">
        <TextField
          icon="lock"
          value={password}
          onChange={onPasswordChange}
          placeholder="Password (min 8 characters)"
          autoComplete="new-password"
          type={showPassword ? "text" : "password"}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          <GhlIcon name="eye" size={18} />
        </button>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#343DE5] px-5 text-[14px] font-semibold leading-5 text-white shadow-[0_14px_30px_rgba(52,61,229,0.22)] transition-all duration-150 hover:bg-[#2831D3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
      >
        Create free account
        <GhlIcon name="arrowRight" size={17} />
      </button>
      <p className="text-center text-[12px] leading-5 text-gray-500">
        By continuing you agree to our{" "}
        <a href="#" className="font-semibold text-gray-700 underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="font-semibold text-gray-700 underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}

function TextField({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  icon: GhlIconName;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="relative block">
      <GhlIcon
        name={icon}
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-12 text-[14px] leading-5 text-gray-900 shadow-xs outline-none transition-all duration-150 placeholder:text-gray-400 focus:border-[#343DE5] focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

function CompletionStep({
  intent,
  domain,
}: {
  intent: Intent | null;
  domain?: string;
}) {
  const destination = intent === "learn" ? "feed" : "workspace";

  return (
    <motion.div key="complete" {...stepMotion}>
      <div className="mb-7 flex size-14 items-center justify-center rounded-2xl bg-[#343DE5] text-white shadow-[0_16px_36px_rgba(52,61,229,0.22)]">
        <GhlIcon name="check" size={26} />
      </div>
      <h1 className="max-w-[540px] font-montserrat text-[30px] font-bold leading-[36px] tracking-[-0.5px] text-gray-900 sm:text-[38px] sm:leading-[44px]">
        Your {destination} is ready.
      </h1>
      <p className="mt-3 max-w-[500px] text-[15px] leading-7 text-gray-500">
        Kollab is tuned for {domain ?? "your interests"} and ready to show the
        first set of courses, communities, and creators.
      </p>
      <Link
        href="/discover"
        className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#343DE5] px-5 text-[14px] font-semibold leading-5 text-white shadow-[0_14px_30px_rgba(52,61,229,0.22)] transition-all duration-150 hover:bg-[#2831D3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 active:scale-[0.97]"
      >
        Continue to Discover
        <GhlIcon name="arrowRight" size={17} />
      </Link>
    </motion.div>
  );
}

function ExperiencePanel({
  intent,
  buildChoice,
  learnChoice,
  domain,
  domainIcon,
  complete,
  variant,
}: {
  intent: Intent | null;
  buildChoice: BuildChoice | null;
  learnChoice: LearnChoice | null;
  domain?: string;
  domainIcon?: GhlIconName;
  complete: boolean;
  variant: OrbVariant;
}) {
  const isLearner = intent === "learn";
  const modeLabel = isLearner ? "Discovery feed" : "Creator workspace";
  const focusLabel = getFocusLabel(intent, buildChoice, learnChoice);
  const hasFocus = isLearner ? learnChoice !== null : buildChoice !== null;

  const accent = !intent ? "#8E93FF" : isLearner ? "#4CC5FF" : "#F472C8";
  const accentSoft = !intent ? "#62D2FF" : isLearner ? "#7C83FF" : "#9B5CFF";
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
    headline = "Composing your space.";
  } else if (!hasFocus) {
    headline = isLearner
      ? "Tuning your discovery feed."
      : "Building your creator workspace.";
  } else if (!domain) {
    headline = isLearner ? `${focusLabel} in focus.` : `${focusLabel} in motion.`;
  } else {
    headline = `${domain}, locked in.`;
  }

  return (
    <aside
      className="fixed bottom-0 right-0 top-20 z-20 hidden items-center justify-center overflow-hidden px-6 py-10 xl:flex"
      style={{ width: "calc(50vw - 360px)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #2B2F8C 0%, #1B1E63 55%, #14163F 100%)",
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
            focusIcon={focusIcon}
            activePillar={activePillar}
          />
        )}

        <OrbCaption
          accent={accent}
          eyebrow={eyebrow}
          headline={headline}
          domain={domain}
          domainIcon={domainIcon}
        />
      </div>
    </aside>
  );
}

function OrbCaption({
  accent,
  eyebrow,
  headline,
  domain,
  domainIcon,
}: {
  accent: string;
  eyebrow: string;
  headline: string;
  domain?: string;
  domainIcon?: GhlIconName;
}) {
  return (
    <div className="mt-16 flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={eyebrow}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.22, 0.85, 0.25, 1] }}
          className="text-[12px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: accent }}
        >
          {eyebrow}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.h2
          key={headline}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.36, ease: [0.22, 0.85, 0.25, 1] }}
          className="mt-3 max-w-[360px] font-montserrat text-[27px] font-bold leading-9 tracking-[-0.5px] text-white"
        >
          {headline}
        </motion.h2>
      </AnimatePresence>

      <div className="mt-6 h-9">
        <AnimatePresence>
          {domain ? (
            <motion.div
              key="topic"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.34, ease: [0.22, 0.85, 0.25, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white/90 backdrop-blur"
            >
              {domainIcon ? (
                <span style={{ color: accent }}>
                  <GhlIcon name={domainIcon} size={15} />
                </span>
              ) : null}
              {domain}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

type PillarKey = "courses" | "communities" | "creators";

const KOLLAB_PILLARS: { key: PillarKey; icon: GhlIconName; label: string }[] = [
  { key: "courses", icon: "book", label: "Courses" },
  { key: "communities", icon: "users", label: "Communities" },
  { key: "creators", icon: "badge", label: "Creators" },
];

// Default Kollab-native concept: the three pillars (courses, communities,
// creators) orbit a central morphing focus glyph. The pillar matching the
// user's choice lights up; mode drives the accent color.
function KollabConstellation({
  accent,
  focusIcon,
  activePillar,
}: {
  accent: string;
  focusIcon: GhlIconName;
  activePillar: PillarKey | null;
}) {
  const radius = 116;
  const nodeSize = 48;

  return (
    <motion.div
      className="relative flex size-[300px] items-center justify-center"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        aria-hidden
        className="absolute size-[150px] rounded-full blur-[46px]"
        animate={{
          backgroundColor: accent,
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.62, 0.4],
        }}
        transition={{
          backgroundColor: { duration: 1.1, ease: "easeOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <div
        aria-hidden
        className="absolute rounded-full border border-white/10"
        style={{ width: radius * 2, height: radius * 2 }}
      />
      <div
        aria-hidden
        className="absolute rounded-full border border-white/[0.05]"
        style={{ width: radius * 2 - 56, height: radius * 2 - 56 }}
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

      <OrbCore focusIcon={focusIcon} size={104} iconSize={30} />
    </motion.div>
  );
}

function PillarNode({
  icon,
  active,
  accent,
  size,
}: {
  icon: GhlIconName;
  active: boolean;
  accent: string;
  size: number;
}) {
  return (
    <motion.div
      className="flex items-center justify-center rounded-2xl border backdrop-blur-md"
      style={{ width: size, height: size }}
      animate={{
        backgroundColor: active ? accent : "rgba(255,255,255,0.06)",
        borderColor: active ? accent : "rgba(255,255,255,0.14)",
        color: active ? "#ffffff" : "rgba(255,255,255,0.55)",
        scale: active ? 1.12 : 1,
        boxShadow: active
          ? `0 0 24px ${accent}66`
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.5, ease: [0.22, 0.85, 0.25, 1] }}
    >
      <GhlIcon name={icon} size={20} />
    </motion.div>
  );
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
  return <Icon size={size} strokeWidth={1.85} className={className} />;
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
