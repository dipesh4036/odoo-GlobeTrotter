"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, DollarSign, Share2, Users, ArrowRight, Globe, BarChart3, Map, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.23, 1, 0.32, 1] as const;
const display = "font-[family-name:var(--font-display)]";
const sans = "font-[family-name:var(--font-geist-sans)]";
const mono = "font-[family-name:var(--font-geist-mono)]";

/* ─── Nav ─── */
function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200/60">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.jpg" alt="GlobeTrotter" width={28} height={28} className="rounded-lg" />
          <span className={`font-semibold text-zinc-900 text-[15px] tracking-tight ${sans}`}>GlobeTrotter</span>
        </Link>

        <nav className={`hidden md:flex items-center gap-8 text-[14px] text-zinc-500 font-medium ${sans}`}>
          <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
          <a href="#showcase" className="hover:text-zinc-900 transition-colors">Showcase</a>
          <a href="#testimonials" className="hover:text-zinc-900 transition-colors">Testimonials</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className={`h-9 px-4 text-[14px] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full font-medium ${sans}`}>
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className={`h-9 px-5 text-[14px] bg-zinc-900 text-white hover:bg-zinc-800 rounded-full font-semibold active:scale-[0.97] ${sans}`}>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero (Variant-style: centered serif headline + big image below) ─── */
function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white pt-32 pb-0 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">

        <motion.h1
          className={`text-[clamp(2.75rem,6.5vw,5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-zinc-900 mb-6 ${display}`}
          initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.8, delay: 0.08, ease }}
        >
          Plan trips for the
          <br />
          <span className="text-indigo-400 font-normal italic">Adventurous</span> Soul.
        </motion.h1>

        <motion.p
          className={`text-[16px] text-zinc-500 max-w-[50ch] mx-auto mb-10 leading-relaxed ${sans}`}
          initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.8, delay: 0.16, ease }}
        >
          Trip planners redesigned for the modern traveler.
          <br />
          Organizing without the overhead, sharing without the complexity.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 mb-16"
          initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.8, delay: 0.24, ease }}
        >
          <Link href="/register">
            <Button className={`h-12 px-8 rounded-full bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-[0.97] ${sans}`}>
              Start Planning Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className={`h-12 px-8 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium text-sm active:scale-[0.97] ${sans}`}>
              Sign In
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Big hero image */}
      <motion.div
        className="max-w-[1200px] mx-auto px-6 md:px-10"
        initial={reduce ? false : { opacity: 0, transform: "translateY(30px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: 1, delay: 0.35, ease }}
      >
        <div className="rounded-t-3xl overflow-hidden border border-b-0 border-zinc-200 shadow-2xl shadow-zinc-300/30">
          <Image
            src="/hero-banner.jpg"
            alt="GlobeTrotter travel planning"
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Bento Features ─── */
function FeaturesSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-zinc-50 py-28 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="mb-14"
          initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <h2 className={`text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em] text-zinc-900 mb-4 ${display}`}>
            Everything you need.
          </h2>
          <p className={`text-zinc-500 text-[16px] leading-relaxed max-w-[55ch] ${sans}`}>
            We have built everything you need to plan any trip. From quick weekends to month-long adventures.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
          {/* 1. Day-by-Day Planning (large, 2-col with mini itinerary preview) */}
          <motion.div
            className="md:col-span-2 bg-white border border-zinc-200 rounded-2xl p-8 overflow-hidden hover:shadow-lg transition-shadow relative"
            initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className={`text-lg font-bold text-zinc-900 mb-1 ${display}`}>Day-by-Day Planning</h3>
                <p className={`text-zinc-500 text-[14px] leading-relaxed ${sans}`}>Build your itinerary with a drag-and-drop builder. Group activities by day and reorganize on the fly.</p>
              </div>
            </div>

            {/* Mini itinerary preview */}
            <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-4 space-y-2">
              {["Eiffel Tower Visit", "Seine River Cruise", "Louvre Museum"].map((name, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 ${mono}`}>{i + 1}</div>
                    <span className={`text-sm font-medium text-zinc-700 ${sans}`}>{name}</span>
                  </div>
                  <span className={`text-xs text-zinc-400 ${mono}`}>Day {i + 1}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 2. Budget Tracking (tall, with mini bar chart) */}
          <motion.div
            className="bg-white border border-zinc-200 rounded-2xl p-8 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.07, ease }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className={`text-lg font-bold text-zinc-900 mb-1 ${display}`}>Budget Tracking</h3>
            <p className={`text-zinc-500 text-[14px] leading-relaxed mb-6 ${sans}`}>Real-time cost breakdowns with charts.</p>

            {/* Mini bar chart */}
            <div className="flex-1 flex items-end gap-2 pt-4">
              {[65, 45, 80, 35, 55, 70, 40].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-emerald-200 hover:bg-emerald-300 transition-colors"
                    style={{ height: `${h}px` }}
                  />
                  <span className={`text-[9px] text-zinc-400 ${mono}`}>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3. Public Sharing (1-col) */}
          <motion.div
            className="bg-white border border-zinc-200 rounded-2xl p-8 overflow-hidden hover:shadow-lg transition-shadow"
            initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.14, ease }}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
              <Share2 className="w-5 h-5 text-sky-600" />
            </div>
            <h3 className={`text-lg font-bold text-zinc-900 mb-1 ${display}`}>Public Sharing</h3>
            <p className={`text-zinc-500 text-[14px] leading-relaxed mb-5 ${sans}`}>Publish and share with one click.</p>

            {/* Share buttons mini preview */}
            <div className="flex gap-2">
              <div className="flex-1 bg-green-50 border border-green-100 rounded-lg py-2 text-center">
                <span className={`text-[11px] font-semibold text-green-700 ${sans}`}>WhatsApp</span>
              </div>
              <div className="flex-1 bg-sky-50 border border-sky-100 rounded-lg py-2 text-center">
                <span className={`text-[11px] font-semibold text-sky-700 ${sans}`}>Twitter</span>
              </div>
              <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg py-2 text-center">
                <span className={`text-[11px] font-semibold text-zinc-600 ${sans}`}>Copy Link</span>
              </div>
            </div>
          </motion.div>

          {/* 4. Community Feed (2-col, with avatar row) */}
          <motion.div
            className="md:col-span-2 bg-white border border-zinc-200 rounded-2xl p-8 overflow-hidden hover:shadow-lg transition-shadow"
            initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.21, ease }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className={`text-lg font-bold text-zinc-900 mb-1 ${display}`}>Community Feed</h3>
                <p className={`text-zinc-500 text-[14px] leading-relaxed ${sans}`}>Discover itineraries from travelers worldwide. Post your own trips and inspire others.</p>
              </div>
            </div>

            {/* Mini community cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Priya M.", trip: "Southeast Asia", days: 14, color: "bg-indigo-100 text-indigo-700" },
                { name: "Tomas R.", trip: "European Tour", days: 10, color: "bg-emerald-100 text-emerald-700" },
                { name: "Akiko T.", trip: "Japan Winter", days: 7, color: "bg-amber-100 text-amber-700" },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-50 rounded-xl border border-zinc-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full ${item.color} flex items-center justify-center text-[9px] font-bold`}>
                      {item.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className={`text-xs font-medium text-zinc-700 ${sans}`}>{item.name}</span>
                  </div>
                  <p className={`text-[13px] font-semibold text-zinc-800 mb-1 ${sans}`}>{item.trip}</p>
                  <span className={`text-[11px] text-zinc-400 ${mono}`}>{item.days} days</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Showcase (light theme) ─── */
function ShowcaseSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white py-28 px-6 md:px-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <h2 className={`text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em] text-zinc-900 mb-4 ${display}`}>
            Connect destinations worldwide.
          </h2>
          <p className={`text-zinc-500 text-[16px] leading-relaxed max-w-[50ch] mx-auto ${sans}`}>
            Plan multi-city journeys across continents. Visualize your route and keep every stop organized.
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-200/40"
          initial={reduce ? false : { opacity: 0, transform: "scale(0.97)" }}
          whileInView={{ opacity: 1, transform: "scale(1)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
        >
          <Image src="/hero-globe.jpg" alt="GlobeTrotter worldwide routes" width={1200} height={675} className="w-full h-auto" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function TestimonialsSection() {
  const reduce = useReducedMotion();
  const testimonials = [
    { name: "Priya Mehta", role: "Solo Traveler", quote: "I planned my entire Southeast Asia trip in one sitting. The day-by-day builder made it so simple.", initials: "PM", color: "bg-indigo-100 text-indigo-700" },
    { name: "Tomas Reyes", role: "Travel Blogger", quote: "The public sharing feature is brilliant. I share itineraries with followers and they copy them instantly.", initials: "TR", color: "bg-emerald-100 text-emerald-700" },
    { name: "Akiko Tanaka", role: "Family Planner", quote: "Budget tracking across multiple stops saved us from overspending. The charts make it crystal clear.", initials: "AT", color: "bg-amber-100 text-amber-700" },
    { name: "Marcus Eriksson", role: "Group Organizer", quote: "Finally, a trip planner that does not look like a todo app. My friends actually enjoy using it.", initials: "ME", color: "bg-rose-100 text-rose-700" },
  ];

  return (
    <section className="bg-zinc-50 py-28 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          className={`text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em] text-zinc-900 mb-14 text-center ${display}`}
          initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          Trusted by travelers worldwide
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white border border-zinc-100 rounded-2xl p-6 hover:shadow-md hover:border-zinc-200 transition-all"
              initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease }}
            >
              <p className={`text-zinc-600 text-[14px] leading-relaxed mb-6 ${sans}`}>&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold ${sans}`}>{t.initials}</div>
                <div>
                  <p className={`text-sm font-semibold text-zinc-800 ${sans}`}>{t.name}</p>
                  <p className={`text-xs text-zinc-400 ${sans}`}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function CTASection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white py-28 px-6 md:px-10 border-t border-zinc-100">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
      >
        <h2 className={`text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em] text-zinc-900 mb-5 ${display}`}>
          Your next trip starts here.
        </h2>
        <p className={`text-zinc-500 text-[16px] mb-10 max-w-[48ch] mx-auto leading-relaxed ${sans}`}>
          Create a free account and start building your itinerary in minutes. No credit card required.
        </p>
        <Link href="/register">
          <Button className={`h-12 px-10 rounded-full bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-[0.97] ${sans}`}>
            Start Planning Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

/* ─── Footer (Banana-style: columns + giant brand text) ─── */
function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100 pt-16 pb-12 px-6 md:px-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.jpg" alt="GlobeTrotter" width={28} height={28} className="rounded-lg" />
              <span className={`font-bold text-zinc-900 text-[15px] ${display}`}>GlobeTrotter</span>
            </div>
            <p className={`text-sm text-zinc-400 leading-relaxed max-w-[220px] ${sans}`}>
              The modern trip planner for travelers. Built by travelers, for travelers.
            </p>
          </div>
          <div>
            <h4 className={`text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-4 ${sans}`}>Product</h4>
            <ul className={`space-y-3 text-sm text-zinc-400 ${sans}`}>
              <li><Link href="/dashboard" className="hover:text-zinc-700 transition-colors">Dashboard</Link></li>
              <li><Link href="/trips/new" className="hover:text-zinc-700 transition-colors">Trip Builder</Link></li>
              <li><Link href="/community" className="hover:text-zinc-700 transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-4 ${sans}`}>Company</h4>
            <ul className={`space-y-3 text-sm text-zinc-400 ${sans}`}>
              <li><a href="https://github.com/dipesh4036/odoo-GlobeTrotter" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 transition-colors">GitHub</a></li>
              <li><span className="text-zinc-300">About</span></li>
              <li><span className="text-zinc-300">Blog</span></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-4 ${sans}`}>Resources</h4>
            <ul className={`space-y-3 text-sm text-zinc-400 ${sans}`}>
              <li><Link href="/register" className="hover:text-zinc-700 transition-colors">Get Started</Link></li>
              <li><Link href="/login" className="hover:text-zinc-700 transition-colors">Sign In</Link></li>
              <li><span className="text-zinc-300">Help Center</span></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-4 ${sans}`}>Legal</h4>
            <ul className={`space-y-3 text-sm text-zinc-400 ${sans}`}>
              <li><span className="text-zinc-300">Privacy</span></li>
              <li><span className="text-zinc-300">Terms</span></li>
              <li><span className="text-zinc-300">Security</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 mb-10" />

        <div className="overflow-hidden text-center">
          <p className={`text-[clamp(3rem,9vw,8rem)] font-black tracking-[-0.04em] text-zinc-100 leading-none select-none whitespace-nowrap ${display}`}>
            GLOBETROTTER
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <div className="bg-white">
      <Nav />
      <HeroSection />
      <div id="features"><FeaturesSection /></div>
      <div id="showcase"><ShowcaseSection /></div>
      <div id="testimonials"><TestimonialsSection /></div>
      <CTASection />
      <Footer />
    </div>
  );
}
