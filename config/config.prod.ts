// https://umijs.org/config/
import {defineConfig} from 'umi';
import CompressionPlugin from "compression-webpack-plugin";

export default defineConfig({
  publicPath: '/',
  define: {
    API_URL: 'https://www.zerocode.net.cn'
  },
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
  // 生产环境去除console日志打印
  terserOptions: {
    compress: {
      drop_console: true,
    },
  },

  // 打包时移除 console
  extraBabelPlugins: ['transform-remove-console'],
  chainWebpack: function (config, {webpack}) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 1000,
          minChunks: 2,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              //@ts-ignore
              test({resource}) {
                return /[\\/]node_modules[\\/]/.test(resource)
              },
              priority: 10,
            },
          },
        },
      },
    })

    // Gzip压缩
    config.plugin('compression-webpack-plugin').use(CompressionPlugin, [
      {
        test: /\.(js|css|html)$/i, // 匹配
        algorithm: 'gzip',
        threshold: 10240, // 超过10k的文件压缩
        minRatio: 0.8,
        deleteOriginalAssets: false, // 不删除源文件
      },
    ])


  },
});
