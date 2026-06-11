# インフラストラクチャと外部連携

## ホスティング: Netlify

このプロジェクトは Netlify 上でホストされています。

### ビルド設定 (`netlify.toml`)

- **ビルドコマンド**: `pnpm build`
- **公開ディレクトリ**: `.next`
- **キャッシュ制御**: `_next/static/*` は 1 年間の長期キャッシュ、それ以外は `must-revalidate` 設定となっています。

### セキュリティヘッダー

- `netlify.toml` の `[[headers]]` で全レスポンスに以下を付与しています。
  - `Strict-Transport-Security`(HTTPS 強制・1 年)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`(クリックジャッキング対策)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`(camera / microphone / geolocation 無効)
- `/map` 配下は外部アプリのプロキシ表示のため `X-Robots-Tag: noindex` を付与しています。
- CSP (Content-Security-Policy) は未導入。導入する場合は Report-Only で影響確認後に強制すること。

### リダイレクト運用

- `netlify.toml` の `[[redirects]]` セクションで、以下のリダイレクトを管理しています。
  - ドメイン正規化 (`tomokichidiary.netlify.app` -> `tomokichidiary.com`)
  - 旧パス構造の正規化 (`/diary/*`, `/tourism/*`, `/itinerary/*` -> `/posts/*`)
  - 廃止されたツール・ページからトップページへの転送

### 画像最適化 (`netlify-loader.ts`)

- Netlify Image CDN を利用するためのカスタムローダーです。
- 本番環境 (`production`) では `/.netlify/images?url=...` 形式の URL を生成し、エッジでの画像リサイズと最適化を実現しています。
- 品質パラメータ未指定時はデフォルトで `q=60` を付与します(転送量削減のため)。

## AI エージェント基盤

### エージェント連携 (`.agent-game-companion/`)

- AI エージェント（Gemini CLI 等）と開発環境を繋ぐための基盤です。
- `hooks/`: エージェントの動作をカスタマイズまたは補助するスクリプト。
- `state/`: エージェントの実行状態や履歴の永続化。

### プロキシ設定 (`src/proxy.ts`)

- リクエストパスを小文字へ正規化（308 リダイレクト）する Next.js プロキシ（ミドルウェア）です。

## MCP (Model Context Protocol)

- `.mcp.json`: AI エージェントが利用可能なツールやリソースの定義。
- これにより、AI がリポジトリ内の特定の操作（記事生成、画像解析など）を効率的に行えるようになっています。
