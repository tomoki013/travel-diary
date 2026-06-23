# コンテンツ運用

## 記事の置き場所

- 公開記事: `posts/`
- 下書き: `draft-posts/`
- ルール: `draft-posts/rules/`

## 基本ルール

- 記事ルールの正本は `draft-posts/rules/OPERATIONS.md`（frontmatter・命名・出力先・内部リンク・公開前チェック）。
- 文体・構成・カテゴリ別の執筆方針といった編集ルールは廃止済み。`OPERATIONS.md` 以外のルールファイルは存在しない。

## frontmatter の主な項目

正確な型・必須/任意・使用タイミングは `draft-posts/rules/OPERATIONS.md` の frontmatter 表を正本とする。

- `title`（必須）
- `publishedAt` / `updatedAt` / `travelDates`（公開日・更新日・訪問日。3種を区別する）
- `category`（必須。`tourism` / `itinerary` / `series` / `one-off`）
- `excerpt` / `description`
- `heroImage`（必須） / `heroAlt`
- `regionIds`（`src/data/region.ts` の slug に一致させる）
- `series`（`category: series` で必須） / `journeyId`
- `costReport`（`category: itinerary`） / `promotionPrograms`（PR 記事）
- `tags`
- `travelTopics`（`category: tourism` のみ）
- `draft`

## 運用上の前提

- 地域指定は `src/data/region.ts` にある slug に合わせます。
- 記事一覧や関連記事は frontmatter を前提に構築されているため、空欄や不整合を作らないことを優先します。
- 記事編集時は `draft-posts/rules/` を先に確認します。
- 旅行予約・準備の導線は `/travel-essentials` に集約し、アフィリエイト方針の説明は `/affiliates` に分離します。
- `/travel-essentials` では `status: "ready"` の予約サービスだけを掲載し、未準備やリンク未設定の候補は表示しません。

## ビルドとの関係

- prebuild により記事キャッシュが生成されるため、記事追加・frontmatter 変更後は生成結果の確認が必要です。
