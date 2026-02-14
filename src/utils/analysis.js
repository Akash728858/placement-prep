/**
 * Generate checklist, 7-day plan, and interview questions from extracted skills.
 * Template-based; no external APIs.
 */

import { extractSkills } from './skillExtraction';
import { getCompanyIntel } from './companyIntel';
import { getRoundMapping } from './roundMapping';

const ROUND_TEMPLATES = {
  round1: {
    title: 'Round 1: Aptitude / Basics',
    base: [
      'Revise quantitative aptitude: percentages, ratios, time-speed-distance.',
      'Practice logical reasoning and pattern recognition.',
      'Review verbal ability: grammar, comprehension.',
      'Time yourself on mock aptitude tests.',
      'Brush up on basic numerical puzzles.',
    ],
    extra: {
      coreCS: 'Add: basic CS fundamentals (binary, number systems).',
      languages: 'Add: language syntax quick reference.',
    },
  },
  round2: {
    title: 'Round 2: DSA + Core CS',
    base: [
      'Revise arrays, strings, and two-pointer techniques.',
      'Practice trees and graphs (BFS/DFS).',
      'Review hash maps and sliding window patterns.',
      'Solve 2–3 medium problems daily.',
      'Revise time/space complexity for common patterns.',
    ],
    extra: {
      coreCS: 'Revise OS: processes, threads, scheduling. Revise DBMS: normalization, indexes.',
      data: 'Revise SQL joins, subqueries, and indexing.',
      languages: 'Practice coding in your primary language (syntax + STL/library).',
    },
  },
  round3: {
    title: 'Round 3: Tech interview (projects + stack)',
    base: [
      'Prepare 2–3 project deep-dives (problem, solution, your role).',
      'Align resume bullet points with JD keywords.',
      'Prepare STAR examples for behavioral questions.',
      'Review system design basics: scalability, load balancing.',
    ],
    extra: {
      web: 'Prepare: React/Vue lifecycle, REST vs GraphQL, state management.',
      data: 'Prepare: database design, indexing, transactions.',
      cloudDevOps: 'Prepare: Docker, CI/CD, cloud services used.',
      testing: 'Prepare: testing strategy, unit vs integration tests.',
    },
  },
  round4: {
    title: 'Round 4: Managerial / HR',
    base: [
      'Prepare "Tell me about yourself" (1–2 min).',
      'List strengths and weaknesses with examples.',
      'Prepare "Why this company?" and "Why this role?"',
      'Prepare questions to ask the interviewer.',
      'Practice confidence and clarity; avoid badmouthing.',
    ],
  },
};

function pickItems(base, extraList, maxItems = 8) {
  const out = [...base];
  for (const line of extraList) {
    if (out.length >= maxItems) break;
    out.push(line);
  }
  return out.slice(0, maxItems);
}

/**
 * @param {{ categories: Record<string, { label: string, skills: string[] }>, all: string[] }} extracted
 */
export function generateChecklist(extracted) {
  const checklist = [];
  const cats = extracted.categories || {};
  const has = (k) => cats[k] && cats[k].skills && cats[k].skills.length > 0;

  for (const [roundKey, t] of Object.entries(ROUND_TEMPLATES)) {
    const base = t.base || [];
    const extra = [];
    if (t.extra) {
      if (has('coreCS') && t.extra.coreCS) extra.push(t.extra.coreCS);
      if (has('languages') && t.extra.languages) extra.push(t.extra.languages);
      if (has('data') && t.extra.data) extra.push(t.extra.data);
      if (has('web') && t.extra.web) extra.push(t.extra.web);
      if (has('cloudDevOps') && t.extra.cloudDevOps) extra.push(t.extra.cloudDevOps);
      if (has('testing') && t.extra.testing) extra.push(t.extra.testing);
    }
    checklist.push({
      round: t.title,
      items: pickItems(base, extra, 8),
    });
  }
  return checklist;
}

const DAY_TEMPLATES = [
  {
    day: 1,
    title: 'Day 1–2: Basics + Core CS',
    base: ['Aptitude practice (30 min).', 'Revise OS: processes, memory.', 'Revise DBMS: SQL basics, normalization.'],
    extra: { coreCS: 'Deep dive OS/Networks/DBMS topics from JD.', languages: 'Language syntax and common APIs.' },
  },
  {
    day: 2,
    title: 'Day 3–4: DSA + Coding practice',
    base: ['Solve 3–4 problems (arrays, strings, trees).', 'Revise recursion and DP basics.', 'Time yourself on 2 medium problems.'],
    extra: { coreCS: 'Focus on algorithm patterns mentioned in JD.' },
  },
  {
    day: 3,
    title: 'Day 5: Project + Resume alignment',
    base: ['Document 2 projects with problem–solution–impact.', 'Align resume bullets with JD keywords.', 'Prepare 2-min project pitch.'],
    extra: {
      web: 'Frontend/backend talking points and demo flow.',
      data: 'Database choices and schema highlights.',
      cloudDevOps: 'Deployment and infra you used.',
    },
  },
  {
    day: 4,
    title: 'Day 6: Mock interview questions',
    base: ['Practice 5 behavioral questions (STAR).', 'Prepare "Tell me about yourself".', 'Mock 1 tech round with a friend or timer.'],
    extra: {
      web: 'React/Node/API design questions.',
      data: 'SQL and schema design questions.',
      testing: 'How you test your code.',
    },
  },
  {
    day: 5,
    title: 'Day 7: Revision + Weak areas',
    base: ['Revise weak topics from the week.', 'Quick recap of DSA patterns.', 'Rest and stay calm before interview.'],
    extra: { web: 'Frontend revision if React/Next in JD.', coreCS: 'Last-minute core CS revision.' },
  },
];

