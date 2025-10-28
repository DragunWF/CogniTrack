# CogniTrack Components Guide 📚

This document provides an overview of the custom UI components created for CogniTrack.

## 🎨 Design Philosophy

The app uses a dark theme optimized for:

- **Reduced eye strain** during extended use
- **Mindfulness and focus** through calming colors
- **Clear visual hierarchy** for quick information scanning
- **Psychological comfort** when tracking personal habits

---

## 🧩 Component Inventory

### Bad Habit Components (`/presentation/components/badHabit/`)

#### 1. **HabitCounter**

A card component with increment/decrement buttons for quick habit tracking.

**Features:**

- Visual tier indicator (⚪ → ✖️ → 🚫) that changes based on count
- Increment (+) and decrement (−) buttons
- Disabled state when count reaches 0
- Elevated card design with shadows

**Props:**

```typescript
{
  name: string;          // Habit name
  count: number;         // Current daily count
  onIncrement: () => void;
  onDecrement: () => void;
}
```

**Visual Tiers:**

- `⚪` = 0 occurrences (clean slate)
- `✖️` = 1-2 occurrences (caution)
- `🚫` = 3+ occurrences (warning)

---

#### 2. **HabitLogItem**

A chronological entry showing when and how a habit was logged.

**Features:**

- Time display in 12-hour format (e.g., "2:30 PM")
- Habit name and description
- Optional notes section
- Color-coded indicator dot
- Pressable for editing/viewing details

**Props:**

```typescript
{
  id: number;
  name: string;
  description: string;
  datetime: number;      // Unix timestamp
  notes?: string;
  onPress?: () => void;  // Optional callback
}
```

---

### UI Components (`/presentation/components/ui/`)

#### 3. **Card**

A reusable container for elevated content surfaces.

**Features:**

- Consistent dark theme styling
- Shadow and border for depth
- Rounded corners

**Props:**

```typescript
{
  children: React.ReactNode;
  style?: object;        // Optional style overrides
}
```

---

#### 4. **SectionHeader**

A header component for organizing screen sections.

**Features:**

- Bold title text
- Optional subtitle for context
- Consistent spacing

**Props:**

```typescript
{
  title: string;
  subtitle?: string;
  style?: object;
}
```

---

#### 5. **Title**

A flexible title component for screen headers.

**Props:**

```typescript
{
  children: React.ReactNode;
  textStyles?: object;   // Optional text style overrides
}
```

---

## 📱 Screen Layout: BadHabitScreen

### Structure Overview

```
┌─────────────────────────────────┐
│  Bad Habit Tracker (Header)     │
├─────────────────────────────────┤
│  Today's Habits                  │
│  ┌───────────────────────────┐  │
│  │ Social Media     ⚪  [-3+]│  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Snacking         ✖️  [-1+]│  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  Today's Log                     │
│  ┌───────────────────────────┐  │
│  │ 2:30 PM • Social Media    ●│  │
│  │ Mindlessly scrolling...    │  │
│  │ Note: Felt stressed        │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 1:00 PM • Snacking        ●│  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Sections

1. **Header** - Screen title
2. **Today's Habits** - Quick-add counter cards
3. **Divider** - Visual separation
4. **Today's Log** - Chronological list of entries
5. **Empty State** - Shown when no logs exist

---

## 🎨 Color System

### Dark Theme Psychology

The color palette was designed with psychological principles:

| Color                | Purpose           | Psychology                                |
| -------------------- | ----------------- | ----------------------------------------- |
| **Deep Purple/Blue** | Primary actions   | Focus, mindfulness, cognitive awareness   |
| **Calm Teal**        | Success, progress | Balance, clarity, positive transformation |
| **Soft Coral**       | Errors            | Serious but not anxiety-inducing          |
| **Warm Amber**       | Warnings          | Gentle caution without harshness          |
| **Deep Navy-Black**  | Background        | Calm, introspective environment           |

### Color Categories

```typescript
mainColors {
  primary:    // Brand identity, buttons
  accent:     // Success, highlights
  background: // App surfaces
  text:       // Typography
  border:     // Dividers, outlines
  shadow:     // Depth and elevation
}

utilityColors {
  success:    // Achievements
  warning:    // Cautions
  error:      // Alerts
  info:       // Informational
}
```

---

## 🔧 Implementation Notes

### Adding New Habit Counters

To add more habits to the quick-add section:

```typescript
const mockSelectedHabits = [
  { id: 1, name: "Your Habit", count: 0 },
  // Add more habits here
];
```

### Handling Button Actions

Three TODO sections in `BadHabitScreen.tsx`:

1. **`handleIncrement(habitId)`** - Increment habit counter
2. **`handleDecrement(habitId)`** - Decrement habit counter
3. **`handleLogItemPress(logId)`** - View/edit log details

### Database Integration

Replace mock data with actual database queries:

- `mockSelectedHabits` → Query today's tracked habits
- `mockTodayLog` → Query chronological log entries for today

---

## 📐 Layout Guidelines

### Spacing

- Section padding: `16px`
- Card margins: `12px` between items
- Internal card padding: `16px`

### Typography Scale

- Screen title: `28px` (bold)
- Section header: `18px` (bold)
- Body text: `16px` (regular)
- Secondary text: `14px`
- Small text: `12px`

### Border Radius

- Large cards: `16px`
- Standard cards: `12px`
- Buttons: `22px` (circular)

---

## 🚀 Future Enhancements

Consider these additions:

- Swipe-to-delete on log items
- Pull-to-refresh functionality
- Animated transitions between tiers
- Haptic feedback on button press
- Filter/search in log view

---

## 📝 Maintenance Notes

When modifying components:

1. Update TypeScript interfaces if props change
2. Test on both iOS and Android
3. Verify accessibility (contrast ratios, touch targets)
4. Keep dark theme consistency across all components
5. Document any new utility functions
