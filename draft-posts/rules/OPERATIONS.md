# 運用仕様 (Operations)

このファイルは、frontmatter、命名、修正運用、内部リンク制約、公開前チェックなどのプロジェクト固有仕様を定義します。
編集方針は `EDITORIAL_BASELINE.md`、カテゴリ戦略は `CONTENT_STRATEGY.md`、travel-diary の専用仕様は `TRAVEL_DIARY_RULES.md`、ソース変換は `SOURCE_CONVERSION.md` を参照してください。

## 1. Frontmatter

| キー | 型 | 必須/任意 | 説明 | 使用タイミング |
| :-- | :-- | :-- | :-- | :-- |
| `title` | `string` | 必須 | 記事タイトル | 全記事 |
| `dates` | `string[]` | 必須 | 日付配列。`["2024-03-10"]` | 全記事 |
| `category` | `string` | 必須 | `tourism`, `itinerary`, `series`, `one-off` | 全記事 |
| `excerpt` | `string` | 任意 | 要約。100 から 150 文字程度 | 一覧・SEO |
| `image` | `string` | 必須 | アイキャッチ画像のパス | 全記事 |
| `tags` | `string[]` | 任意 | 検索・フリーワード導線用タグ | 全記事 |
| `location` | `string[]` | 任意 | `src/data/region.ts` の `slug` | 全記事 |
| `author` | `string` | 任意 | 著者名。デフォルトは `ともきち` | 全記事 |
| `id` | `string` | 任意 | 記事のユニーク ID | 管理上必要な場合 |
| `budget` | `number` | 任意 | 旅行の総予算 | `category: itinerary` |
| `costs` | `Record` | 任意 | 費用の内訳 | `category: itinerary` |
| `series` | `string` | 任意 | 連載シリーズの slug | `category: series` |
| `journey` | `string` | 任意 | `journey.ts` の ID | 旅程に紐づく記事 |
| `travelTopics` | `string[]` | 任意 | 実用情報ラベル | 実用性の高い `tourism` |
| `isPromotion` | `boolean` | 任意 | PR 記事かどうか | PR 記事のみ |
| `promotionPG` | `string[]` | 任意 | プロモーション種別やリンク情報 | PR 記事のみ |

## 2. Frontmatter の運用

- `category: itinerary` では `budget` `costs` `journey` を使用可能。
- `category: series` では `series` が必須。
- `journey` は全カテゴリで使用可能。
- ただし、旅程に紐づく記事では `journey` を原則付与する。
- `series: travel-diary` と `category: itinerary` では `journey` を基本必須として扱う。
- 特定の旅の移動、空港アクセス、観光実体験に依存する `category: tourism` でも、旅程と結びつくなら `journey` を付与する。
- 旅程に依存しない一般論や単発の考え方記事では、`journey` はなくてよい。
- 全記事で `image` を必ず入れる。画像未確定でも `image: /images/` を入れておく。
- `dates` は 1 つ目を公開日または旅行開始日、2 つ目以降があれば更新日として扱う。
- `location` は配列で記述し、`src/data/region.ts` に定義された `slug` と一致させる。
- `location` は、使えるなら国より都市・エリアのような小さい単位を優先する。
- 同じ記事で国 `slug` と、その国に含まれる都市・エリア `slug` を併記しない。
- `src/data/region.ts` に子 `slug` がない場所だけ、国 `slug` 単独を使ってよい。

## 3. `travelTopics`

- `travelTopics` は原則として `category: tourism` の記事にだけ付ける。
- `category` は記事形式、`travelTopics` は実務テーマとして扱い、混同しない。
- 少し触れているだけなら付与しない。主要導線、見出し、比較軸として成立しているテーマだけ残す。
- 推奨ラベルは `money` `visa` `transport` `booking` `sim` `insurance`。

## 4. 命名と表記

### ファイル名

- すべて小文字のケバブケースを基本とする。
- 半角英数字のみを使い、日本語、全角文字、スペースは使わない。
- frontmatter に `slug` を持つ場合は、ファイル名と一致させる。

