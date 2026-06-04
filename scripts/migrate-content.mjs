import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePosts = path.join(root, 'content', 'post');
const blogDir = path.join(root, 'src', 'content', 'blog');
const assetsDir = path.join(root, 'static', 'blog-assets');

const slugMap = new Map([
  ['Go微服务网关开发(1)--概念介绍', 'go-gateway-concepts'],
  ['Go微服务网关开发(2)--路由转发功能的实现', 'go-gateway-routing'],
  ['Go微服务网关开发(3)：负载均衡功能的实现', 'go-gateway-load-balancing'],
  ['Hugo+GitHub快速搭建个人博客', 'hugo-github-blog'],
  ['图文讲解：分布式系统、微服务架构与服务器集群的区别与联系', 'distributed-microservices-cluster'],
  ['常用C++算法模板与例题( 偏自用)', 'cpp-algorithm-templates']
]);

const yamlQuote = (value) => JSON.stringify(String(value ?? ''));

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) {
    return [{}, markdown];
  }

  const end = markdown.indexOf('\n---', 3);
  if (end === -1) {
    return [{}, markdown];
  }

  const raw = markdown.slice(3, end).trim();
  const body = markdown.slice(end + 4).replace(/^\s+/, '');
  const data = {};
  let currentList = null;

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const listItem = line.match(/^\s*-\s*["']?(.*?)["']?\s*$/);
    if (listItem && currentList) {
      data[currentList].push(listItem[1]);
      continue;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!pair) continue;

    const key = pair[1];
    let value = pair[2].trim();
    currentList = null;

    if (!value) {
      data[key] = [];
      currentList = key;
      continue;
    }

    value = value.replace(/^["']|["']$/g, '');
    data[key] = value;
  }

  return [data, body];
}

function rewriteImageLinks(body, slug) {
  return body
    .replace(/\]\((?!https?:\/\/|\/|#)([^)]+?\.(?:png|jpe?g|gif|webp|svg))\)/gi, (_, file) => {
      const encoded = file.split('/').map(encodeURIComponent).join('/');
      return `](/blog-assets/${slug}/${encoded})`;
    })
    .replace(/[]/g, '');
}

async function migratePost(entry) {
  const sourceDir = path.join(sourcePosts, entry);
  const markdownPath = path.join(sourceDir, 'index.md');
  const info = await stat(markdownPath).catch(() => null);
  if (!info?.isFile()) return;

  const slug = slugMap.get(entry) ?? entry
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '');

  const markdown = await readFile(markdownPath, 'utf8');
  const [frontmatter, body] = parseFrontmatter(markdown);
  const mediaDir = path.join(assetsDir, slug);
  await mkdir(mediaDir, { recursive: true });

  for (const item of await readdir(sourceDir)) {
    if (item === 'index.md') continue;
    const itemPath = path.join(sourceDir, item);
    const itemStat = await stat(itemPath);
    if (itemStat.isFile()) {
      await cp(itemPath, path.join(mediaDir, item));
    }
  }

  const cover = frontmatter.image ? `/blog-assets/${slug}/${encodeURIComponent(frontmatter.image)}` : '';
  const output = [
    '---',
    `title: ${yamlQuote(frontmatter.title)}`,
    `description: ${yamlQuote(frontmatter.description)}`,
    `date: ${yamlQuote(frontmatter.date)}`,
    `author: ${yamlQuote(frontmatter.author || 'LeoninCS')}`,
    `cover: ${yamlQuote(cover)}`,
    `categories: ${JSON.stringify(frontmatter.categories || [])}`,
    `tags: ${JSON.stringify(frontmatter.tags || [])}`,
    '---',
    '',
    rewriteImageLinks(body, slug).trim(),
    ''
  ].join('\n');

  await writeFile(path.join(blogDir, `${slug}.md`), output);
}

await rm(blogDir, { recursive: true, force: true });
await rm(assetsDir, { recursive: true, force: true });
await mkdir(blogDir, { recursive: true });
await mkdir(assetsDir, { recursive: true });

const entries = await readdir(sourcePosts);
for (const entry of entries) {
  await migratePost(entry);
}

console.log(`Migrated ${entries.length} post directories.`);
