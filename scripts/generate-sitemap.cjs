const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://life.freetoolshubs.com';

const CATEGORY_SLUGS = [
  'morning-routine',
  'habit-building',
  'daily-productivity',
  'goal-setting',
  'mindfulness',
  'fitness',
  'evening-ritual',
  'career-growth'
];

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

function isTier1Indexable(template) {
  const m = template.title.match(TITLE_REGEX);
  if (!m) return false;
  const [, scenario, category, context, persona] = m;
  if (persona !== 'Type A') return false;
  if (isMismatchedContext(scenario, category, context)) return false;
  const primaryCats = PRIMARY_CATEGORIES[scenario] || [];
  if (!primaryCats.includes(category)) return false;
  const allowedContexts = DOMAIN_PRIMARY_CONTEXTS[scenario] || DOMAIN_PRIMARY_CONTEXTS[category] || DEFAULT_PRIMARY_CONTEXTS;
  return allowedContexts.includes(context);
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const templates = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'public/lifeTemplates.json'), 'utf8'));
const tier1Templates = templates.filter(isTier1Indexable);

fs.writeFileSync(
  path.join(ROOT_DIR, 'public/tier1Templates.json'),
  JSON.stringify(tier1Templates),
  'utf8'
);

const sitemapUrls = [
  `${BASE_URL}/`,
  `${BASE_URL}/templates`,
  `${BASE_URL}/about`,
  ...CATEGORY_SLUGS.map(slug => `${BASE_URL}/category/${slug}`),
  ...tier1Templates.map(t => `${BASE_URL}/${t.slug}`)
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.map(loc => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`),
  '</urlset>',
  ''
].join('\n');

fs.writeFileSync(path.join(ROOT_DIR, 'public/sitemap.xml'), xml, 'utf8');
if (fs.existsSync(path.join(ROOT_DIR, 'dist'))) {
  fs.writeFileSync(path.join(ROOT_DIR, 'dist/sitemap.xml'), xml, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'dist/tier1Templates.json'), JSON.stringify(tier1Templates), 'utf8');
}

console.log(`Sitemap generated with ${sitemapUrls.length} canonical indexable URLs (3 static + 8 category hubs + ${tier1Templates.length} Tier 1 templates).`);
