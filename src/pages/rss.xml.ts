import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSortedPosts, getPostUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();

  return rss({
    title: 'LeoninCS’s Blog',
    description: '学习记录、技术分享、偶尔发些日常生活。',
    site: context.site ?? 'https://xianchaoqian.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: getPostUrl(post)
    }))
  });
}
