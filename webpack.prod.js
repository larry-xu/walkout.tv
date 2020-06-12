const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "docs"),
  },
  plugins: [
    new webpack.DefinePlugin({
      CLIENT_DOMAIN: JSON.stringify("www.walkout.tv"),
      PROXY_ORIGIN: JSON.stringify("http://proxy.walkout.tv")
    })
  ],
});
