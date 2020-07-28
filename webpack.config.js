const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  externals: [
    {
      react: 'react',
      'prop-types': 'prop-types',
      'react-native': 'react-native',
    },
    // (context, request, callback) => {
    //   console.log('request', request);
    //   if (/^react-native/.test(request)) {
    //     return callback(null, `commonjs ${request}`);
    //   }
    //   return callback();
    // },
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            caller: {
              name: 'bundler',
            },
          },
        },
      },
    ],
  },
};
