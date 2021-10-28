let path  = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   mode: 'development',
   entry: {
      app: ['@babel/polyfill', './src/js/index.js']
   },
   output: {
      // options related to how webpack emits results
      path: path.resolve(__dirname, 'dist'), // string (default)
      // the target directory for all output files
      // must be an absolute path (use the Node.js path module)
      // the filename template for entry chunks
      filename: 'js/bundle.js',
   },
   plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
        inject: 'body',
        scriptLoading: 'blocking'
      }),
    ],
    module: {
      rules: [
        {
          test: /\.?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
               presets: ['@babel/preset-env', '@babel/preset-react']
             }
          }
        },
        {
         test: /\.css$/i,
         use: ["style-loader", "css-loader"],
       },
      ]
    },
    devtool: 'eval',
    devServer: {
      static: {
         directory: path.join(__dirname, 'dist'),
       },
    },

}