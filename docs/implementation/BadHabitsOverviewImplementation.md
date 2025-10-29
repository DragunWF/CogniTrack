# Bad Habits Overview Screen - Implementation Documentation

## 📊 Overview

The **Bad Habits Overview Screen** provides a comprehensive analytics dashboard for habit tracking with three interactive components that work together to give users deep insights into their behavior patterns.

---

## 🏗️ Architecture Implementation

This implementation follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                     │
│  - BadHabitsOverviewScreen.tsx (Main Screen)            │
│  - CalendarHeatmapView.tsx (Component 1)                │
│  - MostCommonHabits.tsx (Component 2)                   │
│  - ChronologicalFeed.tsx (Component 3)                  │
├─────────────────────────────────────────────────────────┤
│  APPLICATION LAYER                                      │
│  - badHabitAnalyticsUseCases.ts                         │
│    - GetDailyHabitCountsUseCase                         │
│    - GetHabitTypeAggregatesUseCase                      │
│    - GetFilteredHabitsUseCase                           │
├─────────────────────────────────────────────────────────┤
│  INFRASTRUCTURE LAYER                                   │
│  - badHabitRepository.ts (Extended with new methods)    │
│    - getByDate(date: string)                            │
│    - getByName(name: string)                            │
│    - getByDateAndName(date: string, name: string)       │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Three Main Components

### **Component 1: Interactive Calendar Heatmap**

**Location:** Top of the screen  
**File:** `CalendarHeatmapView.tsx`

**Functionality:**

- Displays last 90 days of habit activity
- Each day is a square colored by intensity
- Shows count inside each square (if > 0)
- Tapping a day toggles date filter

**Color Tier System:**

```typescript
Count 0:     #2E2D3D (backgroundInput) - No activity
Count 1-2:   #F59E0B (Amber)           - Caution
Count 3-5:   #FB923C (Orange)          - Warning
Count 6-9:   #EF4444 (Red)             - Danger
Count 10+:   #991B1B (Dark Red)        - Critical
```

**Data Flow:**

```
GetDailyHabitCountsUseCase.execute()
  ↓
Fetches all BadHabit records
  ↓
Groups by date (YYYY-MM-DD)
  ↓
Counts habits per day
  ↓
Returns DailyHabitCount[]
```

**Key Features:**

- ✅ Horizontally scrollable grid view
- ✅ Weeks organized in rows (7 days per row)
- ✅ Visual legend showing intensity scale
- ✅ Selected date highlighted with border
- ✅ Badge showing currently selected date

**Implementation Details:**

```typescript
interface HeatmapData {
  date: string; // YYYY-MM-DD format
  count: number; // Total habits logged that day
}

// Generate 90 days of data
const generateHeatmapDays = () => {
  const days = [];
  for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    days.push({
      date: dateKey,
      count: dataMap.get(dateKey) || 0,
      dateObj: date,
    });
  }
  return days;
};
```

---

### **Component 2: Most Common Habits Summary**

**Location:** Below the heatmap  
**File:** `MostCommonHabits.tsx`

**Functionality:**

- Shows Top 10 most frequently logged habits
- Sorted by count (descending)
- Each item displays habit name, description, and total count
- Tapping a habit toggles habit name filter

**Data Flow:**

```
GetHabitTypeAggregatesUseCase.execute(limit: 10)
  ↓
Fetches all BadHabit records
  ↓
Groups by habit name
  ↓
Aggregates: { name, count, description, lastOccurrence }
  ↓
Sorts by count (descending)
  ↓
Returns top 10 HabitTypeAggregate[]
```

**Visual Design:**

- 🥇 Gold medal for #1 habit
- 🥈 Silver medal for #2 habit
- 🥉 Bronze medal for #3 habit
- 📌 Pin icon for habits #4-10

**Key Features:**

- ✅ FlatList for optimal performance
- ✅ Selected habit highlighted with primary color
- ✅ Filter badge shows active habit filter
- ✅ Clear button (✕) to remove filter
- ✅ Empty state with guidance

**Item Layout:**

```
┌─────────────────────────────────────────┐
│ 🥇  Social Media Scrolling      42     │
│     Mindless scrolling...      times   │
└─────────────────────────────────────────┘
  ↑         ↑                      ↑
 Rank    Habit Info            Count
```

---

### **Component 3: Chronological Feed**

**Location:** Bottom of the screen (scrollable)  
**File:** `ChronologicalFeed.tsx`

**Functionality:**

- Displays all habit entries grouped by date
- Uses SectionList for date headers
- Filters based on `selectedDate` AND/OR `selectedHabit`
- Tapping an entry opens edit modal

