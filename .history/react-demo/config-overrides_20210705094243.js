/* config-overrides.js */

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  config.externals = {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  };
  return config;
}

作者：Shenfq
链接：https://juejin.cn/post/6903335881227108366
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。