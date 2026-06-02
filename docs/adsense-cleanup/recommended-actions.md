# AdSense再審査前 推奨アクション一覧

> 作成日: 2026-06-02
> 前提: 今回は調査のみ。ファイル削除・noindex実装・リダイレクト変更・記事リライトは別途実施。

---

## すぐ対応候補（実装コスト低・効果高）

| 対象 | 推奨対応 | 理由 | 実装前確認 |
|---|---|---|---|
| `/roadmap` | `layout.tsx` を新設して `metadata.robots.index = false` を追加 | サイトが未完成に見える文言あり。sitemap掲載中。noindexなし。 | `"use client"` ページのためpage.tsxへの直接metadata追加不可。`layout.tsx` 新設が必要。 |
| `/affiliates` | `metadata.robots.index = false` を追加（metadata exportを新設） | sitemap掲載中。アフィリエイト一覧ページとして収益目的ページに見えるリスクあり。 | metadata追加のみ。フッターのlegalリンクは維持。 |
| `/destination/osaka` など1記事のページ6件 | `generateMetadata` に記事数チェックを追加してnoindex化 | 記事1件のみ。ページとして薄い。対象: osaka, istanbul, sentosa, yogyakarta, seoul, brussels | 実装方法: `generateMetadata` 内で `posts.length <= 1` のときにnoindex返す。 |

---

## 記事対応候補（本人リライト前の準備）

以下をリライト優先リストとして運営者に提示する。

### A1（審査前に必ず処置）28件

**最優先（アフィリエイト色強）**:

| slug | 推奨対応 |
|---|---|
| trip_com-lounge-benefits | リライト（タイトルをサービス名から体験に変更。journeyId設定） |
| omio-reservation | リライト（冒頭を実体験から。アフィリエイト導線を末尾に限定） |

**最優先（文字数700字以下）**:

| slug | 字数 | 推奨対応 |
|---|---|---|
| introduce | 660 | 大幅加筆（管理者プロフィール・旅行経歴・ブログの目的） |
| why-travelers-dont-return | 716 | noindex化 or リライト（2,000字まで加筆） |
| developing-country-sunset | 821 | noindex化 or 特定の旅行体験に絞って書き直し |
| india5 | 828 | リライト（ガンジス川沐浴の体験を詳述） |
| sunset1 | 829 | noindex化 or リライト（夕景を見た状況・感情を追記） |
| india-street-food-tips | 905 | リライト（インドの屋台体験を具体的に） |
| china-alipay-useful | 917 | リライト（上海旅行でのAlipay体験を詳述） |

**journeyId未設定 + 実体験弱い**:

| slug | 推奨対応 |
|---|---|
| airport-access-kansai | リライト（関空利用体験を追記）or 削除検討 |
| exchange-rate | リライト（特定旅行の両替体験に紐付け） |
| malaysia-before-thailand | noindex化 or 体験ベースに書き直し |
| kyoto-view1 | noindex化 or 京都在住体験を前面に |

**体験弱い（SEO色が強いアクセス・ガイド系）**:

| slug | 推奨対応 |
|---|---|
| airport-access-athens | リライト（アテネ旅行時の実際の移動方法を入れる） |
| airport-access-santorini | リライト（サントリーニ到着時の体験を入れる） |
| howtoget-abusimbel-from-asuwan | リライト（実際にミニバスで行った経験を追記） |
| howtoget-mirador-del-valle | リライト（バスと徒歩両方試した体験を追記） |
| paris-navigo-easy | リライト（パリ旅行中の使用体験を入れる） |
| santorini-transportation | リライト（実際に使った移動手段の感想） |

**短い・体験弱い（旅行記シリーズ内）**:

| slug | 推奨対応 |
|---|---|
| turkey1 | リライト（イスタンブール初日の体験をもっと詳しく） |
| turkey3 | リライト（気球サンライズとエジプトへの移動を詳述） |
| egypt3 | リライト（ミニバスでアブシンベルへの体験を詳述） |
| hokkaido1 | リライト（札幌初日の体験を詳述） |
| india3 | リライト（ジャイプル＋寝台列車の体験を詳述） |
| india5 | リライト（ガンジス川体験を詳述） |
| bankok-sandaijiin | リライト（3寺院を回った体験を詳述） |
| route-of-arrival-to-arl-at-suvarnabhumi | リライト（ARL乗り換え動線の体験を入れる） |
| thai4 | リライト（テント泊の体験を詳述） |
| singapore3 | リライト（チャンギ空港での夜越しを詳述） |
| travel-history1 | リライト（バンコク到着時の感情を詳述） |
| changi-airport-liquids | リライト（液体持参体験を具体的に） |

---

### A2（できれば審査前に改善）27件

本人の判断で優先度を決めてよい。緊急性はA1より低い。

**SEO色を弱める（タイトル・excerpt）**:

- bangkok-tourism、india-visa、bathing-ganga、oia-sunset-guide、paris-subway、putra-mosque-ramadan-hours、vietnam-transit

