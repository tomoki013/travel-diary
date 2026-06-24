# 全記事リライト トリアージ表（作業用・一時ドキュメント）

> 全公開記事105本のリライト campaign 用の仕分け＋進捗シート。
> campaign 完了後に削除する想定。記事ルールの正本は `draft-posts/rules/OPERATIONS.md`。

## 目標の文体（記事タイプで使い分け／サンプルで確定済み）

- **diary / series**（travel-diary・sunset・landscape・architecture・kyoto・travel-history）: **標準語寄りの軽い口語＋関西の風味を控えめに（弱め）**。
  - ベース: カジュアルな常体（〜だった／〜と思う／〜してしまった／〜なんだ）。
  - 関西の風味は控えめに散らす（めっちゃ／ええ／〜ちゃう／〜やな等を要所のみ）。常体に振りすぎない。
  - 一人称は「自分」。感嘆符・煽りは抑える。
  - 確定サンプル: `draft-posts/thai1.md`（A）, `draft-posts/egypt1.md`（B）。
- **tourism / itinerary**: 丁寧な です・ます調を維持。**落ち着いた誠実トーン**（過剰な煽り・！・「衝撃の/最強の」等は抑制）。
  - 確定サンプル: `draft-posts/bangkok-localbus.md`（C）。
- **one-off**: 内容に応じて（基本は です・ます、整っていれば維持）。

## 分類の定義

| 区分                   | 意味                                                                                                   | 主な根拠                                      |
| :--------------------- | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------- |
| **A 完全リライト**     | 構成から作り直す。Note体質（1文1段落の改行過多）、本文中への画像直挿し・内部リンク直挿し、語尾不統一。 | 2024年の初期記事に集中。レガシー痕跡(L)多め。 |
| **B 文体のみ／中程度** | 構成は概ね妥当。目標の声へ寄せ、語尾統一・軽い整理を行う。                                             | 2025年以降の diary/series、2024年の tourism。 |
| **C 維持／軽微**       | ほぼ完成。誤字・表記ゆれ・声の微調整のみ。                                                             | 2025年中盤以降の clean な tourism / one-off。 |

> 一次判定は「公開日・分量・レガシー痕跡・スポット精読」からの**仮置き**。精読が要るものは「要精読」と明記。あなたが「判定(赤入れ)」列を上書きしてください。

## 進捗ステータス

`未着手` → `下書き(draft-posts)` → `レビュー中` → `反映済(posts)`

---

## A) 2024年初期（Note体質エラー世代）

| file                   | cat       | series       | 公開日     | 字数 |   L | 一次判定 | 根拠                                                                   | 判定(赤入れ) | 状態               |
| :--------------------- | :-------- | :----------- | :--------- | ---: | --: | :------: | :--------------------------------------------------------------------- | :----------: | :----------------- |
| introduce.md           | series    | travel-diary | 2024-01-03 | 2465 |   0 |    B     | 自己紹介/入口ページ。clean。声の方針を要確認(です・ます維持 vs 関西弁) |    要確認    | 未着手(現状維持中) |
| hokkaido1.md           | series    | travel-diary | 2024-02-27 | 5343 |   2 |    A     | 初期世代                                                               |      A       | 反映済(posts)      |
| hokkaido2.md           | series    | travel-diary | 2024-02-28 | 6436 |   6 |    A     | 初期世代・レガシー多                                                   |      A       | 反映済(posts)      |
| thai1.md               | series    | travel-diary | 2024-03-01 | 8895 |   4 |    A     | 精読済:Note体質・画像直挿し                                            |      A       | 反映済(posts)      |
| thai2.md               | series    | travel-diary | 2024-03-02 | 6917 |   2 |    A     | 初期世代                                                               |      A       | 反映済(posts)      |
| thai3.md               | series    | travel-diary | 2024-03-03 | 5885 |   1 |    A     | 初期世代                                                               |      A       | 反映済(posts)      |
| thai-itinerary.md      | itinerary | -            | 2024-03-01 | 6235 |   0 |    B     | 行程表                                                                 |      B       | 反映済(posts)      |
| wat-arun.md            | tourism   | -            | 2024-03-02 | 4614 |   0 |    B     | 2024 tourism                                                           |      B       | 反映済(posts)      |
| wat-pho.md             | tourism   | -            | 2024-03-03 | 4880 |   0 |    B     | 2024 tourism                                                           |      B       | 反映済(posts)      |
| wat-phra-kaew.md       | tourism   | -            | 2024-03-03 | 5169 |   0 |    B     | 2024 tourism                                                           |      B       | 反映済(posts)      |
| bankok-sandaijiin.md   | tourism   | -            | 2024-03-03 | 4068 |   0 |    B     | 2024 tourism                                                           |      B       | 反映済(posts)      |
| thai-transportation.md | tourism   | -            | 2024-03-03 | 8797 |   0 |    B     | 2024 tourism                                                           |      B       | 反映済(posts)      |

