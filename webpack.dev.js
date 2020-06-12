const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new webpack.DefinePlugin({
      CLIENT_DOMAIN: JSON.stringify("localhost"),
      PROXY_ORIGIN: JSON.stringify("http://localhost:3000")
    })
  ],
});