**文字数補強**:

- arabic-number、batu-caves-guide、best-city-for-student、google-maps-bus-developing-countries、malaysia-night-vibes、paris-restraunt、putra-mosque-guide、santorini-tourism、shanghai-chagee-addict、thai-itinerary、wat-arun、wat-pho、wat-phra-kaew

**冒頭を体験から始める**:

- airport-access-donmuang、airport-access-suvarnabhumi、chaophraya-express、omio-reservation（重複だがA1寄り）、thai-traditional-massage

**体験表現を追加**:

- thai-transportation、thai5

---

## 保留候補

| 対象 | 保留理由 | 追加で確認すること |
|---|---|---|
| 国別・大陸別 destination ページ（`/destination/thailand` 等） | 記事が子地域に集中しており、国別ページの記事数が不明 | 実装を確認し、子地域の記事を集約しているか確認 |
| sitemap.xml の内容 | next-sitemap がnoindexページを自動除外しているか不明 | `pnpm build` 後に `public/sitemap.xml` を確認 |
| `/affiliates` の統合タイミング | `/editorial-policy` への統合は作業量が発生する | noindex追加後、AdSense審査後に実装 |
| `best-city-for-student`（コラム系A2） | journeyIdなしだがコラムとして独自視点あり | 本人が体験を追記できる記事か判断 |

---

## 審査前に見せない候補

| URL/記事 | 対応 | 理由 |
|---|---|---|
| `/roadmap` | noindex追加 | 未完成感のある文言。審査担当者にマイナス印象 |
| `/affiliates` | noindex追加 | アフィリエイト一覧ページ。収益化目的に見える |
| `/destination/osaka` 等1記事の都市ページ | noindex追加 | 薄いページ |
| `why-travelers-dont-return` | noindex推奨 | 716字。体験なし。审査リスク高 |
| `developing-country-sunset` | noindex推奨 | 821字。journeyIdなし |
| `sunset1` | noindex推奨 | 829字。体験記述弱い |
| `malaysia-before-thailand` | noindex推奨 | journeyIdなし。体験弱い。一般論 |
| `kyoto-view1` | noindex推奨 | journeyIdなし。体験弱い |

---

## 維持候補

以下は問題なし。AdSense審査においてもプラス評価が期待できる。

| URL/記事 | 理由 |
|---|---|
| `/about`、`/contact`、`/editorial-policy`、`/privacy`、`/terms`、`/cookie-policy`、`/faq` | E-E-A-T観点で重要なポリシー・自己紹介ページ群。内容充実。 |
| spain1–7 | 旅行記として自然。体験・感情が強く、4,000字超の充実した記事が複数。 |
| france1–3 | 体験ベースの旅行記。問題なし。 |
| india1, india6, india7 | 体験が強い。ガンジス川・路地・祭りと独自性あり。 |
| greece1, thailand1–3 | 体験ベースの旅行記。文字数も十分。 |
| china2, china3 | 体験ベース。2,000字以上。 |
| malaysia1–3 | 体験ベース。journeyIdあり。 |
| `/destination/bangkok`（26記事）、`/destination/paris`（9記事）等 | 記事数が多く、内部導線として価値がある。 |
| `/faq` | canonical設定あり。AdSense審査でサイトの使い方を説明する有用ページ。 |
| `/editorial-policy` | 執筆方針を丁寧に説明。E-E-A-T強化に貢献。 |

---

## 作業の順番（推奨）

### フェーズ1：実装作業（運営者以外が実施可能）

1. `/roadmap` にnoindex追加
2. `/affiliates` にnoindex追加
3. `/destination/[region]` に記事数1件以下のページへnoindex追加

### フェーズ2：記事評価・優先度確認（運営者が判断）

4. A1記事を上から確認し、リライトするか・noindexにするかを1件ずつ判断
5. noindex対象とする記事を決める（本人がリライトできない記事）

### フェーズ3：記事リライト（運営者が実施）

6. アフィリエイト色の強い2件（trip_com-lounge-benefits、omio-reservation）を最優先でリライト
7. 700字以下の短い記事を加筆 or noindex化
8. 主要導線に近いアクセス・ガイド系記事の冒頭を体験ベースに修正

### フェーズ4：サイト整備（審査申請前の最終確認）

9. sitemap.xml を確認し、noindexページが除外されていることを確認
10. `/about` ページの内容を確認し、運営者プロフィールが充実しているか確認
11. AdSense審査申請

---

## 調査の根拠

| 調査文書 | 内容 |
|---|---|
| `docs/adsense-cleanup/static-page-audit.md` | 固定ページ調査（/social, /roadmap, /travel-essentials, /affiliates, /request） |
| `docs/adsense-cleanup/noindex-inventory.md` | noindex設定の全洗い出し |
| `docs/adsense-cleanup/destination-series-audit.md` | 地域別・シリーズ別ページの薄さ調査 |
| `docs/adsense-cleanup/article-audit.md` | 記事105件の全評価 |
