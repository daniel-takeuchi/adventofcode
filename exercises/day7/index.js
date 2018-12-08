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
function getStepOrder(current, instrs, done = []) {
  if (!current) current = steps.find(s => !prerequirements.has(s) && !done.includes(s));
  done.push(current);

  let next = instrs.filter(i => done.includes(i.prerequisite) && !done.includes(i.step));
  const unmetPrereqs = instrs.filter(i => !done.includes(i.prerequisite) && !done.includes(i.step)).map(p => p.step);
  if (unmetPrereqs.length > 0) next = next.filter(n => !unmetPrereqs.includes(n.step));
  next.sort((a, b) => a.step < b.step ? -1 : 1);

  if (unmetPrereqs.length && !next[0]) {
    return getStepOrder(null, instrs, done);
  } else if (next[0]) {
    return getStepOrder(next[0].step, instrs, done);
  }
  return done;
}

const stepOrder = getStepOrder(null, instructions);
console.log(`Day 7 Exercise 1 Answer: ${stepOrder.join('')}`);

// Exercise 2
function getNextSteps(instrs, timeline, done) {
  let nextSteps = steps.filter(s => !prerequirements.has(s) && !done.includes(s));
  nextSteps = nextSteps.concat(instrs.filter(i => done.includes(i.prerequisite) && !done.includes(i.step)).map(i => i.step));
  const unmetPrereqs = instrs.filter(i => !done.includes(i.prerequisite) && !done.includes(i.step)).map(p => p.step);
  if (unmetPrereqs.length > 0) nextSteps = nextSteps.filter(n => !unmetPrereqs.includes(n));
  nextSteps = nextSteps.sort((a, b) => {
    const lastSecond = timeline[timeline.length - 1];
    if (lastSecond && lastSecond.includes(a)) return -1;
    if (lastSecond && lastSecond.includes(b)) return 1;
    return a < b ? -1 : 1;
  });
  return new Set(nextSteps);
}

function getStepsDuration(defaultTaskDuration = 60) {
  return steps.reduce((acc, step) => {
    acc[step] = defaultTaskDuration + steps.indexOf(step) + 1;
    return acc;
  }, {});
}

function getTimeline(instrs, stepsDuration, timeline=[], done = [], workerCount = 5) {
  let second = 0;
  let isDone = false;
  while (!isDone) {
    let nextSteps = getNextSteps(instrs, timeline, done);
    nextSteps = [...nextSteps].slice(0, workerCount);
    timeline.push(nextSteps.join(''));
    nextSteps.forEach((step) => {
      if (stepsDuration[step] === timeline.filter(s => s.includes(step)).length) done.push(step);
    });
    if (done.length === 26) isDone = true;
    ++second;
  }
  return second;
}

const stepsDurations = getStepsDuration();
console.log(`Day 7 Exercise 2 Answer: ${getTimeline(instructions, stepsDurations)}`);
