# Blog Rules & Guidelines

このディレクトリには、ブログ記事の執筆、編集、およびメタデータ管理に関するルールをまとめています。
AI はこのルール群を「絶対的規範」として扱い、記事の種類に応じて必要なファイルを組み合わせて適用します。

## ファイル構成

| ファイル名                         | 役割 |
| :--------------------------------- | :--- |
| **`WRITING_GUIDELINES.md`**        | **全記事共通の基本原則。** 構成、文体、誠実さ、情報鮮度などの総論。 |
| **`CONTENT_TYPE_GUIDELINES.md`**   | **カテゴリ別の書き分け。** `tourism` / `itinerary` / `series` / `one-off` の目的と優先順位。 |
| **`PERSONA_RULES.md`**             | **デフォルト語り手の設計。** 主に travel-diary / series 系で使う人格、感情、口調、価値観。 |
| **`REVISION_RULES.md`**            | **修正専門ルール。** 既存下書きや外部テキストをブログ向けに整形・再構成する手順。 |
| **`NOTE_CONVERSION_RULES.md`**     | **Note変換専門ルール。** Note 特有のノイズや埋め込みを除去するための特化ルール。 |
| **`METADATA_RULES.md`**            | **メタデータ運用ルール。** Frontmatter の型、必須項目、カテゴリ別の定義。 |
| **`NAMING_CONVENTIONS.md`**        | **命名・表記ルール。** ファイル名、slug、数字、記号、地名表記の統一。 |
| **`README.md`**                    | (本ファイル) ルール全体の概要と適用順。 |

## 適用フロー

### 新規執筆

1. `METADATA_RULES.md` と `NAMING_CONVENTIONS.md` を確認する。
2. `WRITING_GUIDELINES.md` で全体方針を合わせる。
3. `CONTENT_TYPE_GUIDELINES.md` でカテゴリごとの書き分けを確認する。
4. `series` など人格が重要な記事では `PERSONA_RULES.md` を適用する。
5. 必要なら `REVISION_RULES.md` で仕上げのチェックを行う。

### 修正案件

1. `REVISION_RULES.md` を起点にする。
2. 必要に応じて `WRITING_GUIDELINES.md` と `CONTENT_TYPE_GUIDELINES.md` で方向性を合わせる。
3. Note 原稿なら `NOTE_CONVERSION_RULES.md` を先に通す。

## 運用方針

- **旅行日記と情報記事を分ける:** 同じ文体・同じ温度で全カテゴリを書かない。
- **人格は必要な場面だけ使う:** 情報記事では抑え、series ではしっかり出す。
- **旅行以外にも広げる:** one-off などでは、旅行ブログ由来の誠実さと構造化を保ちながら、テーマ拡張に対応する。
