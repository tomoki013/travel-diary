// @ts-check
/**
 * クライアント JS バンドルサイズの計測＆予算チェック。
 *
 * `.next/static/chunks` 配下の JS を集計し、gzip 後の合計が予算を超えたら
 * 非ゼロ終了して CI を失敗させる。回帰の早期検知が目的。
 *
 * 使い方: pnpm build 後に `node scripts/check-bundle-size.mjs`
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";

// --- 予算（gzip 後・バイト）。現状 ~630KB に対し約11%の余裕を持たせて設定。 ---
const BUDGET_GZIP_BYTES = 700 * 1024; // 700 KB

const CHUNKS_DIR = path.join(process.cwd(), ".next", "static", "chunks");

/** @param {string} dir */
async function collectJsFiles(dir) {
  /** @type {string[]} */
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await collectJsFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      out.push(full);
    }
  }
  return out;
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  try {
    await stat(CHUNKS_DIR);
  } catch {
    console.error(`❌ ${CHUNKS_DIR} が見つかりません。先に \`pnpm build\` を実行してください。`);
    process.exit(1);
  }

  const files = await collectJsFiles(CHUNKS_DIR);
  let rawTotal = 0;
  let gzipTotal = 0;
  /** @type {{name: string, gzip: number}[]} */
  const perFile = [];

  for (const file of files) {
    const buf = await readFile(file);
    const gz = gzipSync(buf).length;
    rawTotal += buf.length;
    gzipTotal += gz;
    perFile.push({ name: path.relative(CHUNKS_DIR, file), gzip: gz });
  }

  perFile.sort((a, b) => b.gzip - a.gzip);

  console.log("Client JS bundle (.next/static/chunks)");
  console.log(`  files:      ${files.length}`);
  console.log(`  raw total:  ${fmt(rawTotal)}`);
  console.log(`  gzip total: ${fmt(gzipTotal)}  (budget ${fmt(BUDGET_GZIP_BYTES)})`);
  console.log("  largest chunks (gzip):");
  for (const f of perFile.slice(0, 8)) {
    console.log(`    ${fmt(f.gzip).padStart(10)}  ${f.name}`);
  }

  if (gzipTotal > BUDGET_GZIP_BYTES) {
    console.error(
      `\n❌ バンドルが予算を超過: ${fmt(gzipTotal)} > ${fmt(BUDGET_GZIP_BYTES)} (gzip)`,
    );
    process.exit(1);
  }
  console.log(`\n✅ バンドルは予算内: ${fmt(gzipTotal)} ≤ ${fmt(BUDGET_GZIP_BYTES)} (gzip)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
