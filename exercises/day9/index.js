/**
 * Represents a Circular Linked List node.
 */
class Node {
  constructor(value, prev, next) {
    this.prev = prev;
    this.next = next;
    this.value = value;
  }

  insertAfter(node, first) {
    node.next = this.next || first;
    node.prev = this || first;
    if (this.next) this.next.prev = node;
    this.next = node;
  }

  removeBefore() {
    this.prev.prev.next = this.prev.next;
    this.prev = this.prev.prev;
  }
}

function getHighestScore(playerCount = PLAYER_COUNT, highMarble = HIGH_MARBLE) {
  let firstMarble = new Node(0);
  let marbles = firstMarble;
  let playerScore = {};
  let currentMarble = 1;
  let currentPlayer = 1;

  while (currentMarble <= highMarble) {
    if (currentMarble % 23 === 0) {
      const toRemove = marbles.prev.prev.prev.prev.prev.prev.prev;
      const currentPoints = currentMarble + toRemove.value;
      playerScore[currentPlayer] = (playerScore[currentPlayer] || 0) + currentPoints;
      toRemove.next.removeBefore();
      marbles = toRemove.next;
    } else {
      const next = new Node(currentMarble);
      (marbles.next || firstMarble).insertAfter(next, firstMarble);
      marbles = next;
    }
  
    currentPlayer = currentPlayer === playerCount ? 1 : currentPlayer + 1;
    ++currentMarble;
  }
  
  let max = 0;
  for (let player in playerScore) {
    if (playerScore[player] > max) max = playerScore[player];
  }
  return max;
}

const PLAYER_COUNT = 429;
const HIGH_MARBLE = 70901;
console.log(`Day 9 Exercise 1 Answer: ${getHighestScore(PLAYER_COUNT, HIGH_MARBLE)}`);
console.log(`Day 9 Exercise 2 Answer: ${getHighestScore(PLAYER_COUNT, HIGH_MARBLE * 100)}`);
