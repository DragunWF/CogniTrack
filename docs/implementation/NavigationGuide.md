# Navigation Guide 🧭

Documentation for the CogniTrack navigation system and tab bar styling.

---

## 📱 Bottom Tab Navigation

### Tab Structure

The app uses React Navigation's Bottom Tab Navigator with 4 main screens:

| Tab          | Icon                              | Purpose                                                 |
| ------------ | --------------------------------- | ------------------------------------------------------- |
| **Tracker**  | `checkbox` / `checkbox-outline`   | Main habit logging screen with counters and today's log |
| **Overview** | `list` / `list-outline`           | Historical view of all logged habits with filtering     |
| **Stats**    | `bar-chart` / `bar-chart-outline` | Data visualization with pie charts and bar graphs       |
| **Insights** | `bulb` / `bulb-outline`           | AI-powered analysis via Gemini API                      |

---

## 🎨 Styling

### Dark Theme Tab Bar

The tab bar is styled to match the app's dark theme psychology:

```typescript
tabBarStyle: {
  backgroundColor: mainColors.backgroundElevated,  // Slightly elevated dark surface
  borderTopColor: mainColors.border,               // Subtle border
  height: 60,                                      // Comfortable tap targets
  paddingBottom: 8,
  paddingTop: 8,
  elevation: 8,                                    // Android shadow
  shadowColor: mainColors.shadowStrong,            // iOS shadow
}
```

### Active vs Inactive States

