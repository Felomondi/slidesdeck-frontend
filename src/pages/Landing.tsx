import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  FileText,
  Zap,
  Save,
  ArrowRight,
  Wand2,
  LayoutTemplate,
  Star,
  ChevronDown,
} from "lucide-react";
import { TopBar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import { useState } from "react";

// Small helper for staggered animations
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function Landing() {
  const navigate = useNavigate();
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      {/* Decorative background */}
      <BackgroundAuras />

      <TopBar />

      {/* Hero */}
      <main className="relative mx-auto max-w-7xl px-4 pt-12 sm:pt-20 pb-24">
        <motion.section
          {...fadeUp(0)}
          className="text-center mb-14 sm:mb-20"
          aria-label="Hero"
        >
          <motion.div
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border mb-6"
          >
            <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-medium">AI‑Powered Presentation Generator</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.15)}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
          >
            Create Stunning Presentations {""}
            <span className="block bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              in Seconds
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Transform your ideas into professional slide decks with AI. Describe your topic and
            SlidesDeck drafts a complete, editable outline with visuals and speaker notes.
          </motion.p>

          {/* Primary CTAs + inline prompt */}
          <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-col items-center gap-4">
            <div className="w-full max-w-2xl glass border rounded-2xl p-2 sm:p-3 flex items-center gap-2">
              <input
                aria-label="Describe your topic"
                placeholder='e.g., "Fundamentals of Neural Networks" for first‑year CS students'
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-base sm:text-lg px-2"
              />
              <button
                onClick={() => navigate("/signin")}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Generate
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate("/signin")}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-lg transition-all"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-medium glass border hover:opacity-90 transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Trust bar */}
            <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span>Trusted by students & educators at</span>
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-4 opacity-70">
                {[
                  "Vassar",
                  "NYU",
                  "Columbia",
                  "Berkeley",
                  "MIT",
                  "Waterloo",
                ].map((name) => (
                  <div
                    key={name}
                    className="h-6 sm:h-7 rounded-md bg-gradient-to-b from-white/30 to-white/5 dark:from-white/5 dark:to-white/0 glass border flex items-center justify-center text-[10px] sm:text-xs"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Preview mock */}
        <motion.section {...fadeUp(0.35)} className="mb-16 sm:mb-24" aria-label="Live preview">
          <div className="relative rounded-2xl border glass p-2 sm:p-3 shadow-sm">
            <div className="rounded-xl bg-gradient-to-b from-white/60 to-white/10 dark:from-white/5 dark:to-white/0 p-4 sm:p-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="ml-2">SlidesDeck – Outline Preview</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Left: outline */}
                <div className="md:col-span-2 rounded-xl border glass p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Wand2 className="h-5 w-5" />
                    <span className="font-semibold">Auto‑generated outline</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><span className="mt-[6px] h-2 w-2 rounded-full bg-sky-500"/> Intro & Objectives</li>
                    <li className="flex items-start gap-2"><span className="mt-[6px] h-2 w-2 rounded-full bg-sky-500"/> Core Concepts (bulleted)</li>
                    <li className="flex items-start gap-2"><span className="mt-[6px] h-2 w-2 rounded-full bg-sky-500"/> Visual Suggestions</li>
                    <li className="flex items-start gap-2"><span className="mt-[6px] h-2 w-2 rounded-full bg-sky-500"/> Speaker Notes</li>
                    <li className="flex items-start gap-2"><span className="mt-[6px] h-2 w-2 rounded-full bg-sky-500"/> Summary & Next Steps</li>
                  </ul>
                </div>
                {/* Right: slide mock */}
                <div className="rounded-xl border glass p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <LayoutTemplate className="h-5 w-5" />
                    <span className="font-semibold">Slide preview</span>
                  </div>
                  <div className="aspect-video rounded-lg border bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-white/5 dark:to-white/0 grid place-items-center text-center p-6">
                    <div>
                      <p className="text-xs text-gray-500">Title</p>
                      <p className="text-lg font-semibold">Fundamentals of Neural Networks</p>
                      <div className="mt-3 text-left text-sm opacity-80 space-y-1">
                        <p>• Neuron & activation</p>
                        <p>• Layers & architectures</p>
                        <p>• Training & loss</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Feature grid – upgraded visuals */}
        <motion.section {...fadeUp(0.4)} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-white" />}
            title="AI‑Powered Generation"
            desc="Describe your topic and let AI create a full outline with bullet points and speaker notes."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-white" />}
            title="Lightning Fast"
            desc="Go from idea to deck in seconds — skip the tedious slide boilerplate."
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6 text-white" />}
            title="Fully Editable"
            desc="Tweak every line. Export, duplicate, or continue editing anytime."
          />
        </motion.section>

        {/* How it works – with connective rail */}
        <motion.section {...fadeUp(0.45)} className="glass rounded-2xl border p-8 sm:p-12 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">How It Works</h2>
          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((n, idx) => (
              <li key={n} className="text-center">
                <div className="relative inline-flex">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white text-2xl font-bold">
                    {n}
                  </div>
                  {idx < 2 && (
                    <span className="hidden md:block absolute left-[110%] top-1/2 -translate-y-1/2 w-24 h-[2px] bg-gradient-to-r from-sky-400 to-indigo-500" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  {n === 1 && "Describe Your Topic"}
                  {n === 2 && "AI Generates Outline"}
                  {n === 3 && "Edit & Save"}
                </h3>
                <p className="text-sm opacity-70 max-w-xs mx-auto">
                  {n === 1 && "Tell us audience, tone, and goals."}
                  {n === 2 && "Get slides, bullets, notes, and visual ideas."}
                  {n === 3 && "Polish your content, then export or present."}
                </p>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* Social proof */}
        <motion.section {...fadeUp(0.5)} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="I built a 12‑slide lecture in under 3 minutes. The outline quality shocked me."
              author="Associate Prof., CS"
            />
            <TestimonialCard
              quote="My pitch deck finally looks polished without living in PowerPoint all night."
              author="Startup Founder"
            />
            <TestimonialCard
              quote="Great defaults, but I love that everything is editable. Huge time‑saver!"
              author="MBA Student"
            />
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section {...fadeUp(0.55)} className="mb-20" aria-label="Frequently Asked Questions">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">FAQ</h2>
          <div className="max-w-3xl mx-auto divide-y divide-white/10 rounded-2xl border glass">
            {faqItems.map((item, i) => (
              <button
                key={i}
                onClick={() => setFaqOpen((p) => (p === i ? null : i))}
                className="w-full text-left px-5 sm:px-6 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                aria-expanded={faqOpen === i}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-semibold">{item.q}</p>
                    <p className={`mt-2 text-sm opacity-80 transition-all ${faqOpen === i ? "max-h-60" : "max-h-0 overflow-hidden"}`}>
                      {item.a}
                    </p>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 mt-1 transition-transform ${faqOpen === i ? "rotate-180" : "rotate-0"}`} />
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUp(0.6)} className="text-center glass rounded-2xl border p-8 sm:p-12">
          <Save className="h-12 w-12 mx-auto mb-4 text-sky-600 dark:text-sky-400" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-lg opacity-80 mb-6 max-w-xl mx-auto">
            Join students and professionals creating better presentations faster with SlidesDeck.
          </p>
          <button
            onClick={() => navigate("/signin")}
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-lg transition-all"
          >
            Create Your First Presentation
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="glass rounded-2xl border p-6 shadow-sm">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-70">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="glass rounded-2xl border p-6">
      <div className="flex items-center gap-1 mb-3 text-amber-500" aria-hidden>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="text-sm opacity-90">“{quote}”</p>
      <p className="mt-3 text-xs opacity-60">— {author}</p>
    </div>
  );
}


function BackgroundAuras() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* radial auras */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute top-40 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "#6b7280",
        }}
      />
      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/30" />
    </div>
  );
}

const faqItems = [
  {
    q: "Can I edit everything the AI generates?",
    a: "Yes. Headings, bullets, speaker notes, and visuals are fully editable. You stay in control.",
  },
  {
    q: "Do you store my content?",
    a: "Projects are saved to your account for your convenience, but we never train on your private data.",
  },
  {
    q: "Can I export to PowerPoint or Google Slides?",
    a: "You can export to PPTX and PDF today; Google Slides export is coming soon.",
  },
];
