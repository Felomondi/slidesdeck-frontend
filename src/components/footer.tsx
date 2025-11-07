import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-semibold tracking-tight mb-4"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm" />
              <span className="text-lg">SlidesDeck</span>
            </Link>
            <p className="text-sm opacity-70 max-w-md">
              Create stunning presentations in seconds with AI. Transform your ideas into
              professional slide decks effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/signin"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/app"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  Create Presentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-60">
              © {currentYear} SlidesDeck. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm opacity-60">
              <Sparkles className="h-4 w-4" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

