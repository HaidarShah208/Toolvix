import { LoadingState } from "@/components/ui/states";

export default function Loading() {
  return (
    <div className="container-page pt-8">
      <div className="h-4 w-48 animate-pulse rounded bg-surface-muted" aria-hidden="true" />
      <div className="mt-6 h-10 w-2/3 max-w-md animate-pulse rounded-lg bg-surface-muted" aria-hidden="true" />
      <LoadingState className="mt-8" label="Loading page…" />
    </div>
  );
}
