# 固定ページ AdSense審査前調査

> 調査日: 2026-06-02
> 目的: AdSense再審査前に見せるべきでないページ・対処が必要なページの洗い出し

---

## サマリー

| ページ | noindex | sitemap掲載 | navigation | footer | 推奨判定 |
|---|---|---|---|---|---|
| `/social` | **あり** | 未掲載（noindexのため） | なし | なし | **現状維持** |
| `/roadmap` | **なし** | **掲載中** | なし | なし | **noindex追加 + footer削除確認** |
| `/travel-essentials` | **あり** | 未掲載（noindexのため） | なし | footerあり | **現状維持（footer動線は検討）** |
| `/affiliates` | **なし** | **掲載中** | なし | **footerあり（legalセクション）** | **noindex追加 or legalページとして維持** |
| `/request` | **あり** | 未掲載（noindexのため） | なし | footerあり | **現状維持** |

---

## `/social` — 現状維持

### 実装確認

- **ファイル**: `src/app/(pages)/social/page.tsx`
- **noindex**: `robots: { index: false, follow: true }` → **設定済み**
- **sitemap**: noindexのため未掲載（next-sitemapが除外）
- **NAV_LINKS**: なし（`src/constants/navigation.tsx` の `NAV_LINKS` に含まれていない）
- **FOOTER**: なし（`FOOTER_CONTENTS_LIST`、`FOOTER_ABOUT_LIST`、`FOOTER_COMMUNITY_LIST`、`FOOTER_LEGAL_LIST` いずれにも含まれていない）
- **内部リンク**: 他ページからのリンクは不明だが、ナビ・フッター非掲載のため主要導線には存在しない

### 評価

noindex設定済み、フッター・ナビ非掲載。AdSense審査担当者がクロールで到達する可能性は低い。

### 推奨対応

**そのまま維持**。対応不要。

---

## `/roadmap` — **要対応（noindex追加 + 動線確認）**

### 実装確認

- **ファイル**: `src/app/(pages)/roadmap/page.tsx`
- **種別**: `"use client"` コンポーネント（Server Component ではない）
- **noindex**: **設定なし** — `metadata` export 自体が存在しない
- **sitemap**: **掲載中**（除外設定なし、noindexもないため）
- **NAV_LINKS**: なし
- **FOOTER**: なし（`FOOTER_ABOUT_LIST` 等に含まれていない）
- **内部リンク**: 他ページからのリンクは不明

### 問題のある文言

ページ内に以下の未完成感・開発中感を連想させる文言が存在する。

```
"Future Roadmap"
"これからの冒険の計画"
"To Be Continued..."
"旅はまだ始まったばかり。"
```

これらはAdSense審査担当者に「このサイトはまだ開発中・未完成」という印象を与えるリスクがある。

### AdSense審査上のリスク

- ページが検索インデックスされている可能性がある
- sitemapに掲載されているため、GoogleのクローラーとAdSense審査担当者が到達しやすい
- 「未完成サイト」「開発中サイト」と判断される懸念が高い

### 推奨対応

1. **noindex追加（最優先）**: `page.tsx` を Server Component に変更するか、`layout.tsx` を追加して `metadata.robots.index = false` を設定する
2. **sitemapから除外**: noindex追加後、next-sitemapが自動除外する（または `next-sitemap.config.js` の `exclude` に追加）
3. **フッター・ナビからのリンクなし**: 現状問題なし

**実装前確認**: `"use client"` のため、metadata を追加するには `layout.tsx` を新設するか、ファイル構造を変更する必要あり。

---

## `/travel-essentials` — 現状維持（footer動線は低リスク）

### 実装確認

- **ファイル**: `src/app/(pages)/travel-essentials/page.tsx`
- **noindex**: `robots: { index: false, follow: true }` → **設定済み**
- **sitemap**: noindexのため未掲載
- **NAV_LINKS**: なし
- **FOOTER**: `FOOTER_ABOUT_LIST` に `{ name: "旅行予約・準備", pass: "/travel-essentials" }` として存在

### 掲載サービス（`status: "ready"` のもの）

アフィリエイトリンクが設定されているサービス:

| サービス名 | カテゴリ |
|---|---|
| Trip.com | flight / hotel / train |
| Klook | activity |
| GetYourGuide | activity |
| Omio | transport |
| 一休.com | hotel |

