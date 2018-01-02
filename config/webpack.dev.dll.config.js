const webpack = require('webpack');
const config = require('./config');
const base = require('./webpack.base.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const clearFiles = [
    `${config.path.dll}/manifest.dev.json`,
    `${config.path.dll}/*.dev.dll.*`,
];

module.exports = {
    output: {
        path: config.path.dll,
        filename: '[name].[hash].dev.dll.js',
        library: '[name]_[hash]_dev',
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
        new webpack.NamedModulesPlugin(),
        new webpack.DllPlugin({
            path: `${config.path.dll}/manifest.dev.json`,
            name: '[name]_[hash]_dev',
            context: config.path.root,
        }),
    ],
};
