import { PageLoader } from "@/components/features/LoadingAnimation/PageLoader";

export default function Loading() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      <PageLoader message="最高の旅を計画しています…" />
    </div>
  );
}
