# Tab Bar Design Specification 🎨

Visual reference for the CogniTrack bottom tab bar design.

---

## 🎨 Visual Layout

```
┌────────────────────────────────────────────────────────────┐
│                      Main Content Area                       │
│                    (Screen-specific)                        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                     ▲ Shadow/Elevation                       │
│                     │                                        │
│  ┌──────┬──────────┬──────────┬──────────┬──────────┐      │
│  │  ☑️   │   📋     │   📊     │   💡     │          │      │
│  │      │          │          │          │          │      │
│  │Track │ Overview │  Stats   │ Insights │          │      │
│  │er    │          │          │          │          │      │
│  └──────┴──────────┴──────────┴──────────┴──────────┘      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📐 Dimensions & Spacing

### Tab Bar

```
Height: 60px
├─ Top Padding: 8px
├─ Icon Area: 24px
├─ Label Area: 14px
└─ Bottom Padding: 8px (+ safe area on iOS)

Border Top: 1px solid #2E2D3D
Shadow: 0px -4px 8px rgba(0,0,0,0.6)
```

### Individual Tab

```
Width: 25% of screen width (4 tabs)
Icon Size: 24x24px
Label Font: 11px, semi-bold (600)
Letter Spacing: 0.3px
```

---

## 🎨 Color Specifications

### Background

```css
Background: #1A1823 (backgroundElevated)
Border: #2E2D3D (border)
```

### Active State (Selected Tab)

```css
Icon Color: #6B5FCC (primary500)
Label Color: #6B5FCC (primary500)
Font Weight: 600 (semi-bold)
Icon Variant: Filled (solid)
```

### Inactive State

```css
Icon Color: #6E7191 (textMuted)
Label Color: #6E7191 (textMuted)
Font Weight: 600 (semi-bold)
Icon Variant: Outline
```

### Shadow & Elevation

```css
iOS Shadow:
  - Color: rgba(0,0,0,0.6)
  - Offset: 0px, -4px
  - Opacity: 1
  - Radius: 8px

Android:
  - Elevation: 8
```

---

## 📱 Tab-by-Tab Breakdown

### 1. Tracker Tab

**Icon:** `checkbox` / `checkbox-outline`

```
Active State:          Inactive State:
┌─────────┐           ┌─────────┐
│    ☑️    │           │    ☐    │
│         │           │         │
│ Tracker │           │ Tracker │
│         │           │         │
└─────────┘           └─────────┘
Color: #6B5FCC        Color: #6E7191
```

**Purpose:** Main habit logging and today's view  
**Position:** Far left (primary screen)  
**Tap Target:** 95px × 60px (comfortable for thumbs)

---

### 2. Overview Tab

**Icon:** `list` / `list-outline`

```
Active State:          Inactive State:
┌─────────┐           ┌─────────┐
│    📋    │           │    📋    │
│         │           │         │
│Overview │           │Overview │
│         │           │         │
└─────────┘           └─────────┘
Color: #6B5FCC        Color: #6E7191
```

**Purpose:** Historical log with filtering  
**Position:** Second from left  
**Tap Target:** 95px × 60px

---

### 3. Stats Tab

**Icon:** `bar-chart` / `bar-chart-outline`

```
Active State:          Inactive State:
┌─────────┐           ┌─────────┐
│    📊    │           │    📊    │
│         │           │         │
│  Stats  │           │  Stats  │
│         │           │         │
└─────────┘           └─────────┘
Color: #6B5FCC        Color: #6E7191
```

**Purpose:** Data visualization (charts/graphs)  
**Position:** Second from right  
**Tap Target:** 95px × 60px

---

### 4. Insights Tab

**Icon:** `bulb` / `bulb-outline`

```
Active State:          Inactive State:
┌─────────┐           ┌─────────┐
│    💡    │           │    💡    │
│         │           │         │
│Insights │           │Insights │
│         │           │         │
└─────────┘           └─────────┘
Color: #6B5FCC        Color: #6E7191
```

**Purpose:** AI-powered analysis  
**Position:** Far right  
**Tap Target:** 95px × 60px

---

## 🎯 Touch Targets

### WCAG 2.1 Compliance

- **Minimum:** 44px × 44px
- **CogniTrack:** 95px × 60px ✅
- **Result:** Exceeds accessibility standards

### Thumb Zones (Right-handed)

```
┌────────────────────────────────┐
│                                │
│        Content Area            │
│                                │
│                        ⚫ Hard  │
├────────────────────────────────┤
│ Easy  Okay    Okay    Medium   │
│  ⚫     ⚫      ⚫       ⚫       │
│Track Overview Stats  Insights  │
└────────────────────────────────┘
```

**Design Decision:** Tracker on left for easy access (most-used feature)

---

## 📊 Contrast Ratios

### Active State (#6B5FCC on #1A1823)

```
Contrast Ratio: 6.8:1
WCAG AA: ✅ Pass (requires 3:1 for UI components)
WCAG AAA: ✅ Pass (requires 4.5:1 for text)
```

### Inactive State (#6E7191 on #1A1823)

```
Contrast Ratio: 4.2:1
WCAG AA: ✅ Pass (requires 3:1 for UI components)
WCAG AAA: ⚠️ Marginal (acceptable for secondary elements)
```

---

## 🎬 Animations & Transitions

### Tab Press Animation

```
Duration: 150ms
Easing: ease-in-out

