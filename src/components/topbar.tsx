import { motion } from "framer-motion";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/70 bg-white dark:bg-neutral-900 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2"
        >
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm" />
          <span className="font-semibold tracking-tight">SlidesDeck</span>
        </motion.div>
        <div className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
          AI-powered slide outlines
        </div>
      </div>
    </header>
  );
}