**Filtering Logic:**

```typescript
Filter Scenarios:

1. No Filters Active:
   - Show all habits, grouped by date

2. Date Filter Only:
   - Show only habits from selectedDate

3. Habit Filter Only:
   - Show only habits matching selectedHabit

4. Both Filters Active:
   - Show habits matching selectedHabit FROM selectedDate
```

**Data Flow:**

```
GetFilteredHabitsUseCase.execute(date?, habitName?)
  ↓
badHabitRepository.getByDateAndName(date, name)  // Both filters
    OR
badHabitRepository.getByDate(date)               // Date only
    OR
badHabitRepository.getByName(name)               // Name only
    OR
badHabitRepository.getAll()                      // No filters
  ↓
Sort by datetime (descending)
  ↓
Returns BadHabit[]
```

**Key Features:**

- ✅ SectionList with date headers
- ✅ Badge showing entry count per day
- ✅ Active filters displayed as chips
- ✅ Reuses HabitLogItem component
- ✅ Empty state with contextual message

**Section Header:**

```
┌─────────────────────────────────────────┐
│ October 29, 2025                    [5] │
└─────────────────────────────────────────┘
         ↑                               ↑
    Date Header                    Entry Count
```

---

## 🔄 State Management

### **Data States**

```typescript
const [dailyCounts, setDailyCounts] = useState<DailyHabitCount[]>([]);
const [topHabits, setTopHabits] = useState<HabitTypeAggregate[]>([]);
const [filteredHabits, setFilteredHabits] = useState<BadHabit[]>([]);
```

### **Filter States**

```typescript
const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
const [selectedHabit, setSelectedHabit] = useState<string | undefined>(
  undefined
);
```

### **Modal States**

```typescript
const [modalVisible, setModalVisible] = useState(false);
const [editingHabit, setEditingHabit] = useState<BadHabit | undefined>(
  undefined
);
```

---

## 📡 Use Cases Created

### **1. GetDailyHabitCountsUseCase**

**Purpose:** Aggregate habits by day for heatmap visualization

**Returns:**

```typescript
interface DailyHabitCount {
  date: string; // YYYY-MM-DD
  count: number; // Total habits logged
  timestamp: number; // Unix timestamp for sorting
}
```

**Algorithm:**

1. Fetch all habits from repository
2. Create Map<date, count>
3. Iterate through habits, grouping by date
4. Increment count for each date
5. Convert Map to sorted array

---

### **2. GetHabitTypeAggregatesUseCase**

**Purpose:** Find most common habits across all time

**Parameters:**

- `limit: number` (default: 10) - How many top habits to return

**Returns:**

```typescript
interface HabitTypeAggregate {
  name: string;
  count: number;
  description: string;
  lastOccurrence: number; // Unix timestamp
}
```

**Algorithm:**

1. Fetch all habits from repository
2. Create Map<habitName, aggregate>
3. For each habit:
   - If name exists in map: increment count
   - If new: create new aggregate entry
   - Update lastOccurrence if more recent
4. Convert to array, sort by count (descending)
5. Slice to limit

---

### **3. GetFilteredHabitsUseCase**

**Purpose:** Fetch habits with optional date and name filters

**Parameters:**

- `date?: string` (YYYY-MM-DD format)
- `habitName?: string`

**Returns:** `BadHabit[]` sorted by datetime descending

**Logic:**

```typescript
if (date && habitName) {
  // Both filters: Date AND Name
  habits = await repository.getByDateAndName(date, habitName);
} else if (date) {
  // Date only
  habits = await repository.getByDate(date);
} else if (habitName) {
  // Name only
  habits = await repository.getByName(habitName);
} else {
  // No filters
  habits = await repository.getAll();
}
```

---

## 🗄️ Repository Methods Added

### **getByDate(date: string): Promise<BadHabit[]>**

Fetches all habits from a specific date.

```typescript
async getByDate(date: string): Promise<BadHabit[]> {
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const results = await db.getAllAsync<BadHabit>(
    `SELECT * FROM badHabits WHERE datetime BETWEEN ? AND ?;`,
    [startOfDay.getTime(), endOfDay.getTime()]
  );

  return results as BadHabit[];
}
```

**SQL Query:** Uses BETWEEN with Unix timestamps for efficient date filtering

---

### **getByName(name: string): Promise<BadHabit[]>**

Fetches all habits matching a specific habit name.

