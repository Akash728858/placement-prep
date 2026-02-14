/**
 * Standard analysis entry schema, validation, and normalizers.
 * All saved entries conform to this shape.
 */

export const SKILL_KEYS = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other'];

const DEFAULT_EXTRACTED_SKILLS = Object.fromEntries(SKILL_KEYS.map((k) => [k, []]));

const DEFAULT_OTHER_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects'];

/**
 * Normalize extracted skills from extractSkills() to standard 7-key object.
 * general -> other; cloudDevOps -> cloud. If empty, other = DEFAULT_OTHER_SKILLS.
 */
export function normalizeExtractedSkills(extracted) {
  const out = { ...DEFAULT_EXTRACTED_SKILLS };
  const cats = extracted?.categories || {};
  const map = {
    coreCS: 'coreCS',
    languages: 'languages',
    web: 'web',
    data: 'data',
    cloudDevOps: 'cloud',
    cloud: 'cloud',
    testing: 'testing',
    general: 'other',
    other: 'other',
  };
  for (const [key, cat] of Object.entries(cats)) {
    const arr = Array.isArray(cat?.skills) ? cat.skills : [];
    const target = map[key] || 'other';
    if (!out[target].length) out[target] = [];
    out[target].push(...arr);
  }
  for (const k of SKILL_KEYS) {
    out[k] = [...new Set(out[k] || [])];
  }
  if (extracted?.isGeneralFresher || SKILL_KEYS.every((k) => !out[k].length)) {
    out.other = [...DEFAULT_OTHER_SKILLS];
  }
  return out;
}

/**
 * Normalize round mapping to { roundTitle, focusAreas[], whyItMatters }[].
 */
export function normalizeRoundMapping(rounds) {
  if (!Array.isArray(rounds)) return [];
  return rounds.map((r) => ({
    roundTitle: r.roundTitle ?? r.title ?? '',
    focusAreas: Array.isArray(r.focusAreas) ? r.focusAreas : (r.description ? [r.description] : []),
    whyItMatters: r.whyItMatters ?? '',
  }));
}

/**
 * Normalize checklist to { roundTitle, items[] }[].
 */
export function normalizeChecklist(checklist) {
  if (!Array.isArray(checklist)) return [];
  return checklist.map((c) => ({
    roundTitle: c.roundTitle ?? c.round ?? '',
    items: Array.isArray(c.items) ? c.items : [],
  }));
}

/**
 * Normalize 7-day plan to { day, focus, tasks[] }[].
 */
export function normalizePlan7Days(plan) {
  if (!Array.isArray(plan)) return [];
  return plan.map((p) => ({
    day: p.day ?? 0,
    focus: p.focus ?? p.title ?? '',
    tasks: Array.isArray(p.tasks) ? p.tasks : (Array.isArray(p.items) ? p.items : []),
  }));
}

/**
 * Build standard entry (no id/createdAt/updatedAt - caller adds those).
 */
export function buildStandardEntry(payload) {
  const now = new Date().toISOString();
  const extracted = normalizeExtractedSkills(payload.extractedSkills ?? {});
  const baseScore = Number(payload.baseScore ?? payload.readinessScore ?? 0);
  return {
    company: String(payload.company ?? '').trim(),
    role: String(payload.role ?? '').trim(),
    jdText: String(payload.jdText ?? ''),
    extractedSkills: extracted,
    roundMapping: normalizeRoundMapping(payload.roundMapping ?? []),
    checklist: normalizeChecklist(payload.checklist ?? []),
    plan7Days: normalizePlan7Days(payload.plan ?? payload.plan7Days ?? []),
    questions: Array.isArray(payload.questions) ? payload.questions : [],
    baseScore: Math.max(0, Math.min(100, Math.round(baseScore))),
    skillConfidenceMap: payload.skillConfidenceMap && typeof payload.skillConfidenceMap === 'object' ? payload.skillConfidenceMap : {},
    finalScore: Math.max(0, Math.min(100, Math.round(Number(payload.finalScore ?? payload.readinessScore ?? baseScore) || 0))),
    updatedAt: payload.updatedAt ?? now,
    companyIntel: payload.companyIntel ?? null,
  };
}

/**
 * Validate a raw stored entry. Returns true if usable.
 */
export function validateEntry(raw) {
  try {
    if (!raw || typeof raw !== 'object' || !raw.id) return false;
    if (typeof raw.jdText !== 'string') return false;
    if (!raw.extractedSkills || typeof raw.extractedSkills !== 'object') return false;
    if (!Array.isArray(raw.questions)) return false;
    if (typeof raw.baseScore !== 'number' && typeof raw.readinessScore !== 'number') return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalize a stored entry for app use (fill defaults, support legacy keys).
 */
export function normalizeStoredEntry(raw) {
  if (!raw || !raw.id) return null;
  try {
    const baseScore = Number(raw.baseScore ?? raw.readinessScore ?? 0) || 0;
    const skillConfidenceMap = raw.skillConfidenceMap && typeof raw.skillConfidenceMap === 'object' ? raw.skillConfidenceMap : {};
    const extracted = raw.extractedSkills && typeof raw.extractedSkills === 'object'
      ? { ...DEFAULT_EXTRACTED_SKILLS, ...raw.extractedSkills }
      : { ...DEFAULT_EXTRACTED_SKILLS, other: [...DEFAULT_OTHER_SKILLS] };
    for (const k of SKILL_KEYS) {
      if (!Array.isArray(extracted[k])) extracted[k] = [];
    }
    const checklist = Array.isArray(raw.checklist) ? raw.checklist.map((c) => ({
      roundTitle: c.roundTitle ?? c.round,
      items: Array.isArray(c.items) ? c.items : [],
    })) : [];
    const plan7Days = Array.isArray(raw.plan7Days) ? raw.plan7Days : (Array.isArray(raw.plan) ? raw.plan.map((p) => ({
      day: p.day,
      focus: p.focus ?? p.title,
      tasks: Array.isArray(p.tasks) ? p.tasks : (Array.isArray(p.items) ? p.items : []),
    })) : []);
    const roundMapping = Array.isArray(raw.roundMapping) ? raw.roundMapping.map((r) => ({
      roundTitle: r.roundTitle ?? r.title,
      focusAreas: Array.isArray(r.focusAreas) ? r.focusAreas : (r.description ? [r.description] : []),
      whyItMatters: r.whyItMatters ?? '',
    })) : [];
    return {
      id: raw.id,
      createdAt: raw.createdAt ?? new Date().toISOString(),
      company: String(raw.company ?? ''),
      role: String(raw.role ?? ''),
      jdText: raw.jdText,
      extractedSkills: extracted,
      roundMapping,
      checklist,
      plan7Days,
      questions: Array.isArray(raw.questions) ? raw.questions : [],
      baseScore,
      skillConfidenceMap,
      finalScore: Number(raw.finalScore ?? raw.readinessScore ?? baseScore) || 0,
      updatedAt: raw.updatedAt ?? raw.createdAt ?? new Date().toISOString(),
      companyIntel: raw.companyIntel ?? null,
    };
  } catch {
    return null;
  }
}
