import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildObsidianNote,
  buildAstroPost,
  extractObsidianAssets,
  parseFrontmatter,
  shouldPublish,
  slugify,
  transformAstroLinksToObsidian,
  transformObsidianLinks
} from './obsidian-sync-lib.mjs';

test('parses publish frontmatter and arrays', () => {
  const markdown = [
    '---',
    'publish: true',
    'title: "测试文章"',
    'tags: ["Astro", "Obsidian"]',
    'categories:',
    '  - 技术',
    '  - 博客',
    '---',
    '',
    '正文'
  ].join('\n');

  const { data, body } = parseFrontmatter(markdown);

  assert.equal(data.publish, true);
  assert.equal(data.title, '测试文章');
  assert.deepEqual(data.tags, ['Astro', 'Obsidian']);
  assert.deepEqual(data.categories, ['技术', '博客']);
  assert.equal(body.trim(), '正文');
  assert.equal(shouldPublish(data), true);
});

test('slugifies Chinese and Latin titles into stable paths', () => {
  assert.equal(slugify('Hello Astro Sync!'), 'hello-astro-sync');
  assert.equal(slugify('蓝桥杯 C++/B 组'), '蓝桥杯-c-b-组');
});

test('transforms Obsidian embed links and tracks assets', () => {
  const markdown = [
    '# 标题',
    '',
    '![[cover.png]]',
    '![[images/demo chart.png|示例图]]',
    '普通 [[内部链接]] 保留文本。'
  ].join('\n');

  const assets = extractObsidianAssets(markdown);
  const transformed = transformObsidianLinks(markdown, 'my-post');

  assert.deepEqual(assets, ['cover.png', 'images/demo chart.png']);
  assert.match(transformed, /!\[cover\]\(\/blog-assets\/my-post\/cover\.png\)/);
  assert.match(transformed, /!\[示例图\]\(\/blog-assets\/my-post\/demo%20chart\.png\)/);
  assert.match(transformed, /普通 内部链接 保留文本。/);
});

test('builds Astro post frontmatter with defaults', () => {
  const markdown = [
    '---',
    'publish: true',
    'title: "测试文章"',
    'date: "2026-06-04"',
    'cover: "cover.png"',
    '---',
    '',
    '第一段作为摘要内容。',
    '',
    '![[cover.png]]'
  ].join('\n');

  const result = buildAstroPost({
    markdown,
    sourcePath: 'Blog/测试文章.md',
    defaultAuthor: 'LeoninCS',
    today: '2026-06-04'
  });

  assert.equal(result.slug, '测试文章');
  assert.deepEqual(result.assets, ['cover.png']);
  assert.match(result.markdown, /title: "测试文章"/);
  assert.match(result.markdown, /description: "第一段作为摘要内容。"/);
  assert.match(result.markdown, /cover: "\/blog-assets\/测试文章\/cover\.png"/);
  assert.match(result.markdown, /!\[cover\]\(\/blog-assets\/测试文章\/cover\.png\)/);
});

test('builds Obsidian note from Astro post and maps hosted assets', () => {
  const markdown = [
    '---',
    'title: "旧文章"',
    'description: "旧博客文章"',
    'date: "2025-09-30"',
    'author: "LeoninCS"',
    'cover: "/blog-assets/old-post/face.png"',
    'categories: ["技术"]',
    'tags: ["Astro", "Obsidian"]',
    '---',
    '',
    '# 旧文章',
    '',
    '![流程图](/blog-assets/old-post/demo%20chart.png)'
  ].join('\n');

  const transformed = transformAstroLinksToObsidian(markdown, 'old-post');
  const result = buildObsidianNote({
    markdown,
    sourcePath: 'src/content/blog/old-post.md'
  });

  assert.match(transformed, /!\[\[old-post\/demo chart\.png\|流程图\]\]/);
  assert.equal(result.noteName, '旧文章.md');
  assert.deepEqual(result.assets, [
    { sourcePath: 'old-post/face.png', vaultPath: 'old-post/face.png' },
    { sourcePath: 'old-post/demo chart.png', vaultPath: 'old-post/demo chart.png' }
  ]);
  assert.match(result.markdown, /publish: true/);
  assert.match(result.markdown, /slug: "old-post"/);
  assert.match(result.markdown, /cover: "old-post\/face\.png"/);
  assert.match(result.markdown, /!\[\[old-post\/demo chart\.png\|流程图\]\]/);
});
