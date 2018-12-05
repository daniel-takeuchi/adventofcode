const FileReaderUtil = require('../../utils/file-reader-util');
const inputArray = FileReaderUtil.getDataArray('./exercises/day2/data-input.txt');

function getMapOfLetterCount(word) {
  let letterMap = {};
  word.split('').forEach(l => letterMap[l] = (letterMap[l] || 0) + 1);
  return letterMap;
}

function countItemsWithDoubleOrTripleLetters(items) {
  let twoLetterCount = 0;
  let threeLetterCount = 0;
  items.forEach((item) => {
    const letterMap = getMapOfLetterCount(item);
    const counts = Object.values(letterMap);
    if (counts.includes(2)) twoLetterCount++;
    if (counts.includes(3)) threeLetterCount++;
  });
  return [twoLetterCount, threeLetterCount];
}

function isSimilar(word1, word2) {
  const word1Array = word1.split('');
  const word2Array = word2.split('');
  let matchCount = 0;

  for (let i = 0; i < word1Array.length; i++) {
    if (word1Array[i] !== word2Array[i]) matchCount++;
    if (matchCount >= 2) break;
  }

  return matchCount === 1;
}

function findSimilarPair(items) {
  let item1, item2;
  let foundMatch = false;
  for (let i = 0; i < inputArray.length; i++) {
    item1 = inputArray[i];
    for (let j = i + 1; j < inputArray.length; j++) {
      item2 = inputArray[j];
      if (isSimilar(item1, item2)) {
          foundMatch = true;
          break;
      }
    }
    if (foundMatch) break;
  }
  return [item1, item2];
}

function stripUniqueLetters(word1, word2) {
  let commonLetters = '';
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === word2[i]) commonLetters += word1[i];
  }
  return commonLetters;
}

const [double, triple] = countItemsWithDoubleOrTripleLetters(inputArray);
console.log(`Day 2 Exercise 1 Answer: ${double * triple}`);

const similarPair = findSimilarPair(inputArray);
console.log(`Day 2 Exercise 2 Answer: ${stripUniqueLetters(...similarPair)}`);
