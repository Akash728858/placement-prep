const STORAGE_KEY = 'prp_final_submission';
const TOTAL_STEPS = 8;

function loadRaw() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function saveRaw(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/**
 * Basic URL validation: must have http/https and a host.
 * @param {string} value
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateUrl(value) {
  const str = String(value ?? '').trim();
  if (!str) return { valid: false, message: 'Required' };
  try {
    const u = new URL(str);
    if (!['http:', 'https:'].includes(u.protocol)) return { valid: false, message: 'Must use http or https' };
    if (!u.hostname || u.hostname.length < 2) return { valid: false, message: 'Invalid host' };
    return { valid: true };
  } catch {
    return { valid: false, message: 'Invalid URL' };
  }
}

const DEFAULT_SUBMISSION = {
  lovableUrl: '',
  githubUrl: '',
  deployedUrl: '',
  steps: Array(TOTAL_STEPS).fill(false),
};

/**
 * @returns {{ lovableUrl: string, githubUrl: string, deployedUrl: string, steps: boolean[] }}
 */
export function getProofSubmission() {
  const raw = loadRaw();
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SUBMISSION };
  const steps = Array.isArray(raw.steps) ? raw.steps.slice(0, TOTAL_STEPS) : [...DEFAULT_SUBMISSION.steps];
  while (steps.length < TOTAL_STEPS) steps.push(false);
  return {
    lovableUrl: String(raw.lovableUrl ?? '').trim(),
    githubUrl: String(raw.githubUrl ?? '').trim(),
    deployedUrl: String(raw.deployedUrl ?? '').trim(),
    steps: steps.slice(0, TOTAL_STEPS),
  };
}

/**
 * @param {Partial<{ lovableUrl: string, githubUrl: string, deployedUrl: string, steps: boolean[] }>} update
 */
export function setProofSubmission(update) {
  const current = getProofSubmission();
  const next = { ...current };
  if (update.lovableUrl !== undefined) next.lovableUrl = String(update.lovableUrl).trim();
  if (update.githubUrl !== undefined) next.githubUrl = String(update.githubUrl).trim();
  if (update.deployedUrl !== undefined) next.deployedUrl = String(update.deployedUrl).trim();
  if (Array.isArray(update.steps)) {
    next.steps = update.steps.slice(0, TOTAL_STEPS);
    while (next.steps.length < TOTAL_STEPS) next.steps.push(false);
  }
  return saveRaw(next);
}

export function setProofStep(index, completed) {
  const current = getProofSubmission();
  const steps = [...current.steps];
  if (index >= 0 && index < TOTAL_STEPS) steps[index] = Boolean(completed);
  return setProofSubmission({ ...current, steps });
}

/**
 * Shipped only if: all 8 steps completed, all 10 tests passed, all 3 links valid.
 */
export function isShipped(testSummary, submission) {
  const sub = submission ?? getProofSubmission();
  const stepsComplete = sub.steps.length >= TOTAL_STEPS && sub.steps.every(Boolean);
  const testsComplete = testSummary && testSummary.allPassed;
  const lovableOk = validateUrl(sub.lovableUrl).valid;
  const githubOk = validateUrl(sub.githubUrl).valid;
  const deployedOk = validateUrl(sub.deployedUrl).valid;
  return Boolean(stepsComplete && testsComplete && lovableOk && githubOk && deployedOk);
}

export { TOTAL_STEPS };
