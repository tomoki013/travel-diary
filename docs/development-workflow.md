# 開発フロー

## 主要コマンド

```bash
pnpm dev
pnpm prebuild
pnpm build
pnpm lint
pnpm start
```

## 補足

- `pnpm dev` は prebuild を実行してから起動します。
- prebuild では画像インデックス、記事キャッシュ、記事メタデータを生成します。
- lint は `src/` と Next.js / sitemap 設定を対象にしています。

## 日常の進め方

1. 影響範囲のコンポーネントと `src/lib/` を確認する
2. データ取得と UI の責務分離を崩さずに編集する
3. 関連する docs と AI ルールファイルの更新要否を確認する
4. `pnpm exec tsc --noEmit` と `pnpm lint` で検証する

## 変更時の注意

- repo 直下の `.posts.*.json` は prebuild で更新されます。
- 記事運用ルールを変える場合は `draft-posts/rules/` と `docs/content-operations.md` を確認します。
