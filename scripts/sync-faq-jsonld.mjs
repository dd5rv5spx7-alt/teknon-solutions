// Runs before every build (see package.json's "prebuild" script). Regenerates
// index.html's FAQPage JSON-LD block from src/data/siteData.js's FAQS array —
// previously that block was a hand-typed second copy of the same 8 Q&A
// pairs FAQ.jsx renders, with nothing enforcing the two stayed in sync. The
// Course/Organization/LocalBusiness entries in the same JSON-LD graph are
// left hand-authored: they don't map cleanly onto any single siteData.js
// export, and auto-generating them risks producing worse copy than what's
// there now for very little drift-prevention benefit (business info changes
// rarely; FAQ copy changes often).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const siteDataPath = path.join(root, 'src/data/siteData.js');
const indexHtmlPath = path.join(root, 'index.html');

const siteDataSource = readFileSync(siteDataPath, 'utf8');

// siteData.js also imports lucide-react icon components at module scope —
// importing it directly in this plain Node script would require a full JSX/
// bundler pipeline just to read one plain-data array. A targeted regex
// extraction of the FAQS array literal avoids that entirely, at the cost of
// only working while FAQS keeps its current `{ q: '...', a: '...' }` shape.
const match = siteDataSource.match(/export const FAQS = (\[[\s\S]*?\n\]);/);
if (!match) {
  console.error('sync-faq-jsonld: could not find "export const FAQS = [...]" in siteData.js — skipping, index.html left as-is.');
  process.exit(0);
}

let faqs;
try {
  // eslint-disable-next-line no-eval
  faqs = eval(match[1]);
} catch (err) {
  console.error('sync-faq-jsonld: could not parse the extracted FAQS array — skipping.', err.message);
  process.exit(0);
}

const mainEntity = faqs.map((f) => ({
  '@type': 'Question',
  name: f.q,
  acceptedAnswer: { '@type': 'Answer', text: f.a },
}));

const html = readFileSync(indexHtmlPath, 'utf8');
const faqBlockPattern = /(\{\s*"@type":\s*"FAQPage",\s*"mainEntity":\s*)\[[\s\S]*?\](\s*\})/;

const match2 = html.match(faqBlockPattern);
if (!match2) {
  console.error('sync-faq-jsonld: could not find the FAQPage block in index.html — skipping.');
  process.exit(0);
}

// Match the file's existing indentation rather than dumping JSON.stringify's
// own spacing: read how many spaces precede the "mainEntity" line so the
// generated array lines up with hand-authored JSON-LD around it.
const baseIndentMatch = match2[1].match(/\n(\s*)"mainEntity"/);
const baseIndent = baseIndentMatch ? baseIndentMatch[1] : '          ';
const itemIndent = baseIndent + '  ';
const mainEntityJson =
  '[\n' +
  mainEntity
    .map((item) => JSON.stringify(item, null, 2).split('\n').map((l, i) => (i === 0 ? itemIndent + l : itemIndent + l)).join('\n'))
    .join(',\n') +
  '\n' +
  baseIndent +
  ']';

const updated = html.replace(faqBlockPattern, `$1${mainEntityJson}$2`);

if (updated !== html) {
  writeFileSync(indexHtmlPath, updated);
  console.log(`sync-faq-jsonld: synced ${faqs.length} FAQ entries from siteData.js into index.html's JSON-LD.`);
} else {
  console.log('sync-faq-jsonld: index.html already up to date.');
}
