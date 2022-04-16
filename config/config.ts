// https://umijs.org/config/
import {defineConfig} from 'umi';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const {REACT_APP_ENV} = process.env;
const isEnvProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  hash: true,
  antd: {
    dark: true, // 开启暗色主题
  },
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 240,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': '6px',
    'popover-background': '#1f2931',
    'component-background': '#1f2931',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
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
  mfsu: {},
  headScripts: [
    { src: '/js/html2canvas.min.js', defer: true },
    { src: '/js/g6.min.js', defer: true },
    { src: '/js/g6-plugins.min.js', defer: true },
  ],
  // 生产环境去除console日志打印
  terserOptions: {
    compress: {
      drop_console: isEnvProduction,
    },
  },
  chainWebpack(config){
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 2,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test: /^.*node_modules[\\/](?!ag-grid-|lodash|wangeditor|react-virtualized|rc-select|rc-drawer|rc-time-picker|rc-tree|rc-table|rc-calendar|antd).*$/,
              chunks: "all",
              priority: 10,
            },
            virtualized: {
              name: "virtualized",
              test: /[\\/]node_modules[\\/]react-virtualized/,
              chunks: "all",
              priority: 10
            },
            ag: {
              name: "ag",
              test: /[\\/]node_modules[\\/]ag-grid-/,
              chunks: "all",
              priority: 10
            },
            antd: {
              name: "antd",
              test: /[\\/]node_modules[\\/]antd[\\/]/,
              chunks: "all",
              priority: 9
            },
            lodash: {
              name: "lodash",
              test: /[\\/]node_modules[\\/]lodash[\\/]/,
              chunks: "all",
              priority: -2
            },
            handsontable: {
              name: "handsontable",
              test: /[\\/]node_modules[\\/]handsontable[\\/]/,
              chunks: "all",
              priority: 10
            },
            blueprintjs: {
              name: "blueprintjs",
              test: /[\\/]node_modules[\\/]blueprintjs[\\/]/,
              chunks: "all",
              priority: 10
            },
            ace: {
              name: "ace",
              test: /[\\/]node_modules[\\/]ace[\\/]/,
              chunks: "all",
              priority: 10
            },
            xlsx: {
              name: "xlsx",
              test: /[\\/]node_modules[\\/]xlsx[\\/]/,
              chunks: "async",
              priority: 10
            }
          }
        }
      }
    });
    //过滤掉momnet的那些不使用的国际化文件
    config.plugin("replace").use(require("webpack").ContextReplacementPlugin).tap(() => {
      return [/moment[/\\]locale$/, /zh-cn/];
    });
  }

});
