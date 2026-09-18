# 蓝梅 AI 虚拟试衣 Demo

面向商场门店大屏的 AI 虚拟试衣产品原型。仓库保留原微信小程序、Node.js 服务端与管理后台，并新增可独立运行的网页 Demo。

## Structure

- `miniprogram/`: 微信小程序源码
- `server/`: Express + TypeScript + SQLite 后端
- `web-demo/`: 大屏与手机承接网页 Demo
- `docs/product-brief.md`: 一页产品方案
- `docs/ai-tool-notes.md`: AI 工具、提示词和人工修改说明

## Run the web demo

```bash
cd web-demo
npm install
npm run dev
```

生产构建：`npm run build`。

网页 Demo 使用前端状态和静态数据模拟 AI 生成、库存、锁货、跨店取货与支付承接，不接真实数据库或交易系统。二维码只携带商品、颜色、离散画像和过期时间，不包含原始身体参数。

## Notes

运行原小程序和服务端前，请复制 `server/.env.example` 为 `server/.env` 并配置真实服务域名、Ark API Key、后台密码和远程模板同步账号。

运行时目录、数据库、生成图片、依赖和构建产物不会提交到仓库。
