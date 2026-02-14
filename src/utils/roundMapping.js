/**
 * Dynamic round mapping from company size + detected skills.
 * No external APIs.
 */

function hasCategory(extracted, key) {
  const cat = extracted?.categories?.[key];
  return cat && Array.isArray(cat.skills) && cat.skills.length > 0;
}

function hasDSA(extracted) {
  return hasCategory(extracted, 'coreCS') || (extracted?.all || []).some((s) => /dsa|algorithm|data structure/i.test(String(s)));
}

function hasWebStack(extracted) {
  return hasCategory(extracted, 'web') || hasCategory(extracted, 'languages');
}

function hasSystemDesign(extracted) {
  return (extracted?.all || []).some((s) => /system design|scalability|distributed/i.test(String(s))) || hasCategory(extracted, 'cloudDevOps');
}

/**
 * @param {string} sizeCategory - 'startup' | 'mid-size' | 'enterprise'
 * @param {object} extractedSkills - From skillExtraction
 * @returns {Array<{ roundNumber: number, title: string, description: string, whyItMatters: string }>}
 */
export function getRoundMapping(sizeCategory, extractedSkills) {
  const size = sizeCategory || 'startup';
  const hasDSAFlag = hasDSA(extractedSkills);
  const hasWeb = hasWebStack(extractedSkills);
  const hasSys = hasSystemDesign(extractedSkills);

  if (size === 'enterprise' && hasDSAFlag) {
    return [
      {
        roundNumber: 1,
        title: 'Round 1: Online Test',
        description: 'DSA + Aptitude. Timed coding and MCQ.',
        whyItMatters: 'Screens for fundamentals and speed; most candidates are filtered here.',
      },
      {
        roundNumber: 2,
        title: 'Round 2: Technical (DSA + Core CS)',
        description: 'DSA problems, OS, DBMS, networks.',
        whyItMatters: 'Validates depth in computer science basics and problem-solving approach.',
      },
      {
        roundNumber: 3,
        title: 'Round 3: Tech + Projects',
        description: 'Project deep-dive, system design basics.',
        whyItMatters: 'Shows how you apply knowledge in real scenarios and own outcomes.',
      },
      {
        roundNumber: 4,
        title: 'Round 4: HR',
        description: 'Behavioral, fit, and expectations.',
        whyItMatters: 'Final check on communication, values, and long-term fit.',
      },
    ];
  }

  if (size === 'enterprise') {
    return [
      {
        roundNumber: 1,
        title: 'Round 1: Aptitude / Screening',
        description: 'Aptitude and basic technical MCQs.',
        whyItMatters: 'First filter for logical and verbal ability.',
      },
      {
        roundNumber: 2,
        title: 'Round 2: Technical',
        description: 'Core CS and role-specific topics.',
        whyItMatters: 'Assesses technical depth for the role.',
      },
      {
        roundNumber: 3,
        title: 'Round 3: Projects & Discussion',
        description: 'Project walkthrough and design discussion.',
        whyItMatters: 'Evaluates practical experience and communication.',
      },
      {
        roundNumber: 4,
        title: 'Round 4: HR',
        description: 'Behavioral and culture fit.',
        whyItMatters: 'Ensures alignment with company values and team.',
      },
    ];
  }

  if ((size === 'startup' || size === 'mid-size') && (hasWeb || hasSys)) {
    return [
      {
        roundNumber: 1,
        title: 'Round 1: Practical coding',
        description: 'Hands-on coding or take-home; stack-aligned.',
        whyItMatters: 'Proves you can ship; often the main technical signal.',
      },
      {
        roundNumber: 2,
        title: 'Round 2: System / Design discussion',
        description: 'Architecture, trade-offs, or past system decisions.',
        whyItMatters: 'Shows how you think about scale and trade-offs.',
      },
      {
        roundNumber: 3,
        title: 'Round 3: Culture fit',
        description: 'Values, working style, and motivation.',
        whyItMatters: 'Small teams need strong fit and ownership mindset.',
      },
    ];
  }

  if (size === 'mid-size') {
    return [
      {
        roundNumber: 1,
        title: 'Round 1: Technical screening',
        description: 'Coding or technical discussion.',
        whyItMatters: 'Quick validation of core skills.',
      },
      {
        roundNumber: 2,
        title: 'Round 2: Deep dive',
        description: 'Projects and problem-solving.',
        whyItMatters: 'Assesses depth and how you approach problems.',
      },
      {
        roundNumber: 3,
        title: 'Round 3: Team / HR',
        description: 'Team fit and behavioral.',
        whyItMatters: 'Confirms alignment with role and team.',
      },
    ];
  }

  // Default: startup, generic
  return [
    {
      roundNumber: 1,
      title: 'Round 1: Technical',
      description: 'Coding or practical problem-solving.',
      whyItMatters: 'Core signal on whether you can contribute quickly.',
    },
    {
      roundNumber: 2,
      title: 'Round 2: Discussion',
      description: 'Projects, approach, or system thinking.',
      whyItMatters: 'Tests communication and depth of experience.',
    },
    {
      roundNumber: 3,
      title: 'Round 3: Culture fit',
      description: 'Values and working style.',
      whyItMatters: 'Ensures mutual fit for a small team.',
    },
  ];
}
