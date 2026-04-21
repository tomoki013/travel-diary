# インフラストラクチャと外部連携

## ホスティング: Netlify

このプロジェクトは Netlify 上でホストされています。

### ビルド設定 (`netlify.toml`)

- **ビルドコマンド**: `pnpm build`
- **公開ディレクトリ**: `.next`
- **キャッシュ制御**: `_next/static/*` は 1 年間の長期キャッシュ、それ以外は `must-revalidate` 設定となっています。

### リダイレクト運用

- `netlify.toml` の `[[redirects]]` セクションで、以下のリダイレクトを管理しています。
    - ドメイン正規化 (`tomokichidiary.netlify.app` -> `travel.tomokichidiary.com`)
    - 旧パス構造の正規化 (`/diary/*`, `/tourism/*`, `/itinerary/*` -> `/posts/*`)
    - 廃止されたツール・ページからトップページへの転送

### 画像最適化 (`netlify-loader.ts`)

- Netlify Image CDN を利用するためのカスタムローダーです。
- 本番環境 (`production`) では `/.netlify/images?url=...` 形式の URL を生成し、エッジでの画像リサイズと最適化を実現しています。

## AI エージェント基盤

### エージェント連携 (`.agent-game-companion/`)

- AI エージェント（Gemini CLI 等）と開発環境を繋ぐための基盤です。
- `hooks/`: エージェントの動作をカスタマイズまたは補助するスクリプト。
- `state/`: エージェントの実行状態や履歴の永続化。

### プロキシ設定 (`src/proxy.ts`)

- 外部 API（Google AI SDK 等）との通信を中継または制御するためのプロキシロジックが配置されています。

## MCP (Model Context Protocol)

- `.mcp.json`: AI エージェントが利用可能なツールやリソースの定義。
- これにより、AI がリポジトリ内の特定の操作（記事生成、画像解析など）を効率的に行えるようになっています。
