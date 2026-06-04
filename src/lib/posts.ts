import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getSortedPosts() {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getPostUrl(post: BlogPost) {
  return `/posts/${post.id.replace(/\.md$/, '')}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long'
  }).format(date);
}

export function readTime(post: BlogPost) {
  const words = (post.body ?? '').replace(/```[\s\S]*?```/g, '').replace(/<[^>]+>/g, '').length;
  return Math.max(1, Math.ceil(words / 500));
}
