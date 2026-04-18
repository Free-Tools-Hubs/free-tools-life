/**
 * Build a daily plan based on goals and habits.
 * Returns a list of schedule slots.
 */
export const buildDailyPlan = (goals: any[], habits: any[]) => {
  const schedule = [];
  
  // Morning Routine
  schedule.push({ time: "07:00", task: "Wake up & Hydrate", category: "Morning" });
  
  // High priority habits
  habits.slice(0, 3).forEach((h, idx) => {
    schedule.push({ 
      time: `${8 + idx}:00`, 
      task: `Habit: ${h.name}`, 
      category: "Maintenance" 
    });
  });

  // Goal work
  goals.slice(0, 2).forEach((g, idx) => {
    schedule.push({ 
      time: `${11 + idx}:00`, 
      task: `Goal Work: ${g.title}`, 
      category: "Growth" 
    });
  });

  return schedule;
};

/**
 * Slugify a string for URLs.
 */
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};
