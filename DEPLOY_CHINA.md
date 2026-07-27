# Anji Travel OS 国内可访问部署方案

当前项目仍保留 Vercel 国际版，同时可以把同一份 Vite 静态产物部署到国内静态托管。

## 先确认：项目可以纯静态部署

在项目根目录执行：

```bash
npm install
npm run build
```

成功后会生成 `dist/`。这个目录包含网站运行所需的 HTML、JS、CSS、图片、字体图标和 PWA manifest，可以直接上传到静态网站托管。

当前项目：

- 不使用 Vercel Serverless Functions。
- 不使用 Vercel Runtime API。
- Supabase 只通过浏览器端 SDK 访问，配置在构建时注入。
- 没有 history-based 前端路由，页面内导航使用 hash anchor；因此当前版本上传 `dist/` 后不需要额外的路由服务。
- 如果后续增加 React Router 等 history 路由，需要把未知路径 fallback 到 `index.html`。

## Supabase 环境变量

项目已经保留 Supabase 云端同步能力。不要把真实 `.env` 文件提交到 GitHub。

本地配置：

```bash
cp .env.example .env.local
```

然后填写：

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

这两个变量会在 `npm run build` 时注入前端 bundle。`VITE_SUPABASE_ANON_KEY` 只能配合 Supabase RLS 使用，不要把 service role key 放进前端。

如果变量为空：

- 页面进入本地演示模式。
- Today、日期切换、Memory、投票和清单仍然可以浏览和操作。
- 页面顶部会显示本地演示提示。

如果变量已配置：

- 照片、Packing List、地点候选和投票使用 Supabase。
- 两台手机通过同一份云端数据共享。
- 需要先执行项目内的 `supabase/schema.sql`。

注意：国内静态托管只解决前端页面访问问题。如果用户所在网络无法访问 Supabase，云端同步仍会失败；这种情况下页面会保留 fallback，不会白屏，后续再考虑国内数据服务或代理层。

## 方案 A：自定义域名绑定 Vercel（优先尝试）

`.vercel.app` 在中国大陆可能访问不稳定。绑定自己的域名有时可以提高可访问概率，但不能保证所有网络环境稳定。

操作步骤：

1. 打开 Vercel 项目。
2. 进入 **Settings → Domains**。
3. 添加你的自定义域名，例如 `anji.example.com`。
4. 到域名服务商的 DNS 控制台添加 Vercel 提示的记录，通常是 CNAME 或 A 记录。
5. 等待 DNS 生效，回到 Vercel 确认域名状态为已验证。
6. 在 Vercel 的 **Settings → Environment Variables** 中配置：

   ```text
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```

7. 重新部署一次，让环境变量进入新的前端构建。

Vercel 版本继续保留，GitHub 的 `main` 更新也继续由 Vercel 自动部署。

## 方案 B：腾讯云 CloudBase / 静态网站托管

适合快速提供一个国内访问入口。CloudBase 静态网站托管支持 HTML、CSS、JavaScript 静态资源，并可以配置默认首页和重定向规则；正式使用时建议绑定自定义域名，不要长期依赖平台默认域名。

部署步骤：

1. 本地构建：

   ```bash
   npm run build
   ```

2. 在腾讯云 CloudBase 创建环境，进入 **静态网站托管**。
3. 将本地 `dist/` 目录中的全部内容上传到静态托管文件根目录，不要再套一层 `dist/` 文件夹。
4. 将默认首页文档设置为 `index.html`。
5. 当前项目使用 hash 导航，不需要 history fallback；如果未来加入 history 路由，在 CloudBase 路由配置中把未知前端路径重定向到 `index.html`。
6. 如果通过 Git 构建而不是手动上传，在构建设置中使用：

   ```text
   Install: npm install
   Build: npm run build
   Output: dist
   ```

7. 在 CloudBase 的构建环境变量中填入 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`，不要把真实值写进仓库。
8. 发布后分别测试首页、`/manifest.webmanifest`、`/icons/icon-192.png` 和 Supabase 同步。

如果使用控制台直接上传 `dist/`，环境变量不会自动改变已经生成的 JS；需要先在本地 `.env.local` 填好变量，再重新 `npm run build`，然后上传新的 `dist/`。

## 方案 C：阿里云 OSS + CDN

适合希望对静态资源、缓存、域名和后续 CDN 有更多控制的场景。OSS 静态网站托管支持设置默认首页和错误文档；对于 SPA，错误文档可以设置为 `index.html`，响应码设置为 200，避免刷新前端路径时出现 404。

部署步骤：

1. 本地构建：

   ```bash
   npm run build
   ```

2. 创建 OSS Bucket，区域按访问人群和后续 CDN 规划选择。
3. 将 `dist/` 内的全部文件上传到 Bucket 根目录。
4. 开启静态网站托管：

   ```text
   默认首页：index.html
   默认错误文档：index.html
   错误响应码：200（仅在使用 history SPA 路由时需要）
   ```

   当前项目主要使用 hash 导航，即使不配置 history fallback 也能正常使用；保留上述配置可以为未来前端路由扩展做准备。

5. 如果通过自定义域名访问，按 OSS 控制台提示配置 DNS CNAME。
6. 如果接入 CDN，将 OSS 作为源站，缓存 CSS、JS、图片和字体；发布新版本后刷新 CDN 缓存，避免旧 bundle 被继续缓存。
7. 在中国大陆使用自定义域名和 CDN，通常需要完成 ICP 备案；具体以域名、Bucket 区域、CDN 产品和云服务商当前要求为准。
8. Supabase 环境变量需要在构建前写入 `.env.local`，然后重新构建上传；OSS 本身不会在运行时替换 Vite 环境变量。

## 三种方案怎么选

| 方案 | 适合 | 需要注意 |
| --- | --- | --- |
| Vercel + 自定义域名 | 最省事，继续使用 GitHub 自动部署 | 中国大陆访问仍不能保证稳定 |
| CloudBase 静态托管 | 快速增加国内静态入口 | 正式访问建议绑定自定义域名 |
| OSS + CDN | 更可控、更适合长期国内访问 | 配置较多，通常涉及 ICP 备案 |

## 每次更新的建议流程

```bash
git pull
npm install
npm run build
```

然后：

- Vercel：推送 GitHub，自动部署。
- CloudBase：重新上传新的 `dist/`，或触发 Git 构建。
- OSS：同步新的 `dist/` 到 Bucket，并按需刷新 CDN 缓存。

两套部署使用同一份源码、同一套 Supabase 环境变量和同一套数据，不需要维护两份前端代码。

## 官方文档

- [腾讯云 CloudBase 静态网站托管](https://cloud.tencent.com/document/product/876/123943)
- [腾讯云 CloudBase 静态网站托管配置与路由](https://cloud.tencent.com/document/product/876/46900)
- [阿里云 OSS 静态网站托管](https://help.aliyun.com/zh/oss/user-guide/hosting-static-websites)
