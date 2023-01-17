let path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

let config = {
  entry: './src/index.js',
  optimization: {
    runtimeChunk: 'single'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules')
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
          // 'sass-loader',
        ],
      },
    ],
  },
  plugins: [ 
    new MiniCssExtractPlugin({filename: '[name].css'}),
    new HtmlWebpackPlugin({ template: './index.html' })
  ]
}

module.exports = (env, options) => {
  
  config.devtool = isProduction ? false : 'eval-cheap-module-source-map';
  config.target = isProduction ? 'browserslist' : 'web'; 

  return config;
};