// const WebpackCdnPlugin = require('webpack-cdn-plugin');

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = process.env.VUE_APP_TITLE; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 8082; // dev port
const isProd = process.env.NODE_ENV === 'production';

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan toå deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: !isProd,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    // before: require('./mock/mock-server.js'),
  },
  filenameHashing: true,
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
    },
  },
  chainWebpack(config) {
    config.devtool(!isProd ? 'source-map' : false);

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial',
      },
    ]);

    config.plugin('html').tap((args) => {
      args[0].title = name;
      return args;
    });

    if (config.plugins.has('extract-css')) {
      const extractCSSPlugin = config.plugin('extract-css');
      extractCSSPlugin &&
        extractCSSPlugin.tap(() => [
          {
            filename: '[name].[hash].css',
            chunkFilename: '[name].[hash].css',
          },
        ]);
    }

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch');

    // if (isProd) {
    //   config.plugin('cdn').use(WebpackCdnPlugin, [
    //     {
    //       modules: [
    //         { name: 'vue', var: 'Vue', path: 'dist/vue.runtime.min.js' },
    //         { name: 'vue-router', var: 'VueRouter', path: 'dist/vue-router.min.js' },
    //         { name: 'vuex', var: 'Vuex', path: 'dist/vuex.min.js' },
    //         { name: 'element-ui', var: 'ELEMENT', path: 'lib/index.js' },
    //       ],
    //       prodUrl: '//cdn.jsdelivr.net/npm/:name@:version/:path',
    //     },
    //   ]);
    // }

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single');
    });
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@dna2.0/styles/variables/index.scss';
          @import '@dna2.0/styles/mixins/index.scss';
        `,
        sassOptions: {
          quietDeps: true,
        },
      },
    },
    extract: process.env.NODE_ENV !== 'development',
  },
};