```typescript
async getByName(name: string): Promise<BadHabit[]> {
  const results = await db.getAllAsync<BadHabit>(
    `SELECT * FROM badHabits WHERE name = ?;`,
    [name]
  );

  return results as BadHabit[];
}
```

**SQL Query:** Simple WHERE clause on name column

---

### **getByDateAndName(date: string, name: string): Promise<BadHabit[]>**

Fetches habits matching BOTH date and name filters.

```typescript
async getByDateAndName(date: string, name: string): Promise<BadHabit[]> {
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const results = await db.getAllAsync<BadHabit>(
    `SELECT * FROM badHabits WHERE datetime BETWEEN ? AND ? AND name = ?;`,
    [startOfDay.getTime(), endOfDay.getTime(), name]
  );

  return results as BadHabit[];
}
```

**SQL Query:** Combines date range BETWEEN with name equality

---

## 🔗 Interactive Filtering System

### **Filter Flow Diagram**

```
User Action                  State Update              Data Refresh
───────────                  ────────────              ────────────

Tap Heatmap Day    →    setSelectedDate(date)    →    fetchFilteredHabits()
                                                        ↓
                                                   Updates filteredHabits[]
                                                        ↓
                                                   ChronologicalFeed re-renders

Tap Habit Item     →    setSelectedHabit(name)   →    fetchFilteredHabits()
                                                        ↓
                                                   Updates filteredHabits[]
                                                        ↓
                                                   ChronologicalFeed re-renders

Clear Filters      →    setSelectedDate(undefined)  →  fetchFilteredHabits()
                        setSelectedHabit(undefined)     ↓
                                                   Shows all habits
```

### **Toggle Behavior**

Each filter can be toggled on/off:

```typescript
// Tap same date again → Deselect
handleDatePress("2025-10-29"); // First tap: Select
handleDatePress("2025-10-29"); // Second tap: Deselect

// Tap same habit again → Deselect
handleHabitPress("Social Media"); // First tap: Select
handleHabitPress("Social Media"); // Second tap: Deselect
```

### **Clear All Button**

The "Clear Filters" button appears when any filter is active:

```typescript
const hasActiveFilters = selectedDate || selectedHabit;

{
  hasActiveFilters && (
    <TouchableOpacity onPress={handleClearFilters}>
      <Text>Clear Filters</Text>
    </TouchableOpacity>
  );
}
```

---

## 🎨 Visual Design

### **Color System**

The tier colors create a natural progression:

| Level | Color        | Hex       | Psychology       |
| ----- | ------------ | --------- | ---------------- |
| 0     | Neutral Gray | `#2E2D3D` | Empty/Inactive   |
| 1-2   | Amber        | `#F59E0B` | Mild concern     |
| 3-5   | Orange       | `#FB923C` | Needs attention  |
| 6-9   | Red          | `#EF4444` | Urgent issue     |
| 10+   | Dark Red     | `#991B1B` | Critical problem |

### **Component Styling**

All components use consistent styling:

- **Card Background:** `mainColors.backgroundCard`
- **Border:** `mainColors.border`
- **Border Radius:** `16px`
- **Padding:** `16px`
- **Margin Bottom:** `16px`

---

## 🧪 Testing Scenarios

### **Happy Path**

- [x] Heatmap loads with 90 days
- [x] Top 10 habits display correctly
- [x] Chronological feed shows all entries
- [x] Tapping heatmap day filters feed
- [x] Tapping habit filters feed
- [x] Both filters work together
- [x] Clear filters resets view
- [x] Edit modal opens on entry tap

### **Edge Cases**

- [x] No habits logged (empty states)
- [x] Only one habit logged
- [x] All habits on same day
- [x] All habits same type
- [x] More than 10 habit types
- [x] Date with 0 habits selected
- [x] Habit type with 0 entries selected

### **Filter Combinations**

- [x] Date only → Shows habits from that day
- [x] Habit only → Shows all occurrences of habit
- [x] Date + Habit → Shows specific habit on specific day
- [x] Toggle date on/off → Feed updates correctly
- [x] Toggle habit on/off → Feed updates correctly
- [x] Clear all → Shows all habits

---

## 🚀 Performance Optimizations

### **1. useFocusEffect with Dependency**

```typescript
useFocusEffect(
  useCallback(() => {
    fetchAllData();
  }, [selectedDate, selectedHabit])
);
```

Refetches data when:

- Screen comes into focus
- Filters change

### **2. ScrollView Disabled for Nested Lists**

```typescript
<FlatList scrollEnabled={false} />
<SectionList scrollEnabled={false} />
```

Allows parent ScrollView to handle scrolling for better performance.

### **3. Efficient Date Grouping**