## A) 2024秋（インド・ベトナム世代）

| file               | cat     | series       | 公開日     |  字数 |   L | 一次判定 | 根拠                                 | 判定(赤入れ) | 状態                               |
| :----------------- | :------ | :----------- | :--------- | ----: | --: | :------: | :----------------------------------- | :----------: | :--------------------------------- |
| india-visa.md      | tourism | -            | 2024-09-20 | 26245 |   0 |    B     | 精読の結果ほぼ完成=実質C。声変更不要 |      C       | posts直修正(エスケープ崩れ1行のみ) |
| vietnam-transit.md | tourism | -            | 2024-09-24 |  4128 |   0 |    B     | 2024 tourism                         |      B       | 反映済(posts)                      |
| vietnam1.md        | series  | travel-diary | 2024-09-24 |  5690 |   1 |    A     | 初期世代                             |      A       | 反映済(posts)                      |
| india1.md          | series  | travel-diary | 2024-09-25 | 13680 |   3 |    A     | 初期世代・長文                       |      A       | 反映済(posts)                      |
| india2.md          | series  | travel-diary | 2024-09-26 |  6715 |   3 |    A     | 初期世代                             |      A       | 反映済(posts)                      |
| india3.md          | series  | travel-diary | 2024-09-27 |  4913 |   3 |    A     | 初期世代                             |      A       | 反映済(posts)                      |
| india4.md          | series  | travel-diary | 2024-09-28 |  5614 |   1 |    A     | 初期世代                             |      A       | 反映済(posts)                      |
| india5.md          | series  | travel-diary | 2024-09-28 |  3032 |   1 |    A     | 初期世代                             |      A       | 反映済(posts)                      |
| india6.md          | series  | travel-diary | 2024-09-29 |  6080 |   1 |    A     | 初期世代                             |      A       | 反映済(posts)                      |
| india7.md          | series  | travel-diary | 2024-09-30 |  5893 |   1 |    A     | 初期世代                             |      A       | 反映済(posts)                      |
| bathing-ganga.md   | tourism | -            | 2024-09-29 |  3549 |   0 |    B     | 2024 tourism                         |      B       | 反映済(posts)                      |

## B) 2025-02 ヨーロッパ（フランス・スペイン）

