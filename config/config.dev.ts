// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: '/',
  define: {
    API_URL: 'http://localhost:9502'
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  mfsu:{}
});
