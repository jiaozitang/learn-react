


# 准备阶段

## 下载源码

首先我们要拥有最新版本的 React 源码，有两种方法：

1. git clone https://github.com/facebook/react.git
2. 通过 jsdelivr CDN 直接下载官方编译好的版本。

由于 git clone 方法需要我们手动编译打包，教程参考 [git clone react 调试源码教程](https://react.iamkasong.com/preparation/source.html#%E6%8B%89%E5%8F%96%E6%BA%90%E7%A0%81)，小编建议直接下载 jsdelivr CDN 上官方编译好的版本，下载地址：[react](https://www.jsdelivr.com/package/npm/react?path=cjs)。

小编选择的是 **react 17.0.2**，jsdelivr CDN 也支持选择其他版本进行下载。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22cc1c72384149f894e11faafb3184ad~tplv-k3u1fbpfcp-watermark.image)

- 下载 [react@17.0.2/umd/react.development.js](https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.js)
- 下载 [react-dom@17.0.2/umd/react-dom.development.js](https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js)

## 调试源码

有了源码之后，我们不能一把梭，直接从第一行读到最后一行，需要找一个入口开始阅读。

通常会选择在入口处，打断点进行调试，跟着断点后执行的函数一步步阅读。

### 本地搭建 React 项目

为了方便引入 react 源码，最简单的方法是使用 create-react-app，create-react-app 自带了 webpack 配置，我们只需要把 react 的引入对象改为我们上文下载的源码即可。

1. create-react-app 新建 react 应用

```
npx create-react-app react-demo
```

2. 进入 react-demo 目录
```
cd react-demo
```

3. 安装依赖
```
npm i
```

4. 安装 [react-app-rewired](https://github.com/timarney/react-app-rewired/blob/master/README_zh.md)
```
npm install react-app-rewired --save-dev
```

5. 修改 package.json script 脚本命令

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8401a4cee1c4a629f5b9b3bf6e8d453~tplv-k3u1fbpfcp-watermark.image)

6. 新增 config-overrides.js 文件

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d890fec7253f4b0693919f73d9695abf~tplv-k3u1fbpfcp-watermark.image)

```
/* config-overrides.js */

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  config.externals = {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  };
  return config;
}
```
7. 在 public/index.html 中引入源码

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7fd9c60596f4d9881cbae8f40457200~tplv-k3u1fbpfcp-watermark.image)

8. 启动 react 项目

```
npm run start
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8dec6df8141498080ce47cdda40ab21~tplv-k3u1fbpfcp-watermark.image)

9. 在源码中添加 console.log('hello world')

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c40417a90402415291261134ed7a5b46~tplv-k3u1fbpfcp-watermark.image)

现在你可以在源码中任意 console.log、debugger 了。

# 参考资料
[我是如何阅读源码的](https://juejin.cn/post/6903335881227108366)

[掘金搜索怎么阅读 react 源码](
https://juejin.cn/search?query=%E6%80%8E%E4%B9%88%E8%AF%BBreact%E6%BA%90%E7%A0%81)