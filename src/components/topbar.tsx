import { Github } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass rounded-2xl mt-3 mb-2 h-14 border transition-all duration-300 flex items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm" />
            <span className="text-sm sm:text-base">SlidesDeck</span>
          </div>
          <a
            href="https://github.com/felomondi/slidesdeck-frontend"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm opacity-80 hover:opacity-100 transition"
          >
            <Github className="h-4 w-4" />
            Source
          </a>
        </div>
      </div>
    </header>
  );
}