| file                            | cat       | series       | 公開日     |  字数 |   L | 一次判定 | 根拠                                     | 判定(赤入れ) | 状態          |
| :------------------------------ | :-------- | :----------- | :--------- | ----: | --: | :------: | :--------------------------------------- | :----------: | :------------ |
| europe-itinerary.md             | itinerary | -            | 2025-02-13 | 18929 |  15 |    B     | 完成度高=実質維持。L高は行程表の日付特性 |      B       | 反映済(posts) |
| france1.md                      | series    | travel-diary | 2025-02-14 |  7870 |   1 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| france2.md                      | series    | travel-diary | 2025-02-15 | 12724 |   2 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| france3.md                      | series    | travel-diary | 2025-02-16 |  7512 |   1 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| spain1.md                       | series    | travel-diary | 2025-02-18 |  8271 |   1 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| spain2.md                       | series    | travel-diary | 2025-02-19 |  9289 |   1 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| spain3.md                       | series    | travel-diary | 2025-02-20 |  6794 |   0 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| spain4.md                       | series    | travel-diary | 2025-02-21 | 10779 |   1 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| spain5.md                       | series    | travel-diary | 2025-02-23 | 13034 |   2 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| spain6.md                       | series    | travel-diary | 2025-02-24 | 12104 |   2 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| spain7.md                       | series    | travel-diary | 2025-02-25 |  9863 |   1 |    B     | 声寄せ                                   |      B       | 反映済(posts) |
| paris-navigo-easy.md            | tourism   | -            | 2025-02-14 |  9224 |   1 |    C     | 2025 tourism                             |              | 未着手        |
| paris-subway.md                 | tourism   | -            | 2025-02-14 |  9178 |   0 |    C     | 2025 tourism                             |              | 未着手        |
| paris-restraunt.md              | tourism   | -            | 2025-02-20 |  3551 |   1 |    C     | ※ファイル名typo(restraunt)               |              | 未着手        |
| omio-reservation.md             | tourism   | -            | 2025-02-22 |  7179 |   0 |    C     | 2025 tourism                             |              | 未着手        |
| howtoget-mirador-del-valle.md   | tourism   | -            | 2025-02-24 |  7943 |   0 |    C     | 2025 tourism                             |              | 未着手        |
| ashumina-pilgrimage-in-spain.md | tourism   | -            | 2025-02-27 |  5873 |   2 |    C     | 要確認                                   |              | 未着手        |
| spain-restaurant.md             | tourism   | -            | 2025-02-27 |  6162 |   1 |    C     | 2025 tourism                             |              | 未着手        |

## C) 2025-06 タイ再訪・トルコ・エジプト・ギリシャ

| file                                       | cat     | series       | 公開日     |  字数 |   L | 一次判定 | 根拠                   | 判定(赤入れ) | 状態          |
| :----------------------------------------- | :------ | :----------- | :--------- | ----: | --: | :------: | :--------------------- | :----------: | :------------ |
| thai4.md                                   | series  | travel-diary | 2025-06-10 |  5366 |   1 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| thai5.md                                   | series  | travel-diary | 2025-06-11 |  6209 |   1 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| thai6.md                                   | series  | travel-diary | 2025-06-12 |  5577 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| turkey1.md                                 | series  | travel-diary | 2025-06-13 |  5164 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| turkey2.md                                 | series  | travel-diary | 2025-06-14 |  5766 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| turkey3.md                                 | series  | travel-diary | 2025-06-16 |  5708 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| egypt1.md                                  | series  | travel-diary | 2025-06-17 |  5953 |   0 |    B     | 声サンプル             |      B       | 反映済(posts) |
| egypt2.md                                  | series  | travel-diary | 2025-06-18 |  6305 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| egypt3.md                                  | series  | travel-diary | 2025-06-20 |  5395 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| egypt4.md                                  | series  | travel-diary | 2025-06-21 |  5951 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| greece1.md                                 | series  | travel-diary | 2025-06-22 |  6629 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| greece2.md                                 | series  | travel-diary | 2025-06-24 |  5693 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| greece3.md                                 | series  | travel-diary | 2025-06-26 |  6446 |   0 |    B     | 声寄せ                 |      B       | 反映済(posts) |
| airport-access-donmuang.md                 | tourism | -            | 2025-06-10 |  8816 |   0 |    C     | clean tourism          |              | 未着手        |
| thai-traditional-massage.md                | tourism | -            | 2025-06-11 |  7763 |   0 |    C     | clean tourism          |              | 未着手        |
| airport-access-suvarnabhumi.md             | tourism | -            | 2025-06-12 |  9837 |   0 |    C     | clean tourism          |              | 未着手        |
| bangkok-localbus.md                        | tourism | -            | 2025-06-12 |  8930 |   0 |    C     | 声サンプル(です・ます) |      C       | 反映済(posts) |
| bangkok-tourism.md                         | tourism | -            | 2025-06-12 | 18344 |   1 |    C     | 大型まとめ。要確認     |              | 未着手        |
| chaophraya-express.md                      | tourism | -            | 2025-06-12 | 10153 |   0 |    C     | clean tourism          |              | 未着手        |
| route-of-arrival-to-arl-at-suvarnabhumi.md | tourism | -            | 2025-06-12 |  6020 |   0 |    C     | clean tourism          |              | 未着手        |
| arabic-number.md                           | tourism | -            | 2025-06-17 |  4394 |   0 |    C     | clean tourism          |              | 未着手        |
| howtoget-abusimbel-from-asuwan.md          | tourism | -            | 2025-06-20 |  7960 |   0 |    C     | clean tourism          |              | 未着手        |
| airport-access-athens.md                   | tourism | -            | 2025-06-22 |  7770 |   0 |    C     | clean tourism          |              | 未着手        |
| airport-access-santorini.md                | tourism | -            | 2025-06-25 |  6819 |   0 |    C     | clean tourism          |              | 未着手        |
| oia-sunset-guide.md                        | tourism | -            | 2025-06-25 |  6251 |   0 |    C     | clean tourism          |              | 未着手        |
| santorini-tourism.md                       | tourism | -            | 2025-06-25 |  5507 |   0 |    C     | clean tourism          |              | 未着手        |
| santorini-transportation.md                | tourism | -            | 2025-06-25 |  8946 |   0 |    C     | clean tourism          |              | 未着手        |

