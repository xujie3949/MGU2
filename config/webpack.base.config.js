const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Autoprefixer = require('autoprefixer');

const config = require('./config');

const extractStyle = new ExtractTextPlugin({
  filename: 'style.[chunkhash].css',
  allChunks: true,
});

module.exports = {
  resolve: {
    alias: {
      Src: config.path.src,
      Images: config.path.images,
      Styles: config.path.styles,
      Utils: config.path.utils,
      Components: config.path.components,
      Models: config.path.models,
      Stores: config.path.stores,
      Services: config.path.services,
      Commands: config.path.commands,
    },
  },
  entry: [
    'babel-polyfill',
    `${config.path.src}index`,
  ],
  output: {
    path: config.path.output,
    publicPath: config.path.public,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkHash].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.styl$/,
        use: extractStyle.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                localIdentName: '[path]-[name]-[local]-[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: [
                  Autoprefixer(),
                ],
              },
            },
            'stylus-loader',
          ],
        }),
      },
      {
        test: /\.css/,
        use: extractStyle.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([config.path.output], {
      root: config.path.root,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: config.path.htmlTemplate,
      favicon: config.path.favicon,
      filename: `${config.path.output}/index.html`,
      hash: false,
      inject: 'body',
    }),
    extractStyle,
  ],
};
