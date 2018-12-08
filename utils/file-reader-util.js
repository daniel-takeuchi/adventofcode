const fs = require('fs');

const getDataString = (filePath) => fs.readFileSync(`${filePath}`, 'utf8');

module.exports = {
  getDataString,
  getDataArray: (filePath, separator = '\n') => getDataString(filePath).trim().split(separator)
};
