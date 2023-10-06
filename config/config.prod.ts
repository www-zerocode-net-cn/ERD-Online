// https://umijs.org/config/
import {defineConfig} from '@umijs/max';

export default defineConfig({
  publicPath: '/',
  define: {
    API_URL: 'https://app.erdonline.com',
    ERD_API_URL: 'https://app.erdonline.com',
  },
  // 打包时移除 console
  extraBabelPlugins: ['transform-remove-console'],
  esbuildMinifyIIFE: true
});
