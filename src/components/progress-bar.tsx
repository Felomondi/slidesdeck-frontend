import { motion } from "framer-motion";

export function ProgressBar() {
  return (
    <div className="mt-4 mb-4">
      <div className="relative h-1.5 rounded-full bg-white/55 border border-white/70 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-sky-500/80 via-indigo-500/80 to-fuchsia-500/80"
          initial={{ x: "-100%" }}
          animate={{ x: ["-100%", "120%"] }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          style={{ backdropFilter: "blur(6px) saturate(1.1)" }}
        />
      </div>
    </div>
  );
}