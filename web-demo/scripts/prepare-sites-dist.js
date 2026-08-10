import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const serverDir = path.join(dist, 'server');
const openaiDir = path.join(dist, '.openai');

fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(openaiDir, { recursive: true });
fs.copyFileSync(
  path.join(root, '.openai', 'hosting.json'),
  path.join(openaiDir, 'hosting.json'),
);

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
html = html.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
  (_match, src) => {
    const jsPath = path.join(dist, src.replace(/^\//, ''));
    const js = fs.readFileSync(jsPath, 'utf8');
    return `<script type="module">${js}</script>`;
  },
);
html = html.replace(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/,
  (_match, href) => {
    const cssPath = path.join(dist, href.replace(/^\//, ''));
    const css = fs.readFileSync(cssPath, 'utf8');
    return `<style>${css}</style>`;
  },
);

const serverSource = `
const html = ${JSON.stringify(html)};

export default {
  async fetch() {
    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-cache'
      }
    });
  }
};
`;

fs.writeFileSync(path.join(serverDir, 'index.js'), serverSource.trimStart());
console.log('Prepared Sites dist server entry');
