# Stats Dashboard - Quick Reference

## File Structure

```
src/
├── application/useCases/
│   └── badHabitStatsUseCases.ts          (3 use cases + helper)
├── presentation/
│   ├── screens/
│   │   └── StatsScreen.tsx               (Main container)
│   └── components/stats/
│       ├── GlobalFilterBar.tsx           (Time range selector)
│       ├── KeyStatBoxes.tsx              (3 metric cards)
│       ├── BreakdownCard.tsx             (Pie chart + tabs)
│       └── TrendsCard.tsx                (Bar graph)
docs/
└── StatsScreenImplementation.md          (Full documentation)
```

## Components Overview

### StatsScreen

- **Purpose:** Main dashboard container
- **Features:** useFocusEffect, parallel data loading, error handling
- **State:** timeRange, stats, breakdownData, trendsData

### GlobalFilterBar

- **Options:** Today, This Week, This Month, This Year, All Time
- **Style:** Segmented control with purple active state

### KeyStatBoxes

- **Cards:** Total Habits 📊, Worst Day 📅, Top Habit 🎯
- **Layout:** Horizontal scrollable row

### BreakdownCard

- **Tabs:** By Habit 🎯, By Trigger ⚡, By Location 📍
- **Chart:** PieChart from react-native-chart-kit
- **Legend:** Custom legend with 8-color palette

### TrendsCard

- **Chart:** BarChart from react-native-chart-kit
- **X-Axis:** Dynamic (hours/days/dates/months based on time range)
- **Style:** Purple bars, dark background, dashed grid

## Use Cases

### GetTimeRangeStatsUseCase

- **Input:** TimeRange
- **Output:** { totalHabits, worstDay, topHabit, topHabitCount }
- **Logic:** Filters by date range, groups by day/habit name

### GetBreakdownDataUseCase

- **Input:** TimeRange, BreakdownType ("habit" | "trigger" | "location")
- **Output:** BreakdownItem[] (top 10 with percentages)
- **Logic:** Groups by type, calculates percentages, sorts descending

### GetTrendDataUseCase

- **Input:** TimeRange
- **Output:** TrendDataPoint[] (label/value pairs)
- **Logic:** Dynamic grouping (hour/day/date/month) based on time range

## Data Flow

```
User selects time range
    ↓
StatsScreen.loadData()
    ↓
Execute 3 use cases (parallel)
    ↓
Repository queries SQLite
    ↓
Transform & aggregate data
    ↓
Update state & re-render components
```

## Key Technologies

- **Charts:** react-native-chart-kit (PieChart, BarChart)
- **State:** React useState + useCallback
- **Lifecycle:** useFocusEffect (auto-refresh on focus)
- **Architecture:** Clean Architecture (4 layers)
- **Types:** Full TypeScript support

## Color Palette

- Primary: `#6B5FCC` (purple)
- Accent: `#4DBDB3` (teal)
- Background: `#0F0E17` (navy-black)
- Card: `#232135` (elevated surface)
- Text: `#FFFFFE` (primary), `#A7A9BE` (secondary)

## Testing Checklist

- [ ] All 5 time ranges work correctly
- [ ] Charts display accurate data
- [ ] Loading states show properly
- [ ] Empty states appear when no data
- [ ] Tabs switch without errors
- [ ] Smooth scrolling performance
- [ ] useFocusEffect refreshes data

## Next Steps

1. Test with real data in simulator
2. Verify date range boundaries
3. Add loading animations
4. Implement error toasts
5. Add export/share features

## Quick Commands

```bash
# Install dependencies
npm install react-native-chart-kit react-native-svg

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type check
npx tsc --noEmit

# Test specific screen
# Navigate to Stats tab in app
```

## Common Issues

- **Charts not showing:** Check if react-native-svg is installed
- **Wrong data:** Verify getDateRange() helper logic
- **Performance lag:** Implement data pagination
- **Type errors:** Ensure all interfaces match use case outputs

See **StatsScreenImplementation.md** for complete documentation.
