const FileReaderUtil = require('../../utils/file-reader-util');
const inputArray = FileReaderUtil.getDataArray('./exercises/day3/data-input.txt');

class Claim {
  constructor(details) {
    const detailsArray = details.split(' ');
    const [leftOffset, topOffset] = detailsArray[2].replace(':', '').split(',').map(n => parseInt(n));
    const [width, height] = detailsArray[3].split('x').map(n => parseInt(n));
    this.id = detailsArray[0];
    this.height = height;
    this.width = width;

    this.left = leftOffset + 1;
    this.top = topOffset + 1;
    this.bottom = topOffset + height;
    this.right = leftOffset + width;
  }
}

const claims = inputArray.map((i) => new Claim(i));

/**
 * Exercise 1
 * Create a Map of coordinates, with values representing the number of claims that fall into it.
 */
const claimMap = claims.reduce((acc, claim) => {
  for (let w = claim.left; w <= claim.right; w++) {
    for (let h = claim.top; h <= claim.bottom; h++) {
      const coordinate = `${w}x${h}`;
      acc[coordinate] = acc[coordinate] ? ++acc[coordinate] : 1;
    }
  }
  return acc;
}, {});

const overlappedSquares = Object.values(claimMap).filter(v => v >= 2);
console.log(`Day 3 Exercise 1 Answer: ${overlappedSquares.length}`);

/**
 * Exercise 2
 * Break out early from loop iterations whenever possible.
 * We also assume that there's only 1 claim that does not overlap, as stated in the instructions.
 */
for (let i = 0; i < claims.length; i++) {
  const claim = claims[i];
  let hasOverlap = false;
  for (let w = claim.left; w <= claim.right; w++) {
    for (let h = claim.top; h <= claim.bottom; h++) {
      const coordinate = `${w}x${h}`;
      if (claimMap[coordinate] >= 2) {
        hasOverlap = true;
        break;
      }
    }
  }
  if (!hasOverlap) {
    console.log(`Day 3 Exercise 2 Answer: ${claim.id}`);
    break;
  }
}