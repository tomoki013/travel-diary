import { CalendarCheck, RefreshCw } from "lucide-react";

interface LegalPageLayoutProps {
  title: string;
  /** リード文(任意)。ページ冒頭の概要に使う。 */
  description?: string;
  /** 制定日(例: 2024年9月15日) */
  enactedDate: string;
  /** 最終更新日(例: 2025年12月22日) */
  updatedDate: string;
  children: React.ReactNode;
}

/**
 * 法務・ポリシー系ページ共通のレイアウト。
 * タイトル・リード文・制定日/最終更新日のヘッダーを揃え、
 * 本文は読みやすい prose スタイル(各 h2 を上罫線で区切る)で表示する。
 */
const LegalPageLayout = ({
  title,
  description,
  enactedDate,
  updatedDate,
  children,
}: LegalPageLayoutProps) => {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="border-b border-stone-200 pb-8 dark:border-stone-800">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
            {title}
          </h1>
          {description && (
            <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-400">{description}</p>
          )}
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-stone-400" />
              <dt className="text-xs font-bold tracking-widest text-stone-400 uppercase">制定日</dt>
              <dd className="font-code text-sm text-stone-700 dark:text-stone-300">
                {enactedDate}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-stone-400" />
              <dt className="text-xs font-bold tracking-widest text-stone-400 uppercase">
                最終更新日
              </dt>
              <dd className="font-code text-sm text-stone-700 dark:text-stone-300">
                {updatedDate}
              </dd>
            </div>
          </dl>
        </header>

        <div className="prose prose-stone prose-lg dark:prose-invert prose-headings:font-heading prose-h2:mt-12 prose-h2:border-t prose-h2:border-stone-200 prose-h2:pt-8 dark:prose-h2:border-stone-800 prose-a:text-amber-600 hover:prose-a:text-amber-700 dark:prose-a:text-amber-400 mt-10 max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalPageLayout;
