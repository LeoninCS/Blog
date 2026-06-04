# LeoninCS’s Blog

布洛克琴的个人 Blog，使用 Astro 构建，记录学习笔记、技术实践、项目复盘和生活观察。

## 技术栈

- Astro
- TypeScript
- Markdown Content Collections
- GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

构建静态站点：

```bash
npm run build
```

## Obsidian 手动同步

复制本地配置模板：

```bash
cp .env.example .env.local
```

填写 Obsidian Local REST API Key 后，同步文章：

```bash
npm run sync:obsidian
```

同步、构建、提交并推送：

```bash
npm run publish:obsidian
```

详细说明见 [docs/obsidian-sync.md](docs/obsidian-sync.md)。

## 部署

推送到 `main` 后，GitHub Actions 会构建 Astro 并发布到 GitHub Pages。
