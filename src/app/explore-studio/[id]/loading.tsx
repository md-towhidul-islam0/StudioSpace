import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
        <Loader2 className="absolute h-6 w-6 text-orange-500 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground animate-pulse">
        Loading category studios...
      </p>
    </div>
  );
}
