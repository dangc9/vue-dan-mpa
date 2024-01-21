## 简介

本项目是基于Vue3 + Vite + TS 的多页面大型MPA项目, 他目前提供了pc用户端模块和后台管理模块的开发编译和打包。
项目支持模块的扩展、支持单独模块运行和打包、也支持全部模块一起运行和打包。

## 技术栈

- [Vue](https://cn.vuejs.org/guide/introduction.html) 现代前端框架，使应用界面开发简单高效，提供流畅的用户体验。
- [Vite](https://cn.vitejs.dev/) 快速构建工具，为项目带来更快的开发速度和响应性能。
- [Typescript](https://github.com/microsoft/TypeScript) 静态类型的JavaScript超集，确保代码质量和可维护性，减少潜在错误。
- [Element-plus](https://element-plus.gitee.io/zh-CN/component/button.html) 基于Vue的精美UI组件库，提供漂亮、功能丰富的界面元素，加速开发进度，让项目外观更专业。
- [Tailwind CSS](https://www.tailwindcss.cn/docs/installation) 强大的CSS框架，提供丰富的可定制样式，快速构建独特的现代界面。
- [Pinia](https://pinia.vuejs.org/zh/introduction.html) 现代化的Vue状态管理库，简单易用，让应用状态管理更高效可靠。
- [Axios](https://github.com/axios/axios) 流行的HTTP客户端，使数据交互更简单，提供稳定的网络请求和响应处理。

## 开发运行

```bash
 # 安装依赖
 pnpm install

 # 本地开发 开启所有模块服务
 npm run dev

 # 本地开发 开启单个模块服务
 npm run dev --page=admin

 # 测试环境打包
 npm run build:stage
 # 单个模块打包
 npm run build:stage --page=admin

 # 生产环境打包
 npm run build:prod
 # 单个模块打包
 npm run build:prod --page=admin

```
