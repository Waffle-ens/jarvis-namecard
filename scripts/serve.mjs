import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const port = Number(process.env.PORT || 4173);
const allowed = new Set(['index.html', 'styles.css', 'app.js', 'site-config.js', 'namecard.png', 'share-card.png', 'yoonbo-sim.vcf']);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.vcf': 'text/vcard; charset=utf-8' };

http.createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path === '/' ? 'index.html' : path.slice(1);
    const target = resolve(root, file);
    if (!allowed.has(file) || !target.startsWith(root + sep)) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('페이지를 찾을 수 없습니다.');
      return;
    }
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(file)], 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('잘못된 요청입니다.');
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
