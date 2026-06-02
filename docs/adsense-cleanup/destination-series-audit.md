# 地域別ページ・シリーズ別ページ 薄さ調査

> 調査日: 2026-06-02
> 対象: `/destination` 配下の全地域ページ、`/series` 配下の全シリーズページ

---

## シリーズページ（`/series/*`）

### 重要前提

**`/series` および `/series/[slug]` はすでに `noindex: true` 設定済み**。AdSense審査担当者がクロールしても評価対象にならない。薄さ問題は審査上の懸念にならない。

### シリーズ一覧

`src/data/series.ts` で定義されている `featuredSeries` のシリーズと、対応する記事数（category: series の記事を `series.slug` でフィルタ）。

| URL | シリーズ名 | 記事数（推定） | 固有説明 | noindex | 判定 | 推奨対応 |
|---|---|---|---|---|---|---|
| `/series/travel-diary` | 旅行日記 | 多数（タイ・インド・スペイン等シリーズ全体） | あり | **あり** | 問題なし | 維持 |
| `/series/travel-history` | ともきちの海外旅行遍歴 | 2（travel-history1, travel-history2） | あり | **あり** | 記事数は少ないがnoindex済み | 維持 |
| `/series/sunset` | 世界の夕陽から | 1（sunset1） | あり | **あり** | 記事数少だがnoindex済み | 維持 |
| `/series/landscape` | 世界の絶景・街並み編 | 1（landscape1） | あり | **あり** | 記事数少だがnoindex済み | 維持 |
| `/series/architecture` | 世界の絶景・建築編 | 2（architecture1, architecture2） | あり | **あり** | noindex済み | 維持 |
| `/series/kyoto` | 京都の景色 | 1（kyoto-view1） | あり | **あり** | noindex済み | 維持 |

**結論**: シリーズページ全体がnoindex。AdSense審査上の懸念なし。内容の改善はAdSense審査後でよい。

---

## 地域別ページ（`/destination/[region]`）

### 重要前提

**`/destination/[region]` はnoindex設定なし → インデックス対象**。薄いページがあるとAdSense審査で低品質コンテンツと評価されるリスクがある。

ただし、各地域ページには「固有の説明文」があるかどうか、記事数が十分かどうかが判断基準になる。

### 判定基準

- 記事数3件以上 + 固有説明あり → **index維持**
- 記事数2件 + テーマ性が明確 → **維持**
- 記事数1件 + 説明が薄い → **noindex候補**
- 記事数0件 → **ページ生成しない**（`dynamicParams = false` + `generateStaticParams` で制御）

### 都市別ページ（記事数が多い順）

| URL | 地域名 | 記事数 | 固有説明 | noindex | 判定 | 推奨対応 |
|---|---|---|---|---|---|---|
| `/destination/bangkok` | バンコク | **26** | あり | なし | **index維持** | 問題なし |
| `/destination/paris` | パリ | 9 | なし（要確認） | なし | **index維持** | 固有説明追加推奨 |
| `/destination/madrid` | マドリード | 8 | あり | なし | **index維持** | 問題なし |
| `/destination/santorini` | サントリーニ | 7 | なし（要確認） | なし | **index維持** | 固有説明追加推奨 |
| `/destination/toledo` | トレド | 7 | あり（region.tsに記述あり） | なし | **index維持** | 問題なし |
| `/destination/kuala-lumpur` | クアラルンプール | 7 | なし（要確認） | なし | **index維持** | 固有説明追加推奨 |
| `/destination/barcelona` | バルセロナ | 6 | あり（region.tsに記述あり） | なし | **index維持** | 問題なし |
| `/destination/varanasi` | バラナシ | 6 | なし（要確認） | なし | **index維持** | 固有説明追加推奨 |
| `/destination/shanghai` | 上海 | 6 | なし（要確認） | なし | **index維持** | 固有説明追加推奨 |
| `/destination/athens` | アテネ | 4 | なし（要確認） | なし | **index維持** | 固有説明追加推奨 |
| `/destination/cappadocia` | カッパドキア | 4 | なし（要確認） | なし | **index維持** | 固有説明追加推奨 |
| `/destination/cairo` | カイロ | 4 | なし（要確認） | なし | **index維持** | 固有説明追加推奨 |
| `/destination/changi` | チャンギ（空港） | 4 | なし | なし | **維持** | 空港エリアとして特殊だが記事数は十分 |
| `/destination/putrajaya` | プトラジャヤ | 4 | なし | なし | **index維持** | 問題なし |
| `/destination/kyoto` | 京都 | 3 | なし（要確認） | なし | **維持** | 固有説明追加推奨 |
| `/destination/giza` | ギザ | 3 | なし | なし | **維持** | 問題なし |
| `/destination/abu-simbel` | アブシンベル | 3 | なし | なし | **維持** | 問題なし |
| `/destination/aswan` | アスワン | 3 | なし | なし | **維持** | 問題なし |
| `/destination/hanoi` | ハノイ | 3 | なし | なし | **維持** | 問題なし |
| `/destination/jaipur` | ジャイプル | 3 | なし | なし | **維持** | 問題なし |
| `/destination/seminyak` | スミニャック | 2 | なし | なし | **維持** | 記事数は少ないが問題なし |
| `/destination/hokkaido` | 北海道 | 2 | なし | なし | **維持** | 問題なし |
| `/destination/new-delhi` | ニューデリー | 2 | なし | なし | **維持** | 問題なし |
| `/destination/agra` | アグラ | 2 | なし | なし | **維持** | 問題なし |
| `/destination/singapore-city` | シンガポール市内 | 2 | なし | なし | **維持** | 問題なし |
| `/destination/osaka` | 大阪 | **1** | なし | なし | **noindex候補** | 空港アクセス記事1件のみ。内容が薄い |
| `/destination/istanbul` | イスタンブール | **1** | なし | なし | **noindex候補** | 旅行記1日分のみ。ページとして薄い |
| `/destination/sentosa` | セントーサ島 | **1** | なし | なし | **noindex候補** | 旅行記1件のみ。ページとして薄い |
| `/destination/yogyakarta` | ジョグジャカルタ | **1** | なし | なし | **noindex候補** | 旅行記1件のみ。ページとして薄い |
| `/destination/seoul` | ソウル | **1** | なし | なし | **noindex候補** | 通過地点の1記事のみ。ページとして薄い |
| `/destination/brussels` | ブリュッセル | **1** | なし | なし | **noindex候補** | 帰国時の通過地点のみ。ページとして薄い |

