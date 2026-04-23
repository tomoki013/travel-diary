# コンテンツ運用

## 記事の置き場所

- 公開記事: `posts/`
- 下書き: `draft-posts/`
- ルール: `draft-posts/rules/`

## 基本ルール

- 共通基準は `EDITORIAL_BASELINE.md`
- カテゴリ意図は `CONTENT_STRATEGY.md`
- `series: travel-diary` は `TRAVEL_DIARY_RULES.md`

## frontmatter の主な項目

- `title`
- `dates`
- `category`
- `excerpt`
- `image`
- `location`
- `series`
- `journey`
- `tags`
- `travelTopics`
- `revenueCategory`

## 運用上の前提

- 地域指定は `src/data/region.ts` にある slug に合わせます。
- 記事一覧や関連記事は frontmatter を前提に構築されているため、空欄や不整合を作らないことを優先します。
- 記事編集時は `draft-posts/rules/` を先に確認します。
- 旅行予約・準備の導線は `/travel-essentials` に集約し、アフィリエイト方針の説明は `/affiliates` に分離します。
- `/travel-essentials` では `status: "ready"` の予約サービスだけを掲載し、未準備やリンク未設定の候補は表示しません。

## ビルドとの関係

- prebuild により記事キャッシュが生成されるため、記事追加・frontmatter 変更後は生成結果の確認が必要です。
