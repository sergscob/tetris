const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production' || process.env.NODE_ENV === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/client/index.js',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './index.html' }),
    ],
    devServer: {
      port: 8081,
      host: '0.0.0.0',
      historyApiFallback: true,
      proxy: [
        {
          context: ['/socket.io'],
          target: 'http://localhost:3004',
          ws: true,
        },
      ],
    },
  };
};
