# CI/CD棚卸表

> 生成日: 2026-06-02
> 対象: `.github/workflows/`、`package.json` scripts、`netlify.toml`、ビルド・デプロイ全般

---

## サマリー

現状はNetlifyがビルドとホスティングを担当し、GitHub ActionsがCI（品質チェック）を担当する構成。
Vercel移行後は、デプロイをVercelに移管し、GitHub ActionsはCI専用として維持する。

---

## 現状棚卸

### GitHub Actions: `.github/workflows/ci.yml`

| 項目 | 現状 | 問題・メモ |
|---|---|---|
| トリガー | `push: main` + 全PR | 問題なし |
| Node.js | v22 | 最新LTS相当。問題なし |
| パッケージマネージャー | pnpm (action-setup@v4) | 問題なし |
| キャッシュ | pnpm store キャッシュ | 問題なし |
| インストール | `pnpm install --frozen-lockfile` | 問題なし |
| prebuild | `pnpm prebuild` | 画像index・記事キャッシュ等の生成。必須。 |
| フォーマットチェック | `pnpm format:check` | Prettier確認。問題なし |
| Lint | `pnpm lint` | ESLint。問題なし |
| Typecheck | `pnpm typecheck` | `tsc --noEmit`。問題なし |
| Build | `pnpm build` | Next.jsビルド確認。問題なし |
| デプロイ | なし（CIはbuildのみ） | デプロイはNetlifyが担当。分離されている。 |

**評価**: CIはコンパクトで適切。Vercel移行後もそのまま維持できる。

---

### package.json scripts

| スクリプト | 内容 | 用途 | 評価 |
|---|---|---|---|
| `dev` | `prebuild && next dev --webpack` | 開発サーバー起動 | 問題なし |
| `prebuild` | 4つのスクリプト（画像index・記事キャッシュ2種・ブログindex生成） | ビルド前の静的データ生成 | 必須。問題なし |
| `build` | `next build --webpack` | 本番ビルド | 問題なし |
| `postbuild` | `next-sitemap --config next-sitemap.config.js` | sitemap生成 | ビルド後に自動実行。問題なし |
| `start` | `next start` | 本番起動 | 問題なし |
| `lint` | ESLint（src + config files） | コード品質 | 問題なし |
| `typecheck` | `tsc --noEmit` | 型チェック | 問題なし |
| `format` | `prettier --write .` | フォーマット修正 | 問題なし |
| `format:check` | `prettier --check .` | フォーマット確認 | CI用。問題なし |
| `check` | lint + typecheck + format:check | ローカル一括確認 | 問題なし |
| `ci` | prebuild + check + build | CI相当の全確認 | CIと同等。問題なし |

---

### Netlify設定 (`netlify.toml`)

| 項目 | 現状 | Vercel移行後の扱い |
|---|---|---|
| ビルドコマンド | `pnpm build` | Vercelのbuild commandに設定 |
| 公開ディレクトリ | `.next` | Vercelは自動認識（Nextjs） |
| `generative-ui` noindex | `X-Robots-Tag: noindex, nofollow` | `next.config.ts` の `headers()` に移行 |
| 静的アセットキャッシュ | `max-age=31536000, immutable` | `next.config.ts` の `headers()` に移行 |
| ドメイン正規化 `netlify.app → tomokichidiary.com` | `[[redirects]]` 301 | Vercel側では自動処理（旧URLは削除） |
| `/diary/*` → `/posts/*` | `[[redirects]]` 301 | `next.config.ts` の `redirects()` に移行 |
| `/tourism/*` → `/posts/*` | `[[redirects]]` 301 | `next.config.ts` の `redirects()` に移行 |
| `/itinerary/*` → `/posts/*` | `[[redirects]]` 301 | `next.config.ts` の `redirects()` に移行 |
| 廃止ページのリダイレクト（`/calculator` `/clock` 等） | `[[redirects]]` 301 | `next.config.ts` の `redirects()` に移行 |

---

### 技術スタック（バージョン確認）

| 項目 | 現状 |
|---|---|
| Next.js | ^16.2.6 |
| React | ^19.2.4 |
| TypeScript | ^5.9.3 |
| Tailwind CSS | ^4.1.12 |
| Node.js (CI) | v22 |
| pnpm | action-setup@v4（バージョン固定なし） |
| AI SDK (Vercel) | ^5.0.59 |
| PWA (Serwist) | ^9.2.1 |

