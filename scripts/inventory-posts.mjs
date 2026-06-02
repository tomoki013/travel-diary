import fs from 'fs';
import path from 'path';

const postsDir = 'posts';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).sort();
const results = [];

for (const fname of files) {
  const raw = fs.readFileSync(path.join(postsDir, fname), 'utf-8');
  const content = raw.replace(/\r\n/g, '\n');
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { results.push({ fname, error: true }); continue; }
  const fmText = fm[1];

  const get = (key) => {
    const m = fmText.match(new RegExp('^' + key + ': (.+)', 'm'));
    return m ? m[1].trim().replace(/^"|"$/g, '') : '';
  };
  const getList = (key) => {
    const lines = fmText.split('\n');
    let inList = false, items = [];
    for (const line of lines) {
      if (new RegExp('^' + key + ':').test(line)) {
        inList = true;
        const inline = line.match(/\[(.+)\]/);
        if (inline) return inline[1].split(',').map(s => s.trim().replace(/["']/g, ''));
        continue;
      }
      if (inList) {
        const m = line.match(/^\s+-\s+(.+)/);
        if (m) items.push(m[1].trim().replace(/["']/g, ''));
        else if (line && !/^\s/.test(line)) break;
      }
    }
    return items;
  };

  const bodyLines = content.split('\n');
  const bodyStart = bodyLines.findIndex((l, i) => i > 0 && l.trim() === '---') + 1;
  const body = bodyLines.slice(bodyStart).join('\n');
  const charCount = body.replace(/[#\-*`\[\]()!]/g, '').replace(/\s+/g, ' ').trim().length;

  results.push({
    fname,
    slug: fname.replace('.md', ''),
    title: get('title'),
    cat: get('category'),
    pub: get('publishedAt'),
    series: get('series'),
    journey: get('journeyId'),
    regions: getList('regionIds').join('/'),
    topics: getList('travelTopics').join('/'),
    chars: charCount,
  });
}

// Classify each article
function classify(r) {
  const { slug, cat, series, journey, topics, chars } = r;
  const topicList = topics.split('/').filter(Boolean);

  // 種別
  let type;
  if (cat === 'series' && slug.match(/^\w+\d+$|^introduce$/)) {
    type = '旅行記';
  } else if (cat === 'series') {
    type = '旅行記';
  } else if (cat === 'itinerary') {
    type = '旅程まとめ';
  } else if (topicList.includes('transport') && slug.includes('airport')) {
    type = 'アクセス';
  } else if (topicList.includes('transport')) {
    type = 'アクセス';
  } else if (topicList.includes('booking') && !topicList.includes('transport')) {
    type = '予約';
  } else if (topicList.includes('visa')) {
    type = 'ガイド';
  } else if (topicList.includes('money')) {
    type = 'ガイド';
  } else if (cat === 'one-off') {
    type = 'コラム';
  } else {
    type = '観光地ガイド';
  }

  // 実体験
  let exp;
  if (cat === 'series') exp = '強い';
  else if (journey) exp = '普通';
  else exp = '弱い';

  // SEO感
  let seo;
  if (type === 'アクセス' || type === '旅程まとめ') seo = '高い';
  else if (type === '観光地ガイド' || type === 'ガイド') seo = '普通';
  else seo = '低い';

  // アフィリエイト色
  let aff = '低い';
  if (slug.includes('trip_com') || slug.includes('omio')) aff = '高い';
  else if (topicList.includes('booking') || slug.includes('reservation') || slug.includes('lounge')) aff = '普通';

  // 独自判断
  let orig;
  if (cat === 'series') orig = 'ある';
  else if (journey) orig = '少ない';
  else orig = 'ない';

  // 判定 + 優先度
  // 優先度はAdSense再審査前に「対応が必要か」の緊急度を示す。
  // A = 審査前に対応推奨（薄い・アフィ色強い・体験薄い）
  // B = 基盤コンテンツ or 情報系（定期確認でよい）
  // C = 優先度低い（コラム系・後回し可）
  let verdict, pri, memo;

  if (aff === '高い') {
    verdict = 'リライト推奨';
    pri = 'A';
    memo = 'アフィリエイト色が強い。AdSense審査前に体験重視に寄せ直す必要あり。';
  } else if (cat === 'series' && chars < 900) {
    verdict = 'リライト推奨';
    pri = 'A';
    memo = `文字数が非常に少ない（${chars}字）。シリーズ記事でも薄い印象を与えるリスクあり。`;
  } else if (cat === 'series') {
    verdict = '維持';
    pri = 'B';
    memo = 'シリーズ旅行記の核。体験ベースで内容問題なし。';
  } else if (cat === 'itinerary') {
    verdict = '軽微修正';
    pri = 'B';
    memo = '旅程まとめは有用。費用データ・日付の鮮度を確認推奨。';
  } else if (exp === '弱い' && chars < 2000) {
    verdict = 'リライト推奨';
    pri = 'A';
    memo = `実体験の裏付けなし＋文字数少（${chars}字）。AdSense審査でリスクあり。`;
  } else if (exp === '弱い') {
    verdict = 'リライト推奨';
    pri = 'B';
    memo = '実旅行と紐付けが薄い。体験ベースに寄せる対応推奨。';
  } else if (chars < 1000) {
    verdict = 'リライト推奨';
    pri = 'A';
    memo = `文字数が少ない（${chars}字）。薄い記事と見なされるリスクあり。`;
  } else if (chars < 1800 && cat !== 'series') {
    verdict = 'リライト推奨';
    pri = 'A';
    memo = `文字数が少ない（${chars}字）。情報量を補強推奨。`;
  } else if (type === 'アクセス' && journey) {
    verdict = '維持';
    pri = 'B';
    memo = '実体験に基づくアクセス情報。情報鮮度を定期確認。';
  } else if (type === 'アクセス' && !journey) {
    verdict = 'リライト推奨';
    pri = 'B';
    memo = '実体験の裏付けが確認できない。一般情報寄りなら体験を追記。';
  } else if (cat === 'one-off' && chars < 1500) {
    verdict = 'リライト推奨';
    pri = 'A';
    memo = `コラム系だが文字数少（${chars}字）。AdSense審査では薄く見られやすい。`;
  } else if (cat === 'one-off') {
    verdict = '軽微修正';
    pri = 'C';
    memo = 'コラム系。独自視点はあるがAdSense審査では評価されにくい。内容に問題はない。';
  } else {
    verdict = '維持';
    pri = 'B';
    memo = '内容・体験ともに問題なし。';
  }

  return { type, exp, seo, aff, orig, verdict, pri, memo };
}

// Generate markdown table
const lines = [];
lines.push('# 記事棚卸表');
lines.push('');
lines.push('> 生成日: ' + new Date().toISOString().split('T')[0]);
lines.push('> 対象: posts/ 配下の全Markdownファイル (' + results.filter(r => !r.error).length + '件)');
lines.push('');
lines.push('## サマリー');
lines.push('');

const classified = results.filter(r => !r.error).map(r => ({ ...r, ...classify(r) }));
const byVerdict = {};
for (const r of classified) {
  byVerdict[r.verdict] = (byVerdict[r.verdict] || 0) + 1;
}
for (const [k, v] of Object.entries(byVerdict).sort()) {
  lines.push('- ' + k + ': ' + v + '件');
}
lines.push('');

const byPri = { A: [], B: [], C: [] };
for (const r of classified) byPri[r.pri].push(r);

lines.push('優先度別:');
for (const p of ['A', 'B', 'C']) {
  lines.push('- 優先度' + p + ': ' + byPri[p].length + '件');
}
lines.push('');

// Full table
lines.push('## 全記事一覧');
lines.push('');
lines.push('| ファイル | タイトル（抜粋） | 種別 | 公開日 | 地域 | 実体験 | SEO感 | アフィ色 | 独自判断 | 判定 | 優先度 | メモ |');
lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|');

for (const r of classified) {
  const title = r.title.length > 28 ? r.title.slice(0, 28) + '…' : r.title;
  const region = r.regions.length > 18 ? r.regions.slice(0, 18) + '…' : r.regions;
  lines.push(
    '| [' + r.fname + '](posts/' + r.fname + ') | ' + title + ' | ' + r.type + ' | ' + r.pub + ' | ' +
    region + ' | ' + r.exp + ' | ' + r.seo + ' | ' + r.aff + ' | ' + r.orig + ' | **' + r.verdict + '** | ' + r.pri + ' | ' + r.memo + ' |'
  );
}

// Priority A section
lines.push('');
lines.push('## 優先度A（要対応）');
lines.push('');
for (const r of byPri.A) {
  lines.push('### ' + r.fname);
  lines.push('- **タイトル**: ' + r.title);
  lines.push('- **判定**: ' + r.verdict);
  lines.push('- **理由**: ' + r.memo);
  lines.push('- **文字数**: ' + r.chars + '字');
  lines.push('');
}

const out = lines.join('\n');
fs.writeFileSync('docs/inventory-posts.md', out, 'utf-8');
console.log('Written: docs/inventory-posts.md (' + out.length + ' bytes)');
console.log('Total articles: ' + classified.length);
