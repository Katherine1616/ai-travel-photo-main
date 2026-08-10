# AI Travel Photo MVP

AI 旅拍 / AI 试衣微信小程序 MVP，包含微信小程序端、Node.js 后端、管理后台和一个已拆分的网页 Demo。

## Structure

- `miniprogram/`: 微信小程序源码
- `server/`: Express + TypeScript + SQLite 后端
- `web-demo/`: 静态网页 Demo

## Notes

运行前请复制 `server/.env.example` 为 `server/.env` 并配置真实服务域名、Ark API Key、后台密码和远程模板同步账号。

运行时目录、数据库、生成图片、依赖和构建产物不会提交到仓库。