## D) 2025-07〜08 その他シリーズ＋tourism

| file                     | cat     | series         | 公開日     | 字数 |   L | 一次判定 | 根拠             | 判定(赤入れ) | 状態          |
| :----------------------- | :------ | :------------- | :--------- | ---: | --: | :------: | :--------------- | :----------: | :------------ |
| airport-access-kansai.md | tourism | -              | 2025-07-04 | 7177 |   0 |    C     | clean tourism    |              | 未着手        |
| exchange-rate.md         | tourism | -              | 2025-07-07 | 8130 |   3 |    C     | 要確認           |              | 未着手        |
| travel-history1.md       | series  | travel-history | 2025-07-31 | 3842 |   0 |    B     | 弱め関西弁で統一 |      B       | 反映済(posts) |
| travel-history2.md       | series  | travel-history | 2025-08-01 | 4751 |   0 |    B     | 弱め関西弁で統一 |      B       | 反映済(posts) |
| best-city-for-student.md | one-off | -              | 2025-08-03 | 4516 |   0 |    C     | 整っている       |              | 未着手        |
| landscape1.md            | series  | landscape      | 2025-08-04 | 3898 |   0 |    B     | 弱め関西弁で統一 |      B       | 反映済(posts) |
| sunset1.md               | series  | sunset         | 2025-08-05 | 3226 |   0 |    B     | 弱め関西弁で統一 |      B       | 反映済(posts) |
| architecture1.md         | series  | architecture   | 2025-08-08 | 4193 |   0 |    B     | 弱め関西弁で統一 |      B       | 反映済(posts) |
| architecture2.md         | series  | architecture   | 2025-08-09 | 4347 |   0 |    B     | 弱め関西弁で統一 |      B       | 反映済(posts) |
| kyoto-view1.md           | series  | kyoto          | 2025-08-12 | 3982 |   0 |    B     | 弱め関西弁で統一 |      B       | 反映済(posts) |

## E) 2025-09〜12 中国・年末one-off

