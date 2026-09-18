# FORME AI 虚拟试衣 Demo

面向商场门店横向大屏的 AI 虚拟试衣网页原型。`web-demo/` 是独立的 Vite Web 应用，不依赖微信小程序运行环境。

## Structure

- `miniprogram/`: 历史原型源码，不参与网页 Demo 构建
- `server/`: 历史服务端，不参与当前静态 Demo
- `web-demo/`: 大屏与手机承接网页 Demo，可部署到 Vercel
- `docs/product-brief.md`: 一页产品方案
- `docs/ai-tool-notes.md`: AI 工具、提示词和人工修改说明

## Run the web demo

```bash
cd web-demo
npm install
npm run dev
```

生产构建：`npm run build`。

网页 Demo 使用前端状态和静态数据模拟 AI 生成、库存、锁货、跨店取货与支付承接，不接真实数据库或交易系统。试穿画面由身高范围、整体体型和身体比例共同驱动，并将商品素材映射到对应衣型；未来接入虚拟试衣 API 时可替换这一渲染层。手机提交后直接进入商品承接页；同浏览器标签页通过 `BroadcastChannel` 演示大屏联动，真实跨设备同步需要后端会话服务。

## Deploy to Vercel

在 Vercel 中将 Root Directory 设置为 `web-demo`。项目已包含 `vercel.json`，构建命令为 `npm run build`，输出目录为 `dist`。

## Notes

运行原小程序和服务端前，请复制 `server/.env.example` 为 `server/.env` 并配置真实服务域名、Ark API Key、后台密码和远程模板同步账号。

运行时目录、数据库、生成图片、依赖和构建产物不会提交到仓库。
