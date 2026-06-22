import { PageLoader } from "@/components/features/LoadingAnimation/PageLoader";

export default function Loading() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      {/* ページ遷移時は飛行機の航路だけ（サイト名スプラッシュは初回ロードの
          InitialPreloader が担当する） */}
      <PageLoader showText={false} />
    </div>
  );
}