### カテゴリ別

- `category: series`: シリーズ別の命名規則に従う。
- `category: itinerary`: `[地域]-itinerary.md`
- `category: tourism`: `[キーワード].md` または `[地域]-[内容].md`
- `category: one-off`: `[内容キーワード].md`

### シリーズ別

- `travel-diary`: `[国名][連番].md`
- `travel-history`: `travel-history[連番].md`
- `sunset`: `sunset[連番].md`
- `landscape`: `landscape[連番].md`
- `architecture`: `architecture[連番].md`
- `kyoto`: `kyoto-view[連番].md`

### 表記

- 数字は半角算用数字を使う。
- 地名は Google マップ表記を基準とする。
- 通貨は `€5.5` `1,000円` のように記号と数字を併用する。
- 強調は Markdown の `**太字**` を使う。

## 5. 修正運用

- 既存の `posts/` 記事を修正する場合は、全面的な書き直しではなく必要最低限の修正を基本にする。
- 新規作成や修正した記事は、いきなり `posts/` へ置かず、必ず一旦 `draft-posts/` に出力して確認を挟む。
- `series: travel-diary` の修正や新規化では、構成と密度の判断を `TRAVEL_DIARY_RULES.md` に合わせる。
- 確認可能な客観情報は補正してよいが、体験談の主観や印象そのものは消さない。
- 喫煙事情の記載は、`category: tourism` の喫煙事情特化記事以外には含めない。
- 営業時間、料金、運行頻度、入場条件などの変動情報は、原則として著者が現地で直接確認した内容を優先する。
- 現地で直接確認していない補足情報を入れる場合は、`公式サイトでは` `公式案内では` `ネット上では` など、情報源の性質を本文中で明記する。
- 現地確認できていない情報を、体験ベースの事実のように断定して書かない。

## 6. 内部リンク

- 記事内で紹介した場所やトピックに詳細記事がある場合は、その記事への内部リンクを積極的に設置する。
- Markdown リンクはカード UI に変換されるため、本文へ埋め込まず独立した段落で配置する。
- 時系列順に読む読者のため、未来の記事へのリンクは原則として設置しない。
- ただし、同じ `journey` を持つ既存記事どうしなら、公開日が後でも自然な文脈の補助リンクとして設置してよい。
- `series: travel-diary` の回リンクは原則として直前回までに留め、前々回以前の回リンクは置かない。

## 7. 写真挿入マーカー

- 後から写真を差し込む候補箇所には、次の 3 行構成を使う。
- `[[photo]]`
- `![alt](/images/_photo-placeholder/example.jpg)`
- `[[/photo]]`
- 中の画像行は通常の Markdown 画像記法をそのまま使い、`alt` は必須にする。
- `alt` は被写体が分かる簡潔な日本語にし、感想や評価語を混ぜない。
- `src` は仮パスでよいが、将来の実画像パスに近い命名へ寄せる。
- `src` のファイル名は被写体や場面が分かる `kebab-case.jpg` を使い、`example.jpg` や連番だけの仮名は避ける。
- このブロックは公開画面では非表示になる前提なので、本文に混ぜず独立行で置く。

## 8. ノイズ除去

公開前に、次の要素は例外なく削除対象とする。

- 画像関連の孤立行や画像キャプション
- `目次`、`すべて表示`、目次リスト
- 公式情報確認と無関係な外部誘導、SNS フォロー推奨、関連記事誘導だけの文
- `こんにちは` `いかがでしたか？` のような定型挨拶

## 9. 最終チェック

- 検索ノイズとして `目次` `画像` `ぜひ見て` などが残っていないか。
- 外部リンクがある場合、それが公式情報への導線か、不要な誘導かを判別できるか。
- `[[photo]]` ブロックで `alt` が空欄になっていないか。
- frontmatter がカテゴリ要件を満たしているか。
- `image` が未設定になっていないか。
- `location` が `src/data/region.ts` と一致しているか。
- `travelTopics` の付与が過不足なく、`tourism` に限定されているか。
- ファイル名と表記が命名規則に準拠しているか。
