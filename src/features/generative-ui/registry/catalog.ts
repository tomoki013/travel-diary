import { PrimitiveType } from "../top/schema";

export interface ComponentDefinition {
  type: PrimitiveType;
  description: string;
  bestUsedFor: string;
  propsExample: Record<string, unknown>;
  category:
    | "Layout"
    | "Typography"
    | "DataDisplay"
    | "Feedback"
    | "Navigation"
    | "Media"
    | "Special";
}

export const COMPONENT_CATALOG: ComponentDefinition[] = [
  // Layout
  {
    type: "section",
    category: "Layout",
    description:
      "白背景・境界線・余白を持つ情報の大きなまとまり。原則として全てのトップレベルコンテンツはこれに含める。",
    bestUsedFor: "論理的な章立ての区切り",
    propsExample: { id: "sec-1" },
  },
  {
    type: "container",
    category: "Layout",
    description: "要素を包む基本的なコンテナ。余白の調整などに使用。",
    bestUsedFor: "要素のグループ化",
    propsExample: {},
  },
  {
    type: "flex_col",
    category: "Layout",
    description: "子要素を垂直方向（縦）に並べる。要素間の隙間(gap)を調整可能。",
    bestUsedFor: "情報の積み上げ",
    propsExample: { gap: 4 },
  },
  {
    type: "flex_row",
    category: "Layout",
    description:
      "子要素を水平方向（横）に並べる。デスクトップでは横並び、モバイルでは自動的に縦に折り返すレスポンシブ仕様。",
    bestUsedFor: "ボタンやタグの並列配置、PCでの情報の横並び",
    propsExample: { gap: 2, wrap: true },
  },
  {
    type: "grid",
    category: "Layout",
    description:
      "要素を格子状に並べる。PC/タブレットでは指定した列数、モバイルでは自動的に1列になる。PCでの2カラム・3カラム構成に必須。",
    bestUsedFor: "カードや画像のグリッド表示、PCでの多カラムレイアウト",
    propsExample: { cols: 2, gap: 4 },
  },
  {
    type: "card",
    category: "Layout",
    description: "影と境界線を持つ独立したパネル。",
    bestUsedFor: "特定のトピックの強調、クリック可能なアイテムの囲み",
    propsExample: { padding: "medium" },
  },
  {
    type: "divider",
    category: "Layout",
    description: "水平な区切り線。",
    bestUsedFor: "セクション内の情報の境界を明確にする",
    propsExample: {},
  },
  {
    type: "spacer",
    category: "Layout",
    description: "垂直方向の余白（small, medium, large）。",
    bestUsedFor: "要素間の微調整",
    propsExample: { size: "medium" },
  },

  // Typography
  {
    type: "heading_h1",
    category: "Typography",
    description:
      "ページ最上部の特大見出し。必ず「text」プロパティに目を引くメインタイトルを設定すること。",
    bestUsedFor: "メインタイトル",
    propsExample: { text: "旅行プランの提案" },
  },
  {
    type: "heading_h2",
    category: "Typography",
    description: "セクションの開始を示す大きな見出し。",
    bestUsedFor: "章のタイトル",
    propsExample: { text: "予算の概要" },
  },
  {
    type: "heading_h3",
    category: "Typography",
    description: "中見出し。",
    bestUsedFor: "項目のタイトル",
    propsExample: { text: "おすすめの移動手段" },
  },
  {
    type: "heading_h4",
    category: "Typography",
    description: "小見出し。",
    bestUsedFor: "補足的な項目タイトル",
    propsExample: { text: "注意点" },
  },
  {
    type: "body_text",
    category: "Typography",
    description:
      "標準的な本文テキスト。「text」プロパティにユーザーの課題を解決する説明を詳しく書くこと。",
    bestUsedFor: "説明文、ユーザーへのメッセージ",
    propsExample: { text: "このプランは、限られた予算で最大限に楽しむためのものです。" },
  },
  {
    type: "caption_text",
    category: "Typography",
    description:
      "補足情報や注釈用の小さなテキスト。「text」プロパティに具体的な補足説明を書くこと。",
    bestUsedFor: "免責事項、補足説明",
    propsExample: { text: "※ 料金は季節により変動します。" },
  },
  {
    type: "quote_block",
    category: "Typography",
    description:
      "引用形式のテキストブロック。「text」プロパティに印象的なメッセージやレビューを書くこと。",
    bestUsedFor: "旅の格言、他者のレビュー、強調したいメッセージ",
    propsExample: { text: "旅は、どこへ行くかではなく、誰と行くかだ。", author: "有名な誰か" },
  },
  {
    type: "highlight_text",
    category: "Typography",
    description: "背景色がついた強調テキスト。",
    bestUsedFor: "最重要ポイントの強調",
    propsExample: { text: "ここがポイント！", color: "amber" },
  },
  {
    type: "gradient_text",
    category: "Typography",
    description: "虹色や高級感のあるグラデーションがかかったテキスト。極めて重要なキーワードに。",
    bestUsedFor: "キャッチコピー、驚きの数値",
    propsExample: { text: "予算 0円の旅", from: "amber", to: "rose" },
  },

  // Data Display
  {
    type: "data_table",
    category: "DataDisplay",
    description: "多目的な表。列名(columns)と行データ(rows)を持つ。",
    bestUsedFor: "料金比較、スペック比較、スケジュール",
    propsExample: {
      columns: ["項目", "価格"],
      rows: [
        ["ホテル", "¥5,000"],
        ["食事", "¥2,000"],
      ],
    },
  },
  {
    type: "key_value_list",
    category: "DataDisplay",
    description: "「ラベル: 値」の形式のリスト。垂直方向に並ぶ。",
    bestUsedFor: "施設のスペック、営業時間、連絡先",
    propsExample: {
      items: [
        { label: "所要時間", value: "約30分" },
        { label: "難易度", value: "初級" },
      ],
    },
  },
  {
    type: "progress_bar",
    category: "DataDisplay",
    description: "進捗や割合を示すバー（0-100）。",
    bestUsedFor: "満足度、予算の使用率、おすすめ度",
    propsExample: { label: "おすすめ度", value: 85, color: "emerald" },
  },
  {
    type: "rating_stars",
    category: "DataDisplay",
    description: "5つ星評価のスター表示。",
    bestUsedFor: "評価、人気の度合い",
    propsExample: { rating: 4.5, label: "総合評価" },
  },
  {
    type: "tag_list",
    category: "DataDisplay",
    description: "小さなラベル(tags)の羅列。",
    bestUsedFor: "カテゴリ表示、特徴の箇条書き",
    propsExample: { tags: ["格安", "女子旅", "日帰り"] },
  },
  {
    type: "timeline",
    category: "DataDisplay",
    description: "垂直方向のタイムライン。",
    bestUsedFor: "モデルコース、移動のステップ",
    propsExample: {
      items: [
        { title: "成田出発", time: "10:00" },
        { title: "バンコク到着", time: "16:00" },
      ],
    },
  },
  {
    type: "comparison_columns",
    category: "DataDisplay",
    description: "2つの要素を左右に並べて比較するパネル。",
    bestUsedFor: "Aプラン vs Bプラン、メリット vs デメリット",
    propsExample: {
      left: { title: "電車", items: ["安い", "正確"] },
      right: { title: "タクシー", items: ["速い", "楽"] },
    },
  },

  // Feedback & Callout
  {
    type: "alert_box",
    category: "Feedback",
    description:
      "重要度に応じた通知ボックス。「title」と「text」プロパティに具体的な案内を書き、空にしないこと。",
    bestUsedFor: "警告、成功通知、重要な案内",
    propsExample: {
      variant: "warning",
      title: "注意",
      text: "パスポート前期限を確認してください。",
    },
  },
  {
    type: "tip_callout",
    category: "Feedback",
    description:
      "豆知識やヒントを示す電球マーク付きのボックス。「text」プロパティに具体的なアドバイスを書くこと。",
    bestUsedFor: "旅の裏技、ちょっとしたアドバイス",
    propsExample: { text: "現地ではGrabアプリを使うと安くて安全です。" },
  },
  {
    type: "did_you_know",
    category: "Feedback",
    description:
      "「ご存知ですか？」形式の雑学パネル。「title」と「text」プロパティを必ず埋めること。",
    bestUsedFor: "現地の文化や歴史の紹介",
    propsExample: { title: "現地のマナー", text: "寺院では肩を出さない服装が求められます。" },
  },

  // Navigation & Action
  {
    type: "primary_button",
    category: "Navigation",
    description: "一番目立つ塗りつぶしボタン。",
    bestUsedFor: "メインのアクション、予約ページへの誘導",
    propsExample: { label: "詳しく見る", articleId: "optional-id" },
  },
  {
    type: "secondary_button",
    category: "Navigation",
    description: "アウトラインのみのボタン。控えめなアクション用。",
    bestUsedFor: "サブのアクション、関連記事への誘導",
    propsExample: { label: "保存する" },
  },
  {
    type: "text_link",
    category: "Navigation",
    description: "下線付きのテキストリンク。",
    bestUsedFor: "本文中の関連記事へのリンク",
    propsExample: { label: "ガイドブックを読む", articleId: "id" },
  },
  {
    type: "action_card",
    category: "Navigation",
    description: "全体がクリック可能な、リンク機能付きのカード。",
    bestUsedFor: "次のステップの提示、おすすめ記事の紹介",
    propsExample: {
      title: "準備リストを確認する",
      description: "忘れ物がないかチェックしましょう",
      articleId: "id",
    },
  },
  {
    type: "floating_action",
    category: "Navigation",
    description: "画面の端に浮いているような、浮遊感のある強力なアクションボタン。",
    bestUsedFor: "常に提示しておきたい主要な行動（お問い合わせ、予約など）",
    propsExample: { label: "今すぐ相談", icon: "message" },
  },

  // Media
  {
    type: "image_single",
    category: "Media",
    description: "大きな1枚画像。",
    bestUsedFor: "風景の訴求、雰囲気の伝達",
    propsExample: { articleId: "id", caption: "夕暮れの寺院" },
  },
  {
    type: "image_gallery",
    category: "Media",
    description: "複数の画像をグリッド表示。クリックで詳細へ。",
    bestUsedFor: "旅のハイライト写真集",
    propsExample: { articleIds: ["id1", "id2", "id3"] },
  },
  {
    type: "icon_with_text",
    category: "Media",
    description: "アイコンと短いテキストのセット。",
    bestUsedFor: "特徴のクイックな紹介（Wi-Fiあり、無料、など）",
    propsExample: { icon: "wifi", text: "無料Wi-Fi完備" },
  },

  // Special High-Impact Components
  {
    type: "hero_section",
    category: "Special",
    description:
      "画面全体または大部分を占める、画像背景と大きなタイトルを持つドラマチックなセクション。ユーザーを一瞬で引き込む。",
    bestUsedFor: "ページの最上部、最も重要なテーマの提示",
    propsExample: {
      title: "タイの絶景を巡る旅",
      subtitle: "心揺さぶる体験がここに",
      articleId: "id",
      height: "full",
    },
  },
  {
    type: "featured_card",
    category: "Layout",
    description:
      "画像とテキストが洗練されたバランスで配置された、特別感のあるカード。背景のグラデーションやアニメーションが特徴。",
    bestUsedFor: "最優先で読ませたい記事やおすすめスポット",
    propsExample: {
      title: "必見！スワンナプーム活用術",
      description: "これさえ読めば不安ゼロ",
      articleId: "id",
      badge: "人気No.1",
    },
  },
];
