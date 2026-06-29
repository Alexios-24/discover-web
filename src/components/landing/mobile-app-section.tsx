"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const STORE_LINK = "/discover?app=1";

export function MobileAppSection() {
  return (
    <section className="w-full bg-white py-12 max-md:py-8" aria-labelledby="mobile-app-heading">
      <div className="mx-auto w-full max-w-[1440px] px-[54px] max-md:px-4">
        <h2 id="mobile-app-heading" className="sr-only">
          Download the app now
        </h2>

        <div className="relative hidden aspect-[1332/454] overflow-hidden rounded-[16px] border border-[#C1C2F9] bg-white lg:block">
          <DesktopSectionArtwork />
        </div>

        <div className="relative hidden overflow-hidden rounded-[16px] border border-[#C1C2F9] bg-white max-lg:block max-lg:min-h-[560px] max-md:min-h-[610px]">
          <LavenderBand />

          <div className="absolute left-[69.5px] top-[130.5px] z-10 flex w-[614px] flex-col max-lg:left-8 max-lg:top-10 max-lg:w-[calc(100%-64px)] max-md:left-5 max-md:top-7 max-md:w-[calc(100%-40px)]">
            <div className="flex flex-col gap-3">
              <h2
                className="max-w-[490px] font-montserrat text-[40px] font-bold leading-[48.76px] text-[#101828] max-md:max-w-[310px] max-md:text-[30px] max-md:leading-[38px]"
              >
                Download the app now
              </h2>
              <p className="max-w-[614px] text-[16px] font-medium leading-6 text-[#101828] max-lg:max-w-[560px] max-md:text-[15px] max-md:leading-[22px]">
                A focused app experience for members to discover spaces, continue courses,
                and stay connected without the noise.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-6 max-md:mt-5 max-md:gap-3">
              <StoreBadge
                href={STORE_LINK}
                image="/mobile-app/mobile-app-google-play.png"
                label="Get GoKollab on Google Play"
                className="h-[60px] w-[180px] max-md:h-[48px] max-md:w-[144px]"
              />
              <StoreBadge
                href={STORE_LINK}
                image="/mobile-app/mobile-app-app-store.png"
                label="Get GoKollab on the App Store"
                className="h-[60px] w-[163px] max-md:h-[48px] max-md:w-[130px]"
              />
            </div>
          </div>

          <div className="absolute left-[715.5px] top-4 z-0 h-[511.83px] w-[458.01px] max-lg:left-1/2 max-lg:top-[194px] max-lg:-translate-x-1/2 max-md:top-[260px] max-md:h-[508px] max-md:w-[455px]">
            <PhoneClusterArtwork />
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopSectionArtwork() {
  return (
    <>
      <LavenderBand />

      <div className="absolute left-[69.5px] top-[130.5px] z-10 flex w-[614px] flex-col">
        <div className="flex flex-col gap-3">
          <h2 className="max-w-[490px] font-montserrat text-[40px] font-bold leading-[48.76px] text-[#101828]">
            Download the app now
          </h2>
          <p className="max-w-[614px] text-[16px] font-medium leading-6 text-[#101828]">
            A focused app experience for members to discover spaces, continue courses,
            and stay connected without the noise.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <StoreBadge
            href={STORE_LINK}
            image="/mobile-app/mobile-app-google-play.png"
            label="Get GoKollab on Google Play"
            className="h-[60px] w-[180px]"
          />
          <StoreBadge
            href={STORE_LINK}
            image="/mobile-app/mobile-app-app-store.png"
            label="Get GoKollab on the App Store"
            className="h-[60px] w-[163px]"
          />
        </div>
      </div>

      <div className="absolute left-[54%] top-[16.374%] z-0 h-[112.738%] w-[34.385%] origin-top-left scale-[0.88]">
        <MockupPhoneStack />
      </div>
    </>
  );
}

function PhoneClusterArtwork() {
  return <MockupPhoneStack />;
}

function MockupPhoneStack() {
  const shouldReduceMotion = useReducedMotion();
  const phoneTransition = { duration: 1.15, ease: [0.16, 1, 0.3, 1] } as const;

  return (
    <motion.div
      data-mobile-app-phone-artwork
      role="img"
      aria-label="GoKollab mobile app screens showing courses, discussions, and events."
      className="relative h-full w-full"
      initial={shouldReduceMotion ? "entered" : "initial"}
      whileInView="entered"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.img
        src="/mobile-app/mobile-app-phone-left.png"
        alt=""
        aria-hidden
        className="absolute left-[19.65%] top-[10.59%] z-10 h-[76.8%] w-auto max-w-none select-none will-change-transform"
        draggable={false}
        loading="lazy"
        decoding="async"
        variants={{
          initial: { x: "0%" },
          entered: { x: "-30%" },
        }}
        transition={phoneTransition}
      />
      <motion.img
        src="/mobile-app/mobile-app-phone-center.png"
        alt=""
        aria-hidden
        className="absolute left-[40.87%] top-[10.57%] z-10 h-[76.8%] w-auto max-w-none select-none will-change-transform"
        draggable={false}
        loading="lazy"
        decoding="async"
        variants={{
          initial: { x: "0%" },
          entered: { x: "40%" },
        }}
        transition={phoneTransition}
      />
      <motion.img
        src="/mobile-app/mobile-app-phone-right.png"
        alt=""
        aria-hidden
        className="absolute left-[24.72%] top-0 z-20 h-full w-auto max-w-none select-none"
        draggable={false}
        loading="lazy"
        decoding="async"
        variants={{
          initial: { y: 0 },
          entered: { y: 0 },
        }}
        transition={phoneTransition}
      />
    </motion.div>
  );
}

function StoreBadge({
  href,
  image,
  label,
  className,
}: {
  href: string;
  image: string;
  label: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group block rounded-[14px] outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#343DE5] focus-visible:ring-offset-2 active:translate-y-0"
    >
      <img
        src={image}
        alt=""
        className={`${className} select-none object-contain`}
        draggable={false}
        loading="lazy"
        decoding="async"
      />
    </Link>
  );
}

function LavenderBand() {
  return (
    <img
      aria-hidden
      data-mobile-app-bg-band
      src="/mobile-app/mobile-app-bg-band.png"
      alt=""
      className="pointer-events-none absolute left-[-52.049%] top-[-11.621%] h-[194.163%] w-[180.218%] max-w-none select-none object-fill"
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  );
}
