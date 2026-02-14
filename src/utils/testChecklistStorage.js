const STORAGE_KEY = 'placement-prep-test-checklist';
const TOTAL_TESTS = 10;

function loadRaw() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * @returns {boolean[]} Array of 10 booleans (checked state per test)
 */
export function getTestChecklist() {
  const raw = loadRaw();
  if (!raw || raw.length !== TOTAL_TESTS) {
    return Array(TOTAL_TESTS).fill(false);
  }
  return raw.slice(0, TOTAL_TESTS).map((v) => Boolean(v));
}

/**
 * @param {boolean[]} checklist - Length 10
 */
export function setTestChecklist(checklist) {
  try {
    const arr = Array.isArray(checklist) ? checklist.slice(0, TOTAL_TESTS) : [];
    const padded = [...arr, ...Array(Math.max(0, TOTAL_TESTS - arr.length)).fill(false)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(padded.slice(0, TOTAL_TESTS)));
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {number} index - 0–9
 * @param {boolean} value
 */
export function setTestChecked(index, value) {
  const list = getTestChecklist();
  if (index < 0 || index >= TOTAL_TESTS) return false;
  list[index] = Boolean(value);
  return setTestChecklist(list);
}

export function resetTestChecklist() {
  return setTestChecklist(Array(TOTAL_TESTS).fill(false));
}

/**
 * @returns {{ passed: number, total: number, allPassed: boolean }}
 */
export function getTestSummary() {
  const list = getTestChecklist();
  const passed = list.filter(Boolean).length;
  return { passed, total: TOTAL_TESTS, allPassed: passed === TOTAL_TESTS };
}

export { TOTAL_TESTS };
