const path              = require('path');
const webpack           = require('webpack');
const config            = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 提取css
const AssetsPlugin = require('assets-webpack-plugin'); // 生成文件名，配合HtmlWebpackPlugin增加打包后dll的缓存
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
    mode: 'production',
    entry: {
        libs: config.dll.libs,
    },
    output: {
        path: path.resolve(__dirname, '../' + config.dll.path),
        filename: '[name].[chunkhash:7].js',
        library: '[name]_library'
    },
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              beautify: false, //不需要格式化
              comments: false //不保留注释
            },
            compress: {
              warnings: false
            }
          }
        })]
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '../' + config.dll.path + '/[name]-mainfest.json'),
            name: '[name]_library',
            context: __dirname // 执行的上下文环境，对之后DllReferencePlugin有用
        }),
        new ExtractTextPlugin('[name].[contenthash:7].css'),
        //  webpack.optimize.UglifyJsPlugin has been removed, please use config.optimization.minimize instead.
        // new webpack.optimize.UglifyJsPlugin({
        //   compress: {
        //     warnings: false
        //   },
        // }),
        new AssetsPlugin({
            filename: 'bundle-config.json',
            path: './' + config.dll.path
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
}
