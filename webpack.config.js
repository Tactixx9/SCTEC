const path = require('path');
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
};
