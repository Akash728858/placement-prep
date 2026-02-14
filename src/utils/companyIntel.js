/**
 * Company intel from name + JD (heuristic only, no scraping).
 * Size: startup (<200), mid-size (200–2000), enterprise (2000+).
 */

const KNOWN_ENTERPRISE = [
  'amazon', 'infosys', 'tcs', 'tata consultancy', 'wipro', 'accenture', 'microsoft', 'google', 'meta', 'apple',
  'ibm', 'oracle', 'capgemini', 'cognizant', 'hcl', 'tech mahindra', 'larsen', 'toubro', 'lt', 'dell',
  'cisco', 'intel', 'sap', 'salesforce', 'adobe', 'netflix', 'uber', 'paypal', 'goldman sachs', 'jpmorgan',
  'morgan stanley', 'mckinsey', 'bcg', 'bain', 'deloitte', 'ey', 'kpmg', 'pwc'
];

const INDUSTRY_KEYWORDS = [
  { keywords: ['fintech', 'banking', 'finance', 'payment', 'insurance'], industry: 'Financial Services' },
  { keywords: ['healthcare', 'medical', 'pharma', 'clinical'], industry: 'Healthcare' },
  { keywords: ['ecommerce', 'retail', 'marketplace', 'shopping'], industry: 'E-commerce & Retail' },
  { keywords: ['edtech', 'education', 'learning', 'course'], industry: 'Education Technology' },
  { keywords: ['saas', 'cloud', 'enterprise software'], industry: 'SaaS & Enterprise Software' },
  { keywords: ['automotive', 'vehicle', 'ev', 'mobility'], industry: 'Automotive & Mobility' },
];

const DEFAULT_INDUSTRY = 'Technology Services';

function normalizeCompany(name) {
  return String(name || '').trim().toLowerCase();
}

function matchesKnownEnterprise(companyNormalized) {
  return KNOWN_ENTERPRISE.some((known) => companyNormalized.includes(known) || known.includes(companyNormalized));
}

/**
 * @param {string} company - Company name
 * @param {object} extractedSkills - From skillExtraction
 * @param {string} [jdText] - Optional JD text for industry guess
 * @returns {{ companyName: string, industry: string, sizeCategory: string, typicalHiringFocus: string }}
 */
export function getCompanyIntel(company, extractedSkills, jdText = '') {
  const companyName = String(company || '').trim() || 'Unknown';
  const normalized = normalizeCompany(company);
  const combined = normalized + ' ' + (jdText || '').toLowerCase();

  let sizeCategory = 'startup';
  if (normalized && matchesKnownEnterprise(normalized)) {
    sizeCategory = 'enterprise';
  }

  let industry = DEFAULT_INDUSTRY;
  for (const row of INDUSTRY_KEYWORDS) {
    if (row.keywords.some((kw) => combined.includes(kw))) {
      industry = row.industry;
      break;
    }
  }

  let typicalHiringFocus;
  if (sizeCategory === 'enterprise') {
    typicalHiringFocus = 'Structured process with emphasis on DSA, core CS fundamentals, and system design. Multiple technical rounds with standardized evaluation. Strong aptitude and communication rounds.';
  } else if (sizeCategory === 'mid-size') {
    typicalHiringFocus = 'Balance of problem-solving, hands-on coding, and domain fit. Often 2-3 technical rounds plus culture fit.';
  } else {
    typicalHiringFocus = 'Practical problem-solving and stack depth. Focus on what you can build, past projects, and how you learn. Fewer rounds; impact and culture fit matter.';
  }

  return {
    companyName,
    industry,
    sizeCategory,
    typicalHiringFocus,
  };
}
