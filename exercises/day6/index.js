const FileReaderUtil = require('../../utils/file-reader-util');
const input = FileReaderUtil.getDataArray('./exercises/day6/data-input.txt');

class Coordinate {
  constructor(string, distance = 0) {
    const [x, y] = string.split(', ');
    this.key = string;
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.distance = distance;
  }
}

/**
 * Looks through the Array of coordinates to determine the edges of the Coordinates Board.
 * @param {Array} coords - Array of Coordinates
 * @returns {Object} - Positions of the edges of the board (top, bottom, left, right).
 */
function getBoardEdges(coords) {
  let top, bottom, left, right;
  coords.forEach((coord) => {
    if (!left || coord.x < left) left = coord.x;
    if (!right || coord.x > right) right = coord.x;
    if (!top || coord.y < top) top = coord.y;
    if (!bottom || coord.y > bottom) bottom = coord.y;
  });

  return { top, bottom, left, right };
}

/**
 * Populates coordinates for the whole board
 * @param {Coordinate} coord - Current Coordinate
 * @param {Number} x
 * @param {Number} y
 * @param {Coordinate} currentMapped
 */
function fillMapCoordinate(coord, x, y, currentMapped) {
  const distance = Math.abs(coord.x - x) + Math.abs(coord.y - y);
  if (!currentMapped || distance < currentMapped.distance) {
    return new Coordinate(coord.key, distance);
  }
  return currentMapped;
}

function removeCommonAreas(coords, map) {
  coords.forEach((c) => {
    for (let x = boardEdges.left; x <= boardEdges.right; x++) {
      for (let y = boardEdges.top; y <= boardEdges.bottom; y++) {
        const currentCoord = map[`${x}, ${y}`];
        if (currentCoord.key === c.key) continue;
        const distance = Math.abs(c.x - x) + Math.abs(c.y - y);
        if (currentCoord.distance !== distance) continue;
        currentCoord.key = null;
        currentCoord.x = null;
        currentCoord.y = null;
        currentCoord.distance = null;
      }
    }
  });
  return map;
}

function getMapOfClosestCoord(coords, boardEdges) {
  let map = coords.reduce((acc, coord) => {
    acc[coord.key] = coord;
    return acc;
  }, {});
  coords.forEach((c) => {
    for (let x = boardEdges.left; x <= boardEdges.right; x++) {
      for (let y = boardEdges.top; y <= boardEdges.bottom; y++) {
        const currentCoord = map[`${x}, ${y}`];
        if (currentCoord && currentCoord.key === c.key) continue;
        map[`${x}, ${y}`] = fillMapCoordinate(c, x, y, currentCoord);
      }
    }
  });
  return removeCommonAreas(coords, map);
}

function getCoordinatesOnEdges(coordBoard) {
  let coordsOnEdges = {};
  for (let coord in map) {
    let [x, y] = coord.split(', ');
    x = parseInt(x);
    y = parseInt(y);
    if (x === boardEdges.left || x === boardEdges.right || y === boardEdges.top || y === boardEdges.bottom) {
      coordsOnEdges[`${map[coord].x}, ${map[coord].y}`] = true;
    }
  }
  return coordsOnEdges;
}

function getLargestCoordinateArea(coords) {
  let largest = 0;
  validCoordinates.forEach((coord) => {
    const filtered = Object.values(map).filter(c => c.key === coord.key);
    if (filtered.length > largest) largest = filtered.length;
  });
  return largest;
}

const coordinates = input.map(i => new Coordinate(i));
const boardEdges = getBoardEdges(coordinates);
const map = getMapOfClosestCoord(coordinates, boardEdges);
const edgeCoordinates = getCoordinatesOnEdges(map);
const invalidCoords = Object.keys(edgeCoordinates);
const validCoordinates = coordinates.filter((c) => !invalidCoords.includes(c.key));
const largestArea = getLargestCoordinateArea(validCoordinates);
console.log(`Day 6 Exercise 1 Answer: ${largestArea}`);

// Exercise 2
function isWithinRange(x, y, coords, limit = 10000) {
  let distance = 0;
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    distance += Math.abs(coord.x - x) + Math.abs(coord.y - y);
    if (distance >= limit) break;
  }
  return distance < limit;
}

function getInRangeCoords(coords, board) {
  const inRange = [];
  for (let x = board.left; x <= board.right; x++) {
    for (let y = board.top; y <= board.bottom; y++) {
      if (isWithinRange(x, y, coords)) inRange.push(`${x}, ${y}`);
    }
  }
  return inRange;
}

function groupRanges(target, ranges, seenCoords = new Set(), group = new Set()) {
  let currentGroupSize = group.size;
  if (group.size === 0) {
    group.add(target);
  }
  const cloneGroup = new Set(group);
  group.forEach((item) => {
    if (!seenCoords.has(item)) {
      let [x, y] = item.split(', ');
      const neighbours = ranges.filter((r) => {
        let [rx, ry] = r.split(', ');
        if (x === rx && y === ry) return false;
        return Math.abs(x - rx) <= 1 && Math.abs(y - ry) <= 1;
      });
      seenCoords.add(item);
      neighbours.forEach(n => cloneGroup.add(n));
    }
  });
  console.log('Group size:', cloneGroup.size);
  if (currentGroupSize < cloneGroup.size && cloneGroup.size > 1) return groupRanges(target, ranges, seenCoords, cloneGroup);
  return cloneGroup;
}

const inRangeCoords = getInRangeCoords(coordinates, boardEdges, 10000);
console.log(`There are ${inRangeCoords.length} coordinates in range.`);

let seenCoords = new Set();
let biggestSet = 0;
inRangeCoords.forEach((target) => {
  if (!seenCoords.has(target)) {
    const group = groupRanges(target, inRangeCoords, seenCoords);
    if (group.size > biggestSet) biggestSet = group.size;
  };
});

console.log(`Day 6 Exercise 2 Answer: ${biggestSet}`);