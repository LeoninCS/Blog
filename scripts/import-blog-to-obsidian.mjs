import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { buildObsidianNote } from './obsidian-sync-lib.mjs';

const root = process.cwd();
const env = await loadEnv(path.join(root, '.env.local'));

if (env.OBSIDIAN_ALLOW_INSECURE_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const config = {
  apiBase: env.OBSIDIAN_API_BASE || 'https://127.0.0.1:27124',
  apiKey: env.OBSIDIAN_API_KEY,
  blogDir: trimSlashes(env.OBSIDIAN_BLOG_DIR || 'Blog'),
  assetDir: trimSlashes(env.OBSIDIAN_IMPORT_ASSET_DIR || 'Blog/assets'),
  contentDir: path.join(root, env.OBSIDIAN_CONTENT_DIR || 'src/content/blog'),
  localAssetsDir: path.join(root, env.OBSIDIAN_ASSETS_DIR || 'static/blog-assets')
};

if (!config.apiKey) {
  throw new Error('缺少 OBSIDIAN_API_KEY，请先复制 .env.example 为 .env.local 并填写 Local REST API Key。');
}

const entries = await readdir(config.contentDir, { withFileTypes: true });
const posts = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => path.join(config.contentDir, entry.name))
  .sort();

const imported = [];

for (const postPath of posts) {
  const markdown = await readFile(postPath, 'utf8');
  const note = buildObsidianNote({
    markdown,
    sourcePath: postPath
  });

  await putVaultText(`${config.blogDir}/${note.noteName}`, note.markdown);

  for (const asset of note.assets) {
    const bytes = await readFile(path.join(config.localAssetsDir, asset.sourcePath));
    await putVaultBytes(`${config.assetDir}/${asset.vaultPath}`, bytes);
  }

  imported.push({
    noteName: note.noteName,
    assets: note.assets.length
  });
}

console.log(`导入完成：${imported.length} 篇文章`);
for (const item of imported) {
  console.log(`- ${item.noteName}（附件 ${item.assets} 个）`);
}

async function putVaultText(vaultPath, text) {
  await requestVault(vaultPath, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    body: text
  });
}

async function putVaultBytes(vaultPath, bytes) {
  await requestVault(vaultPath, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: bytes
  });
}

async function requestVault(vaultPath, init = {}) {
  const url = new URL(`/vault/${vaultPath.split('/').map(encodeURIComponent).join('/')}`, config.apiBase);
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`${init.method || 'GET'} ${vaultPath}: ${response.status} ${response.statusText}${text ? ` ${text}` : ''}`);
  }

  return response;
}

async function loadEnv(file) {
  const content = await readFile(file, 'utf8').catch(() => '');
  const result = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const pair = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!pair) continue;

    result[pair[1]] = pair[2].replace(/^["']|["']$/g, '');
  }

  return result;
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
}
