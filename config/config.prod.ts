// https://umijs.org/config/
import {defineConfig} from '@umijs/max';

export default defineConfig({
  publicPath: '/',
  define: {
    API_URL: 'https://www.zerocode.net.cn'
  },
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
  ],
  // 生产环境去除console日志打印
  terserOptions: {
    compress: {
      drop_console: true,
    },
  },

  // 打包时移除 console
  extraBabelPlugins: ['transform-remove-console'],

});
