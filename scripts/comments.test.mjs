import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('giscus comments use the configured repository and discussion category', async () => {
  const component = await readFile('src/components/Comments.astro', 'utf8');
  const layout = await readFile('src/layouts/PostLayout.astro', 'utf8');

  assert.match(component, /https:\/\/giscus\.app\/client\.js/);
  assert.match(component, /data-repo="LeoninCS\/Blog"/);
  assert.match(component, /data-repo-id="R_kgDOP534OA"/);
  assert.match(component, /data-category="General"/);
  assert.match(component, /data-category-id="DIC_kwDOP534OM4C-fJV"/);
  assert.match(component, /data-mapping="pathname"/);
  assert.match(component, /data-theme="preferred_color_scheme"/);
  assert.match(component, /data-lang="zh-CN"/);
  assert.match(layout, /import Comments from '\.\.\/components\/Comments\.astro';/);
  assert.match(layout, /<Comments \/>/);
});
