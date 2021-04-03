# 百度前端学院2016春季任务

本项目为前端入门练习，完整任务列表参见[百度前端技术学院](http://ife.baidu.com/2016/task/all)，已完成任务部署在[IFE2016任务](https://yioneko.github.io/ife-2016-spring/)。

## 开发
本项目前期使用原生HTML/CSS/JavaScript，后期转向TypeScript，CSS预处理器Sass，以及React框架。

本地开发服务器：
```shell
yarn dev
```

## 构建
由于本项目前期并没有引入JavaScript，且Webpack对多HTML文件入口打包的支持欠缺，因此本项目使用了原生支持多HTML文件入口打包的[Vite](https://vitejs.dev/guide/build.html#multi-page-app)。

打包命令：
```shell
yarn build
```
预览：
```shell
yarn preview
```
> 注意：由于使用Vite打包，因此本项目不支持没有ES6模块支持的浏览器。(请尽量使用Chrome, Edge, Firefox以及其他较新内核版本的Chromium系浏览器进行开发、测试。)

### Code review is welcome.
