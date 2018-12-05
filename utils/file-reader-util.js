const fs = require('fs');

const getDataString = (filePath) => fs.readFileSync(`${filePath}`, 'utf8');

module.exports = {
  getDataString,
  getDataArray: (filePath) => getDataString(filePath).trim().split('\n')
};
