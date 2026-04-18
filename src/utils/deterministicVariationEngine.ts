/**
 * A deterministic engine that returns consistent variations based on a seed (usually a slug hash).
 * This ensures "High Quality" programmatic SEO content without randomness across reloads.
 */

// Simple hash function for strings
const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const routineExplanations = [
  "This routine is designed to stabilize your nervous system before the day demands your attention. By focusing on small, rhythmic wins, you build a foundation of competence that carries through your toughest meetings.",
  "Maximum efficiency isn't about doing more; it's about making the most important things feel effortless. This specific configuration of habits leverages the 'flow state' windows usually lost to early morning scrolling.",
  "Psychological momentum is a real force. This template uses 'habit stacking' to ensure that every action you take naturally leads into the next, reducing the mental friction of starting your day.",
  "Stoic principles guide this approach. By focusing only on what you can control—your morning movements—you build an internal fortress that remains unshaken by external daily chaos.",
  "Minimalism in action. We've stripped away the 'productivity theater' to leave only the core rituals that actually move the needle on your long-term health and career goals.",
  "An energizing sequence designed for high-output individuals. Every step is curated to maximize cognitive clarity and physical readiness without the mid-morning crash.",
  "Reflective and intentional. This path is for those who want to reclaim their time and ensure their actions align with their deepest values, one morning at a time.",
  "Action-focused and relentless. If you have big goals, you need a big morning. This routine provides the structure needed to tackle your hardest tasks while others are still waking up."
];

const habitTips = [
  "Tip: Try the 'Two-Minute Rule'—if a habit takes less than two minutes, do it immediately to prevent mental clutter.",
  "Insight: Your environment is your invisible hand. Design your space so the good habits are the easiest choice.",
  "Pro-tip: Use habit stacking. Link your new habit to an existing one, like 'After I pour my coffee, I will journal for 5 minutes.'",
  "Strategy: Never miss twice. It's okay to fail once, but the second time is the start of a new, bad habit. Get back on track fast.",
  "Reminder: Aim for consistency over intensity. 10 minutes of movement every day beats a 2-hour workout once a month.",
  "Note: Tracking your habits provides an immediate dopamine hit. Each checkbox is a signal to your brain that 'I am the type of person who stays disciplined.'"
];

const successTips = [
  "Focus on the first 10 minutes. If you win the start, you usually win the day.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Don't compare your Chapter 1 to someone else's Chapter 20.",
  "The best routine is the one you actually do when you're tired.",
  "Your future self will thank you for the work you do this morning.",
  "Discipline equals freedom. Own your morning, own your life."
];

export const getDeterministicContent = (slug: string) => {
  const hash = getHash(slug);
  
  return {
    explanation: routineExplanations[hash % routineExplanations.length],
    habitTip: habitTips[hash % habitTips.length],
    successTip: successTips[hash % successTips.length],
    tone: ["Motivational", "Practical", "Minimalist", "Energizing", "Reflective", "Action-Focused"][hash % 6],
    context: ["Busy Professional", "Student", "Parent", "Beginner", "Advanced"][hash % 5]
  };
};
