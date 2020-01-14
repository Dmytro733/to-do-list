var path = require('path');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist'
        
      },
      devServer: {
        overlay: true
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/
          },{
            test: /\.sass$/,
            use: [
              "style-loader",
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {sourceMap: true}
              },
              {
                loader: "sass-loader",
                options: {sourceMap: true}
              }
            ]
          },{
              test: /\.css$/,
              use: [
                MiniCssExtractPlugin.loader,
                "css-loader"
            ]
          },
        ]
      },
      plugins: [ 
        new MiniCssExtractPlugin({
          filename: '[name].css'
        })
      ]
};