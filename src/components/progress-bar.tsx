import { motion } from "framer-motion";

export function ProgressBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute left-0 right-0 -top-2 h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
    >
      <motion.div
        className="h-full w-1/3 bg-gradient-to-r from-sky-500 to-indigo-500"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}