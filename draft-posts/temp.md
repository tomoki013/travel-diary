---
# =====================================================================
# 記事テンプレート（temp.md）
# 新規記事を書くときはこのファイルをコピーして使う。
# draft: true を外すまで公開リストには含まれない。
# =====================================================================

# タイトル（必須）- 記事の見出しになる
title: 記事タイトルをここに書く

# 要約・抜粋（任意）- 一覧カード・SEO 説明文に使う。100〜150文字程度
excerpt: >-
  記事の要約をここに書く。検索結果や一覧ページに表示されるので
  読者が記事を開くかどうかを判断できる内容にする。

# SEO 用の短い説明文（任意）- excerpt と別に設定したい場合のみ
# 省略すると excerpt がそのまま使われる
# description: ここにSEO専用の説明文を書く

# 公開日（必須）- 旅行実施日またはコンテンツ基準日を YYYY-MM-DD 形式で
publishedAt: "2025-01-01"

# 更新日（任意）- 内容を大幅改訂した日。省略可
# updatedAt: "2025-06-01"

# 旅行期間（任意）- 実際に旅行した日付範囲
travelDates:
  start: "2025-01-01"
  # end は日帰りや単日の場合は省略してよい
  # end: "2025-01-05"

# カテゴリ（必須）- 以下の4種類から1つ選ぶ
#   tourism   : 特定の場所・体験・移動手段の実用情報
#   itinerary : 旅全体の旅程と費用まとめ
#   series    : 連載記事（旅行記・夕陽・建築など）
#   one-off   : 旅の考え方・エッセイ
category: tourism

# タグ（任意）- 検索・フリーワード導線用
tags:
  - 海外旅行

# アイキャッチ画像のパス（必須）- /images/ から始める
heroImage: /images/_photo-placeholder/example.jpg

# アイキャッチ画像の alt テキスト（任意）- 被写体が分かる簡潔な日本語
# heroAlt: バンコクのワット・アルンと夕陽

# 地域スラッグ配列（任意）- src/data/region.ts の slug と一致させる
# 国より都市・エリアの小さい単位を優先する。国と都市を併記しない。
regionIds:
  - bangkok

# 著者（任意）- 省略すると「ともきち」として扱われる
author: ともきち

# シリーズ（任意）- category: series の場合に必須
# series:
#   slug: travel-diary   # travel-diary / sunset / architecture / landscape / travel-history / kyoto
#   order: 1             # 省略可。指定しない場合は publishedAt 順で並ぶ

# 旅程 ID（任意）- src/data/journey.ts の ID と一致させる
# 旅程に紐づく記事には原則付与する
# journeyId: j-2025-01-01

# 費用レポート（任意）- category: itinerary でのみ使う
# costReport:
#   budget:                 # 事前想定予算（任意）
#     amount: 100000
#     currency: JPY
#   costs:                  # 実際の支出内訳
#     currency: JPY
#     items:
#       flight: 50000
#       hotel: 30000
#       food: 10000
#       transport: 5000
#       sightseeing: 3000
#       other: 2000

# プロモーションプログラム（任意）- PR記事の場合のみ設定する
# 記入すると記事上部にプロモーション告知が表示される
# promotionPrograms:
#   - Omio
#   - Trip.com

# 実用情報ラベル（任意）- category: tourism の記事にのみ付ける
# 主要導線・見出し・比較軸として成立しているテーマだけ記入する
# 使えるラベル: money / visa / transport / booking / sim / insurance
# travelTopics:
#   - transport

# 下書きフラグ（任意）- true のままだとビルドのメタデータに含まれない
draft: true
---

## 導入

（読者の疑問・課題・関心を1段落で置く）

（この記事で分かることを1段落で示す）

## 本文見出し

（内容）

## まとめ
