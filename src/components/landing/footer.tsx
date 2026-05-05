"use client";

export function LandingFooter() {
  return (
    <footer className="bg-ink text-ink-dim border-t border-white/10 px-10 py-12 grain">
      {/* Massive logotype */}
      <div className="overflow-hidden mb-12">
        <h3
          className="font-montserrat font-extrabold tracking-[-0.06em] leading-[0.8] text-cream"
          style={{ fontSize: "clamp(120px, 22vw, 360px)" }}
        >
          GoKollab<span className="text-lime">.</span>
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12 max-w-[1400px] mx-auto">
        <div>
          <h4 className="font-sans text-[11px] uppercase tracking-[0.18em] text-cream mb-4">Platform</h4>
          <ul className="space-y-2.5 text-[14px]">
            <li><a href="/discover" className="hover:text-cream transition-colors">Communities</a></li>
            <li><a href="/discover" className="hover:text-cream transition-colors">Courses</a></li>
            <li><a href="/discover" className="hover:text-cream transition-colors">Live events</a></li>
            <li><a href="/discover" className="hover:text-cream transition-colors">Mobile</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[11px] uppercase tracking-[0.18em] text-cream mb-4">Creators</h4>
          <ul className="space-y-2.5 text-[14px]">
            <li><a href="/discover" className="hover:text-cream transition-colors">Get started</a></li>
            <li><a href="/discover" className="hover:text-cream transition-colors">Showcase</a></li>
            <li><a href="/discover" className="hover:text-cream transition-colors">Templates</a></li>
            <li><a href="/discover" className="hover:text-cream transition-colors">Affiliate</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[11px] uppercase tracking-[0.18em] text-cream mb-4">Resources</h4>
          <ul className="space-y-2.5 text-[14px]">
            <li><a href="#" className="hover:text-cream transition-colors">Docs</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Changelog</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Help center</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[11px] uppercase tracking-[0.18em] text-cream mb-4">Company</h4>
          <ul className="space-y-2.5 text-[14px]">
            <li><a href="#" className="hover:text-cream transition-colors">About</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Press</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-white/10 max-w-[1400px] mx-auto font-sans text-[13px] text-ink-faint">
        <div>© 2026 GoKollab — Built for creators, by HighLevel.</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse-dot inline-block" />
          v4.7.0 · status: all systems go ✦
        </div>
      </div>
    </footer>
  );
}