掲載候補（`status: "pending"`、アフィリエイトURL未設定）:
- Booking.com、Airbnb、SkyScanner、Trifa — URLが `YOUR_AFFILIATE_LINK_HERE` のまま

### 評価

- noindex済みのためGoogleのインデックスには入らない
- AdSense審査担当者が直接このページを評価する可能性は低い
- ただし、フッターリンクからたどり着ける状態ではある
- `status: "pending"` のサービスは表示されていないため、未完成の見た目にはなっていない

### 推奨対応

**noindexのまま維持**。フッターの動線は低リスク。

**将来的な検討**: AdSense審査後、`/about` や記事内の案内に統合してページ自体を廃止することも選択肢。現段階では現状維持が安全。

---

## `/affiliates` — **要検討（noindex追加 推奨）**

### 実装確認

- **ファイル**: `src/app/(pages)/affiliates/page.tsx`
- **noindex**: **設定なし** — `metadata` export が存在しない
- **sitemap**: **掲載中**（除外設定なし）
- **NAV_LINKS**: なし
- **FOOTER**: `FOOTER_LEGAL_LIST` に `{ name: "アフィリエイトポリシー", pass: "/affiliates" }` として存在

### 内容確認

- アフィリエイトポリシーの説明文（収益化していることの明示）
- `status: "ready"` のアフィリエイトプログラム一覧へのリンク（Trip.com、Klook、GetYourGuide、Omio、一休.com）
- `/editorial-policy` の「広告・アフィリエイトとの関係」セクションで内容が一部重複

### AdSense審査上の懸念

- sitemapに掲載されているため、審査担当者が到達しやすい
- ページがアフィリエイトサービス一覧と説明文のみで構成されており、「収益化が目的のページ」として見られるリスクがある
- `/editorial-policy` に同様の内容があるため、重複している

### 推奨対応

以下の2択。

**案A（推奨）: noindex追加**
- `metadata.robots.index = false` を追加する
- フッターの legalリンクとして存在は維持する（削除しない）
- AdSense審査担当者からは見えなくなる

**案B: `/editorial-policy` に統合**
- `/editorial-policy` の「広告・アフィリエイトとの関係」セクションを充実させ、`/affiliates` の内容を吸収する
- `/affiliates` は 301リダイレクト（`/editorial-policy`向け）にする
- フッターのリンクは `/editorial-policy` に変更する

**現段階ではAを推奨**（統合はVercel移行後の実装で行う）。

---

## `/request` — 現状維持

### 実装確認

- **ファイル**: `src/app/(pages)/request/page.tsx`
- **noindex**: `robots: { index: false, follow: true }` → **設定済み**
- **sitemap**: noindexのため未掲載
- **NAV_LINKS**: なし
- **FOOTER**: `FOOTER_COMMUNITY_LIST` に `{ name: "記事テーマ募集", pass: "/request" }` として存在

### 評価

noindex設定済み。フッターからのリンクのみ。AdSense審査には直接影響しない。

### 推奨対応

**そのまま維持**。対応不要。

---

## 調査2補足：ナビゲーション・フッター構造

`src/constants/navigation.tsx` 確認。

### ヘッダーナビゲーション（NAV_LINKS）

```
/ → Home
/posts → Blog  
/gallery → Gallery
/destination → Destination
/contact → Contact
/about → About
```

問題のあるページはヘッダーナビに存在しない。

### フッター

| セクション | ページ |
|---|---|
| コンテンツ | /posts, /gallery, /destination, /series, /journey, /map |
| サイトについて | /about, /travel-essentials, /sitemap |
| コミュニティ | /faq, /contact, /request |
| Legal | /privacy, /terms, **/affiliates**, /editorial-policy, /cookie-policy |

**要確認**: `/affiliates` がフッターのlegalセクションにある。noindex追加後もフッターリンクは維持してよい（legalページとして必要）。

---

## すぐ対応が必要なもの

| 対象 | 対応 | 実装難易度 |
|---|---|---|
| `/roadmap` | noindex追加（layout.tsx新設 or ファイル構造変更） | 低 |
| `/affiliates` | noindex追加（metadata export 追加） | 低 |
