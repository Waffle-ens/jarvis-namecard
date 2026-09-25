import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
await mkdir(output, { recursive: true });
const files = ['index.html', 'styles.css', 'app.js', 'site-config.js', 'namecard.png', 'share-card.png', 'yoonbo-sim.vcf'];
for (const file of files) await copyFile(resolve(root, file), resolve(output, file));

const origin = process.env.SITE_URL;
if (origin) {
  const url = new URL(origin);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('SITE_URL must be a public HTTP(S) URL.');
  url.search = '';
  url.hash = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  const escaped = url.href.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const html = (await readFile(resolve(output, 'index.html'), 'utf8'))
    .replace(/^.*<link rel="canonical"[^>]*>\r?\n/gm, '')
    .replace(/^.*<meta property="og:url"[^>]*>\r?\n/gm, '')
    .replace(/^.*<meta property="og:image"[^>]*>\r?\n/gm, '');
  const imageUrl = new URL('share-card.png', url).href.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  await writeFile(resolve(output, 'index.html'), html.replace('    <title>', `    <link rel="canonical" href="${escaped}" />\n    <meta property="og:url" content="${escaped}" />\n    <meta property="og:image" content="${imageUrl}" />\n    <title>`));
}

const vcard = await readFile(resolve(output, 'yoonbo-sim.vcf'), 'utf8');
await writeFile(resolve(output, 'yoonbo-sim.vcf'), vcard.replace(/\r?\n/g, '\r\n'));
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Built static site in dist/');
