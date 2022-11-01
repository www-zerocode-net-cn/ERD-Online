// https://umijs.org/config/
import {defineConfig} from '@umijs/max';

export default defineConfig({
  publicPath: '/',
  define: {
    API_URL: 'https://erd.zerocode.net.cn'
  },
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
  ],

  // 打包时移除 console
  extraBabelPlugins: ['transform-remove-console'],

});
