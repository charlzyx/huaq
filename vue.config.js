const path = require('path');

const HOST = './';

module.exports = {
  outputDir: path.resolve(__dirname, 'docs'),
  publicPath: `${HOST}`,
};
