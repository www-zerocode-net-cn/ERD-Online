// https://umijs.org/config/
import {defineConfig} from 'umi';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';



const {REACT_APP_ENV} = process.env;

export default defineConfig({
  hash: true,
  dva: {
    hmr: true,
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn

  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {type: 'none'},
  webpack5: {},
  exportStatic: {},
  sass: {},



});