---

## 環境変数棚卸（確認必要）

以下は推定。実際のNetlify側の環境変数一覧を別途確認が必要。

| 変数名（推定） | 用途 | Vercel移行時の扱い |
|---|---|---|
| `GOOGLE_AI_API_KEY` / 類似 | AIチャット機能 | Vercelの環境変数に移行 |
| `NEXT_PUBLIC_GA_ID` / 類似 | Google Analytics | Vercelの環境変数に移行 |
| `NEXT_PUBLIC_ADSENSE_ID` / 類似 | Google AdSense | Vercelの環境変数に移行 |
| その他メール送信系 | お問い合わせフォーム | Vercelの環境変数に移行 |

**次のアクション**: `vercel env pull` または Netlifyダッシュボードで実際の環境変数一覧を確認する。

---

## CI/CD再設計方針（Vercel移行後）

### Vercelが担当すること

| 項目 | 設定方法 |
|---|---|
| Preview Deployment | PRマージで自動（Vercel GitHub連携） |
| Production Deployment | `main` ブランチへのpushで自動 |
| ビルド実行 | Vercelがbuild commandを実行 |
| ホスティング・CDN | Vercelが担当 |
| 環境変数管理 | Vercelダッシュボードで管理 |
| Deployment rollback | Vercelダッシュボードから即時可能 |
| ドメイン管理 | Vercelでカスタムドメイン設定 |

### GitHub Actionsが担当すること（現状維持）

| ジョブ | 内容 |
|---|---|
| `format:check` | Prettierフォーマット確認 |
| `lint` | ESLint |
| `typecheck` | `tsc --noEmit` |
| `build` | ビルドが通るかの確認 |

### GitHub Actionsでやりすぎないこと

- Vercel本番デプロイの二重管理
- NetlifyとVercelの並行デプロイを長期間続ける
- Lighthouseを毎commitで必須化する（AdSense審査前は警告扱いでよい）
- リンクチェックを全記事に対して毎回実行する（重い）

---

## Vercel移行チェックリスト（CI/CD観点）

### Step 1: Vercel Preview環境の確認

- [ ] `pnpm build` がVercel上で通る
- [ ] `pnpm prebuild` がVercel上で通る（スクリプト依存の確認）
- [ ] `postbuild` のsitemap生成がVercel上で動く
- [ ] Next.js `output` 設定が `standalone` 不要なことを確認

### Step 2: 環境変数の移行

- [ ] Netlify側の環境変数一覧を確認
- [ ] Vercelの `Production` / `Preview` / `Development` 環境に設定
- [ ] `.env.local` との差分確認

### Step 3: リダイレクトの移行

- [ ] `netlify.toml` の全 `[[redirects]]` を `next.config.ts` の `redirects()` に変換
- [ ] 変換後に301リダイレクトが正しく動くか確認
- [ ] `netlify.app` ドメインのリダイレクトは削除（Vercel側では不要）

### Step 4: ヘッダーの移行

- [ ] 静的アセットキャッシュ設定を `next.config.ts` の `headers()` に変換
- [ ] `generative-ui` のnoindexヘッダーを `next.config.ts` に変換

### Step 5: GitHub Actions確認

- [ ] CIがVercel Preview Deploymentと干渉しないことを確認
- [ ] Build jobをVercelに任せるか、GitHub Actions側でも確認するか方針決定

---

## 現状の問題点まとめ

| 問題 | 重要度 | 対応タイミング |
|---|---|---|
| Netlify依存のリダイレクト設定がNext.jsコードに存在しない | 高 | Vercel移行時に必須 |
| 環境変数がNetlify側にのみ存在（推定） | 高 | Vercel移行時に必須 |
| `netlify-loader.ts` がNetlify Image CDN前提 | 中 | Vercel移行時に要置き換え |
| pnpmのバージョンが `action-setup@v4` で固定されていない | 低 | 気になるなら `packageManager` フィールドで固定 |
| Lighthouseチェックが未導入 | 低 | AdSense審査後に検討 |
