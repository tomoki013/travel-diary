import { Reveal } from "@/components/common/Reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Tag, Archive } from "lucide-react";

interface UpdateItem {
  date: string;
  version: string;
  title: string;
  content: string;
  type: string;
  isNew?: boolean;
  /** 一度提供したが現在は削除・終了した機能であることを示す */
  removed?: boolean;
  /** 削除・終了した時期や理由の補足（removed が true のときに表示） */
  removedNote?: string;
}

// バージョン採番ルールは docs/versioning-release.md を参照（SemVer）。
// 並びは新しい順。package.json の version と先頭エントリを一致させること。
const UPDATES: UpdateItem[] = [
  {
    date: "2026.06.16",
    version: "v4.6.3",
    title: "日本語フォントの大幅削減で表示を高速化",
    content:
      "日本語Webフォントを大幅に削減し、レンダリングをブロックするCSS/woff2を圧縮して表示速度を改善しました。",
    type: "Performance",
    isNew: true,
  },
  {
    date: "2026.06.11",
    version: "v4.6.2",
    title: "canonical修正とAPI強化",
    content:
      "canonicalの生成を修正し、フォントCSSを半減、アニメーションをCSS化、APIの入力検証を強化しました。",
    type: "Performance",
  },
  {
    date: "2026.06.10",
    version: "v4.6.1",
    title: "フォント最適化とレガシーJSの削除",
    content:
      "フォントを最適化し、レガシーなJSポリフィルを削除、preconnectを追加してバンドルを軽量化しました。",
    type: "Performance",
  },
  {
    date: "2026.06.08",
    version: "v4.6.0",
    title: "未使用機能の整理と軽量化",
    content:
      "利用の少なかった機能（Generative UI・AIチャット・PWAオフライン対応など）を削除してバンドルを縮小し、CLSを改善しました。",
    type: "Performance",
  },
  {
    date: "2026.05.31",
    version: "v4.5.1",
    title: "frontmatterスキーマの移行",
    content: "記事のfrontmatterスキーマを新仕様へ移行し、保守性を高めました。",
    type: "Refactor",
  },
  {
    date: "2026.05.31",
    version: "v4.5.0",
    title: "地域階層検索とダークモード対応",
    content:
      "大陸・国・都市の階層に対応したサイト内検索を導入し、リンクカードのダークモード表示とllms.txtを追加しました。",
    type: "Feature",
  },
  {
    date: "2026.05.23",
    version: "v4.4.2",
    title: "構造化データとパフォーマンス警告の改善",
    content: "構造化データを見直し、パフォーマンス関連の警告を解消しました。",
    type: "Fix",
  },
  {
    date: "2026.05.13",
    version: "v4.4.1",
    title: "CSS・フォント・画像の最適化",
    content:
      "レンダリングをブロックするCSSとフォントを最適化し、画像のpriority/sizesを調整、ウィジェットを遅延読み込みにしました。",
    type: "Performance",
  },
  {
    date: "2026.05.12",
    version: "v4.4.0",
    title: "パフォーマンス基盤とCIの整備",
    content: "包括的なパフォーマンス改善を行い、計測を含むCIを整備しました。",
    type: "Performance",
  },
  {
    date: "2026.05.10",
    version: "v4.3.1",
    title: "SEO/AIOの包括的な改善",
    content: "検索エンジンとAI検索向けに、構造化情報やメタ情報を包括的に改善しました。",
    type: "Improvement",
  },
  {
    date: "2026.05.07",
    version: "v4.3.0",
    title: "Generative UI（実験的）を公開",
    content: "入力内容に応じてAIがUIを動的に生成する実験的ページを公開しました。",
    type: "Experimental",
    removed: true,
    removedNote: "2026年6月に提供を終了しました。",
  },
  {
    date: "2026.05.04",
    version: "v4.2.0",
    title: "フッター刷新とTomokichi Globeの外部リンク化",
    content:
      "ブログのフッターUIを更新し、旅の必需品を整理、Tomokichi Globeを外部リンクとして案内するようにしました。",
    type: "Feature",
  },
  {
    date: "2026.05.02",
    version: "v4.1.1",
    title: "低価値ページのnoindex整理",
    content: "AdSense審査に向けて、低価値ページのnoindexとプレースホルダーを整理しました。",
    type: "Fix",
  },
  {
    date: "2026.04.23",
    version: "v4.1.0",
    title: "探索リンクの並び替えとSNS追加",
    content: "探索リンクの並びを見直し、新しいSNSアカウントを追加しました。",
    type: "Feature",
  },
  {
    date: "2026.04.10",
    version: "v4.0.2",
    title: "RSC脆弱性(CVE-2026-23864)の修正",
    content: "Reactを更新し、RSCに関するDoS脆弱性(CVE-2026-23864)を修正しました。",
    type: "Security",
  },
  {
    date: "2026.04.09",
    version: "v4.0.1",
    title: "フッター・サイトマップのリンク整理",
    content: "フッターとサイトマップのリンク構成を整理しました。",
    type: "Fix",
  },
  {
    date: "2026.03.29",
    version: "v4.0.0",
    title: "ヒーロー・ヘッダー・記事詳細のUI刷新",
    content:
      "トップのヒーロー、ヘッダー、記事詳細ページのデザインを刷新し、サイト全体のトーンを統一しました。",
    type: "Major",
  },
  {
    date: "2026.03.22",
    version: "v3.7.4",
    title: "旅トピックのフィルタリングUX改善",
    content: "旅のトピックを絞り込む操作の使い勝手を改善しました。",
    type: "Improvement",
  },
  {
    date: "2026.03.10",
    version: "v3.7.3",
    title: "記事キャッシュの最適化",
    content: "記事キャッシュを最適化し、配信に使う関数のバンドルサイズを削減しました。",
    type: "Performance",
  },
  {
    date: "2026.03.02",
    version: "v3.7.2",
    title: "記事下の次アクション提案を改善",
    content: "記事末尾の次の行動提案と、モバイルのフッターレイアウトを改善しました。",
    type: "Improvement",
  },
  {
    date: "2026.02.24",
    version: "v3.7.0",
    title: "Focus Mode を公開",
    content: "記事に集中して読める Focus Mode を追加しました。",
    type: "Feature",
    removed: true,
    removedNote: "2026年4月に提供を終了しました。",
  },
  {
    date: "2026.02.23",
    version: "v3.6.2",
    title: "AI執筆に関する注意書きを追加",
    content: "記事詳細ページに、AIによる執筆補助に関する注意書きを追加しました。",
    type: "Improvement",
  },
  {
    date: "2026.01.05",
    version: "v3.6.1",
    title: "ロードマップ・コンタクトのUX改善",
    content: "ロードマップページとコンタクトページの導線・表示を改善しました。",
    type: "Fix",
  },
  {
    date: "2026.01.05",
    version: "v3.6.0",
    title: "Journeyページを追加",
    content: "旅の歩みを時系列で振り返る Journey ページを追加しました。",
    type: "Feature",
  },
  {
    date: "2025.12.30",
    version: "v3.5.0",
    title: "FAQをダッシュボード化",
    content:
      "FAQページをインタラクティブなダッシュボードへ刷新し、リアルタイム検索に対応しました。",
    type: "Feature",
  },
  {
    date: "2025.12.25",
    version: "v3.4.2",
    title: "PWA設定の修正",
    content: "PWAの設定を見直し、一部の表示崩れを修正しました。",
    type: "Fix",
  },
  {
    date: "2025.12.23",
    version: "v3.4.1",
    title: "Google Analyticsの導入",
    content: "アクセス解析のためにGoogle Analyticsを導入しました。",
    type: "Improvement",
  },
  {
    date: "2025.12.23",
    version: "v3.4.0",
    title: "AIトラベルプランナーを独立アプリ化",
    content:
      "AIトラベルプランナーを、ともきちの旅行日記とは独立したアプリとして分離し、本体からはリンクで案内するようにしました。",
    type: "Enhancement",
  },
  {
    date: "2025.12.18",
    version: "v3.3.1",
    title: "Globeプロモの調整",
    content: "Tomokichi Globe を紹介するセクションの文言と配置を調整しました。",
    type: "Fix",
  },
  {
    date: "2025.12.11",
    version: "v3.3.0",
    title: "Tomokichi Globeのプロモを追加",
    content: "ホーム・記事・地域ページに、3D地球儀 Tomokichi Globe への導線を追加しました。",
    type: "Feature",
  },
  {
    date: "2025.12.05",
    version: "v3.2.1",
    title: "モバイルメニュー・ヘッダーの修正",
    content: "モバイルメニューの挙動とヘッダーの透過表示を修正しました。",
    type: "Fix",
  },
  {
    date: "2025.11.25",
    version: "v3.2.0",
    title: "ヘッダー強化と背景デザイン",
    content: "ヘッダーを強化し、SVG背景を追加。モバイルメニューの視認性も改善しました。",
    type: "Feature",
  },
  {
    date: "2025.11.24",
    version: "v3.1.2",
    title: "エラーページの追加",
    content: "error.tsx / global-error.tsx を追加し、予期しないエラー時の表示を整えました。",
    type: "Fix",
  },
  {
    date: "2025.11.18",
    version: "v3.1.1",
    title: "ローディング・404アニメーションの刷新",
    content: "ローディング画面と404ページのアニメーションを、旅をテーマにした演出へ刷新しました。",
    type: "Design",
  },
  {
    date: "2025.11.17",
    version: "v3.1.0",
    title: "専用のローディング・404ページ",
    content: "独自デザインの loading ページと not-found ページを追加しました。",
    type: "Feature",
  },
  {
    date: "2025.11.13",
    version: "v3.0.0",
    title: "Next.js v16へアップグレード",
    content: "基盤を Next.js v16 へアップグレードし、パッケージ管理を pnpm へ移行しました。",
    type: "Major",
  },
  {
    date: "2025.10.15",
    version: "v2.11.1",
    title: "AIプランナーのフォールバック改善",
    content: "AIプランナーの生成失敗時に、下書きプランへ安全に切り替わるよう改善しました。",
    type: "Fix",
  },
  {
    date: "2025.10.12",
    version: "v2.11.0",
    title: "AIプランナーに予算考慮を追加",
    content: "AIプランナーで予算を選択でき、予算を踏まえた提案ができるようにしました。",
    type: "Feature",
  },
  {
    date: "2025.10.10",
    version: "v2.10.1",
    title: "AIプランナーの安定化",
    content: "AIプランナーを構造化JSON・多段API化し、タイムアウトや生成エラーを軽減しました。",
    type: "Fix",
  },
  {
    date: "2025.10.09",
    version: "v2.10.0",
    title: "FAQページを追加",
    content: "よくある質問をまとめたFAQページを追加しました。",
    type: "Feature",
  },
  {
    date: "2025.10.07",
    version: "v2.9.1",
    title: "AIプランナーのエラー対応改善",
    content: "AIプランナーのタイムアウトとエラーハンドリングを改善しました。",
    type: "Fix",
  },
  {
    date: "2025.10.02",
    version: "v2.9.0",
    title: "AI旅行プランナーを実験的に公開",
    content: "AIが旅程の素案を提案する機能を実験的に公開しました。",
    type: "Experimental",
  },
  {
    date: "2025.10.01",
    version: "v2.8.0",
    title: "APIとデータ取得のキャッシュ",
    content: "APIルートとデータ取得にキャッシュを導入し、応答を高速化しました。",
    type: "Performance",
  },
  {
    date: "2025.09.21",
    version: "v2.7.0",
    title: "アフィリエイトカードの表示",
    content: "記事のメタ情報をもとに、関連するアフィリエイトカードを表示できるようにしました。",
    type: "Feature",
  },
  {
    date: "2025.09.16",
    version: "v2.6.0",
    title: "シェアボタンと注意ボックスを追加",
    content: "記事にシェアボタンを追加し、冒頭に作成日を示す注意ボックスを配置しました。",
    type: "Feature",
  },
  {
    date: "2025.09.10",
    version: "v2.5.1",
    title: "PWA関連の不具合修正",
    content: "PWA周りで発生していたエラーを修正しました。",
    type: "Fix",
  },
  {
    date: "2025.09.09",
    version: "v2.5.0",
    title: "検索オーバーレイのUI/UX改善",
    content: "サイト内検索のオーバーレイと検索候補の表示・操作性を改善しました。",
    type: "Improvement",
  },
  {
    date: "2025.09.05",
    version: "v2.4.0",
    title: "PWA対応",
    content: "PWAに対応し、オフラインでも閲覧できるようにしました。",
    type: "Feature",
    removed: true,
    removedNote: "2026年6月にオフライン対応（Service Worker）を終了しました。",
  },
  {
    date: "2025.09.05",
    version: "v2.3.0",
    title: "地域階層リンクとモバイル地図ズーム",
    content:
      "国の地域ページに下位地域へのリンクを表示し、モバイルでも世界地図をズームできるようにしました。",
    type: "Feature",
  },
  {
    date: "2025.09.02",
    version: "v2.2.1",
    title: "ギャラリー表示の安定化",
    content: "ギャラリーのフィルタリングアニメーションとレイアウトの高さを安定化しました。",
    type: "Fix",
  },
  {
    date: "2025.09.02",
    version: "v2.2.0",
    title: "インタラクティブ世界地図を導入",
    content: "ズームやツールチップに対応した、クリックできる世界地図を導入しました。",
    type: "Feature",
  },
  {
    date: "2025.08.31",
    version: "v2.1.0",
    title: "サイト内検索を実装",
    content: "スコアリングと並び替えに対応した、サイト内検索機能を実装しました。",
    type: "Feature",
  },
  {
    date: "2025.08.26",
    version: "v2.0.1",
    title: "地域ロジックのリファクタリング",
    content: "地域(region)や関連記事のロジックを整理し、フィルタリングを共通化しました。",
    type: "Refactor",
  },
  {
    date: "2025.08.21",
    version: "v2.0.0",
    title: "サイトUIの大幅リニューアル",
    content: "サイト全体のUIを大幅にリニューアルし、独自の世界観を表現するデザインへ刷新しました。",
    type: "Major",
  },
  {
    date: "2025.06.04",
    version: "v1.1.2",
    title: "記事フィルタリングの改善",
    content: "記事の絞り込みロジックを見直し、関連性の高い表示にしました。",
    type: "Improvement",
  },
  {
    date: "2025.04.22",
    version: "v1.1.1",
    title: "モバイル目次の不具合修正",
    content: "モバイルで目次のオートスクロールにより下へスクロールできない問題を修正しました。",
    type: "Fix",
  },
  {
    date: "2025.03.18",
    version: "v1.1.0",
    title: "コンポーネント整備とツール追加",
    content: "各種UIのコンポーネント化を進め、ルーレット機能を追加しました。",
    type: "Feature",
  },
  {
    date: "2025.03.08",
    version: "v1.0.0",
    title: "ともきちの旅行日記を公開",
    content:
      "Next.jsで構築した旅行ブログとして、記事表示と写真ギャラリーを備えたサイトを公開しました。",
    type: "Major",
  },
];

