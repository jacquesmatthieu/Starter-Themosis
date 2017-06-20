const config              = require('./config.json'),
      packageJson         = require('../package.json'),
      path                = require('path'),
      webpack             = require('webpack'),
      ManifestPlugin      = require('webpack-manifest-plugin'),
      ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
      WebpackChunkHash    = require('webpack-chunk-hash'),
      HtmlWebpackPlugin   = require('html-webpack-plugin'),
      glob                = require('glob-all'),
      ExtractCSS          = require('extract-text-webpack-plugin'),
      WatchTimePlugin     = require('webpack-watch-time-plugin'),
      autoprefixer        = require('autoprefixer'),
      disclaimer          = require('./disclaimer'),
      StyleLintPlugin     = require('stylelint-webpack-plugin'),

      npmDependencies     = Object.keys(packageJson && packageJson.dependencies || {}),
      listVendor          = glob.sync(path.resolve(__dirname, config.jsVendorPath + '/**/*.js')),
      allVendor           = npmDependencies.concat(listVendor),
      publicPath          = path.resolve(__dirname, config.publicPath),
      isDevelopmentServer = process.argv[process.argv.length - 1] === '--env.dev-server',
      isDevelopment       = process.argv[process.argv.length - 1] === '--env.development',
      isStaging           = process.argv[process.argv.length - 1] === '--env.staging',
      isProduction        = process.argv[process.argv.length - 1] === '--env.production',

      babelSettings       = {
          extends: path.resolve(__dirname, './.babelrc')
      },

      output              = {
          path: publicPath,
          filename: isProduction ? 'dist/js/[name].[chunkhash].js' : 'dist/js/[name].js',
          sourceMapFilename: '[file].map',
          chunkFilename: isProduction ? 'dist/js/chunks/[name].[chunkhash].js' : 'dist/js/chunks/[name].js',
          publicPath: '' // Important to find polyfills
      };

console.info(disclaimer(packageJson.version, isProduction ? 'production' : 'development'));

let entry = {
    main: [path.resolve(__dirname, config.jsEntry), path.resolve(__dirname, config.scssEntry)],
    vendor: allVendor
};

let plugins = isProduction ? [new webpack.optimize.UglifyJsPlugin(config.uglifyJS), new webpack.HashedModuleIdsPlugin()] : [new webpack.NamedModulesPlugin()];

if (isDevelopmentServer) {
    plugins = plugins.concat(new webpack.HotModuleReplacementPlugin());
} else {
    plugins = plugins.concat(
            new StyleLintPlugin({
                configFile: './config/.stylelintrc',
                quiet: true, // Use webpack performances hints entry instead
                syntax: 'scss',
                context: path.resolve(__dirname, config.scssPath),
                failOnError: false,
                emitErrors: false
            })
    );
}

plugins = plugins.concat(
        WatchTimePlugin,
        new WebpackChunkHash(),
        new ManifestPlugin({
            fileName: 'dist/js/manifests/manifest.json'
        }),
        new ChunkManifestPlugin({
            filename: 'dist/js/manifests/chunks-manifest.json',
            manifestVariable: 'webpackManifest'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            minify: {
                minifyJS: true
            },
            template: './src/views/scripts.twig.js',
            filename: publicPath + '/resources/views/dist/scripts.twig'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            minify: {
                minifyJS: true
            },
            template: './src/views/links.twig.js',
            filename: publicPath + '/resources/views/dist/links.twig'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isProduction ? JSON.stringify('production') : JSON.stringify('development'),
                WEBPACK: true,
                BUILD_DATE: JSON.stringify((new Date).toString()),
                PACKAGE_VERSION: JSON.stringify(packageJson.version)
            }
        }),
        new webpack.ProvidePlugin({
            Promise: 'bluebird',
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks: Infinity
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            options: {
                context: '/',
                sassLoader: {
                    includePaths: [path.resolve(__dirname, config.scssPath)]
                },
                postcss: [
                    autoprefixer({
                        browsers: config.browserCompatibilities
                    })
                ],
                eslint: {
                    quiet: true, // Use webpack performances hints entry instead
                    configFile: './config/.eslintrc',
                    failOnWarning: false,
                    failOnError: true,
                    emitError: false,
                    emitWarning: false,
//                    formatter: require("eslint/lib/formatters/stylish"),
                    formatter: require("eslint-friendly-formatter"),
                }
            }
        }),
        new ExtractCSS({
            filename: isProduction ? 'dist/css/main.[contenthash:20].css' : 'dist/css/main.css',
            allChunks: true
        })
);

module.exports = {
    target: 'web',
    entry: entry,
    output: output,
    plugins: plugins,
    watch: !isProduction && !isStaging,
    devtool: !isProduction ? 'source-map' : '',
    resolve: {
        extensions: ['.js', '.scss']
    },
    performance: {
        hints: isProduction ? "warning" : false
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'eslint-loader',
                exclude: /node_modules|polyfills|vendor/
            },
            {
                test: require.resolve('jquery'),
                use: 'expose-loader?$!expose-loader?jQuery'
            },
            {
                test: /\.js?$/,
                use: 'babel-loader?' + JSON.stringify(babelSettings),
                include: path.resolve(__dirname, '../src/js'),
                exclude: /node_modules/
            },
            {
                test: /\.scss/,
                use: ExtractCSS.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader?' + JSON.stringify({sourceMap: !isProduction}),
                        'postcss-loader',
                        'sass-loader?' + JSON.stringify({sourceMap: !isProduction})
                    ]
                }),
                include: path.resolve(__dirname, '../src/scss')
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                include: path.resolve(__dirname, '../src/assets/fonts'),
                use: 'file-loader?' + JSON.stringify({
                    name: '[name].[ext]',
                    publicPath: '../../',
                    outputPath: 'dist/fonts/',
                    emitFile: true
                })
            },
            {
                test: /\.jpe?g$/,
                include: path.resolve(__dirname, '../src/assets/img/jpg'),
                use: 'file-loader?' + JSON.stringify({
                    name: '[name].[ext]',
                    publicPath: '../../',
                    outputPath: 'dist/img/png/',
                    emitFile: true
                })
            },
            {
                test: /\.png$/,
                include: path.resolve(__dirname, '../src/assets/img/png'),
                use: 'file-loader?' + JSON.stringify({
                    name: '[name].[ext]',
                    publicPath: '../../',
                    outputPath: 'dist/img/png/',
                    emitFile: true
                })
            },
            {
                test: /\.svg$/,
                include: path.resolve(__dirname, '../src/assets/img/svg'),
                use: 'file-loader?' + JSON.stringify({
                    name: '[name].[ext]',
                    publicPath: '../../',
                    outputPath: 'dist/img/svg/',
                    emitFile: true
                })
            }
        ]
    },
    devServer: {
        hot: true,
        compress: true,
        port: 80,
        stats: {chunks: false}
    }
};