function dayPlanItems(t, has) {
  const out = [...t.base];
  if (t.extra) {
    if (has('coreCS') && t.extra.coreCS) out.push(t.extra.coreCS);
    if (has('languages') && t.extra.languages) out.push(t.extra.languages);
    if (has('web') && t.extra.web) out.push(t.extra.web);
    if (has('data') && t.extra.data) out.push(t.extra.data);
    if (has('cloudDevOps') && t.extra.cloudDevOps) out.push(t.extra.cloudDevOps);
    if (has('testing') && t.extra.testing) out.push(t.extra.testing);
  }
  return out;
}

/**
 * @param {{ categories: Record<string, { label: string, skills: string[] }> }} extracted
 */
export function generate7DayPlan(extracted) {
  const cats = extracted.categories || {};
  const has = (k) => cats[k] && cats[k].skills && cats[k].skills.length > 0;

  return DAY_TEMPLATES.map((t) => ({
    day: t.day,
    title: t.title,
    items: dayPlanItems(t, has),
  }));
}

const QUESTION_TEMPLATES = [
  { trigger: 'SQL', question: 'Explain indexing in databases and when it helps.' },
  { trigger: 'MongoDB', question: 'When would you choose MongoDB over a relational database?' },
  { trigger: 'React', question: 'Explain state management options in React (useState, context, Redux).' },
  { trigger: 'DSA', question: 'How would you optimize search in sorted data? Discuss time complexity.' },
  { trigger: 'OOP', question: 'Explain polymorphism and give a real-world example.' },
  { trigger: 'Node.js', question: 'How does the Node.js event loop work?' },
  { trigger: 'Docker', question: 'What is the difference between a Docker image and a container?' },
  { trigger: 'REST', question: 'REST vs GraphQL: when would you choose one over the other?' },
  { trigger: 'DBMS', question: 'Explain ACID properties and why they matter.' },
  { trigger: 'OS', question: 'Explain process vs thread and when to use which.' },
  { trigger: 'Networks', question: 'Explain HTTP vs HTTPS and what TLS provides.' },
  { trigger: 'Kubernetes', question: 'What are Kubernetes pods and how do they relate to deployments?' },
  { trigger: 'Java', question: 'Explain the difference between equals() and == in Java.' },
  { trigger: 'Python', question: 'Explain list vs tuple and when to use each.' },
  { trigger: 'JavaScript', question: 'Explain closures and a practical use case.' },
  { trigger: 'CI/CD', question: 'What does a typical CI/CD pipeline do from commit to deploy?' },
  { trigger: 'JUnit', question: 'How do you structure unit tests? What do you mock?' },
  { trigger: 'System Design', question: 'How would you design a URL shortener?' },
];

/**
 * @param {{ categories: Record<string, { label: string, skills: string[] }>, all: string[] }} extracted
 * @returns {string[]} Up to 10 questions
 */
export function generateQuestions(extracted) {
  const all = (extracted.all || []).map((s) => s.toLowerCase());
  const selected = [];
  const used = new Set();

  for (const { trigger, question } of QUESTION_TEMPLATES) {
    const triggerLower = trigger.toLowerCase();
    const match = all.some((s) => s.includes(triggerLower) || triggerLower.includes(s));
    if (match && !used.has(question)) {
      used.add(question);
      selected.push(question);
    }
    if (selected.length >= 10) break;
  }

  if (selected.length < 10) {
    const fallback = [
      'Walk me through your resume and a project you are proud of.',
      'Describe a time you solved a difficult technical problem.',
      'How do you stay updated with new technologies?',
      'What is your approach to debugging production issues?',
      'How do you handle disagreements in a team?',
      'Explain a system you designed or improved.',
      'What are your strengths and how do they apply to this role?',
      'Where do you see yourself in 2–3 years?',
      'Do you have any questions for us?',
    ];
    for (const q of fallback) {
      if (selected.length >= 10) break;
      if (!used.has(q)) selected.push(q);
    }
  }

  return selected.slice(0, 10);
}

/**
 * Readiness score: start 35, +5 per category (max 30), +10 company, +10 role, +10 JD length > 800. Cap 100.
 */
export function calculateReadinessScore(extracted, { company = '', role = '', jdText = '' }) {
  let score = 35;
  const cats = extracted.categories || {};
  const categoryCount = Object.keys(cats).filter((k) => k !== 'general').length;
  score += Math.min(categoryCount * 5, 30);
  if (company && String(company).trim().length > 0) score += 10;
  if (role && String(role).trim().length > 0) score += 10;
  if (jdText && String(jdText).trim().length > 800) score += 10;
  return Math.min(100, Math.max(0, score));
}

/**
 * Run full analysis from JD text and optional company/role.
 */
export function runAnalysis(jdText, company = '', role = '') {
  const extracted = extractSkills(jdText);
  const checklist = generateChecklist(extracted);
  const plan = generate7DayPlan(extracted);
  const questions = generateQuestions(extracted);
  const readinessScore = calculateReadinessScore(extracted, { company, role, jdText });

  const companyIntel = company && String(company).trim()
    ? getCompanyIntel(company.trim(), extracted, jdText)
    : null;
  const roundMapping = getRoundMapping(companyIntel?.sizeCategory ?? 'startup', extracted);

  return {
    extractedSkills: extracted,
    checklist,
    plan,
    questions,
    readinessScore,
    companyIntel,
    roundMapping,
  };
}
