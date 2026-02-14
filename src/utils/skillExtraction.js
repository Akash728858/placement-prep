/**
 * Skill extraction from JD text (case-insensitive keyword match).
 * No external APIs. Heuristic only.
 */

const CATEGORIES = {
  coreCS: {
    label: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Data Structures', 'Algorithms', 'Operating System', 'Computer Networks', 'System Design'],
  },
  languages: {
    label: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang', 'Ruby', 'Kotlin', 'Swift'],
  },
  web: {
    label: 'Web',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'Angular', 'Vue', 'HTML', 'CSS', 'frontend', 'backend'],
  },
  data: {
    label: 'Data',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'NoSQL', 'database'],
  },
  cloudDevOps: {
    label: 'Cloud/DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'DevOps', 'K8s', 'Terraform'],
  },
  testing: {
    label: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'testing', 'unit test'],
  },
};

function findMatches(text, keywords) {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const found = [];
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) found.push(kw);
  }
  return [...new Set(found)];
}

/**
 * @param {string} jdText - Raw job description text
 * @returns {{ categories: Record<string, { label: string, skills: string[] }>, all: string[], isGeneralFresher: boolean }}
 */
export function extractSkills(jdText) {
  const categories = {};
  const allSet = new Set();

  for (const [key, { label, keywords }] of Object.entries(CATEGORIES)) {
    const skills = findMatches(jdText, keywords);
    if (skills.length) {
      categories[key] = { label, skills };
      skills.forEach((s) => allSet.add(s));
    }
  }

  const all = [...allSet];
  const isGeneralFresher = all.length === 0;

  if (isGeneralFresher) {
    categories.other = {
      label: 'Other',
      skills: ['Communication', 'Problem solving', 'Basic coding', 'Projects'],
    };
  }

  return {
    categories: categories,
    all,
    isGeneralFresher,
  };
}

export { CATEGORIES };
