const fs = require('fs');

module.exports = {
  getDataArray(filePath) {
    const inputString = fs.readFileSync(`${filePath}`, 'utf8');
    return inputString.split('\n');
  }
};