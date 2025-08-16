import { motion } from "framer-motion";

export function SlideSkeleton() {
  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 p-4 shadow-sm"
    >
      <div className="h-5 w-2/3 rounded-md bg-neutral-200 dark:bg-neutral-700 shimmer" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-11/12 rounded-md bg-neutral-200 dark:bg-neutral-800 shimmer" />
        <div className="h-3 w-10/12 rounded-md bg-neutral-200 dark:bg-neutral-800 shimmer" />
        <div className="h-3 w-8/12 rounded-md bg-neutral-200 dark:bg-neutral-800 shimmer" />
      </div>
    </motion.div>
  );
}