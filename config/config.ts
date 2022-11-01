// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import proxy from './proxy';
import routes from './routes';


const {REACT_APP_ENV} = process.env;

export default defineConfig({
  hash: true,
  dva: {

  },
  fastRefresh: true,
  // umi routes: https://umijs.org/docs/routing
  routes,
  title:'ERD Online',
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  deadCode: {},
  headScripts:[
    '/js/g6.min.js',
    '/js/g6-plugins.min.js',
    '/js/html2canvas.min.js',
    '/env-config.js?date='+ new Date(),
  ]


});
