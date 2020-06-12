const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'styles.css' },
        { from: 'favicon.ico' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "index.html"
    })
  ],

  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};
