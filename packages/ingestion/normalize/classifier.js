/**
 * Classify role based on title and description.
 * @param {string} title - Job title
 * @param {string} description - Job description
 * @returns {'SDE' | 'DATA' | 'AI_ML' | 'OTHER'}
 */
/**
 * Classify role based on title and description.
 * @param {string} title - Job title
 * @param {string} description - Job description
 * @returns {'SDE' | 'DATA' | 'AI_ML' | 'OTHER'}
 */
export function classifyRole(title = '', description = '') {
  const t = title.toLowerCase();

  // 1. Check title first (most specific and accurate)
  // AI/ML specific titles
  if (/\b(machine learning|deep learning|nlp|computer vision|genai|generative ai|llm|llms|ai engineer|ai research|ai intern|ai resident|ai fellow)\b/i.test(t)) {
    return 'AI_ML';
  }
  if (/\bml\b/i.test(t) && /\b(engineer|developer|intern|research|scientist)\b/i.test(t)) {
    return 'AI_ML';
  }
  if (/\bai\b/i.test(t) && /\b(engineer|developer|intern|research|scientist|agent)\b/i.test(t)) {
    return 'AI_ML';
  }

  // Data specific titles
  if (/\b(data science|data scientist|data analyst|data analytics|data engineer|bi analyst|business intelligence|analytics intern)\b/i.test(t)) {
    return 'DATA';
  }

  // SDE / Software titles
  if (/\b(software|developer|engineer|sde|frontend|front-end|backend|back-end|fullstack|full-stack|web dev|mobile dev|ios|android|devops|sre|systems|infrastructure|security engineer|qa engineer|test engineer|platform|firmware|hardware)\b/i.test(t)) {
    return 'SDE';
  }

  // 2. Fallback to description analysis with strict phrase patterns
  const d = description.toLowerCase();

  if (/\b(machine learning|deep learning|natural language processing|computer vision|reinforcement learning|foundation models|large language models|generative ai)\b/i.test(d)) {
    return 'AI_ML';
  }

  if (/\b(data science|data analytics|data pipeline|data warehouse|etl pipeline|business intelligence|quantitative analysis)\b/i.test(d)) {
    return 'DATA';
  }

  if (/\b(software engineer|software development|backend service|web development|frontend architecture|distributed systems|rest api|microservices)\b/i.test(d)) {
    return 'SDE';
  }

  return 'OTHER';
}

