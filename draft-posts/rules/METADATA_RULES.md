# メタデータ運用ルール (Frontmatter)

このプロジェクトのブログ記事で使用される全メタデータ（Frontmatter）の定義と運用ルールです。

## メタデータ一覧

| キー           | 型         | 必須/任意 | 説明                                                           | 使用タイミング                                                   |
| :------------- | :--------- | :-------- | :------------------------------------------------------------- | :--------------------------------------------------------------- |
| `title`        | `string`   | **必須**  | 記事のタイトル                                                 | 全記事共通                                                       |
| `dates`        | `string[]` | **必須**  | 日付（配列）。`["2024-03-10"]`                               | 全記事共通                                                       |
| `category`     | `string`   | **必須**  | `tourism`, `itinerary`, `series`, `one-off`                    | 全記事共通                                                       |
| `excerpt`      | `string`   | 任意      | 記事の要約（100-150文字程度）                                  | 一覧・SEO用                                                      |
| `image`        | `string`   | 任意      | アイキャッチ画像のパス (`/images/...`)                         | 全記事推奨                                                       |
| `tags`         | `string[]` | 任意      | 検索・フリーワード導線用タグ（配列）                           | 全記事共通                                                       |
| `location`     | `string[]` | 任意      | `src/data/region.ts` の `slug`（配列）                         | 全記事共通                                                       |
| `author`       | `string`   | 任意      | 著者名（デフォルト: `ともきち`）                               | 全記事共通                                                       |
| `id`           | `string`   | 任意      | 記事のユニークID                                               | 管理上必要な場合                                                 |
| `budget`       | `number`   | 任意      | 旅行の総予算                                                   | `category: itinerary` の時のみ                                   |
| `costs`        | `Record`   | 任意      | 費用の内訳（JSON形式）                                         | `category: itinerary` の時のみ                                   |
| `series`       | `string`   | 任意      | 連載シリーズのスラッグ（`series.ts` 参照）                     | `category: series` の時のみ                                      |
| `journey`      | `string`   | 任意      | `journey.ts` の ID。行程表示用                                 | **`series: travel-diary` または `category: itinerary`** の時のみ |
| `travelTopics` | `string[]` | 任意      | 実用情報ラベル。`money`, `visa`, `transport`, `booking`, `sim`, `insurance` | 実用記事・比較記事・導線を明確にしたい記事                       |
| `isPromotion`  | `boolean`  | 任意      | プロモーション（PR）記事か否か                                 | PR記事のみ                                                       |
| `promotionPG`  | `string[]` | 任意      | プロモーションの種類やリンク情報                               | PR記事のみ                                                       |

## 運用上の詳細ルール

### 1. category ごとの固有フィールド

- **itinerary (旅行記・行程):** `budget`, `costs`, `journey` を使用可能。
- **series (連載):** `series` が必須。また `series: travel-diary` の場合のみ `journey` を使用可能。

### 2. location (地域)

- **形式:** 配列形式で記述。
- **紐付け:** `src/data/region.ts` に定義されている `slug` と一致させる。

### 3. dates (日付)

- 1つ目が公開日または旅行開始日。2つ目以降がある場合は更新日として扱う。

### 4. travelTopics（実用ラベル）

- **目的:** ブログ一覧・検索ダイアログで「お金・決済」「交通」「ビザ」「予約」などの実務情報を横断で見つけやすくするためのラベルです。
- **使い分け:** `category` は記事の形式、`travelTopics` は記事内で扱う実務テーマです。両者を混同しないでください。
- **複数付与:** 1記事に複数ラベルを付けて構いません。例: 空港アクセス記事に `transport`、空港到着後の両替説明が厚い記事に `transport` + `money`。
- **厳選付与:** 話題が少し触れているだけなら付与しません。記事の主要導線・見出し・比較軸として成立しているテーマだけを残してください。
- **推奨基準:**
  - `money`: 両替、現金、カード、QR決済、レート、支払い事情
  - `visa`: ビザ申請、入国条件、必要書類
  - `transport`: 空港アクセス、鉄道、バス、地下鉄、移動手段比較
  - `booking`: ホテル・鉄道・ツアー・航空券などの予約手順/比較
  - `sim`: SIM / eSIM / Wi‑Fi など通信準備
  - `insurance`: 海外旅行保険、補償、加入判断
