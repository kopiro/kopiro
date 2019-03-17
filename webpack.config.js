const paths = require('./paths');

module.exports = {
  entry: ['@babel/polyfill', './src/client/index.js'],
  output: {
    path: paths.publicJs,
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
