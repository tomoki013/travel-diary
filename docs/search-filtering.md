# 検索・絞り込み・並び替え

`/posts`（記事一覧）とヘッダーの検索オーバーレイで共通の検索体験を提供します。
タクソノミーと維持基準の source of truth は `src/data/searchFilters.ts` です。

## 構成

- **キーワード検索**: `SearchInput`（`/posts`）/ `SearchOverlay`（ヘッダー）。
- **絞り込み**: `FilterButton` を押すと `FilterModal` が開く。両画面で同じコンポーネントを共用。
  - `FilterButton` … 画面には「絞り込み」ボタンだけを置き、アクティブ件数をバッジ表示。
  - `FilterModal` … 内部に下書き state を持ち、**「適用」を押したときだけ**反映する（controlled）。
    背景クリック / Esc / × はキャンセル。
- **並び替え**: `/posts` の 3 ボタン（`sortOptions`）。

これらは `src/components/features/search/` 配下にまとまっています
（`FilterButton.tsx` / `FilterModal.tsx` / `FilterChipGroup.tsx` / `SearchOverlay.tsx`）。

## URL パラメータ（`/posts`）

| パラメータ | 値                            | 役割                                       |
| ---------- | ----------------------------- | ------------------------------------------ |
| `sort`     | `recommended` / `new` / `old` | 並び替え（表示順のみ）。既定は recommended |
| `category` | `PostType`                    | 記事カテゴリで絞り込み                     |
| `topic`    | `TravelTopic`                 | 実用ラベルで絞り込み（tourism に正規化）   |
| `lens`     | `all` / `practical` / `diary` | 記事タイプで絞り込み                       |
| `tags`     | カンマ区切り                  | タグで絞り込み（AND）                      |
| `region`   | リージョン slug               | 地域で絞り込み（地域ページ起点）           |
| `search`   | 文字列                        | キーワード検索                             |
| `page`     | 数値                          | ページ番号                                 |

- **後方互換**: 旧 `view`（`recommended`/`new`/`practical`/`diary`）リンクは
  `sort`/`lens` にマップする（`posts/page.tsx` の `resolveSortAndLens`）。
- 並び替えと絞り込みは責務を分ける: **sort は表示順だけ**、取捨選択は **filter（category/topic/lens/tags/region）** が行う。

## データ層

- 並び替え: `getSortedPosts(posts, sort)`（`src/lib/post-discovery.ts`）。
- 記事タイプ: `filterByLens(posts, lens)` / 述語 `isPracticalPost` `isDiaryPost`。
- タグ: `filterByTag`（`src/lib/post-filters.ts`）。
- 件数プレビュー: `FilterModal` が `/api/search`（`tags` / `lens` 対応）へ問い合わせ。取得失敗時は非表示。

## 維持基準

絞り込みに出す選択肢は次のルールで維持する（詳細は `src/data/searchFilters.ts` 冒頭コメント）。

- **カテゴリ / 実用ラベル**: `src/data/categories.ts` と 1:1。`PostType` / `TravelTopic` を増やしたときだけ追加。
- **記事タイプ（lens）**: `recommended` 全体 / `practical`（実用情報）/ `diary`（旅行記）。
  意味は `post-discovery.ts` の述語定義に追従する。
- **タグ（`FILTERABLE_TAGS`）**:
  1. 「再利用できる普遍的な旅テーマ」であること（地名・建造物名などの固有名詞は対象外）。
  2. 実データで **3 記事以上** に付与されていること。
  3. ほぼ全記事に付くタグ（例: 「海外旅行」）は絞り込みとして無意味なので除外。
  - 一回限りの固有名詞は **地域フィルタ / キーワード検索**で拾う。
  - 記事を追加・更新して基準を満たすタグが出たら、`FILTERABLE_TAGS` に手動で追記する。
  - `/posts` では `FILTERABLE_TAGS` のうち実在するものだけを候補にしている（`posts/page.tsx`）。
