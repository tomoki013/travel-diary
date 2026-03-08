# メタデータ運用ルール (Frontmatter)

このプロジェクトのブログ記事で使用される全メタデータ（Frontmatter）の定義と運用ルールです。

## メタデータ一覧

| キー          | 型         | 必須/任意 | 説明                                        | 使用タイミング                                                   |
| :------------ | :--------- | :-------- | :------------------------------------------ | :--------------------------------------------------------------- |
| `title`       | `string`   | **必須**  | 記事のタイトル                              | 全記事共通                                                       |
| `dates`       | `string[]` | **必須**  | 日付（配列）。`["2024-03-10"]`              | 全記事共通                                                       |
| `category`    | `string`   | **必須**  | `tourism`, `itinerary`, `series`, `one-off` | 全記事共通                                                       |
| `excerpt`     | `string`   | 任意      | 記事の要約（100-150文字程度）               | 一覧・SEO用                                                      |
| `image`       | `string`   | 任意      | アイキャッチ画像のパス (`/images/...`)      | 全記事推奨                                                       |
| `tags`        | `string[]` | 任意      | 検索・フィルタリング用タグ（配列）          | 全記事共通                                                       |
| `location`    | `string[]` | 任意      | `src/data/region.ts` の `slug`（配列）      | 全記事共通                                                       |
| `author`      | `string`   | 任意      | 著者名（デフォルト: `ともきち`）            | 全記事共通                                                       |
| `id`          | `string`   | 任意      | 記事のユニークID                            | 管理上必要な場合                                                 |
| `budget`      | `number`   | 任意      | 旅行の総予算                                | `category: itinerary` の時のみ                                   |
| `costs`       | `Record`   | 任意      | 費用の内訳（JSON形式）                      | `category: itinerary` の時のみ                                   |
| `series`      | `string`   | 任意      | 連載シリーズのスラッグ（`series.ts` 参照）  | `category: series` の時のみ                                      |
| `journey`     | `string`   | 任意      | `journey.ts` の ID。行程表示用              | **`series: travel-diary` または `category: itinerary`** の時のみ |
| `isPromotion` | `boolean`  | 任意      | プロモーション（PR）記事か否か              | PR記事のみ                                                       |
| `promotionPG` | `string[]` | 任意      | プロモーションの種類やリンク情報            | PR記事のみ                                                       |

## 運用上の詳細ルール

### 1. category ごとの固有フィールド

- **itinerary (旅行記・行程):** `budget`, `costs`, `journey` を使用可能。
- **series (連載):** `series` が必須。また `series: travel-diary` の場合のみ `journey` を使用可能。

### 2. location (地域)

- **形式:** 配列形式で記述。
- **紐付け:** `src/data/region.ts` に定義されている `slug` と一致させる。

### 3. dates (日付)

- 1つ目が公開日または旅行開始日。2つ目以降がある場合は更新日として扱う。
