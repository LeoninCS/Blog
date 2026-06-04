import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path, { basename } from 'node:path';

import { assetCandidates, buildAstroPost } from './obsidian-sync-lib.mjs';

const root = process.cwd();
const env = await loadEnv(path.join(root, '.env.local'));

if (env.OBSIDIAN_ALLOW_INSECURE_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const config = {
  apiBase: env.OBSIDIAN_API_BASE || 'https://127.0.0.1:27124',
  apiKey: env.OBSIDIAN_API_KEY,
  blogDir: trimSlashes(env.OBSIDIAN_BLOG_DIR || 'Blog'),
  attachmentDirs: splitList(env.OBSIDIAN_ATTACHMENT_DIRS || ''),
  defaultAuthor: env.OBSIDIAN_DEFAULT_AUTHOR || 'LeoninCS',
  contentDir: path.join(root, env.OBSIDIAN_CONTENT_DIR || 'src/content/blog'),
  assetsDir: path.join(root, env.OBSIDIAN_ASSETS_DIR || 'static/blog-assets')
};

if (!config.apiKey) {
  throw new Error('缺少 OBSIDIAN_API_KEY，请先复制 .env.example 为 .env.local 并填写 Local REST API Key。');
}

const entries = await listMarkdownFiles(config.blogDir);
const posts = [];

for (const entry of entries) {
  const markdown = await getVaultText(entry);
  const post = buildAstroPost({
    markdown,
    sourcePath: entry,
    defaultAuthor: config.defaultAuthor
  });

  if (post) posts.push(post);
}

await mkdir(config.contentDir, { recursive: true });

for (const post of posts) {
  await writeFile(path.join(config.contentDir, `${post.slug}.md`), post.markdown);

  const postAssetsDir = path.join(config.assetsDir, post.slug);
  await rm(postAssetsDir, { recursive: true, force: true });
  await mkdir(postAssetsDir, { recursive: true });

  for (const asset of post.assets) {
    const bytes = await getFirstExistingAsset(post.sourceDir, asset);
    await writeFile(path.join(postAssetsDir, basename(asset)), bytes);
  }
}

console.log(`同步完成：${posts.length} 篇文章`);
for (const post of posts) {
  console.log(`- ${post.slug}`);
}

async function listMarkdownFiles(dir) {
  let listing;
  try {
    listing = await getVaultJson(dir);
  } catch (error) {
    if (error.status === 404) {
      const root = await getVaultJson('').catch(() => null);
      const rootFiles = Array.isArray(root?.files) && root.files.length ? root.files.join('、') : '空';
      throw new Error(`Obsidian 中没有找到 "${dir}" 文件夹。当前 vault 根目录：${rootFiles}`);
    }
    throw error;
  }

  const items = Array.isArray(listing?.files) ? listing.files : Array.isArray(listing) ? listing : [];
  const paths = [];

  for (const item of items) {
    const itemPath = typeof item === 'string' ? item : item?.path || item?.name;
    if (!itemPath) continue;

    const fullPath = itemPath.startsWith(`${dir}/`) ? itemPath : `${dir}/${itemPath}`;
    if (fullPath.endsWith('.md')) paths.push(fullPath);
  }

  return paths.sort();
}

async function getFirstExistingAsset(noteDir, asset) {
  const candidates = assetCandidates(noteDir, asset, config.attachmentDirs);
  const errors = [];

  for (const candidate of candidates) {
    try {
      return await getVaultBytes(candidate);
    } catch (error) {
      errors.push(`${candidate}: ${error.message}`);
    }
  }

  throw new Error(`读取附件失败：${asset}\n${errors.join('\n')}`);
}

async function getVaultJson(vaultPath) {
  const response = await requestVault(vaultPath, { headers: { Accept: 'application/json' } });
  return response.json();
}

async function getVaultText(vaultPath) {
  const response = await requestVault(vaultPath, { headers: { Accept: 'text/markdown, text/plain, */*' } });
  return response.text();
}

async function getVaultBytes(vaultPath) {
  const response = await requestVault(vaultPath);
  return Buffer.from(await response.arrayBuffer());
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
    const error = new Error(`${response.status} ${response.statusText}${text ? ` ${text}` : ''}`);
    error.status = response.status;
    throw error;
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

function splitList(value) {
  return value.split(',').map((item) => trimSlashes(item.trim())).filter(Boolean);
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
}
