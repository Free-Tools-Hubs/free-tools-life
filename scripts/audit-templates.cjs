const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const templates = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'public/lifeTemplates.json'), 'utf8'));

const PRIMARY_CATEGORIES = {
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
  'Writing Habit': ['Habit Building', 'Morning Routine', 'Daily Productivity']
};

const SECONDARY_CATEGORIES = {
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
  'Writing Habit': ['Goal Setting', 'Mindfulness']
};

const DEFAULT_PRIMARY_CONTEXTS = [
  'Busy Professionals', 'Students', 'Parents', 'Beginners',
  'Entrepreneurs', 'Remote Workers', 'Managers', 'Freelancers'
];

const DOMAIN_PRIMARY_CONTEXTS = {
  'Fitness': ['Athletes', 'Beginners', 'Busy Professionals', 'Parents', 'Retirees', 'Students'],
  'Morning Routine': ['Busy Professionals', 'Students', 'Parents', 'Early Birds', 'Night Owls', 'Entrepreneurs', 'Remote Workers', 'Beginners'],
  'Evening Ritual': ['Busy Professionals', 'Parents', 'Night Owls', 'Students', 'Remote Workers', 'Entrepreneurs', 'Retirees', 'Beginners'],
  'Career Growth': ['Busy Professionals', 'Managers', 'Entrepreneurs', 'Freelancers', 'Remote Workers', 'Students', 'Beginners'],
  'Creative Flow': ['Artists', 'Creative Minds', 'Freelancers', 'Entrepreneurs', 'Students', 'Remote Workers'],
  'Writing Habit': ['Artists', 'Creative Minds', 'Freelancers', 'Students', 'Beginners', 'Busy Professionals', 'Remote Workers'],
  'Healthy Aging': ['Retirees', 'Parents', 'Busy Professionals', 'Beginners']
};

const TITLE_REGEX = /^(.+) (Morning Routine|Habit Building|Daily Productivity|Goal Setting|Mindfulness|Fitness|Evening Ritual|Career Growth) for (.+) \((.+)\)$/;

function isMismatchedContext(scenario, category, context) {
  if (context === 'Retirees' && category === 'Career Growth') return true;
  if (
    context === 'Athletes' &&
    ['Financial Planning', 'Public Speaking', 'Social Networking', 'Writing Habit'].includes(scenario)
  ) {
    return true;
  }
  return false;
}

const counts = { tier1: 0, tier2: 0, tier3: 0, tier4: 0, unclassified: 0 };
const byCategory = {};

for (const t of templates) {
  if (!byCategory[t.category]) {
    byCategory[t.category] = { total: 0, tier1: 0, tier2: 0, tier3: 0, tier4: 0 };
  }
  byCategory[t.category].total++;

  const m = t.title.match(TITLE_REGEX);
  if (!m) {
    counts.unclassified++;
    continue;
  }
  const [, scenario, category, context, persona] = m;

  if (persona !== 'Type A') {
    counts.tier3++;
    byCategory[t.category].tier3++;
    continue;
  }

  const primaryCats = PRIMARY_CATEGORIES[scenario] || [];
  const secondaryCats = SECONDARY_CATEGORIES[scenario] || [];
  const isPrimary = primaryCats.includes(category);
  const isSecondary = secondaryCats.includes(category);

  if (isMismatchedContext(scenario, category, context) || (!isPrimary && !isSecondary)) {
    counts.tier4++;
    byCategory[t.category].tier4++;
    continue;
  }

  const allowedContexts = DOMAIN_PRIMARY_CONTEXTS[scenario] || DOMAIN_PRIMARY_CONTEXTS[category] || DEFAULT_PRIMARY_CONTEXTS;
  if (isPrimary && allowedContexts.includes(context)) {
    counts.tier1++;
    byCategory[t.category].tier1++;
  } else {
    counts.tier2++;
    byCategory[t.category].tier2++;
  }
}

console.log('=== LIFEHUB TEMPLATE DATASET AUDIT & RECONCILIATION ===');
console.log('Total Template Records:', templates.length);
console.log('Tier 1 (Strong Indexable):', counts.tier1);
console.log('Tier 2 (Potentially Indexable After Improvement):', counts.tier2);
console.log('Tier 3 (Consolidation Candidates - Persona Variants):', counts.tier3);
console.log('Tier 4 (Non-Indexable / Mismatched Cross-Products):', counts.tier4);
console.log('Unclassified:', counts.unclassified);
console.log(
  'Reconciliation Sum:',
  counts.tier1 + counts.tier2 + counts.tier3 + counts.tier4 + counts.unclassified
);
console.log('\nBreakdown by Category:');
console.table(byCategory);