export default function UpdateList() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="font-heading text-primary mb-4 text-3xl font-bold md:text-4xl">
          Update History
        </h2>
        <p className="text-muted-foreground">ともきちの旅行日記の進化の記録</p>
      </div>

      <div className="space-y-6">
        {UPDATES.map((item, index) => (
          <Reveal
            key={index}
            amount={0}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
            }}
          >
            <Card
              className={
                "overflow-hidden border-l-4 transition-shadow duration-300 hover:shadow-lg " +
                (item.removed
                  ? "border-l-muted-foreground/40 bg-muted/30 opacity-70"
                  : "border-l-primary")
              }
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Meta Info */}
                  <div className="border-border flex flex-shrink-0 flex-col gap-2 border-b pb-4 md:w-48 md:border-r md:border-b-0 md:pr-6 md:pb-0">
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-mono text-sm">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="text-primary h-4 w-4" />
                      <span className="text-lg font-bold">{item.version}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          item.type === "Major"
                            ? "default"
                            : item.type === "Fix"
                              ? "destructive"
                              : item.type === "Experimental"
                                ? "outline"
                                : "secondary"
                        }
                        className="mt-1"
                      >
                        {item.type} Update
                      </Badge>
                      {item.removed && (
                        <Badge
                          variant="outline"
                          className="border-muted-foreground/40 text-muted-foreground mt-1 gap-1"
                        >
                          <Archive className="h-3 w-3" />
                          提供終了
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <h3
                        className={
                          "text-xl font-bold " +
                          (item.removed
                            ? "text-muted-foreground line-through decoration-1"
                            : "text-foreground")
                        }
                      >
                        {item.title}
                      </h3>
                      {item.isNew && (
                        <span className="animate-pulse rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.content}</p>
                    {item.removed && item.removedNote && (
                      <p className="text-muted-foreground/80 mt-3 flex items-center gap-1.5 text-sm">
                        <Archive className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{item.removedNote}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
