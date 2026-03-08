import fs from 'fs/promises';
import path from 'path';

const POSTS_DIR = 'posts';
const DRAFT_POSTS_DIR = 'draft-posts';

async function processFiles() {
  const files = await fs.readdir(POSTS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file);
    let content = await fs.readFile(filePath, 'utf-8');

    let category = '';
    
    // 1. Frontmatterの修正
    content = content.replace(/^---\n([\s\S]*?)\n---/, (match, fm) => {
      let newFm = fm;
      // title内の連番削除 (【#1】, 第1回, Part 1 などを削除)
      newFm = newFm.replace(/^title:\s*['"]?(.*?)(?:【#\d+】|第\d+回|Part\s*\d+|#\d+)['"]?\s*$/mi, 'title: "$1"');
      // クリーンアップ
      newFm = newFm.replace(/title:\s*"(.*?)\s*[:：]\s*"/m, 'title: "$1"');
      newFm = newFm.replace(/title:\s*"(.*?)\s+"/m, 'title: "$1"');
      
      const catMatch = newFm.match(/^category:\s*['"]?(.*?)['"]?\s*$/m);
      if (catMatch) {
        category = catMatch[1];
      }
      return `---\n${newFm}\n---`;
    });

    // 2. 本文のノイズ除去
    const lines = content.split('\n');
    const newLines = [];
    
    let inToc = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmed = line.trim();

      // 目次セクションの除去
      if (trimmed === '## 目次' || trimmed === '# 目次') {
        inToc = true;
        continue;
      }
      if (inToc && (trimmed.startsWith('- ') || trimmed === '')) {
        continue;
      } else if (inToc && trimmed.startsWith('#')) {
        inToc = false;
      }

      // 孤立行の削除
      if (trimmed === '画像' || trimmed === 'すべて表示') continue;
      
      // 挨拶・結びの削除
      if (trimmed.includes('こんにちは') && trimmed.length < 20) continue;
      if (trimmed.includes('いかがでしたか') && trimmed.length < 30) continue;
      if (trimmed.includes('ここまで読んでくれてありがとう') || trimmed.includes('読んでいただきありがとう')) continue;
      if (trimmed.includes('次回をお楽しみに')) continue;
      
      // 外部誘導の削除
      if (trimmed.includes('以下の記事も') && trimmed.includes('http')) continue;

      // 喫煙事情の削除 (categoryがtourismでない場合)
      if (category !== 'tourism' && (trimmed.includes('喫煙') || trimmed.includes('タバコ') || trimmed.includes('たばこ'))) {
        continue;
      }

      // 未来の記事への誘導や「次回」などの不要な文言の削除
      if (/次回は.*について/.test(trimmed)) continue;

      // 内部リンクの段落化 (画像リンク `![...](...)` を除外する)
      if (!line.includes('![')) {
        if (line.match(/[^ ]+.*\[.+?\]\(.+?\)/) || line.match(/\[.+?\]\(.+?\).*[^ ]+/)) {
          // httpから始まる外部リンクは除外
          if (!line.includes('(http')) {
             line = line.replace(/(.*?)(\[.+?\]\(.+?\))(.*)/, '$1$3\n\n$2');
          }
        }
      }
      
      // `//...//` や不要な装飾の除去
      line = line.replace(/^\/\/(.*?)\/\/$/, '$1');

      newLines.push(line);
    }

    let newContent = newLines.join('\n');
    
    // 不要な空行の連続を修正
    newContent = newContent.replace(/\n{3,}/g, '\n\n');

    const outPath = path.join(DRAFT_POSTS_DIR, file);
    await fs.writeFile(outPath, newContent, 'utf-8');
  }
}

processFiles().catch(console.error);