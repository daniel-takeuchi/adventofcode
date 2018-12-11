// Grid Serial Number
const input = 9221;

class Cell {
  constructor(x, y, serialNumber) {
    let rackId = x + 10;
    let powerLevel = (((rackId * y) + serialNumber) * rackId).toString();
    powerLevel = (powerLevel.length >= 3 ? parseInt(powerLevel[powerLevel.length - 3]) : 0) - 5;
    this.x = x;
    this.y = y;
    this.powerLevel = powerLevel;
  }
}

function getCellGrid(xMax, yMax, serialNumber) {
  const grid = {};
  for (let x = 1; x <= xMax; x++) {
    for (let y = 1; y <= yMax; y++) {
      grid[`${x},${y}`] = new Cell(x, y, serialNumber);
    }
  }
  return grid;
}

function getCellSquareIndexes(x, y, size) {
  const indexes = [];
  for (let i = x; i < x + size; i++) {
    for (let j = y; j < y + size; j++) {
      indexes.push(`${i},${j}`);
    }
  }
  return indexes;
}

function getCellSquareRemainingIndexes(x, y, size) {
  let xMax = x + size - 1 > 300 ? 300 : x + size - 1;
  let yMax = y + size - 1 > 300 ? 300 : y + size - 1;
  const indexes = new Set([`${xMax},${yMax}`]);
  for (let i = x; i < xMax; i++) {
    indexes.add(`${i},${yMax}`);
  }
  for (let j = y; j < yMax; j++) {
    indexes.add(`${xMax},${j}`);
  }
  return [...indexes];
}

function getSquareTotalPower(grid, gridSize, size) {
  let maxSize = gridSize - size + 1;
  const gridPower = {};
  for (let x = 1; x <= maxSize; x++) {
    for (let y = 1; y <= maxSize; y++) {
      const indexes = getCellSquareIndexes(x, y, size);
      gridPower[`${x},${y},${size}`] = indexes.reduce((acc, index) => acc + grid[index].powerLevel, 0);
    }
  }
  return gridPower;
}

// NOTE: This is extremely unefficient
// At the moment, for increasingly bigger squares, we look at the previous square total.
// Eg. For coordinates 1,1 of size 4, we look at the total of 1,1 for size 3, then add
// the remaining cells' power levels.
// Instead, try adding the power levels of squares:
// 1,1,2
// 1,3,2
// 3,1,2
// 3,3,2
// Increasingly bigger squares should be able to be calculated by the sum of 4 smaller squares.
function getLargestPowerSquare(grid, start, end, gridSize) {
  let gridPower = {};
  for (let s = start; s < end; s++) {
    let maxSize = gridSize - s + 1;
    for (let x = 1; x <= maxSize; x++) {
      for (let y = 1; y <= maxSize; y++) {
        let existingGrid = gridPower[`${x},${y},${s - 1}`];
        if (existingGrid) {
          const indexes = getCellSquareRemainingIndexes(x, y, s);
          gridPower[`${x},${y},${s}`] = indexes.reduce((acc, index) => acc + gridPower[`${index},${1}`], existingGrid);
        } else {
          const indexes = getCellSquareIndexes(x, y, s);
          gridPower[`${x},${y},${s}`] = indexes.reduce((acc, index) => acc + grid[index].powerLevel, 0);
        }
      }
    }
    console.log(s);
  }
  return gridPower;
}


const cellGrid = getCellGrid(300, 300, input);
const gridTotalPower = getSquareTotalPower(cellGrid, 300, 3);
let max = 0;
let strongestSquare;
for (let coordinates in gridTotalPower) {
  if (gridTotalPower[coordinates] > max) {
    max = gridTotalPower[coordinates];
    strongestSquare = coordinates;
  }
}

console.log(`Day 11 Exercise 1 Answer: Coordinates ${strongestSquare} has a power level of ${max}`);

const gridTotalPower2 = getLargestPowerSquare(cellGrid, 1, 300, 300);
let max2 = 0;
let strongestSquare2;
for (let coordinates in gridTotalPower2) {
  if (gridTotalPower2[coordinates] > max2) {
    max2 = gridTotalPower2[coordinates];
    strongestSquare2 = coordinates;
  }
}

console.log(`Day 11 Exercise 2 Answer: Coordinates ${strongestSquare2} has a power level of ${max2}`);
