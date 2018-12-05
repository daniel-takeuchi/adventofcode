const FileReaderUtil = require('../../utils/file-reader-util');
const inputArray = FileReaderUtil.getDataArray('./exercises/day1/data-input.txt');

function getSum(numbers) {
  let sum = 0;
  numbers.forEach(n => sum += parseInt(n));
  return sum;
}

function getFirstFrequencyTo2(numbers, startingFrequency = 0, seenFrequencies = {}) {
  let sum = startingFrequency;
  for (let i = 0; i < numbers.length; i++) {
    sum += parseInt(numbers[i]);
    if (seenFrequencies[sum]) return sum;
    seenFrequencies[sum] = 1;
  }
  return getFirstFrequencyTo2(numbers, sum, seenFrequencies);
}


console.log(`Day 1 Exercise 1 Answer: ${getSum(inputArray)}`);
console.log(`Day 1 Exercise 2 Answer: ${getFirstFrequencyTo2(inputArray)}`);
