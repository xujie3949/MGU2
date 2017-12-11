const webpack = require('webpack');
const config = require('./config');
const base = require('./webpack.base.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const clearFiles = [
  `${config.path.dll}/manifest.prod.json`,
  `${config.path.dll}/*.prod.dll.*`,
];

module.exports = {
  output: {
    path: config.path.dll,
    filename: '[name].[hash].prod.dll.js',
    library: '[name]_[hash]_prod',
  },
  entry: {
    vendors: config.vendors,
  },
  module: base.module,
  devtool: base.devtool,
  plugins: [
    new CleanWebpackPlugin(clearFiles, {
      root: config.path.root,
      verbose: true,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.DllPlugin({
      path: `${config.path.dll}/manifest.prod.json`,
      name: '[name]_[hash]_prod',
      context: config.path.root,
    }),
  ],
};
