const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const base = require('./webpack.base.config');
const config = require('./config');

const manifest = require(`${config.path.dll}/manifest.prod.json`);

base.plugins.push(new webpack.HashedModuleIdsPlugin());
base.plugins.push(new webpack.DllReferencePlugin({
    context: config.path.root,
    manifest: manifest,
}));
base.plugins.push(new AddAssetHtmlPlugin({
    filepath: `${config.path.dll}/*.prod.dll.js`,
}));

module.exports = base;
