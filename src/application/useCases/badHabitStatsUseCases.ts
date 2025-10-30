import BadHabit from "../../domain/entities/badHabit";
import BadHabitRepository from "../../infrastructure/database/badHabitRepository";

/**
 * Statistics Use Cases for Bad Habits
 * Provides aggregated statistical data for the Stats Dashboard
 */

export type TimeRange =
  | "Today"
  | "This Week"
  | "This Month"
  | "This Year"
  | "All Time";

export interface TimeRangeStats {
  totalHabits: number;
  worstDay: string;
  topHabit: string;
  topHabitCount: number;
}

export interface BreakdownItem {
  label: string;
  value: number;
  percentage: number;
}

export interface TrendDataPoint {
  label: string;
  value: number;
}

/**
 * Helper function to get date range based on time filter
 */
function getDateRange(timeRange: TimeRange): { start: number; end: number } {
  const now = new Date();
  const end = now.getTime();
  let start: number;

  switch (timeRange) {
    case "Today":
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      start = startOfDay.getTime();
      break;
    case "This Week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      start = startOfWeek.getTime();
      break;
    case "This Month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      start = startOfMonth.getTime();
      break;
    case "This Year":
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      start = startOfYear.getTime();
      break;
    case "All Time":
      start = 0; // Beginning of Unix timestamp
      break;
  }

  return { start, end };
}

/**
 * Get key statistics for the selected time range
 */
export class GetTimeRangeStatsUseCase {
  async execute(timeRange: TimeRange): Promise<TimeRangeStats> {
    const repository = new BadHabitRepository();
    const { start, end } = getDateRange(timeRange);

    // Get habits in range
    const allHabits = await repository.getAll();
    const habitsInRange = allHabits.filter(
      (h) => h.datetime >= start && h.datetime <= end
    );

    const totalHabits = habitsInRange.length;

    // Calculate worst day (day with most habits)
    const dayMap = new Map<string, number>();
    habitsInRange.forEach((habit) => {
      const date = new Date(habit.datetime);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      dayMap.set(dayName, (dayMap.get(dayName) || 0) + 1);
    });

    let worstDay = "None";
    let maxCount = 0;
    dayMap.forEach((count, day) => {
      if (count > maxCount) {
        maxCount = count;
        worstDay = day;
      }
    });

    // Calculate top habit
    const habitMap = new Map<string, number>();
    habitsInRange.forEach((habit) => {
      habitMap.set(habit.name, (habitMap.get(habit.name) || 0) + 1);
    });

    let topHabit = "None";
    let topHabitCount = 0;
    habitMap.forEach((count, name) => {
      if (count > topHabitCount) {
        topHabitCount = count;
        topHabit = name;
      }
    });

    return {
      totalHabits,
      worstDay,
      topHabit,
      topHabitCount,
    };
  }
}

/**
 * Get breakdown data for pie chart
 */
export class GetBreakdownDataUseCase {
  async execute(
    timeRange: TimeRange,
    breakdownType: "habit" | "trigger" | "location"
  ): Promise<BreakdownItem[]> {
    const repository = new BadHabitRepository();
    const { start, end } = getDateRange(timeRange);

    const allHabits = await repository.getAll();
    const habitsInRange = allHabits.filter(
      (h) => h.datetime >= start && h.datetime <= end
    );

    const itemMap = new Map<string, number>();
    const total = habitsInRange.length;

    habitsInRange.forEach((habit) => {
      let key: string;
      switch (breakdownType) {
        case "habit":
          key = habit.name;
          break;
        case "trigger":
          key = habit.trigger || "Unknown";
          break;
        case "location":
          key = habit.location || "Unknown";
          break;
      }
      itemMap.set(key, (itemMap.get(key) || 0) + 1);
    }); // Convert to array and calculate percentages
    const breakdown: BreakdownItem[] = [];
    itemMap.forEach((value, label) => {
      breakdown.push({
        label,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      });
    });

    // Sort by value descending
    return breakdown.sort((a, b) => b.value - a.value);
  }
}

/**
 * Get trend data for bar chart
 */
export class GetTrendDataUseCase {
  async execute(timeRange: TimeRange): Promise<TrendDataPoint[]> {
    const repository = new BadHabitRepository();
    const { start, end } = getDateRange(timeRange);

    const allHabits = await repository.getAll();
    const habitsInRange = allHabits.filter(
      (h) => h.datetime >= start && h.datetime <= end
    );

    const trendMap = new Map<string, number>();

    habitsInRange.forEach((habit) => {
      const date = new Date(habit.datetime);
      let key: string;

      switch (timeRange) {
        case "Today":
          // Group by hour (0-23)
          key = date.getHours().toString().padStart(2, "0");
          break;
        case "This Week":
          // Group by day of week (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          key = days[date.getDay()];
          break;
        case "This Month":
          // Group by day of month (1-31)
          key = date.getDate().toString();
          break;
        case "This Year":
          // Group by month (Jan, Feb, etc.)
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          key = months[date.getMonth()];
          break;
        case "All Time":
          // Group by year
          key = date.getFullYear().toString();
          break;
      }

      trendMap.set(key, (trendMap.get(key) || 0) + 1);
    });

    // Generate all expected labels with 0 counts for missing data
    const trendData: TrendDataPoint[] = [];

    switch (timeRange) {
      case "Today":
        for (let i = 0; i < 24; i++) {
          const label = i.toString().padStart(2, "0");
          trendData.push({ label, value: trendMap.get(label) || 0 });
        }
        break;
      case "This Week":
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach((day) => {
          trendData.push({ label: day, value: trendMap.get(day) || 0 });
        });
        break;
      case "This Month":
        const daysInMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const label = i.toString();
          trendData.push({ label, value: trendMap.get(label) || 0 });
        }
        break;
      case "This Year":
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        months.forEach((month) => {
          trendData.push({ label: month, value: trendMap.get(month) || 0 });
        });
        break;
      case "All Time":
        // Sort years and create data points
        const years = Array.from(trendMap.keys()).sort();
        years.forEach((year) => {
          trendData.push({ label: year, value: trendMap.get(year) || 0 });
        });
        break;
    }

    return trendData;
  }
}
