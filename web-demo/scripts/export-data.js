import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Database = require('../../server/node_modules/better-sqlite3');

const root = path.resolve(import.meta.dirname, '..', '..');
const dbPath = path.join(root, 'server', 'data', 'travel_photo.db');
const outPath = path.join(root, 'web-demo', 'src', 'data.js');

if (!fs.existsSync(dbPath)) {
  throw new Error(`Missing database: ${dbPath}. Start/sync the server first.`);
}

const db = new Database(dbPath, { readonly: true });

const shops = db.prepare(`
  SELECT id, shop_code, shop_name, home_image
  FROM shops
  WHERE is_active = 1
  ORDER BY id
`).all();

const templates = db.prepare(`
  SELECT id, style_name, image_url, scene_prompt, category, package_type,
         sub_category, shop_id, shop_name, gender
  FROM templates
  WHERE is_active = 1
  ORDER BY id DESC
`).all();

const data = {
  exportedAt: new Date().toISOString(),
  shops,
  templates,
};

fs.writeFileSync(
  outPath,
  `export const demoData = ${JSON.stringify(data, null, 2)};\n`,
);

console.log(`Exported ${shops.length} shops and ${templates.length} templates to ${outPath}`);
