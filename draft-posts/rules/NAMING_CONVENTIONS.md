# 命名規則と表記ルール (Naming & Notation)

## 1. ファイル名 (File Names)

### Markdown ファイル名規則

カテゴリやシリーズに応じ、全て小文字のケバブケース (`kebab-case.md`) で命名する。

| カテゴリ / シリーズ                | 命名規則                                    | 具体例                     |
| :--------------------------------- | :------------------------------------------ | :------------------------- |
| **`category: series` (連載)**      | スラッグ別の規則に従う（下記参照）          | `india1.md`, `sunset1.md`  |
| **`category: itinerary` (旅行記)** | `[地域]-itinerary.md`                       | `thai-itinerary.md`        |
| **`category: tourism` (観光)**     | `[キーワード].md` または `[地域]-[内容].md` | `airport-access-athens.md` |
| **`category: one-off` (単発)**     | `[内容キーワード].md`                       | `best-city-for-student.md` |

- **シリーズ別命名規則:**
  - `travel-diary`: `[国名][連番].md` (例: `india1.md`)
  - `travel-history`: `travel-history[連番].md`
  - `sunset`: `sunset[連番].md`
  - `landscape`: `landscape[連番].md`
  - `architecture`: `architecture[連番].md`
  - `kyoto`: `kyoto-view[連番].md`

### その他命名規則

- **言語:** 半角英数字のみ。日本語、全角文字、スペースは使用禁止。
- **slug:** Frontmatter の `slug` は、ファイル名（拡張子なし）と必ず一致させる。
- **画像:** 意味のわかる半角英数字 (例: `wat-arun-sunset.jpg`)。

## 2. 表記ルール (Notation)

### 数字・記号

- **数字:** 半角算用数字（1, 2, 3）を使用。
- **地名:** Googleマップの表記を基準とする。
- **通貨:** 「€5.5」「1,000円」のように記号と数字を併用する。

### 強調・装飾

- **Markdown:** `**太字**` で強調。
- **絵文字:** `⚠️` (警告), `💡` (ヒント), `✅` (完了) のみをアクセントとして使用。