### 国別・大陸別ページ

国別・大陸別ページは、その配下の都市の記事を集約して表示する可能性がある（実装確認が必要）。

| URL | 地域名 | 備考 |
|---|---|---|
| `/destination/asia` | アジア | 大陸レベル。記事多数 |
| `/destination/europe` | ヨーロッパ | 大陸レベル。記事多数 |
| `/destination/africa` | アフリカ | 大陸レベル。エジプト記事あり |
| `/destination/thailand` | タイ | 国レベル。バンコク記事が多い |
| `/destination/india` | インド | 国レベル。`regionIds: [india]` の記事は少ない（india-visa、india-street-food-tips） |
| `/destination/spain` | スペイン | 国レベル。`regionIds: [spain]` の記事は少ない（omio-reservation） |
| `/destination/egypt` | エジプト | 国レベル。`regionIds: [egypt]` の記事は少ない（arabic-number、exchange-rate のeygpt） |
| `/destination/japan` | 日本 | 国レベル。`regionIds: [japan]` の記事は少ない（exchange-rate） |

**国別・大陸別ページの懸念**: 都市レベルの記事を集約できていない場合、国別ページが薄く見える可能性がある。実装を確認し、子地域の記事も含めて表示できているか確認推奨。

---

## noindex候補の詳細

以下の6ページはnoindex推奨。記事が1件のみで、ページとして薄い。

| URL | 記事数 | 理由 |
|---|---|---|
| `/destination/osaka` | 1 | 空港アクセス1記事のみ。観光地ガイドとして薄い |
| `/destination/istanbul` | 1 | 旅行記1日分のみ。1ページの街としては薄い |
| `/destination/sentosa` | 1 | シンガポール旅行記の1日のみ |
| `/destination/yogyakarta` | 1 | インドネシア旅行記の1日のみ |
| `/destination/seoul` | 1 | ソウル経由の1記事のみ（フランス旅行記の通過点） |
| `/destination/brussels` | 1 | 帰国時のブリュッセル経由のみ |

**実装方法**: `generateStaticParams` でこれらのslugを除外するか、`generateMetadata` で記事数が1件以下の場合にnoindexを返すロジックを追加する。

---

## `region.ts` の固有説明が設定されているページ

`src/data/region.ts` を確認したところ、以下のページに `description` フィールドが設定されている（=固有の説明文が表示される）。

| 地域 | description の有無 |
|---|---|
| タイ（thailand） | あり |
| バンコク（bangkok） | あり |
| バルセロナ（barcelona） | あり |
| マドリード（madrid） | あり |
| トレド（toledo） | あり |

それ以外のほとんどの地域は `description` フィールドなし。地域ページの説明文がテンプレートや空になっている場合は AdSense 審査で「テンプレートページ」と見なされるリスクがある。

**推奨**: 記事数が多い地域（パリ、サントリーニ、クアラルンプール等）に `description` を追加する。これはAdSense審査後の対応でよい。

---

## 優先対応まとめ

| 対象 | 推奨対応 | 実装難易度 |
|---|---|---|
| `/destination/osaka` 等（1記事のみの6ページ） | noindex追加 | 中（動的メタデータ生成に条件追加） |
| 国別ページの集約実装確認 | 実装確認のみ（対応なし） | — |
| `region.ts` への固有説明追加 | 審査後に対応 | 低（データ追記のみ） |
