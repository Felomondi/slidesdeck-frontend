// src/components/sidebar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Sparkles,
  BookOpen,
  FileText as FileTextIcon,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type NavItem = {
  label: string;
  icon: typeof FileText;
  path: string;
  action?: () => void;
};

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // ensure dark mode is always applied
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.add("dark");
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const navItems: NavItem[] = [
    { label: "Home", icon: Home, path: "/app" },
    { label: "My Presentations", icon: FileText, path: "/profile" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 240 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen bg-app border-r border-gray-200/50 dark:border-gray-700/50 z-50 flex flex-col"
      >
        {/* Logo/Brand */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-gray-200/50 dark:border-gray-700/50">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  SlidesDeck
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-7 w-7 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm mx-auto"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {/* New Presentation Button */}
          <Link
            to="/app"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
              ${
                isActive("/app")
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
                  : "text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/5"
              }`}
          >
            <Sparkles
              className={`h-5 w-5 shrink-0 ${
                isActive("/app")
                  ? "text-white"
                  : "text-gray-900 dark:text-white"
              }`}
            />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`whitespace-nowrap overflow-hidden ${
                    isActive("/app")
                      ? "text-white"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  New Presentation
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <div className="my-2 border-t border-gray-200/50 dark:border-gray-700/50" />

          {/* Regular Nav Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-white/50 dark:bg-white/5 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                style={{ textDecoration: 'none' }}
              >
                <Icon
                  className="h-5 w-5 shrink-0 text-gray-900 dark:text-white"
                />
                <AnimatePresence mode="wait">
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden text-gray-900 dark:text-white"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          <div className="my-2 border-t border-gray-200/50 dark:border-gray-700/50" />

          {/* Resources Section */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Resources</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <a
              href="/documentation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/5"
              style={{ textDecoration: 'none' }}
            >
              <FileTextIcon className="h-5 w-5 shrink-0 text-gray-900 dark:text-white" />
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden text-gray-900 dark:text-white"
                  >
                    Documentation
                  </motion.span>
                )}
              </AnimatePresence>
            </a>

            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/5"
              style={{ textDecoration: 'none' }}
            >
              <Shield className="h-5 w-5 shrink-0 text-gray-900 dark:text-white" />
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden text-gray-900 dark:text-white"
                  >
                    Privacy Policy
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-2 space-y-1">
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0 text-gray-900 dark:text-white" />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden text-gray-900 dark:text-white"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Collapse/Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-white" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Spacer to prevent content from going under sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? 240 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="shrink-0"
      />
    </>
  );
}