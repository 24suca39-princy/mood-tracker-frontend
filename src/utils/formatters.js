export const formatDate = (dateString) => {
  if (!dateString) return '--';

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const normalizeStats = (rawStats, habits = []) => {
  const moodCountsFromHabits = habits.reduce((acc, habit) => {
    const mood = habit.mood || 'UNKNOWN';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  if (!rawStats || typeof rawStats !== 'object') {
    return {
      totalHabits: habits.length,
      moodDistribution: moodCountsFromHabits,
    };
  }

  const totalHabits =
    rawStats.totalHabits ?? rawStats.total ?? rawStats.count ?? habits.length;

  const moodDistribution =
    rawStats.moodDistribution || rawStats.moods || moodCountsFromHabits;

  const normalizedMoods = Array.isArray(moodDistribution)
    ? moodDistribution.reduce((acc, item) => {
        const key = item.mood || item.name || 'UNKNOWN';
        const value = item.count || item.value || 0;
        acc[key] = value;
        return acc;
      }, {})
    : moodDistribution;

  return {
    totalHabits,
    moodDistribution: normalizedMoods,
  };
};
