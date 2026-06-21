import { Reveal } from "@/components/common/Reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Tag, Archive } from "lucide-react";

/**
 * 更新の種別はバージョン番号（SemVer）の桁で機械的に決める。
 * - major:   x.0.0（世代刷新・全面リニューアル・基盤の刷新）
 * - feature: x.Y.0（後方互換のある新機能・新ページ）
 * - patch:   x.y.Z（修正・小改善・パフォーマンス/デザインの微調整など）
 * 詳細の基準は docs/versioning-release.md を参照。
 */
type UpdateType = "major" | "feature" | "patch";

interface UpdateItem {
  date: string;
  version: string;
  title: string;
  content: string;
  type: UpdateType;
  isNew?: boolean;
  /** 一度提供したが現在は削除・終了した機能であることを示す */
  removed?: boolean;
  /** 削除・終了した時期や理由の補足（removed が true のときに表示） */
  removedNote?: string;
}

const TYPE_LABEL: Record<UpdateType, string> = {
  major: "メジャーアップデート",
  feature: "機能アップデート",
  patch: "パッチアップデート",
};

const TYPE_VARIANT: Record<UpdateType, "default" | "secondary" | "outline"> = {
  major: "default",
  feature: "secondary",
  patch: "outline",
};

// バージョン採番ルールは docs/versioning-release.md を参照（SemVer）。
// 並びは新しい順。package.json の version と先頭エントリを一致させること。
const UPDATES: UpdateItem[] = [
  {
    date: "2026.06.22",
    version: "v4.7.1",
    title: "記事の日付表示をわかりやすく整理",
    content:
      "記事ページで「訪問日・公開日・更新日」を区別して表示するようにしました。記事の上部に公開日と更新日（ある場合）、記事末尾に旅の訪問日を載せています。",
    type: "patch",
    isNew: true,
  },
  {
    date: "2026.06.21",
    version: "v4.7.0",
    title: "記事の絞り込みと並び替えを刷新",
    content:
      "「絞り込み」ボタンからカテゴリ・タグ・記事タイプをまとめて指定できるようにし、並び替えはおすすめ・新しい順・古い順から選べるようにしました。",
    type: "feature",
  },
  {
    date: "2026.06.16",
    version: "v4.6.3",
    title: "表示速度をさらに改善",
    content: "ページの読み込みを軽くして、表示までの速度を改善しました。",
    type: "patch",
  },
  {
    date: "2026.06.11",
    version: "v4.6.2",
    title: "ページ表示の不具合を修正",
    content: "ページのURL表示まわりの不具合を直し、表示速度と入力の安全性を高めました。",
    type: "patch",
  },
  {
    date: "2026.06.10",
    version: "v4.6.1",
    title: "読み込みを軽量化",
    content: "不要な読み込みを減らして、表示速度を改善しました。",
    type: "patch",
  },
  {
    date: "2026.06.08",
    version: "v4.6.0",
    title: "未使用機能の整理と軽量化",
    content:
      "利用の少なかった機能（Generative UI・AIチャット・PWAオフライン対応など）を整理してサイトを軽くし、表示の安定性を高めました。",
    type: "feature",
  },
  {
    date: "2026.05.31",
    version: "v4.5.1",
    title: "記事データ管理の整理",
    content: "記事の管理方法を新しい仕様へ整理し、今後の更新をしやすくしました。",
    type: "patch",
  },
  {
    date: "2026.05.31",
    version: "v4.5.0",
    title: "地域から探せる検索とダークモード対応",
    content:
      "大陸・国・都市から記事を探せるサイト内検索を追加し、リンク表示のダークモード対応などを行いました。",
    type: "feature",
  },
  {
    date: "2026.05.23",
    version: "v4.4.2",
    title: "表示まわりの警告・不具合を解消",
    content: "表示に関わる細かな警告と不具合を解消しました。",
    type: "patch",
  },
  {
    date: "2026.05.13",
    version: "v4.4.1",
    title: "画像・フォントの読み込みを調整",
    content: "画像やフォントの読み込みを調整して、表示速度を改善しました。",
    type: "patch",
  },
  {
    date: "2026.05.12",
    version: "v4.4.0",
    title: "表示速度の全体的な見直し",
    content: "サイト全体の表示速度を見直し、品質を保つための計測の仕組みを整えました。",
    type: "feature",
  },
  {
    date: "2026.05.10",
    version: "v4.3.1",
    title: "検索エンジン向け情報の改善",
    content: "検索エンジンやAI検索で見つけてもらいやすいよう、ページ情報を幅広く改善しました。",
    type: "patch",
  },
  {
    date: "2026.05.07",
    version: "v4.3.0",
    title: "Generative UI（実験的）を公開",
    content: "入力内容に応じてAIがページを動的に組み立てる実験的な機能を公開しました。",
    type: "feature",
    removed: true,
    removedNote: "2026年6月に提供を終了しました。",
  },
  {
    date: "2026.05.04",
    version: "v4.2.0",
    title: "フッター刷新とTomokichi Globeの外部リンク化",
    content:
      "フッターの見た目を整え、旅の必需品を整理し、Tomokichi Globe を外部リンクとして案内するようにしました。",
    type: "feature",
  },
  {
    date: "2026.05.02",
    version: "v4.1.1",
    title: "一部ページの公開設定を整理",
    content: "一部ページの公開設定と仮置きの表示を整理しました。",
    type: "patch",
  },
  {
    date: "2026.04.23",
    version: "v4.1.0",
    title: "探索リンクの並び替えとSNS追加",
    content: "サイト内の探索リンクの並びを見直し、新しいSNSアカウントを追加しました。",
    type: "feature",
  },
  {
    date: "2026.04.10",
    version: "v4.0.2",
    title: "安全性に関わる修正",
    content: "安全性に関わるライブラリの問題（脆弱性）を修正しました。",
    type: "patch",
  },
  {
    date: "2026.04.09",
    version: "v4.0.1",
    title: "フッター・サイトマップのリンク整理",
    content: "フッターとサイトマップのリンク構成を整理しました。",
    type: "patch",
  },
  {
    date: "2026.03.29",
    version: "v4.0.0",
    title: "ヒーロー・ヘッダー・記事詳細のUI刷新",
    content:
      "トップのヒーロー、ヘッダー、記事詳細ページのデザインを刷新し、サイト全体のトーンを統一しました。",
    type: "major",
  },
  {
    date: "2026.03.22",
    version: "v3.7.4",
    title: "旅トピックの絞り込みを改善",
    content: "旅のトピックで絞り込む操作の使い勝手を改善しました。",
    type: "patch",
  },
  {
    date: "2026.03.10",
    version: "v3.7.3",
    title: "記事表示の軽量化",
    content: "記事の表示をさらに軽くしました。",
    type: "patch",
  },
  {
    date: "2026.03.02",
    version: "v3.7.2",
    title: "記事下の次アクション提案を改善",
    content: "記事末尾の次に読む提案と、モバイルのフッター表示を改善しました。",
    type: "patch",
  },
  {
    date: "2026.02.24",
    version: "v3.7.0",
    title: "Focus Mode を公開",
    content: "記事に集中して読める Focus Mode を追加しました。",
    type: "feature",
    removed: true,
    removedNote: "2026年4月に提供を終了しました。",
  },
  {
    date: "2026.02.23",
    version: "v3.6.2",
    title: "AI執筆に関する注意書きを追加",
    content: "記事詳細ページに、AIによる執筆補助に関する注意書きを追加しました。",
    type: "patch",
  },
  {
    date: "2026.01.05",
    version: "v3.6.1",
    title: "ロードマップ・コンタクトの表示改善",
    content: "ロードマップページとコンタクトページの導線・表示を改善しました。",
    type: "patch",
  },
  {
    date: "2026.01.05",
    version: "v3.6.0",
    title: "Journeyページを追加",
    content: "旅の歩みを時系列で振り返る Journey ページを追加しました。",
    type: "feature",
  },
  {
    date: "2025.12.30",
    version: "v3.5.0",
    title: "FAQをダッシュボード化",
    content:
      "FAQページをインタラクティブなダッシュボードへ刷新し、その場で検索できるようにしました。",
    type: "feature",
  },
  {
    date: "2025.12.25",
    version: "v3.4.2",
    title: "表示崩れの修正",
    content: "一部の表示崩れを修正しました。",
    type: "patch",
  },
  {
    date: "2025.12.23",
    version: "v3.4.1",
    title: "アクセス解析の導入",
    content: "サイトの利用状況を把握するためのアクセス解析を導入しました。",
    type: "patch",
  },
  {
    date: "2025.12.23",
    version: "v3.4.0",
    title: "AIトラベルプランナーを独立アプリ化",
    content:
      "AIトラベルプランナーを独立したアプリとして分離し、本体からはリンクで案内するようにしました。",
    type: "feature",
  },
  {
    date: "2025.12.18",
    version: "v3.3.1",
    title: "Globeプロモの調整",
    content: "Tomokichi Globe を紹介するセクションの文言と配置を調整しました。",
    type: "patch",
  },
  {
    date: "2025.12.11",
    version: "v3.3.0",
    title: "Tomokichi Globeのプロモを追加",
    content: "ホーム・記事・地域ページに、3D地球儀 Tomokichi Globe への導線を追加しました。",
    type: "feature",
  },
  {
    date: "2025.12.05",
    version: "v3.2.1",
    title: "モバイルメニュー・ヘッダーの修正",
    content: "モバイルメニューの動きとヘッダーの透過表示を修正しました。",
    type: "patch",
  },
  {
    date: "2025.11.25",
    version: "v3.2.0",
    title: "ヘッダー強化と背景デザイン",
    content: "ヘッダーを強化して背景デザインを追加し、モバイルメニューの見やすさも改善しました。",
    type: "feature",
  },
  {
    date: "2025.11.24",
    version: "v3.1.2",
    title: "エラーページの追加",
    content: "予期しないエラーが起きたときの表示ページを追加しました。",
    type: "patch",
  },
  {
    date: "2025.11.18",
    version: "v3.1.1",
    title: "ローディング・404アニメーションの刷新",
    content: "ローディング画面と404ページのアニメーションを、旅をテーマにした演出へ刷新しました。",
    type: "patch",
  },
  {
    date: "2025.11.17",
    version: "v3.1.0",
    title: "専用のローディング・404ページ",
    content: "独自デザインの読み込み中ページと404ページを追加しました。",
    type: "feature",
  },
  {
    date: "2025.11.13",
    version: "v3.0.0",
    title: "Next.js v16へアップグレード",
    content: "サイトの基盤を Next.js v16 へアップグレードしました。",
    type: "major",
  },
  {
    date: "2025.10.15",
    version: "v2.11.1",
    title: "AIプランナーのフォールバック改善",
    content: "AIプランナーの生成に失敗したとき、下書きプランへ安全に切り替わるよう改善しました。",
    type: "patch",
  },
  {
    date: "2025.10.12",
    version: "v2.11.0",
    title: "AIプランナーに予算考慮を追加",
    content: "AIプランナーで予算を選べるようにし、予算を踏まえた提案ができるようにしました。",
    type: "feature",
  },
  {
    date: "2025.10.10",
    version: "v2.10.1",
    title: "AIプランナーの安定化",
    content: "AIプランナーの安定性を高め、タイムアウトや生成エラーを減らしました。",
    type: "patch",
  },
  {
    date: "2025.10.09",
    version: "v2.10.0",
    title: "FAQページを追加",
    content: "よくある質問をまとめたFAQページを追加しました。",
    type: "feature",
  },
  {
    date: "2025.10.07",
    version: "v2.9.1",
    title: "AIプランナーのエラー対応改善",
    content: "AIプランナーのエラー時の挙動を改善しました。",
    type: "patch",
  },
  {
    date: "2025.10.02",
    version: "v2.9.0",
    title: "AI旅行プランナーを実験的に公開",
    content: "AIが旅程の素案を提案する機能を実験的に公開しました。",
    type: "feature",
  },
  {
    date: "2025.10.01",
    version: "v2.8.0",
    title: "表示の応答を高速化",
    content: "ページの応答を速くする仕組みを取り入れ、表示を高速化しました。",
    type: "feature",
  },
  {
    date: "2025.09.21",
    version: "v2.7.0",
    title: "アフィリエイトカードの表示",
    content: "記事の内容に合わせて、関連する商品・サービスのカードを表示できるようにしました。",
    type: "feature",
  },
  {
    date: "2025.09.16",
    version: "v2.6.0",
    title: "シェアボタンと注意ボックスを追加",
    content: "記事にシェアボタンを追加し、冒頭に作成日を示す注意ボックスを配置しました。",
    type: "feature",
  },
  {
    date: "2025.09.10",
    version: "v2.5.1",
    title: "PWA関連の不具合修正",
    content: "PWA周りで発生していた不具合を修正しました。",
    type: "patch",
  },
  {
    date: "2025.09.09",
    version: "v2.5.0",
    title: "検索のUI/UX改善",
    content: "サイト内検索の表示と操作性を改善しました。",
    type: "feature",
  },
  {
    date: "2025.09.05",
    version: "v2.4.0",
    title: "PWA対応",
    content: "PWAに対応し、オフラインでも閲覧できるようにしました。",
    type: "feature",
    removed: true,
    removedNote: "2026年6月にオフライン対応（Service Worker）を終了しました。",
  },
  {
    date: "2025.09.05",
    version: "v2.3.0",
    title: "地域階層リンクとモバイル地図ズーム",
    content:
      "国の地域ページに下位地域へのリンクを表示し、モバイルでも世界地図をズームできるようにしました。",
    type: "feature",
  },
  {
    date: "2025.09.02",
    version: "v2.2.1",
    title: "ギャラリー表示の安定化",
    content: "ギャラリーの絞り込み時の動きとレイアウトを安定させました。",
    type: "patch",
  },
  {
    date: "2025.09.02",
    version: "v2.2.0",
    title: "インタラクティブ世界地図を導入",
    content: "ズームやツールチップに対応した、クリックできる世界地図を導入しました。",
    type: "feature",
  },
  {
    date: "2025.08.31",
    version: "v2.1.0",
    title: "サイト内検索を追加",
    content: "キーワードから記事を探せるサイト内検索を追加しました。",
    type: "feature",
  },
  {
    date: "2025.08.26",
    version: "v2.0.1",
    title: "地域まわりの整理",
    content: "地域や関連記事の絞り込みを整理し、表示を安定させました。",
    type: "patch",
  },
  {
    date: "2025.08.21",
    version: "v2.0.0",
    title: "サイトUIの大幅リニューアル",
    content: "サイト全体のUIを大幅にリニューアルし、独自の世界観を表現するデザインへ刷新しました。",
    type: "major",
  },
  {
    date: "2025.06.04",
    version: "v1.1.2",
    title: "記事の絞り込みを改善",
    content: "記事の絞り込みを見直し、関連性の高い表示にしました。",
    type: "patch",
  },
  {
    date: "2025.04.22",
    version: "v1.1.1",
    title: "モバイル目次の不具合修正",
    content: "モバイルで目次により下へスクロールできない不具合を修正しました。",
    type: "patch",
  },
  {
    date: "2025.03.18",
    version: "v1.1.0",
    title: "コンポーネント整備とツール追加",
    content: "各種UIの作りを整え、ルーレット機能を追加しました。",
    type: "feature",
  },
  {
    date: "2025.03.08",
    version: "v1.0.0",
    title: "ともきちの旅行日記をNext.jsで公開",
    content:
      "初代サイトの次の世代として、Next.jsで作り直した旅行ブログを公開しました。記事表示と写真ギャラリーを備えています。",
    type: "major",
  },
  {
    date: "2024.09.15",
    version: "v0.1.0",
    title: "初代サイトを公開（HTML / CSS / JavaScript）",
    content:
      "旅行日記の初代サイトを HTML・CSS・JavaScript で制作して公開しました。これがともきちの旅行日記の出発点です。",
    type: "major",
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
                      <Badge variant={TYPE_VARIANT[item.type]} className="mt-1">
                        {TYPE_LABEL[item.type]}
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
