import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Compass,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Discover Spaces",
    desc: "Browse hundreds of verified studios filtered by category, equipment, lighting, and exact neighborhood.",
    icon: Compass,
    accent: "from-orange-500/20 to-orange-500/5",
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    desc: "Pick flexible hourly or daily blocks. Customize booking hours, crew capacity, and requested gear add-ons.",
    icon: CalendarClock,
    accent: "from-amber-500/20 to-amber-500/5",
  },
  {
    step: "03",
    title: "Book Instantly",
    desc: "Transparent upfront pricing with zero surprise fees. Lock in your session with immediate confirmation.",
    icon: Zap,
    accent: "from-orange-600/20 to-orange-600/5",
  },
  {
    step: "04",
    title: "Create & Produce",
    desc: "Arrive on set, connect with your verified host, leverage pro-grade amenities, and bring your vision to life.",
    icon: Video,
    accent: "from-rose-500/20 to-rose-500/5",
  },
];

const guarantees = [
  {
    title: "Liability Protection",
    desc: "Up to $1,000,000 in property damage protection and liability coverage backing every approved reservation.",
    badge: "$1M Coverage",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    desc: "Multi-factor ID verification and authentic community reviews ensure trustworthy hosts and certified creators.",
    badge: "100% Verified",
    icon: BadgeCheck,
  },
  {
    title: "Equipment Safety",
    desc: "Detailed pre-shoot gear checklists, deposit escrow protections, and transparent damage mediation.",
    badge: "Gear Shield",
    icon: PackageCheck,
  },
  {
    title: "24/7 Host & Creator Support",
    desc: "Direct access to real studio operations specialists ready to resolve emergencies, day or night.",
    badge: "24/7 Priority",
    icon: Headphones,
  },
];

const ExtraHomeSection = () => {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* SECTION 1: HOW BOOKING WORKS */}
      <section className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto pt-6" id="how-it-works">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
    
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            How Booking Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            From discovering unique spaces to the final wrap, our streamlined
            workflow gets your creative production rolling in minutes.
          </p>
        </div>

        {/* 4-Step Workflow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/10"
              >
                {/* Step Top Ambient Glow */}
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/10 blur-xl transition-all duration-500 group-hover:bg-orange-500/20 group-hover:scale-125"
                  aria-hidden="true"
                />

                <div>
                  {/* Top Bar: Icon & Step Number */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-orange-500/30">
                      <Icon className="h-6 w-6 transition-transform duration-300" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-muted-foreground/30 group-hover:text-orange-500/60 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Progress bar / bottom highlight */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span className="text-[11px] uppercase tracking-wider text-orange-500 font-bold">
                    Step {idx + 1}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="hidden lg:inline text-muted-foreground/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">
                      Next →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: HOST GUARANTEE & CREATOR SUPPORT */}
      <section className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto pb-8" id="about-us">
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-orange-500/5 p-6 sm:p-10 md:p-12 shadow-sm">
          {/* Subtle Decorative Ambient Glows */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl"
            aria-hidden="true"
          />

          {/* Section Header */}
          <div className="max-w-2xl mb-10 md:mb-12 relative z-10">
         
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Host Guarantee & Creator Support
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Every booking on StudioSpace is fortified with platform assurances
              covering liability, profile verification, gear safety, and 24/7
              concierge support.
            </p>
          </div>

          {/* 4 Guarantees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {guarantees.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <div>
                    {/* Top row: Icon + Pill Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-105">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                        {item.badge}
                      </span>
                    </div>

                    {/* Guarantee Title */}
                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>

                    {/* Guarantee Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Verification Checkmark */}
                  <div className="mt-5 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs font-medium text-orange-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified Guarantee</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Callout Bar */}
          <div className="mt-10 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" />
              <span>
                100% Secure Transactions & Zero-Risk Rescheduling Protection
              </span>
            </div>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group/link"
            >
              <span>List your space with full coverage</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExtraHomeSection;
