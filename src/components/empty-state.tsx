import { FilePlus2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-gray-400">
      <FilePlus2 className="h-10 w-10 mb-3" />
      <h3 className="font-semibold text-lg">No slides yet</h3>
      <p className="max-w-sm text-sm">
        Describe your presentation and generate an outline to get started.
      </p>
    </div>
  );
}