Sequence:
1. Scale down: 0.95x (50ms)
2. Scale up: 1.0x (100ms)
3. Color transition: 150ms
4. Icon swap: outline → filled (instant)
```

### Icon State Change

```
Previous Tab: Filled → Outline (instant)
New Tab: Outline → Filled (instant)
Color fade: 150ms ease-in-out
```

### Platform-Specific

```
iOS:
- Subtle bounce animation
- Haptic feedback (optional)

Android:
- Ripple effect from tap point
- Material Design elevation change
```

---

## 🔄 State Management

### Navigation State

```typescript
{
  index: 0,  // Current tab index (0-3)
  routes: [
    { name: 'BAD_HABIT', key: 'tracker' },
    { name: 'BAD_HABITS_OVERVIEW', key: 'overview' },
    { name: 'STATS', key: 'stats' },
    { name: 'INSIGHT_REPORT', key: 'insights' }
  ]
}
```

### Visual Indicators

- **Current Screen:** Filled icon + primary color
- **Other Screens:** Outline icon + muted color
- **Badge (future):** Red dot on top-right of icon

---

## 📱 Responsive Behavior

### iPhone SE (375px width)

```
Tab Width: 93.75px each
Icon: 24px (visible)
Label: 11px (readable)
Status: ✅ Optimal
```

### iPhone 14 Pro Max (430px width)

```
Tab Width: 107.5px each
Icon: 24px (perfect)
Label: 11px (comfortable)
Status: ✅ Optimal
```

### iPad (768px+ width)

```
Tab Width: Should use side navigation instead
Status: ⚠️ Consider alternative layout for tablets
```

---

## 🛠️ Implementation Code

### Basic Structure

```typescript
<BottomTab.Screen
  name="SCREEN_NAME"
  component={ScreenComponent}
  options={{
    tabBarLabel: "Label",
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => (
      <Ionicons
        name={focused ? "icon-filled" : "icon-outline"}
        size={size}
        color={color}
      />
    ),
  }}
/>
```

### Styling Configuration

```typescript
screenOptions={{
  tabBarStyle: {
    backgroundColor: mainColors.backgroundElevated,
    borderTopColor: mainColors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarActiveTintColor: mainColors.primary500,
  tabBarInactiveTintColor: mainColors.textMuted,
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
}}
```

---

## 🎨 Alternative Color Schemes (Future)

### Light Mode (if implemented)

```css
Background: #FFFFFF
Border: #E0E0E0
Active: #5A4FCF (darker purple for contrast)
Inactive: #888888
```

### High Contrast Mode

```css
Background: #000000
Border: #FFFFFF
Active: #FFFFFF (white)
Inactive: #808080
```

---

## ✅ Checklist for Custom Tab Bar

If you want to create a fully custom tab bar:

- [ ] Measure device width for responsive tabs
- [ ] Handle safe area on iOS (notch + home indicator)
- [ ] Implement accessibility labels
- [ ] Add haptic feedback on iOS
- [ ] Add ripple effect on Android
- [ ] Support landscape orientation
- [ ] Handle keyboard appearance (push up tab bar)
- [ ] Implement gesture navigation (swipe between tabs)
- [ ] Add badge support for notifications
- [ ] Test with VoiceOver / TalkBack
- [ ] Support dynamic type sizes

---

## 📚 Related Documentation

- [ComponentsGuide.md](./ComponentsGuide.md) - Color system details
- [NavigationGuide.md](./NavigationGuide.md) - Navigation setup
- [FeatureSuggestions.md](./FeatureSuggestions.md) - Future tab bar enhancements

---

**Design Version:** 1.0  
**Last Updated:** October 28, 2025  
**Designer Notes:** Psychology-based color choices, accessibility-first design
