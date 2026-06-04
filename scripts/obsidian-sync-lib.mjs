import { basename, dirname, extname, posix } from 'node:path';

export function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) {
    return { data: {}, body: markdown };
  }

  const end = markdown.indexOf('\n---', 3);
  if (end === -1) {
    return { data: {}, body: markdown };
  }

  const raw = markdown.slice(3, end).trim();
  const body = markdown.slice(end + 4).replace(/^\s+/, '');
  return { data: parseSimpleYaml(raw), body };
}

function parseSimpleYaml(raw) {
  const data = {};
  const lines = raw.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const pair = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!pair) continue;

    const key = pair[1];
    let value = pair[2].trim();

    if (!value) {
      const items = [];
      while (index + 1 < lines.length) {
        const item = lines[index + 1].match(/^\s*-\s*(.*)$/);
        if (!item) break;
        items.push(parseYamlScalar(item[1]));
        index += 1;
      }
      data[key] = items;
      continue;
    }

    data[key] = parseYamlScalar(value);
  }

  return data;
}

function parseYamlScalar(value) {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      return JSON.parse(trimmed.replace(/'/g, '"'));
    } catch {
      return trimmed.slice(1, -1).split(',').map((item) => stripQuotes(item.trim())).filter(Boolean);
    }
  }

  return stripQuotes(trimmed);
}

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, '');
}

export function shouldPublish(data) {
  return data.publish === true || data.publish === 'true';
}

export function slugify(value) {
  return String(value || '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';
}

export function extractObsidianAssets(markdown) {
  const assets = new Set();
  const pattern = /!\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  let match;

  while ((match = pattern.exec(markdown))) {
    assets.add(match[1].trim());
  }

  return [...assets];
}

export function transformObsidianLinks(markdown, slug) {
  return markdown
    .replace(/!\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, rawTarget, rawAlias) => {
      const target = rawTarget.trim();
      const file = basename(target);
      const alt = (rawAlias || basename(file, extname(file))).trim();
      return `![${alt}](/blog-assets/${slug}/${encodePath(file)})`;
    })
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, rawTarget, rawAlias) => {
      return (rawAlias || rawTarget).trim();
    });
}

export function buildAstroPost({ markdown, sourcePath, defaultAuthor = 'LeoninCS', today = currentDate() }) {
  const { data, body } = parseFrontmatter(markdown);
  if (!shouldPublish(data)) return null;

  const sourceName = basename(sourcePath, extname(sourcePath));
  const title = String(data.title || sourceName);
  const slug = slugify(data.slug || title);
  const transformedBody = transformObsidianLinks(body, slug).trim();
  const description = String(data.description || firstParagraph(body) || title);
  const cover = data.cover ? `/blog-assets/${slug}/${encodePath(basename(String(data.cover)))}` : '';
  const assets = unique([
    ...extractObsidianAssets(body),
    ...(data.cover ? [String(data.cover)] : [])
  ]);

  const output = [
    '---',
    `title: ${quote(title)}`,
    `description: ${quote(description)}`,
    `date: ${quote(data.date || today)}`,
    `author: ${quote(data.author || defaultAuthor)}`,
    `cover: ${quote(cover)}`,
    `categories: ${JSON.stringify(normalizeList(data.categories))}`,
    `tags: ${JSON.stringify(normalizeList(data.tags))}`,
    '---',
    '',
    transformedBody,
    ''
  ].join('\n');

  return {
    slug,
    sourcePath,
    sourceDir: dirname(sourcePath),
    markdown: output,
    assets
  };
}

function firstParagraph(body) {
  return body
    .replace(/!\[\[[^\]]+\]\]/g, '')
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias || target)
    .split(/\n{2,}/)
    .map((part) => part.replace(/^#+\s*/, '').trim())
    .find((part) => part && !part.startsWith('```'))
    ?.replace(/\s+/g, ' ')
    .slice(0, 160);
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function quote(value) {
  return JSON.stringify(String(value ?? ''));
}

function encodePath(file) {
  return file.split('/').map(encodeURIComponent).join('/');
}

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

export function assetCandidates(noteDir, assetPath, attachmentDirs = []) {
  const clean = assetPath.replace(/^\/+/, '');
  const candidates = [
    posix.join(noteDir, clean),
    clean,
    posix.join(noteDir, basename(clean)),
    ...attachmentDirs.map((dir) => posix.join(dir.replace(/^\/+|\/+$/g, ''), clean)),
    ...attachmentDirs.map((dir) => posix.join(dir.replace(/^\/+|\/+$/g, ''), basename(clean)))
  ];

  return unique(candidates.map((item) => item.replace(/\\/g, '/')));
}