- **Active Tab:**

  - Color: `mainColors.primary500` (Deep purple - #6B5FCC)
  - Icon: Filled variant (e.g., `checkbox`)
  - Font weight: 600 (semi-bold)

- **Inactive Tab:**
  - Color: `mainColors.textMuted` (Muted gray - #6E7191)
  - Icon: Outline variant (e.g., `checkbox-outline`)
  - Font weight: 600 (consistent)

---

## 🎯 Icon Selection Rationale

### 1. **Tracker** - `checkbox`

- **Psychology:** Checkboxes represent task completion and accountability
- **Function:** Immediate association with tracking and logging
- **State:** Filled when active suggests "in progress" or "active tracking"

### 2. **Overview** - `list`

- **Psychology:** Lists represent organization and historical records
- **Function:** Clear representation of browsing past entries
- **State:** Simple, clean icon that doesn't clutter the tab bar

### 3. **Stats** - `bar-chart`

- **Psychology:** Charts universally represent data analysis
- **Function:** Immediate recognition for data visualization features
- **State:** Detailed when active, simplified when inactive

### 4. **Insights** - `bulb`

- **Psychology:** Light bulbs represent ideas, insights, and "aha moments"
- **Function:** Perfect metaphor for AI-powered analysis and discoveries
- **State:** Glowing (filled) when active suggests active thinking

---

## 🔧 Customization Options

### Alternative Icon Sets

If you want to experiment with different icons:

```typescript
// Tracker alternatives
"create-outline" | "create"; // Writing/logging
"time-outline" | "time"; // Time tracking
"recording-outline" | "recording"; // Recording behavior

// Overview alternatives
"calendar-outline" | "calendar"; // Calendar view
"folder-outline" | "folder"; // File organization
"albums-outline" | "albums"; // Collections

// Stats alternatives
"stats-chart-outline" | "stats-chart"; // More detailed chart
"pie-chart-outline" | "pie-chart"; // Pie chart specific
"analytics-outline" | "analytics"; // Analytics focus

// Insights alternatives
"sparkles-outline" | "sparkles"; // AI magic
"eye-outline" | "eye"; // Observation
"telescope-outline" | "telescope"; // Discovery
```

### Changing Colors

To customize tab bar colors, modify these in `screenOptions`:

```typescript
tabBarActiveTintColor: mainColors.primary500,    // Active tab color
tabBarInactiveTintColor: mainColors.textMuted,   // Inactive tab color
```

Consider using accent colors for special emphasis:

- `mainColors.accent500` for success-focused tabs
- `mainColors.primary300` for softer active states

---

## 📏 Accessibility Guidelines

### Touch Targets

- Tab bar height: **60px** (meets 48px minimum)
- Icon size: Default **24px** (comfortable visibility)
- Spacing: 8px padding for comfortable tapping

### Color Contrast

- Active state: High contrast (#6B5FCC on dark background)
- Inactive state: Medium contrast (#6E7191 on dark background)
- Both meet WCAG AA standards for UI components

### Screen Reader Support

React Navigation automatically provides:

- Tab labels for screen readers
- Active state announcements
- Navigation context

To enhance, add `accessibilityLabel` and `accessibilityHint`:

```typescript
<BottomTab.Screen
  name={APP_NAVIGATION_ROUTES.BAD_HABIT}
  component={BadHabitScreen}
  options={{
    tabBarLabel: "Tracker",
    tabBarAccessibilityLabel: "Habit Tracker",
    accessibilityHint: "Opens the main habit tracking screen",
    // ... other options
  }}
/>
```

---

## 🚀 Performance Notes

### Icon Loading

- Uses `@expo/vector-icons` which is bundled with Expo
- No additional network requests
- Icons are vector-based (scales perfectly)
- Minimal memory footprint

### Optimization Tips

1. **Avoid animated icons** in tabs (causes constant re-renders)
2. **Use outline variants** for inactive state (lighter weight)
3. **Keep consistent icon sizes** across all tabs

---

## 🎨 Design Consistency

### Matching Other UI Elements

The tab bar colors match the overall theme:

| Element            | Color                | Purpose                |
| ------------------ | -------------------- | ---------------------- |
| Tab bar background | `backgroundElevated` | Elevated surface       |
| Active tab         | `primary500`         | Primary brand color    |
| Inactive tab       | `textMuted`          | Muted, non-distracting |
| Border             | `border`             | Subtle separation      |
| Shadow             | `shadowStrong`       | Clear elevation        |

This creates a cohesive visual hierarchy where:

- The tab bar feels "floating" above the main content
- Active elements use the primary brand color
- Inactive elements recede into the background

---

## 🔄 Navigation State Management

### Initial Route

```typescript
initialRouteName={APP_NAVIGATION_ROUTES.BAD_HABIT}
```

The app opens to the **Tracker** screen because:

1. It's the primary use case (frictionless logging)
2. Users should see their today's progress immediately
3. Quick access to habit counters encourages consistent use

### Changing Initial Route

To change the starting screen, update `initialRouteName`:

```typescript
initialRouteName={APP_NAVIGATION_ROUTES.STATS}  // Start on Stats
```

Consider starting on different screens based on:

- Time of day (Insights in morning, Tracker during day)
- User behavior (power users might prefer Stats)
- Onboarding status (first-time users need Tracker introduction)

---

## 📱 Platform Differences

### iOS vs Android

The navigation styling adapts to each platform:

**iOS:**

- Uses `shadowOffset`, `shadowOpacity`, `shadowRadius`
- Tab bar has subtle blur effect (native iOS style)
- Smooth animations

**Android:**

- Uses `elevation` for Material Design shadow
- Ripple effect on tab press (native Android)
- Slightly different padding considerations

Both platforms use the same colors for consistency.

---

## 🛠️ Troubleshooting

### Icons Not Showing

If icons don't appear:

1. Ensure `@expo/vector-icons` is installed
2. Check import statement: `import { Ionicons } from "@expo/vector-icons";`
3. Restart the Metro bundler
4. Clear cache: `expo start -c`

### Colors Not Applying

If custom colors aren't working:

1. Verify color constants are imported
2. Check that colors are valid hex codes
3. Ensure `screenOptions` is before individual screens
4. Restart the development server

### Tab Bar Height Issues

If tab bar height is incorrect:

- iOS: Check `paddingBottom` (account for safe area)
- Android: Check `elevation` conflicts
- Universal: Verify `height` is set explicitly

---

## 🎯 Future Enhancements

Consider adding:

1. **Badge notifications** on tabs (e.g., unread insights count)
2. **Haptic feedback** on tab press
3. **Custom tab bar component** for advanced animations
4. **Gesture-based tab switching** (swipe between tabs)
5. **Dynamic tab visibility** based on user preferences

---

## 📝 Code Reference

The AppNavigator is located at:

```
/src/presentation/navigation/AppNavigator.tsx
```

Related constants:

```
/src/shared/constants/navigation.ts  // Route names
/src/shared/constants/colors.ts      // Theme colors
```

Related screens:

```
/src/presentation/screens/BadHabitScreen.tsx
/src/presentation/screens/BadHabitsOverviewScreen.tsx
/src/presentation/screens/StatsScreen.tsx
/src/presentation/screens/InsightReportScreen.tsx
```
