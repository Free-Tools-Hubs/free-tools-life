const fs = require('fs');

const categories = ["Morning Routine", "Habit Building", "Daily Productivity", "Goal Setting", "Mindfulness", "Fitness", "Evening Ritual", "Career Growth"];

const scenarios = [
    "Productivity", "Focus", "High Energy", "Deep Work", "Stress Management",
    "Physical Strength", "Mental Clarity", "Creative Flow", "Stoicism", "Minimalism",
    "Digital Detox", "Healthy Aging", "Weight Loss", "Muscle Gain", "Sleep Quality",
    "Financial Planning", "Social Networking", "Language Learning", "Skill Acquisition", "Self-Care",
    "Public Speaking", "Writing Habit", "Reading More", "Early Rising", "Night Owl Transition",
    "Remote Work", "Entrepreneurship", "Career Growth", "Parenting Balance", "Student Success",
    "Exam Prep", "Meditation Depth", "Yoga Practice", "Running Endurance", "Hydration",
    "Meal Prep", "Cooking Skills", "Home Organization", "Mindful Eating", "Gratitude",
    "Confidence Building", "Public Relations", "Leadership", "Team Management", "Time Management",
    "Focus for ADHD", "Anxiety Reduction", "Artistic Practice", "Musical Training", "Photography",
    "Public Speaking", "Negotiation", "Critical Thinking", "Emotional Intelligence", "Memory Mastery",
    "Speed Reading", "Data Analysis", "Journaling", "Meditation", "Resilience",
    "Sleep Hygiene", "Posture Correction", "Vision Protection", "Immune Support", "Longevity"
];

const contexts = [
    "Busy Professionals", "Students", "Parents", "Beginners", "Advanced", "Entrepreneurs",
    "Remote Workers", "Artists", "Athletes", "Managers", "Freelancers", "Retirees",
    "Night Owls", "Early Birds", "High Achievers", "Creative Minds", "Tech Enthusiasts", "Minimalists"
];

const personas = ["Type A", "Consistent", "Flexible", "Intense"];

const baseHabits = [
    "Drink 500ml Water", "5-min Meditation", "Journal 3 items", "Read 10 pages", "30-min Walk",
    "Cold Shower", "No Phone for 1hr", "Plan Tomorrow", "Deep Work Session", "Stretch",
    "Eat a Green Salad", "Call a Loved One", "Track Expenses", "Practice Skill", "Visualize Goals",
    "Clean Workspace", "Sunlight Exposure", "Vitamin D Check", "Posture Adjustment", "Digital Declutter"
];

const templates = [];
let idCount = 1;

scenarios.forEach(scenario => {
    categories.forEach(category => {
        contexts.forEach(context => {
            personas.forEach(persona => {
                const title = `${scenario} ${category} for ${context} (${persona})`;
                const slug = title.toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/[^\w-]/g, '')
                    .replace(/--+/g, '-');

                templates.push({
                    id: `t-${idCount++}`,
                    slug: slug,
                    category: category,
                    title: title,
                    description: `Optimize your ${scenario.toLowerCase()} with a ${persona.toLowerCase()} approach for ${context.toLowerCase()}. Part of our ${category.toLowerCase()} suite.`,
                    baseRoutines: [...baseHabits].sort(() => 0.5 - Math.random()).slice(0, 4),
                    baseHabits: [...baseHabits].sort(() => 0.5 - Math.random()).slice(0, 7),
                    baseGoals: [
                        `Achieve ${scenario} mastery`,
                        `Maintain ${persona} consistency`
                    ],
                    checklistTemplates: ["Focus", "Action", "Review"],
                    plannerFrameworks: idCount % 2 === 0 ? "Time Blocking" : "Eat the Frog"
                });
            });
        });
    });
});

console.log(`Prepared ${templates.length} templates. Slicing to ~12k for performance...`);

const finalTemplates = templates.slice(0, 12500);

// Save to public folder so it can be fetched on demand (Efficient for 10k+ items)
fs.writeFileSync('public/lifeTemplates.json', JSON.stringify(finalTemplates));
console.log(`Successfully generated ${finalTemplates.length} templates in public/lifeTemplates.json`);
