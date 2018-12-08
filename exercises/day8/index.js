const FileReaderUtil = require('../../utils/file-reader-util');
const input = FileReaderUtil.getDataArray('./exercises/day8/data-input.txt', ' ');

/**
 * Represents a tree node. Nodes may have 0 to many children, but 0 or 1 parent.
 * Each existing child/parent is a pointer to another node.
 * @param {Number} childrenLimit - How many children the node has
 * @param {Number} metadataLimit - How many metadata items the node has
 * @param {parent} node - pointer to the parent of the node instance
 */
class Node {
  constructor(childrenLimit, metadataLimit, parent = null) {
    this.childrenLimit = childrenLimit;
    this.metadataLimit = metadataLimit;
    this.children = [];
    this.metadata = [];
    this.parent = parent;
  }
}

/**
 * Recursively creates a node tree based on the input
 * @param {Array<Number>} nums - data input
 * @param {Number} i - iterator cursor
 * @param {Node} node - current node
 * @returns {Node} - top level node
 */
function createNodeTree(nums, i = 0, node = null) {
  if (!node || node.childrenLimit > node.children.length) {
    const newNode = new Node(nums[i], nums[++i], node);
    if (node) node.children.push(newNode);
    return createNodeTree(nums, ++i, newNode);
  } else {
    node.metadata = nums.slice(i, i + node.metadataLimit);
    i += node.metadataLimit;
    if (node.parent) return createNodeTree(nums, i, node.parent);
    return node;
  }
}

/**
 * Calculates the sum of all metadata under a single node tree
 * @param {Node} - top level node
 * @returns {Number} - sum of all metadata under a node tree
 */
function getMetadataSum(node) {
  const currentSum = node.metadata.reduce((acc, n) => acc + n, 0);
  return node.children.reduce((acc, c) => acc + getMetadataSum(c), currentSum);
}

/**
 * Returns the value of a node tree, based on instruction rules
 * @param {Node} node - top level node
 * @returns {Number} - value of node tree
 */
function getNodeValue(node) {
  return node.metadata.reduce((acc, m) => {
    const hasChildren = node.children.length > 0;
    if (!hasChildren) return acc + m;
    const child = node.children[m - 1];
    return child ? acc + getNodeValue(child) : acc;
  }, 0);
}

const numbers = input.map(i => parseInt(i));
const rootNode = createNodeTree(numbers);
console.log(`Day 8 Exercise 1 Answer: Sum of all metadata is ${getMetadataSum(rootNode)}`);
console.log(`Day 8 Exercise 2 Answer: Root node value is ${getNodeValue(rootNode)}`);