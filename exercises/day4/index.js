const FileReaderUtil = require('../../utils/file-reader-util');
const inputArray = FileReaderUtil.getDataArray('./exercises/day4/data-input.txt');

const DATE_REGEX = /^\[.*\]/;
const NUMBER_REGEX = /\d+/;
const EVENT_ACTIONS = {
  SLEEP: 'falls asleep',
  WAKE_UP: 'wakes up',
  BEGIN_SHIFT: 'begins shift'
};

/**
 * GuardEvent represents an event performed by a security guard
 */
class GuardEvent {
  constructor(details) {
    const date = details.match(DATE_REGEX)[0].replace('[', '').replace(']', '');
    // Action always starts at index 19
    let action = details.slice(19, details.length);
    let id;
    const idMatch = action.match(NUMBER_REGEX);
    if (idMatch) {
      action = EVENT_ACTIONS.BEGIN_SHIFT;
      id = idMatch[0];
    }
    const time = date.slice(11, date.length);
    const midnightMinutes = time.indexOf('00:') === -1 ? null : parseInt(time.slice(3, 5));

    this.guardId = id;
    this.date = date;
    this.midnightMinutes = midnightMinutes;
    this.action = action;
  }
}

/**
 * Calculates the total amount of sleep done by every guard
 * @param {Array} - Array of GuardEvents
 * @returns {Object<String, Number>} - Object where Keys are the Guard IDs and Values are the total amount of sleep done.
 */
function getGuardSleepTotalMap(evs) {
  let currentGuard = null;
  let currentSleepTime = null;
  let guardSleepTime = {};
  evs.forEach((e) => {
    let sleepTime;
    if (e.guardId) currentGuard = e.guardId;
    if (e.action === EVENT_ACTIONS.SLEEP) {
      currentSleepTime = e.midnightMinutes;
    } else if (e.action === EVENT_ACTIONS.WAKE_UP) {
      sleepTime = e.midnightMinutes - currentSleepTime;
      currentSleepTime = null;
    }
    if (sleepTime) {
      guardSleepTime[currentGuard] = (guardSleepTime[currentGuard] || 0) + sleepTime;
    }
  });
  return guardSleepTime;
}

/**
 * Finds the guard who has slept the most
 * @param {Array} - Array of GuardEvents
 * @returns {String} - Guard ID
 */
function getMostSleepyGuard(guardsSleepMap) {
  let mostSleepyGuard = { id: null, sleepTime: 0 };
  for (let id in guardsSleepMap) {
    if (guardsSleepMap[id] > mostSleepyGuard.sleepTime) {
      mostSleepyGuard = { id, sleepTime: guardsSleepMap[id] };
    }
  }
  return mostSleepyGuard.id;
}

/**
 * Looks at a Map of <minutes, slept times>, for the specific minute where sleeping happened the most.
 * @param {Object<Number><Number>} minuteMap
 * @returns {Number}
 */
function getMostSleptMinute(minuteMap) {
  let mostSleptTotal = 0;
  let mostSleptMinute;
  for (let m in minuteMap) {
    if (minuteMap[m] > mostSleptTotal) {
      mostSleptTotal = minuteMap[m];
      mostSleptMinute = m;
    }
  }
  return [mostSleptMinute, mostSleptTotal];
}

/**
 * Checks for a given guard's most slept minute.
 * @param {String} id - id of guard
 * @param {Array} - Chronlogical array of events
 * @returns {Number} - the Minute number where the given guard slept the most times
 */
function getMostSleptMinuteForGuard(id, evs) {
  let currentGuard;
  let currentSleepTime;
  const sleepTimes = {};
  evs.forEach(e => {
    if (e.guardId === id) {
      currentGuard = id;
    } else if (e.guardId && e.guardId !== id) {
      currentGuard = null;
    }
    if (!currentGuard) return;
    if (e.action === EVENT_ACTIONS.SLEEP) {
      sleepTimes[e.midnightMinutes] = (sleepTimes[e.midnightMinutes] || 0) + 1;
      currentSleepTime = e.midnightMinutes;
    } else if (e.action === EVENT_ACTIONS.WAKE_UP) {
      for (let i = currentSleepTime + 1; i < e.midnightMinutes; i++) {
        sleepTimes[i] = (sleepTimes[i] || 0) + 1;
      }
    }
  });
  return getMostSleptMinute(sleepTimes);
}

// Exercise 1
const events = inputArray.map(i => new GuardEvent(i));
const chronologicalEvents = events.sort((a, b) => a.date > b.date ? 1 : -1);
const guardTotalSleepMap = getGuardSleepTotalMap(chronologicalEvents);
const sleepiestGuard = getMostSleepyGuard(guardTotalSleepMap);
const mostSleptMinute = getMostSleptMinuteForGuard(sleepiestGuard, chronologicalEvents)[0];
const answerChecksum = sleepiestGuard * mostSleptMinute;
console.log(`Day 4 Exercise 1 Answer: Guard ${sleepiestGuard} slept the most at the ${mostSleptMinute}th minute.`);
console.log(`Answer checksum is ${answerChecksum}`);

// Exercise 2
let mostSleptTotal = 0;
let sleepiestGuard2;
let mostSleptMinute2;
for (let id in guardTotalSleepMap) {
  const [minute, total] = getMostSleptMinuteForGuard(id, chronologicalEvents);
  if (total <= mostSleptTotal) continue;
  mostSleptTotal = total;
  mostSleptMinute2 = minute;
  sleepiestGuard2 = id;
}

const answerChecksum2 = sleepiestGuard2 * mostSleptMinute2;
console.log(`Day 4 Exercise 2 Answer: Guard ${sleepiestGuard2} slept the most at the ${mostSleptMinute2}th minute.`);
console.log(`Answer checksum is ${answerChecksum2}`);
