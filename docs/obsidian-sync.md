# Obsidian 手动同步

这套脚本把本地 Obsidian `Blog` 文件夹发布到 Astro 博客。

## 1. 安装 Obsidian 插件

在 Obsidian 安装并启用 `Local REST API` 插件，复制插件生成的 API Key。

## 2. 配置本地环境

复制配置模板：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```bash
OBSIDIAN_API_BASE=https://127.0.0.1:27124
OBSIDIAN_API_KEY=你的 API Key
OBSIDIAN_ALLOW_INSECURE_TLS=true
OBSIDIAN_BLOG_DIR=Blog
OBSIDIAN_ATTACHMENT_DIRS=Blog/assets,assets
```

## 3. Obsidian 文章格式

放在 `Blog/` 文件夹下的 Markdown 文章使用如下 frontmatter：

```md
---
publish: true
title: "文章标题"
slug: "post-slug"
description: "文章摘要"
date: "2026-06-04"
categories: ["技术"]
tags: ["Astro", "Obsidian"]
cover: "cover.png"
---

正文内容。

![[cover.png]]
```

字段说明：

- `publish: true`：进入博客同步。
- `slug`：生成 `src/content/blog/<slug>.md`，可省略，省略时用标题生成。
- `cover`：复制到 `static/blog-assets/<slug>/cover.png` 并写入文章封面。
- `![[image.png]]`：转换为 Astro 可访问的 `/blog-assets/<slug>/image.png`。
- `[[内部链接]]`：转换成普通文本。

## 4. 手动同步

只同步文件：

```bash
npm run sync:obsidian
```

同步、构建、提交、推送：

```bash
npm run publish:obsidian
```

推送到 `main` 后，GitHub Pages workflow 会构建 Astro 并发布 `dist`。

## 5. 校验

同步逻辑测试：

```bash
npm run test:obsidian
```

站点构建：

```bash
npm run build
```
