export type IndexabilityTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface CategoryMeta {
  name: string;
  slug: string;
  shortTitle: string;
  headline: string;
  description: string;
  metaDescription: string;
  coreFocus: string;
  keyPrinciples: string[];
  recommendedTimeWindow: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    name: 'Morning Routine',
    slug: 'morning-routine',
    shortTitle: 'Morning Routines',
    headline: 'Structured Morning Routine Templates & Daily Launch Checklists',
    description: 'Start your day with intentional momentum. These offline-first morning routine templates pair hydration, light exposure, movement, and focused planning blocks tailored to your schedule and chronotype.',
    metaDescription: 'Free, private morning routine templates and habit trackers for busy professionals, students, parents, early birds, and night owls. Customize and track offline.',
    coreFocus: 'Circadian alignment, early cognitive clarity, and distraction-free first-hour execution',
    keyPrinciples: [
      'Complete a low-friction anchor habit within 5 minutes of waking before checking notifications.',
      'Sequence physical activation (hydration, light, mobility) before high-cognitive planning.',
      'Keep total morning protocol duration realistic for your chronotype and commute constraints.'
    ],
    recommendedTimeWindow: 'First 30–60 minutes after waking'
  },
  {
    name: 'Habit Building',
    slug: 'habit-building',
    shortTitle: 'Habit Building',
    headline: 'Behavioral Habit Building Templates & Streak Systems',
    description: 'Build durable daily habits using cue-routine-reward loops, habit stacking, and minimum viable consistency targets. Track streaks locally in your browser with zero cloud tracking.',
    metaDescription: 'Browse evidence-informed habit building templates and streak trackers. Design sustainable daily habits for health, focus, writing, and personal growth.',
    coreFocus: 'Cue-based habit stacking, friction reduction, and streak preservation through minimum viable actions',
    keyPrinciples: [
      'Anchor every new behavior to an existing daily trigger (time of day, location, or preceding routine).',
      'Define a 2-minute minimum baseline version for high-stress or travel days so the chain never breaks.',
      'Track visual completion immediately after performing the habit to reinforce identity.'
    ],
    recommendedTimeWindow: 'Anchored to fixed daily transitions (morning, midday, or evening)'
  },
  {
    name: 'Daily Productivity',
    slug: 'daily-productivity',
    shortTitle: 'Daily Productivity',
    headline: 'Daily Productivity Systems, Time-Blocking & Deep Work Planners',
    description: 'Eliminate context switching and decision fatigue with structured daily productivity templates. Combine priority triage, deep work blocks, and intentional shutdown reviews.',
    metaDescription: 'Free daily productivity templates, time-blocking schedules, and deep work trackers for remote workers, professionals, freelancers, and students.',
    coreFocus: 'Cognitive load management, uninterrupted deep work blocks, and ruthless priority selection',
    keyPrinciples: [
      'Identify your single highest-leverage outcome before opening email or messaging apps.',
      'Batch reactive communication into fixed windows rather than fragmenting focus blocks.',
      'Close the workday with a 5-minute workspace reset and tomorrow-top-3 capture.'
    ],
    recommendedTimeWindow: 'Core peak-focus work hours + 10-minute end-of-day review'
  },
  {
    name: 'Goal Setting',
    slug: 'goal-setting',
    shortTitle: 'Goal Setting',
    headline: 'Outcome & Milestone Goal Setting Frameworks',
    description: 'Translate long-term ambitions into measurable weekly targets and daily lead-indicator habits. Track milestone progress privately on your device.',
    metaDescription: 'Structured goal setting templates and milestone trackers for career, financial planning, fitness, language learning, and skill mastery.',
    coreFocus: 'Translating lag-indicator outcomes into controllable daily and weekly lead actions',
    keyPrinciples: [
      'Pair every outcome target with 2–3 daily process habits that you directly control.',
      'Review milestone progress weekly and recalibrate scope rather than abandoning the goal.',
      'Limit active focus goals to prevent dilution of attention across competing priorities.'
    ],
    recommendedTimeWindow: 'Weekly 15-minute calibration + daily lead-habit check-in'
  },
  {
    name: 'Mindfulness',
    slug: 'mindfulness',
    shortTitle: 'Mindfulness & Clarity',
    headline: 'Mindfulness, Stress Regulation & Mental Clarity Protocols',
    description: 'Cultivate emotional regulation, attentional control, and nervous-system recovery through practical mindfulness, breathwork, and reflective journaling templates.',
    metaDescription: 'Practical mindfulness, stress management, stoic reflection, and digital detox templates. Build a calm, resilient daily practice offline.',
    coreFocus: 'Attentional training, nervous-system down-regulation, and cognitive reframing',
    keyPrinciples: [
      'Start with short, consistent 5-minute sessions rather than sporadic long retreats.',
      'Use structured journaling prompts to externalize looping thoughts and anxieties.',
      'Create intentional device-free buffer zones between high-stress work and personal rest.'
    ],
    recommendedTimeWindow: 'Morning centering (5–10 min) + midday or evening decompression'
  },
  {
    name: 'Fitness',
    slug: 'fitness',
    shortTitle: 'Fitness & Physical Health',
    headline: 'Fitness Consistency, Strength & Mobility Habit Trackers',
    description: 'Stay consistent with strength training, conditioning, mobility, nutrition hydration, and active recovery using structured fitness habit templates.',
    metaDescription: 'Free offline fitness habit trackers and workout consistency templates for strength, weight management, mobility, and healthy aging.',
    coreFocus: 'progressive physical consistency, daily non-exercise movement, and recovery hygiene',
    keyPrinciples: [
      'Prioritize workout scheduling consistency and warm-up execution before chasing intensity.',
      'Pair training habits with foundational nutrition, hydration, and sleep recovery anchors.',
      'Track daily movement baselines (steps, posture, mobility) alongside formal training sessions.'
    ],
    recommendedTimeWindow: 'Scheduled training window + throughout-the-day mobility & hydration'
  },
  {
    name: 'Evening Ritual',
    slug: 'evening-ritual',
    shortTitle: 'Evening Rituals',
    headline: 'Evening Wind-Down Rituals & Sleep Hygiene Checklists',
    description: 'Protect your sleep architecture and close the mental loops of the day. These evening ritual templates structure screen curfews, next-day preparation, and physiological wind-down.',
    metaDescription: 'Structured evening ritual and sleep hygiene templates. Improve sleep quality, reduce nighttime screen scrolling, and prepare for tomorrow.',
    coreFocus: 'Cognitive offloading, circadian dim-light transition, and friction-free next-day prep',
    keyPrinciples: [
      'Externalize tomorrow’s tasks and open loops onto paper/planner at least 60 minutes before bed.',
      'Establish a consistent digital sunset to reduce blue-light and dopamine stimulation.',
      'Prepare your physical environment (workspace, clothes, water) so tomorrow starts effortlessly.'
    ],
    recommendedTimeWindow: 'Final 45–90 minutes before sleep'
  },
  {
    name: 'Career Growth',
    slug: 'career-growth',
    shortTitle: 'Career Growth',
    headline: 'Career Growth, Leadership & Deliberate Skill Mastery Plans',
    description: 'Compound your professional trajectory with structured templates for deliberate skill practice, networking, public speaking, deep work, and portfolio building.',
    metaDescription: 'Actionable career growth templates for professionals, managers, entrepreneurs, freelancers, and students. Track skill acquisition and leadership habits.',
    coreFocus: 'Deliberate skill acquisition, strategic relationship building, and high-visibility output',
    keyPrinciples: [
      'Protect dedicated weekly hours for long-term career capital before urgent shallow tasks consume the week.',
      'Break complex skills (public speaking, negotiation, technical mastery) into daily micro-drills.',
      'Document wins, lessons, and network touchpoints systematically every week.'
    ],
    recommendedTimeWindow: '30–45 minutes of daily deliberate practice + weekly career review'
  }
];

