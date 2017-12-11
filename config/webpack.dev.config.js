const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const base = require('./webpack.base.config');
const config = require('./config');

const manifest = require(`${config.path.dll}/manifest.dev.json`);

base.devServer = {
  contentBase: config.path.output,
  publicPath: config.path.public,
  historyApiFallback: true,
  hot: true,
  host: config.host,
  port: config.port,
};

base.plugins.push(new webpack.HotModuleReplacementPlugin());
base.plugins.push(new webpack.NamedModulesPlugin());
base.plugins.push(new webpack.DllReferencePlugin({
  context: config.path.root,
  manifest: manifest,
}));
base.plugins.push(new AddAssetHtmlPlugin({
  filepath: `${config.path.dll}/*.dev.dll.js`,
}));

module.exports = base;
