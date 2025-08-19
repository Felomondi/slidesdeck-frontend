import { motion } from "framer-motion";

export function SlideSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border p-4 sm:p-5"
    >
      <div className="h-5 w-2/3 rounded bg-white/20 animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-5/6 rounded bg-white/15 animate-pulse" />
        <div className="h-3 w-3/4 rounded bg-white/15 animate-pulse" />
        <div className="h-3 w-4/6 rounded bg-white/15 animate-pulse" />
      </div>
      <div className="mt-4 h-24 rounded-lg bg-white/10 animate-pulse" />
    </motion.div>
  );
}