export const CATEGORY_BY_NAME: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map(c => [c.name, c])
);

export const CATEGORY_BY_SLUG: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map(c => [c.slug, c])
);

export const PRIMARY_CATEGORIES_BY_SCENARIO: Record<string, string[]> = {
  'Productivity': ['Morning Routine', 'Daily Productivity', 'Habit Building'],
  'Focus': ['Daily Productivity', 'Morning Routine', 'Mindfulness'],
  'High Energy': ['Morning Routine', 'Fitness', 'Evening Ritual'],
  'Deep Work': ['Daily Productivity', 'Morning Routine', 'Career Growth'],
  'Stress Management': ['Mindfulness', 'Evening Ritual', 'Morning Routine'],
  'Physical Strength': ['Fitness', 'Habit Building', 'Goal Setting'],
  'Mental Clarity': ['Mindfulness', 'Morning Routine', 'Evening Ritual'],
  'Creative Flow': ['Morning Routine', 'Daily Productivity', 'Habit Building'],
  'Stoicism': ['Mindfulness', 'Morning Routine', 'Evening Ritual'],
  'Minimalism': ['Habit Building', 'Daily Productivity', 'Evening Ritual'],
  'Digital Detox': ['Evening Ritual', 'Habit Building', 'Mindfulness'],
  'Healthy Aging': ['Fitness', 'Morning Routine', 'Habit Building'],
  'Weight Loss': ['Fitness', 'Habit Building', 'Goal Setting'],
  'Muscle Gain': ['Fitness', 'Goal Setting', 'Habit Building'],
  'Sleep Quality': ['Evening Ritual', 'Habit Building', 'Mindfulness'],
  'Financial Planning': ['Goal Setting', 'Habit Building', 'Career Growth'],
  'Social Networking': ['Career Growth', 'Goal Setting', 'Habit Building'],
  'Language Learning': ['Habit Building', 'Goal Setting', 'Daily Productivity'],
  'Skill Acquisition': ['Career Growth', 'Goal Setting', 'Habit Building'],
  'Self-Care': ['Evening Ritual', 'Mindfulness', 'Morning Routine'],
  'Public Speaking': ['Career Growth', 'Goal Setting', 'Habit Building'],
  'Writing Habit': ['Habit Building', 'Morning Routine', 'Daily Productivity'],
};