| file                         | cat     | series       | 公開日     | 字数 |   L | 一次判定 | 根拠                             | 判定(赤入れ) | 状態          |
| :--------------------------- | :------ | :----------- | :--------- | ---: | --: | :------: | :------------------------------- | :----------: | :------------ |
| trip_com-lounge-benefits.md  | tourism | -            | 2025-09-21 | 6844 |   0 |    C     | clean tourism                    |              | 未着手        |
| china-alipay-useful.md       | tourism | -            | 2025-11-28 | 3078 |   0 |    C     | clean tourism                    |              | 未着手        |
| china1.md                    | series  | travel-diary | 2025-11-29 | 4601 |   0 |    B     | 声寄せ                           |      B       | 反映済(posts) |
| china2.md                    | series  | travel-diary | 2025-11-30 | 5896 |   3 |    B     | レガシー痕跡なし(直前回リンク等) |      B       | 反映済(posts) |
| china3.md                    | series  | travel-diary | 2025-12-01 | 8312 |   2 |    B     | 構成良好                         |      B       | 反映済(posts) |
| china4.md                    | series  | travel-diary | 2025-12-02 | 3903 |   3 |    B     | 構成良好(直前回リンク)           |      B       | 反映済(posts) |
| developing-country-sunset.md | one-off | -            | 2025-12-03 | 2935 |   0 |    C     | 整っている                       |              | 未着手        |
| india-street-food-tips.md    | tourism | -            | 2025-12-04 | 3207 |   0 |    C     | clean tourism                    |              | 未着手        |
| shanghai-chagee-addict.md    | tourism | -            | 2025-12-05 | 3157 |   0 |    C     | clean tourism                    |              | 未着手        |
| why-travelers-dont-return.md | one-off | -            | 2025-12-06 | 2640 |   0 |    C     | 精読済:clean。noindex            |              | 未着手        |

## F) 2026-03 最新（マレーシア・シンガポール・インドネシア＋tourism）

| file                                    | cat     | series       | 公開日     | 字数 |   L | 一次判定 | 根拠          | 判定(赤入れ) | 状態          |
| :-------------------------------------- | :------ | :----------- | :--------- | ---: | --: | :------: | :------------ | :----------: | :------------ |
| malaysia1.md                            | series  | travel-diary | 2026-03-12 | 5665 |   0 |    B     | 声寄せ        |      B       | 反映済(posts) |
| malaysia2.md                            | series  | travel-diary | 2026-03-13 | 6394 |   0 |    B     | 声寄せ        |      B       | 反映済(posts) |
| malaysia3.md                            | series  | travel-diary | 2026-03-14 | 6479 |   1 |    B     | 声寄せ        |      B       | 反映済(posts) |
| singapore1.md                           | series  | travel-diary | 2026-03-15 | 4538 |   0 |    B     | 声寄せ        |      B       | 反映済(posts) |
| singapore2.md                           | series  | travel-diary | 2026-03-16 | 4288 |   0 |    B     | 声寄せ        |      B       | 反映済(posts) |
| singapore3.md                           | series  | travel-diary | 2026-03-20 | 3146 |   0 |    B     | 声寄せ        |      B       | 反映済(posts) |
| indonesia1.md                           | series  | travel-diary | 2026-03-17 | 5178 |   0 |    B     | 声寄せ        |      B       | 反映済(posts) |
| indonesia2.md                           | series  | travel-diary | 2026-03-18 | 4363 |   0 |    B     | 声寄せ        |      B       | 反映済(posts) |
| indonesia3.md                           | series  | travel-diary | 2026-03-19 | 4219 |   0 |    B     | 声寄せ        |      B       | 反映済(posts) |
| batu-caves-guide.md                     | tourism | -            | 2026-03-24 | 4804 |   0 |    C     | clean tourism |              | 未着手        |
| changi-airport-liquids.md               | tourism | -            | 2026-03-24 | 4145 |   0 |    C     | clean tourism |              | 未着手        |
| putra-mosque-guide.md                   | tourism | -            | 2026-03-24 | 4886 |   0 |    C     | clean tourism |              | 未着手        |
| putra-mosque-ramadan-hours.md           | tourism | -            | 2026-03-24 | 5005 |   0 |    C     | clean tourism |              | 未着手        |
| touch-n-go-how-much.md                  | tourism | -            | 2026-03-24 | 6079 |   0 |    C     | clean tourism |              | 未着手        |
| google-maps-bus-developing-countries.md | one-off | -            | 2026-03-24 | 4475 |   0 |    C     | 整っている    |              | 未着手        |
| malaysia-before-thailand.md             | one-off | -            | 2026-03-24 | 4686 |   0 |    C     | 整っている    |              | 未着手        |
| malaysia-night-vibes.md                 | one-off | -            | 2026-03-24 | 4490 |   0 |    C     | 整っている    |              | 未着手        |

---

## 進捗サマリ