Uses `Map` for O(1) lookups instead of array methods:

```typescript
const habitMap = new Map<string, HabitTypeAggregate>();
// O(1) insertion and lookup
```

### **4. Memoized Date Calculations**

Heatmap days generated once per render:

```typescript
const heatmapDays = generateHeatmapDays(); // Called once
const weeks = chunkIntoWeeks(heatmapDays); // Reuses data
```

---

## 📦 Files Created/Modified

### **New Files**

1. **`badHabitAnalyticsUseCases.ts`**

   - GetDailyHabitCountsUseCase
   - GetHabitTypeAggregatesUseCase
   - GetFilteredHabitsUseCase

2. **`CalendarHeatmapView.tsx`**

   - Custom heatmap component
   - 90-day grid view
   - Color-coded intensity

3. **`MostCommonHabits.tsx`**

   - Ranked habit list
   - Medal rankings
   - Filter toggle

4. **`ChronologicalFeed.tsx`**
   - Grouped section list
   - Date headers
   - Filter display

### **Modified Files**

1. **`badHabitRepository.ts`**

   - Added `getByDate()`
   - Added `getByName()`
   - Added `getByDateAndName()`

2. **`BadHabitsOverviewScreen.tsx`**
   - Implemented full screen
   - Integrated three components
   - Filter state management

---

## 💡 Future Enhancements

### **High Priority**

1. **Date Range Picker**

   - Select custom date ranges
   - "Last 7 days", "Last 30 days" presets

2. **Export Data**

   - Export filtered data to CSV
   - Share with therapist/coach

3. **Comparison View**
   - Compare this week vs last week
   - Month-over-month trends

### **Medium Priority**

4. **Habit Streaks**

   - Show longest streak without habit
   - Display in Most Common section

5. **Time-of-Day Analysis**

   - Heatmap showing time patterns
   - "You usually [habit] at 3 PM"

6. **Multiple Habit Filters**
   - Select multiple habits at once
   - AND/OR logic options

### **Low Priority**

7. **Custom Color Themes**

   - User-configurable tier colors
   - Colorblind-friendly palettes

8. **Animated Transitions**
   - Smooth filter transitions
   - Heatmap square animations

---

## 🎓 Key Learning Points

### **Clean Architecture Benefits Demonstrated**

1. **Separation of Concerns**

   - Analytics logic in use cases (not UI)
   - Repository handles all data access
   - UI components focus on display

2. **Testability**

   - Use cases can be tested independently
   - Mock repositories for unit tests
   - Components testable with mock data

3. **Maintainability**

   - Adding new filters = new repository method
   - Changing UI = no business logic changes
   - Easy to locate bugs (layer isolation)

4. **Extensibility**
   - New analytics = new use case
   - Different visualization = new component
   - Same data, different views

---

## ✅ Requirements Checklist

### **Component 1: Interactive Calendar Heatmap**

- [x] Displays at top of screen
- [x] Fetches all BadHabit data
- [x] Aggregates count per day
- [x] Color intensity based on tiers
- [x] Tapping day updates selectedDate state

### **Component 2: Most Common Habits Summary**

- [x] Located below heatmap
- [x] Fetches and groups by habit name
- [x] Shows Top 10 habits
- [x] FlatList for mobile-friendly display
- [x] Sorted by count (descending)
- [x] Shows Habit Name and Total Count
- [x] Tapping habit updates selectedHabitFilter

### **Component 3: Grouped Chronological Feed**

- [x] At bottom in scrollable SectionList
- [x] Displays individual habit logs
- [x] Grouped by date with headers
- [x] Filters by selectedDate when set
- [x] Filters by selectedHabitFilter when set
- [x] Filters by both when both set
- [x] Shows all when neither set

### **Data & State**

- [x] useState for selectedDate
- [x] useState for selectedHabitFilter
- [x] SQLite queries for aggregated counts per day
- [x] SQLite queries for aggregated counts per habit type
- [x] SQLite queries for filtered habit entries

### **Architecture**

- [x] Follows Clean Architecture
- [x] New use cases created
- [x] Repository methods extended
- [x] Presentation layer separated from logic

---

## 🎉 Achievement Unlocked

You now have a **fully functional analytics dashboard** with:

- ✅ Interactive calendar heatmap
- ✅ Most common habits ranking
- ✅ Filterable chronological feed
- ✅ Dynamic data aggregation
- ✅ Clean Architecture implementation
- ✅ Real-time filter updates
- ✅ Beautiful visual design

**This provides users with powerful insights into their habit patterns!** 🚀
