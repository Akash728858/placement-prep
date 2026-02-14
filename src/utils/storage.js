const STORAGE_KEY = 'placement-prep-analysis-history';

import { buildStandardEntry, validateEntry, normalizeStoredEntry } from './schema';

function loadRaw() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    const parsed = s ? JSON.parse(s) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRaw(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

/**
 * Save a new analysis. Payload from runAnalysis + company, role, jdText.
 * Standardizes to schema and adds id, createdAt, updatedAt.
 */
export function saveAnalysis(payload) {
  const id = `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const baseScore = Number(payload.readinessScore ?? payload.baseScore ?? 0) || 0;
  const standard = buildStandardEntry({
    ...payload,
    baseScore,
    finalScore: baseScore,
    updatedAt,
  });
  const full = { id, createdAt, updatedAt, ...standard };
  const entries = loadRaw();
  entries.unshift(full);
  const saved = saveRaw(entries);
  if (!saved) throw new Error('Could not save to history. Check if storage is full or disabled.');
  return full;
}

/**
 * @returns {{ list: Array<{ id, createdAt, company, role, readinessScore }>, skippedCount: number }}
 */
export function getAnalyses() {
  const raw = loadRaw();
  const list = [];
  let skippedCount = 0;
  for (const e of raw) {
    if (!validateEntry(e)) {
      skippedCount++;
      continue;
    }
    const norm = normalizeStoredEntry(e);
    if (!norm) {
      skippedCount++;
      continue;
    }
    list.push({
      id: String(norm.id),
      createdAt: norm.createdAt ?? new Date().toISOString(),
      company: norm.company ?? '',
      role: norm.role ?? '',
      readinessScore: Number(norm.finalScore ?? norm.baseScore ?? 0) || 0,
    });
  }
  return { list, skippedCount };
}

/**
 * @param {string} id
 * @returns {object|null} Normalized full entry or null
 */
export function getAnalysisById(id) {
  if (id == null || String(id).trim() === '') return null;
  const entries = loadRaw();
  const found = entries.find((e) => e && e.id === id);
  if (!found || !validateEntry(found)) return null;
  return normalizeStoredEntry(found);
}

/**
 * Update an existing entry (e.g. skillConfidenceMap, finalScore, updatedAt).
 */
export function updateAnalysis(id, updates) {
  if (id == null || String(id).trim() === '') return false;
  const entries = loadRaw();
  const idx = entries.findIndex((e) => e && e.id === id);
  if (idx === -1) return false;
  const updatedAt = new Date().toISOString();
  entries[idx] = { ...entries[idx], ...updates, updatedAt };
  return saveRaw(entries);
}
