const path = require('path');

const config = {
  mode: 'production',
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ],
  },
  target: 'node',
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.ts$/i,
        include: [
          path.resolve(__dirname, 'index.ts'),
          path.resolve(__dirname, 'src'),
        ],
        exclude: [
          '/node_modules/',
          '/dist/',
          '/tests/',
        ],
      },
    ],
  },
};

module.exports = () => config;
