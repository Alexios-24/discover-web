import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
] as const;

// Figma node 3994:79277 ("Discover Footer"): 1440 x 89, white surface,
// gray-300 top border, 54px horizontal padding, Kollab logo left, legal links right.
export function DiscoverFooter() {
  return (
    <footer className="w-full border-t border-[#d0d5dd] bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-[54px] py-6 max-md:flex-col max-md:items-start max-md:px-4">
        <Link href="/" aria-label="Kollab home" className="inline-flex h-[41px] items-center">
          <Image
            src="/kollab-logo-light.png"
            alt="Kollab"
            width={320}
            height={128}
            className="h-[41px] w-auto select-none"
            draggable={false}
          />
        </Link>

        <nav aria-label="Footer links" className="flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-1 py-2 text-[14px] font-normal leading-5 text-[#101828] transition-colors hover:text-indigo-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
