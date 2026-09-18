# AI 工具使用说明

## 使用工具

- Codex：梳理原仓库结构、产品流程、前端实现、响应式适配、Git 管理和部署。
- GitHub CLI / GitHub：检索并审阅相近的虚拟试衣、门店大屏与 API Demo。
- 浏览器自动化：逐步验证大屏主链路、精细参数表单、二维码手机页、尺码选择和异常状态。

## 关键提示词

> 设计一个商场门店 AI 虚拟试衣大屏网页原型，不上传真人照片；保留快速选择和手机填写两种人物入口；重点展示生成等待、失败、隐私和从试穿到购买的转化路径。

> 真实后端不实现。将身高、体重、胸腰臀映射为离散画像；AI 生成、库存、锁货、支付和跨店取货用可点击 Demo 状态表达，但不伪装为真实连接。

## 借鉴与取舍

- [Genlook virtual try-on API example](https://github.com/GenlookLabs/virtual-try-on-api-example)：借鉴任务提交、轮询、成功/失败状态；本项目只保留前端状态机。
- [codebuddy-aifit-demo](https://github.com/yihui-dev/codebuddy-aifit-demo)：参考选款与试穿入口；本项目实现为独立网页的大屏加手机承接。
- [StyleMirror virtual try-on kiosk](https://github.com/sk1143734-ops/stylemirror-v11)：参考门店 Kiosk 场景；本项目弱化摄像头和实时 AR，强调匿名参数建模。
- [3D Virtual Fitting Room](https://github.com/monkog/3D-Virtual-Fitting-Room)：用于判断 Kinect/3D 实时叠加的技术成本，因此不进入本轮 MVP。
- [FASHN ComfyUI integration](https://github.com/fashn-AI/ComfyUI-FASHN)：用于理解真实生成服务的接入边界；本 Demo 不调用第三方模型。

只借鉴交互模式和产品状态，没有复制上述仓库代码或素材。

## 本人主要修改

重新定义 16:9 门店大屏信息架构与独立 FORME 品牌；整理六款现代服装与模拟库存；设计两类人物入口及九种内部映射画像；生成六件无模特服装素材板，并实现随身高、体型和身体比例变化的剪影人台与服装映射；实现生成进度、失败、超时、45 秒清除、二维码手机结果、尺码与四类履约路径；补充手机提交跳转、同浏览器联动和 Vercel 部署配置。产品判断、流程边界、隐私规则、文案和最终交互均由本人审阅调整。
