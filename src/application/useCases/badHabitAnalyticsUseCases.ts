import BadHabit from "../../domain/entities/badHabit";
import BadHabitRepository from "../../infrastructure/database/badHabitRepository";

/**
 * Analytics Use Cases for Bad Habits
 * These use cases provide aggregated and analytical data for the Overview screen
 */

export interface DailyHabitCount {
  date: string; // YYYY-MM-DD format
  count: number;
  timestamp: number; // Unix timestamp for sorting
}

export interface HabitTypeAggregate {
  name: string;
  count: number;
  description: string;
  lastOccurrence: number;
}

export class GetDailyHabitCountsUseCase {
  /**
   * Fetches all bad habits and aggregates them by day
   * Returns an array of daily counts for heatmap visualization
   */
  async execute(): Promise<DailyHabitCount[]> {
    const badHabitRepository = new BadHabitRepository();
    const allHabits = await badHabitRepository.getAll();

    // Group by date
    const dailyMap = new Map<string, DailyHabitCount>();

    allHabits.forEach((habit) => {
      const date = new Date(habit.datetime);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

      if (dailyMap.has(dateKey)) {
        const existing = dailyMap.get(dateKey)!;
        existing.count += 1;
      } else {
        dailyMap.set(dateKey, {
          date: dateKey,
          count: 1,
          timestamp: new Date(dateKey).getTime(),
        });
      }
    });

    // Convert to array and sort by date
    return Array.from(dailyMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }
}

export class GetHabitTypeAggregatesUseCase {
  /**
   * Fetches all bad habits and aggregates them by habit name
   * Returns sorted array of most common habits
   * @param limit - Number of top habits to return (default: 10)
   */
  async execute(limit: number = 10): Promise<HabitTypeAggregate[]> {
    const badHabitRepository = new BadHabitRepository();
    const allHabits = await badHabitRepository.getAll();

    // Group by habit name
    const habitMap = new Map<string, HabitTypeAggregate>();

    allHabits.forEach((habit) => {
      if (habitMap.has(habit.name)) {
        const existing = habitMap.get(habit.name)!;
        existing.count += 1;
        // Update last occurrence if this one is more recent
        if (habit.datetime > existing.lastOccurrence) {
          existing.lastOccurrence = habit.datetime;
        }
      } else {
        habitMap.set(habit.name, {
          name: habit.name,
          count: 1,
          description: habit.description,
          lastOccurrence: habit.datetime,
        });
      }
    });

    // Convert to array, sort by count (descending), and limit
    return Array.from(habitMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

export class GetFilteredHabitsUseCase {
  /**
   * Fetches habits filtered by date and/or habit name
   * @param date - Optional date string (YYYY-MM-DD) to filter by specific day
   * @param habitName - Optional habit name to filter by specific habit type
   */
  async execute(date?: string, habitName?: string): Promise<BadHabit[]> {
    const badHabitRepository = new BadHabitRepository();
    let habits: BadHabit[] = [];

    if (date && habitName) {
      // Filter by both date and habit name
      habits = await badHabitRepository.getByDateAndName(date, habitName);
    } else if (date) {
      // Filter by date only
      habits = await badHabitRepository.getByDate(date);
    } else if (habitName) {
      // Filter by habit name only
      habits = await badHabitRepository.getByName(habitName);
    } else {
      // No filters - get all habits
      habits = await badHabitRepository.getAll();
    }

    // Sort by datetime descending (most recent first)
    return habits.sort((a, b) => b.datetime - a.datetime);
  }
}
