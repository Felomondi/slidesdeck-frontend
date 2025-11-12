// src/components/AuthenticatedLayout.tsx
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-app flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

