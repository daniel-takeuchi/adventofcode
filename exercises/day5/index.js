const FileReaderUtil = require('../../utils/file-reader-util');
const input = FileReaderUtil.getDataString('./exercises/day5/data-input.txt');

const cut = (str, cutStart, cutEnd) => str.substr(0, cutStart) + str.substr(cutEnd + 1);

function computePolymerReactions(str) {
  let counter = 0;
  let output = str;
  while (counter < output.length - 1) {
    const a = output[counter];
    const b = output[counter + 1];
    if (a !== b && a.toLowerCase() === b.toLowerCase()) {
      output = cut(output, counter, counter + 1);
      if (counter > 0) counter--;
      continue;
    }
    counter++;
  }
  return output;
}

// Exercise 1
const polymer1 = computePolymerReactions(input);
console.log(`Day 5 Exercise 1 Answer: Polymer length is ${polymer1.length}`);

// Exercise 2
const units = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let polymer2;
units.forEach(unit => {
  const regex = new RegExp(`${unit}|${unit.toUpperCase()}`, 'g');
  const newInput = input.replace(regex, '');
  const newOutput = computePolymerReactions(newInput);
  if (!polymer2 || newOutput.length < polymer2.length) {
    polymer2 = newOutput;
  }
});

console.log(`Day 5 Exercise 2 Answer: Polymer length is ${polymer2.length}`);
