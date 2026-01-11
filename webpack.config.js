const path = require('path');

module.exports = {
  entry: './src/index.js', // Change this to your main JS file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
