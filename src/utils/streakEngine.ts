/**
 * Calculate the current and longest streak from a list of completed dates.
 * Dates are expected in YYYY-MM-DD format.
 */
export const calculateStreak = (completedDates: string[]) => {
  if (!completedDates || completedDates.length === 0) return { current: 0, longest: 0 };

  const sortedDates = [...new Set(completedDates)].sort().reverse();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const newestDate = new Date(sortedDates[0]);
  newestDate.setHours(0, 0, 0, 0);

  // If the newest completion isn't today or yesterday, the current streak is broken
  const diffDaysToday = Math.floor((today.getTime() - newestDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDaysToday > 1) {
    currentStreak = 0;
  } else {
    // Walk back from the newest date to find current streak
    let checkDate = new Date(newestDate);
    for (let i = 0; i < sortedDates.length; i++) {
      const d = new Date(sortedDates[i]);
      if (d.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  longestStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diff = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return { current: currentStreak, longest: longestStreak };
};

/**
 * Update goal progress and return the updated goal object.
 */
export const updateGoalProgress = (goal: any, increment: number) => {
  const newProgress = Math.min(goal.target, Math.max(0, goal.current + increment));
  return { ...goal, current: newProgress };
};