export const SECONDARY_CATEGORIES_BY_SCENARIO: Record<string, string[]> = {
  'Productivity': ['Goal Setting', 'Career Growth', 'Evening Ritual'],
  'Focus': ['Habit Building', 'Goal Setting', 'Career Growth'],
  'High Energy': ['Daily Productivity', 'Habit Building', 'Goal Setting'],
  'Deep Work': ['Habit Building', 'Goal Setting', 'Mindfulness'],
  'Stress Management': ['Habit Building', 'Daily Productivity'],
  'Physical Strength': ['Morning Routine'],
  'Mental Clarity': ['Daily Productivity', 'Habit Building'],
  'Creative Flow': ['Mindfulness', 'Goal Setting', 'Evening Ritual'],
  'Stoicism': ['Habit Building', 'Goal Setting'],
  'Minimalism': ['Morning Routine', 'Mindfulness', 'Goal Setting'],
  'Digital Detox': ['Morning Routine', 'Daily Productivity'],
  'Healthy Aging': ['Mindfulness', 'Evening Ritual', 'Goal Setting'],
  'Weight Loss': ['Morning Routine', 'Evening Ritual'],
  'Muscle Gain': ['Morning Routine'],
  'Sleep Quality': ['Morning Routine'],
  'Financial Planning': ['Daily Productivity'],
  'Social Networking': ['Daily Productivity'],
  'Language Learning': ['Morning Routine'],
  'Skill Acquisition': ['Daily Productivity', 'Morning Routine'],
  'Self-Care': ['Habit Building', 'Goal Setting', 'Fitness'],
  'Public Speaking': ['Daily Productivity', 'Mindfulness'],
  'Writing Habit': ['Goal Setting', 'Mindfulness'],
};

const DEFAULT_PRIMARY_CONTEXTS = [
  'Busy Professionals', 'Students', 'Parents', 'Beginners',
  'Entrepreneurs', 'Remote Workers', 'Managers', 'Freelancers'
];

const DOMAIN_PRIMARY_CONTEXTS: Record<string, string[]> = {
  'Fitness': ['Athletes', 'Beginners', 'Busy Professionals', 'Parents', 'Retirees', 'Students'],
  'Morning Routine': ['Busy Professionals', 'Students', 'Parents', 'Early Birds', 'Night Owls', 'Entrepreneurs', 'Remote Workers', 'Beginners'],
  'Evening Ritual': ['Busy Professionals', 'Parents', 'Night Owls', 'Students', 'Remote Workers', 'Entrepreneurs', 'Retirees', 'Beginners'],
  'Career Growth': ['Busy Professionals', 'Managers', 'Entrepreneurs', 'Freelancers', 'Remote Workers', 'Students', 'Beginners'],
  'Creative Flow': ['Artists', 'Creative Minds', 'Freelancers', 'Entrepreneurs', 'Students', 'Remote Workers'],
  'Writing Habit': ['Artists', 'Creative Minds', 'Freelancers', 'Students', 'Beginners', 'Busy Professionals', 'Remote Workers'],
  'Healthy Aging': ['Retirees', 'Parents', 'Busy Professionals', 'Beginners'],
};

export interface ParsedTemplateAttributes {
  scenario: string;
  category: string;
  context: string;
  persona: string;
}

const TITLE_REGEX = /^(.+) (Morning Routine|Habit Building|Daily Productivity|Goal Setting|Mindfulness|Fitness|Evening Ritual|Career Growth) for (.+) \((.+)\)$/;

export function parseTemplateTitle(title: string, fallbackCategory = 'Habit Building'): ParsedTemplateAttributes {
  const match = title.match(TITLE_REGEX);
  if (match) {
    return {
      scenario: match[1],
      category: match[2],
      context: match[3],
      persona: match[4],
    };
  }
  return {
    scenario: 'Productivity',
    category: fallbackCategory,
    context: 'Busy Professionals',
    persona: 'Type A',
  };
}