- **A 完全リライト**: ✅ 13本完了（hokkaido1-2 / thai1-3 / vietnam1 / india1-7）
- **B 文体のみ／中程度**: ✅ 完了
  - travel-diary 50本（egypt1サンプル含む）
  - その他series 7本（travel-history1-2 / sunset1 / landscape1 / architecture1-2 / kyoto-view1）
  - tourism 7本（wat-arun / wat-pho / wat-phra-kaew / bankok-sandaijiin / thai-transportation / vietnam-transit / bathing-ganga）
  - itinerary 2本（thai-itinerary / europe-itinerary）
  - ※india-visa は精読の結果ほぼ完成のためC再分類（posts直修正1行のみ）
- **C 維持／軽微**: 横断スキャン＋スポット修正で対応済み。
  - 全postsを高シグナルの不具合パターン（[[photo]] / エスケープ崩れ / 定型挨拶 / 第N回 / 文字化け）で横断スキャン。
  - 実不具合のみ posts を直接修正: **shanghai-chagee-addict**（[[photo]]×4除去）／**bangkok-tourism**（文字化け3か所＋挨拶除去）／**india-visa**（エスケープ崩れ1行）。
  - 残りの clean な tourism / one-off は です・ます維持で現状のまま（全文精読は未実施。気になる記事は個別指定で深掘り可能）。

## 内容精査の方式（確定）

- **同時パス**: 声のリライトと内容監査を1回で行う。草稿冒頭に `<!-- 監査ノート -->`（HTMLコメント）を同梱し、公開前に削除する。
- **一次情報は不可侵**: 著者の体験・実額・出来事・店名は私が創作・改変しない（Adsense審査上も重要）。私が触るのは構成・重複・冗長カット・換算統一・typo・リンク規則・alt・声のみ。要書き換え箇所は 🔴 として残し、著者が後から加筆。
- **事実検証**: 記事ごとに判断（必要時のみ私がWebで公式情報を裏取り）。
- 監査ノートの凡例: 🔴著者確認/後で書換 ／ 🟡要事実確認 ／ 🟢私が変更済 ／ 🟡Web検証。

## 横断メモ（記事をまたぐ要決定・要対応）

- **【決定済】為替レート＝記事の公開日(publishedAt)時点の実勢レート**（OPERATIONS.md §4「円換算」にルール化済み）。旅・記事ごとにレート固定、同一記事内で統一。
  - タイ2024-03（thai1,2 / thai-itinerary）≈ **4.2円/バーツ**を適用（Web最終確認待ち）。
  - タイ2025-06（thai4 等）は別レート（≈4.4〜4.5円/バーツ想定、要Web確認）。
  - 他通貨（VND/INR/EUR/EGP/リラ/リンギット等）も各記事 publishedAt のレートで。Web復旧後に主要レートを裏取り。
- **【dedup】赤バスの説明**: thai1日記とbangkok-localbus(tourism)で重複。日記側は体験に絞り、詳細は赤バス記事へリンク誘導済み。他の「日記×実用記事」ペアも同方針。
- **【要確認】ワット・ポー涅槃仏 足裏の装飾**: 「螺旋細工」は螺鈿細工の誤記の可能性。thai3では断定回避（「精緻な装飾」）。確定表記を要決定。
- **【既存バグ・要対応】`[[photo]]`マーカー**: レンダラー(`CustomMarkdown.tsx`)は[[photo]]/[[/photo]]を未対応のため、本文に文字として表示されてしまう。該当4件すべて対応済み: thai5・thai6・indonesia1 はドラフトで除去（posts原本は昇格時に解消）／shanghai-chagee-addict は C のため posts を直接修正。新規 [[photo]] は今後使わない（レンダラー未対応）。リライト時に必ずマーカーを除去し画像のみ残す。

## サンプル先行候補（声を固定するため最初に試作）

1. **thai1.md** — A の代表（Note体質 diary → 新しい口語/方言の声＋構成リライト）
2. **egypt1.md** — B の代表（clean な diary → 声のみ変更）
3. **tourism 1本（例: bangkok-localbus.md）** — です・ます維持タイプの確認

> この3本で2つの声（diary口語 / tourism丁寧）と2つの深さ（A/B）を確定 → 以降の量産テンプレにする。
