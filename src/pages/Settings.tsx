// src/pages/Settings.tsx
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-800 dark:text-gray-400 mt-2">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <div className="glass rounded-2xl border p-8">
            <p className="text-gray-700 dark:text-gray-300">
              Settings page coming soon...
            </p>
          </div>
    </main>
  );
}

