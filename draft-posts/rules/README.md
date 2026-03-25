# Blog Rules & Guidelines

このディレクトリは、ブログ記事の執筆、編集、変換、運用に関するルールの正本です。
AI はここにあるファイルを優先参照し、記事の種類に応じて必要なものだけを組み合わせて適用します。

## ルール体系

| ファイル名 | 役割 |
| :-- | :-- |
| `EDITORIAL_BASELINE.md` | 全記事共通の編集基準。文体、構成、誠実さ、鮮度管理、禁止事項。 |
| `CONTENT_STRATEGY.md` | カテゴリ別の目的と優先順位。`tourism` `itinerary` `series` `one-off` の書き分け。 |
| `TRAVEL_DIARY_RULES.md` | `series: travel-diary` の正本。粒度、構成、タイトル、取捨選択、締め方。 |
| `OPERATIONS.md` | frontmatter、命名、内部リンク、修正運用、公開前チェック。 |
| `SOURCE_CONVERSION.md` | Note など外部原稿をブログ記事へ再構成するための変換ルール。 |

## 適用順

### 新規執筆

1. `OPERATIONS.md` で frontmatter と命名を確認する。
2. `EDITORIAL_BASELINE.md` で全体方針を合わせる。
3. `CONTENT_STRATEGY.md` でカテゴリごとの目的を確認する。
4. `series: travel-diary` を書く場合は `TRAVEL_DIARY_RULES.md` を必ず適用する。

### 修正案件

1. `OPERATIONS.md` で出力先、内部リンク、公開前チェックを確認する。
2. `EDITORIAL_BASELINE.md` と `CONTENT_STRATEGY.md` で方向性を合わせる。
3. `series: travel-diary` の修正なら `TRAVEL_DIARY_RULES.md` で構成と密度を合わせる。
4. Note 原稿や外部原稿なら `SOURCE_CONVERSION.md` を先に通す。

### Source Conversion

1. `SOURCE_CONVERSION.md` で元原稿のノイズ除去と再構成方針を確認する。
2. 変換先カテゴリに合わせて `CONTENT_STRATEGY.md` を適用する。
3. `series: travel-diary` に落とし込む場合は `TRAVEL_DIARY_RULES.md` を正本とする。
4. 最後に `OPERATIONS.md` で frontmatter、命名、配置を確認する。

## 運用原則

- 旅行日記と情報記事を同じ温度で書かない。
- `travel-diary` の判断は `TRAVEL_DIARY_RULES.md` に一本化する。
- 人格表現は `series` では出してよいが、情報記事では抑える。
- `category` は記事形式、`travelTopics` は実用テーマとして運用する。
- 新規作成や修正結果は、必ず一旦 `draft-posts/` に出力する。