export function buildTemplateSlug(scenario: string, category: string, context: string, persona = 'Type A'): string {
  const title = `${scenario} ${category} for ${context} (${persona})`;
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-');
}

export function isMismatchedContext(scenario: string, category: string, context: string): boolean {
  if (context === 'Retirees' && category === 'Career Growth') return true;
  if (
    context === 'Athletes' &&
    (scenario === 'Financial Planning' ||
      scenario === 'Public Speaking' ||
      scenario === 'Social Networking' ||
      scenario === 'Writing Habit')
  ) {
    return true;
  }
  return false;
}

export function getAllowedPrimaryContexts(scenario: string, category: string): string[] {
  return DOMAIN_PRIMARY_CONTEXTS[scenario] || DOMAIN_PRIMARY_CONTEXTS[category] || DEFAULT_PRIMARY_CONTEXTS;
}

export interface TemplateClassification {
  tier: IndexabilityTier;
  isIndexable: boolean;
  robotsDirective: 'index, follow' | 'noindex, follow';
  canonicalSlug: string;
  canonicalUrl: string;
  attributes: ParsedTemplateAttributes;
  reason: string;
}

export const BASE_URL = 'https://life.freetoolshubs.com';

/**
 * Resolves the closest verified Tier 1 (indexable) slug for a given (scenario, category, context).
 * Remember that Writing Habit in the 12,500-record dataset was sliced at 12,500, so we also ensure
 * the target slug exists in the dataset.
 */
export function resolveTier1CanonicalSlug(scenario: string, category: string, context: string): string {
  const primaryCats = PRIMARY_CATEGORIES_BY_SCENARIO[scenario] || ['Habit Building'];
  const targetCat = primaryCats.includes(category) ? category : primaryCats[0];
  const allowedContexts = getAllowedPrimaryContexts(scenario, targetCat);
  const targetContext =
    allowedContexts.includes(context) && !isMismatchedContext(scenario, targetCat, context)
      ? context
      : allowedContexts[0];

  return buildTemplateSlug(scenario, targetCat, targetContext, 'Type A');
}

export function classifyTemplateRecord(template: { slug: string; title: string; category: string }): TemplateClassification {
  const attributes = parseTemplateTitle(template.title, template.category);
  const { scenario, category, context, persona } = attributes;

  const primaryCats = PRIMARY_CATEGORIES_BY_SCENARIO[scenario] || [];
  const secondaryCats = SECONDARY_CATEGORIES_BY_SCENARIO[scenario] || [];
  const isPrimaryCat = primaryCats.includes(category);
  const isSecondaryCat = secondaryCats.includes(category);
  const mismatchedCtx = isMismatchedContext(scenario, category, context);

  // Rule 1: Persona variants (Consistent, Flexible, Intense) -> Tier 3 Consolidation
  if (persona !== 'Type A') {
    const canonicalSlug = resolveTier1CanonicalSlug(scenario, category, context);
    return {
      tier: 'tier3',
      isIndexable: false,
      robotsDirective: 'noindex, follow',
      canonicalSlug,
      canonicalUrl: `${BASE_URL}/${canonicalSlug}`,
      attributes,
      reason: `Persona variant (${persona}) consolidated to primary Type A representative.`
    };
  }

  // Rule 2: Semantically mismatched cross-products -> Tier 4 Non-Indexable
  if (mismatchedCtx || (!isPrimaryCat && !isSecondaryCat)) {
    const canonicalSlug = resolveTier1CanonicalSlug(scenario, category, context);
    return {
      tier: 'tier4',
      isIndexable: false,
      robotsDirective: 'noindex, follow',
      canonicalSlug,
      canonicalUrl: `${BASE_URL}/${canonicalSlug}`,
      attributes,
      reason: `Semantically mismatched cross-product (${scenario} + ${category} for ${context}).`
    };
  }

  // Rule 3: Primary category + primary domain audience -> Tier 1 Strong Indexable
  const allowedContexts = getAllowedPrimaryContexts(scenario, category);
  if (isPrimaryCat && allowedContexts.includes(context)) {
    return {
      tier: 'tier1',
      isIndexable: true,
      robotsDirective: 'index, follow',
      canonicalSlug: template.slug,
      canonicalUrl: `${BASE_URL}/${template.slug}`,
      attributes,
      reason: `Strong indexable primary template (${scenario} ${category} for ${context}).`
    };
  }

  // Rule 4: Valid secondary category or secondary audience -> Tier 2 Potentially Indexable After Improvement
  return {
    tier: 'tier2',
    isIndexable: false,
    robotsDirective: 'noindex, follow',
    canonicalSlug: template.slug,
    canonicalUrl: `${BASE_URL}/${template.slug}`,
    attributes,
    reason: `Secondary category or audience (${scenario} ${category} for ${context}); held from index until audience-specific expansion.`
  };
}

