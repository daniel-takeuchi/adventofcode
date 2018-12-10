const FileReaderUtil = require('../../utils/file-reader-util');
const input = FileReaderUtil.getDataArray('./exercises/day10/data-input.txt');

const POSITION_REGEX = /^position=<([\s|-]*\d+),\s*([\s|-]*\d+)>/;
const VELOCITY_REGEX = /velocity=<([\s|-]*\d+),\s*([\s|-]*\d+)>/;

/**
 * Represents a lightpoint, with coordinates and movement direction/velocity
 */
class LightPoint {
  constructor(details) {
    const positionMatch = details.match(POSITION_REGEX);
    const velocityMatch = details.match(VELOCITY_REGEX);
    this.x = parseInt(positionMatch[1]);
    this.y = parseInt(positionMatch[2]);
    this.xVelocity = parseInt(velocityMatch[1]);
    this.yVelocity = parseInt(velocityMatch[2]);
  }
}

/**
 * Finds the edges of the point coordinates
 * @param {Array<LightPoint>} points
 * @returns {Object} - key/values including left, right, top and bottom
 */
function findBoardEdges(points) {
  let left, right, top, bottom;
  points.forEach(p => {
    if (!left || p.x < left) left = p.x;
    if (!right || p.x > right) right = p.x;
    if (!top || p.y < top) top = p.x;
    if (!bottom || p.y > bottom) bottom = p.x
  });
  return { left, right, top, bottom };
}

/**
 * Prints the board with current points coordinates
 * @param {Array<LightPoint>} points 
 */
function printBoard(points) {
  const { left, right, top, bottom } = findBoardEdges(points);
  console.log(left, right, top, bottom);
  console.log('---------------------------------------------------------------');
  for (let y = top; y <= bottom; y++) {
    let row = '';
    for (let x = left; x <= right; x++) {
      row += points.find(p => p.x === x && p.y === y) ? '#' : '.';
    }
    console.log(row);
  }
  console.log('---------------------------------------------------------------');
}

/**
 * Checks if all points have neighbours
 * @param {Array<LightPoint>} points
 */
function allPointsHaveNeighbours(points) {
  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i];
    const neighbours = points.filter((p) => Math.abs(x - p.x) <= 1 && Math.abs(y - p.y) <= 1);
    if (neighbours.length <= 1) {
      return false;
    };
  }
  return true;
}

/**
 * Aligns points until they all have neighbours
 * @param {Array<LightPoint>} points 
 * @returns {Object} - points and seconds
 */
function alignLightPoints(points) {
  let currentSecond = 0;
  while (!allPointsHaveNeighbours(points)) {
    points.forEach((point) => {
      point.x = point.x + point.xVelocity;
      point.y = point.y + point.yVelocity;
    });
    currentSecond++;
  }
  return { points, seconds: currentSecond };
 }

const lightPoints = input.map(i => new LightPoint(i));
const aligned = alignLightPoints(lightPoints);
console.log('Day 10 Exercise 1 Answer: See message in logs');
printBoard(aligned.points);
console.log(`Day 10 Exercise 2 Answer: ${aligned.seconds} seconds`);