const FileReaderUtil = require('../../utils/file-reader-util');
const input = FileReaderUtil.getDataArray('./exercises/day7/data-input.txt');

/**
 * Instructions always come in the following format:
 * Step C must be finished before step F can begin.
 */
class Instruction {
  constructor(instruction) {
    this.step = instruction[36];
    this.prerequisite = instruction[5];
  }
}

const instructions = input.map(i => new Instruction(i));
const steps = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const prerequirements = new Set(instructions.map(i => i.step));
function getStepOrder2(current, instrs, done = []) {
  if (!current) current = steps.find(s => !prerequirements.has(s) && !done.includes(s));
  done.push(current);

  let next = instrs.filter(i => done.includes(i.prerequisite) && !done.includes(i.step));
  const unmetPrereqs = instrs.filter(i => !done.includes(i.prerequisite) && !done.includes(i.step)).map(p => p.step);
  if (unmetPrereqs.length > 0) next = next.filter(n => !unmetPrereqs.includes(n.step));
  next.sort((a, b) => a.step < b.step ? -1 : 1);

  if (unmetPrereqs.length && !next[0]) {
    return getStepOrder2(null, instrs, done);
  } else if (next[0]) {
    return getStepOrder2(next[0].step, instrs, done);
  }
  return done;
}

const stepOrder = getStepOrder2(null, instructions);
console.log(`Day 7 Exercise 1 Answer: ${stepOrder.join('')}`);
