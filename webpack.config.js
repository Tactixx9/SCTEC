const path = require('path');
<<<<<<< HEAD
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js', // adjust if needed
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // your main HTML file
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' }, // copy assets folder
        { from: 'style.css', to: 'style.css' }, // copy CSS
      ],
    }),
  ],
=======

module.exports = {
  entry: './src/index.js', // Change this to your main JS file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
>>>>>>> aa9b59b2df0040de46e1c0767a044faa5c723257
};
