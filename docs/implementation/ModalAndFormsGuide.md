# Modal and Form Components Implementation Guide 📝

This guide explains the new modal and form components added to CogniTrack, with clear guidance on what's UI-only (done) and what needs your implementation (TODOs).

---

## 🎨 What Was Created (UI Layout Only)

### 1. **FloatingActionButton Component**

**Location:** `/src/presentation/components/ui/FloatingActionButton.tsx`

**Features:**

- Circular button fixed to bottom-right
- Shadow/elevation for depth
- Customizable icon and colors
- 56px default size (accessible tap target)

**Props:**

```typescript
{
  onPress: () => void;
  icon?: string;              // Ionicon name
  backgroundColor?: string;   // Default: primary500
  iconColor?: string;         // Default: white
  size?: number;              // Default: 56px
}
```

---

### 2. **Button Component**

**Location:** `/src/presentation/components/ui/Button.tsx`

**Features:**

- Three variants: primary, secondary, danger
- Loading state with spinner
- Disabled state styling
- Consistent 50px height

**Props:**

```typescript
{
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: object;
}
```

---

### 3. **TextInput Component**

**Location:** `/src/presentation/components/ui/TextInput.tsx`

**Features:**

- Optional label above input
- Error message display
- Multiline support
- Dark theme optimized
- Character limits via props

**Props:**

```typescript
{
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
  maxLength?: number;
}
```

---

### 4. **HabitModal Component**

**Location:** `/src/presentation/components/badHabit/HabitModal.tsx`

**Features:**

- Bottom sheet modal with slide-up animation
- Keyboard-aware scrolling
- Form with 3 fields (name, description, notes)
- Auto-fills in edit mode
- Cancel and Submit buttons

**Props:**

```typescript
{
  visible: boolean;
  mode: "add" | "edit";
  habitData?: {
    id?: number;
    name?: string;
    description?: string;
    notes?: string;
  };
  onClose: () => void;
  onSubmit: (data) => void;
}
```

---

## 🎯 Your Implementation Tasks

### Task 1: Form Validation (HabitModal.tsx)

**Location:** Line ~60 in `HabitModal.tsx`

```typescript
const validateForm = (): boolean => {
  const newErrors: { name?: string; description?: string } = {};

  // TODO: YOUR IMPLEMENTATION HERE
  // Requirements:
  // 1. Name must not be empty (trim whitespace first)
  // 2. Name must be at least 3 characters
  // 3. Description must not be empty (trim whitespace first)
  // 4. Description must be at least 10 characters
  //
  // Set appropriate error messages:
  // - "Name is required"
  // - "Name must be at least 3 characters"
  // - "Description is required"
  // - "Description must be at least 10 characters"

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**Learning Goals:**

- String manipulation (`.trim()`)
- Conditional validation
- Error object construction
- Boolean return logic

**Hints:**

- Use `if (!name.trim())` to check empty strings
- Use `name.trim().length < 3` for length check
- Store errors like: `newErrors.name = "Error message"`

---

### Task 2: Handle Submit (HabitModal.tsx)

**Location:** Line ~70 in `HabitModal.tsx`

```typescript
const handleSubmit = () => {
  if (validateForm()) {
    // This already calls your onSubmit prop
    onSubmit({
      id: habitData?.id,
      name: name.trim(),
      description: description.trim(),
      notes: notes.trim() || undefined,
    });
    handleClose();
  }
};
```

**Note:** This is already implemented! The actual work happens in `BadHabitScreen.tsx`'s `handleSubmitHabit`.

---

### Task 3: Add New Habit (BadHabitScreen.tsx)

**Location:** Line ~110 in `BadHabitScreen.tsx`

```typescript
const handleSubmitHabit = async (data: {
  id?: number;
  name: string;
  description: string;
  notes?: string;
}) => {
  // TODO: YOUR IMPLEMENTATION HERE
  //
  // For ADD mode (when id is undefined):
  // 1. Import AddBadHabitUseCase
  // 2. Create instance: const addUseCase = new AddBadHabitUseCase();
  // 3. Call: await addUseCase.execute({
  //      name: data.name,
  //      description: data.description,
  //      datetime: Date.now(),
  //      notes: data.notes
  //    });
  // 4. Call fetchHabitData() to refresh the list
  // 5. (Optional) Show success toast
  //
  // For EDIT mode (when id exists):
  // 1. Import UpdateBadHabitUseCase
  // 2. Create instance and update the habit
  // 3. Refresh the list
  //
  // Error Handling:
  // - Wrap in try/catch
  // - Console.error on failure
  // - (Optional) Show error toast
};
```

**Learning Goals:**

- Async/await syntax
- Use case pattern
- Conditional logic (add vs edit)
- Error handling with try/catch

---

### Task 4: Increment Habit Counter (BadHabitScreen.tsx)

**Location:** Line ~70 in `BadHabitScreen.tsx`

```typescript
const handleIncrement = async (habitId: number) => {
  // TODO: YOUR IMPLEMENTATION HERE
  //
  // Steps:
  // 1. Find the habit from mockSelectedHabits
  //    const habit = mockSelectedHabits.find(h => h.id === habitId);
  //
  // 2. Create a new habit entry:
  //    - Use AddBadHabitUseCase
  //    - Pass: name, description, datetime: Date.now()
  //
  // 3. Update the counter display:
  //    - Find habit in mockSelectedHabits
  //    - Increment its count
  //    - Update state (later when using real data)
  //
  // 4. Refresh today's log:
  //    - Call fetchHabitData()
  //
  // Note: For now, mockSelectedHabits is static.
  // Later, you'll need to track counts in state/database
};
```

**Learning Goals:**

- Array `.find()` method
- Creating habit entries with timestamps
- State updates
- Real-time UI synchronization

---

### Task 5: Decrement Habit Counter (BadHabitScreen.tsx)

**Location:** Line ~78 in `BadHabitScreen.tsx`

```typescript
const handleDecrement = async (habitId: number) => {
  // TODO: YOUR IMPLEMENTATION HERE
  //
  // Steps:
  // 1. Check if count > 0 (can't go negative)
  //    const habit = mockSelectedHabits.find(h => h.id === habitId);
  //    if (habit && habit.count === 0) return;
  //
  // 2. Find the most recent entry for this habit in todayLog
  //    - Filter todayLog by habit name
  //    - Sort by datetime descending
  //    - Take the first one
  //
  // 3. Delete that entry:
  //    - Use DeleteBadHabitUseCase
  //    - Pass the entry's id
  //
  // 4. Decrement counter and refresh:
  //    - Update count in mockSelectedHabits
  //    - Call fetchHabitData()
};
```

**Learning Goals:**

- Edge case handling (can't go negative)
- Array filtering and sorting
- Delete operations
- Data consistency

---

### Task 6: Edit Habit (BadHabitScreen.tsx)

**Location:** Line ~86 in `BadHabitScreen.tsx`

```typescript
const handleLogItemPress = (logId: number) => {
  // TODO: YOUR IMPLEMENTATION HERE
  //
  // Steps:
  // 1. Find the habit entry by id:
  //    const habit = todayLog.find(h => h.id === logId);
  //
  // 2. If found:
  //    setModalMode("edit");
  //    setEditingHabit(habit);
  //    setModalVisible(true);
  //
  // 3. The modal will pre-fill the form automatically
  //
  // 4. When submitted, handleSubmitHabit will handle the update
};
```

**Learning Goals:**

- Component communication
- State lifting patterns
- Edit vs Add flow
- User experience design

---

## 📚 Database Use Cases You'll Need

Make sure these exist in `/src/application/useCases/badHabitUseCases.ts`:

### 1. AddBadHabitUseCase

```typescript
execute(data: { name: string; description: string; datetime: number; notes?: string }): Promise<void>
```

### 2. UpdateBadHabitUseCase (You may need to create this)

```typescript
execute(id: number, data: { name: string; description: string; notes?: string }): Promise<void>
```

### 3. DeleteBadHabitUseCase (You may need to create this)

```typescript
execute(id: number): Promise<void>
```

### 4. GetAllBadHabitsUseCase (Already exists)

```typescript
execute(): Promise<BadHabit[]>
```

---

## 🎓 Learning Progression

### Week 1: Form Basics

1. Implement form validation
2. Test validation with console.logs
3. Add error message display

### Week 2: Database Integration

1. Study existing use cases
2. Implement Add functionality
3. Test adding habits

### Week 3: Counters

1. Implement increment
2. Implement decrement
3. Handle edge cases

### Week 4: Edit & Polish

1. Implement edit functionality
2. Add toast notifications
3. Handle loading states

---

## 🐛 Testing Checklist

### Form Validation

- [ ] Empty name shows error
- [ ] Short name shows error
- [ ] Empty description shows error
- [ ] Valid data passes validation
- [ ] Errors clear after fixing input

### Add Habit

- [ ] Modal opens on FAB press
- [ ] Form submits successfully
- [ ] Habit appears in today's log
- [ ] Modal closes after submit
- [ ] Form resets for next add

### Increment

- [ ] Counter increases
- [ ] New entry appears in log
- [ ] Visual tier updates (⚪ → ✖️ → 🚫)
- [ ] Multiple increments work

### Decrement

- [ ] Counter decreases
- [ ] Entry removed from log
- [ ] Can't go below 0
- [ ] Visual tier updates correctly

### Edit

- [ ] Tapping log item opens modal
- [ ] Form pre-fills with data
- [ ] Changes save correctly
- [ ] Log updates after edit

---

## 💡 Bonus Challenges (After Basic Implementation)

1. **Toast Notifications**

   - "Habit added successfully"
   - "Habit updated"
   - "Habit deleted"

2. **Loading States**

   - Show spinner during database operations
   - Disable buttons while loading

3. **Confirmation Dialogs**

   - "Are you sure you want to delete?"
   - On decrement to 0

4. **Optimistic Updates**

   - Update UI immediately
   - Revert if database operation fails

5. **Undo Functionality**
   - "Undo" button after delete
   - Toast with undo action

---

## 🎯 Key Takeaways for Hybrid Development

### What AI Did (Save Your Time)

✅ Component structure and styling  
✅ TypeScript interfaces  
✅ Layout and positioning  
✅ Dark theme consistency  
✅ Accessibility (touch targets, contrast)  
✅ Documentation and comments

### What You Should Do (Build Your Skills)

🧠 Business logic implementation  
🧠 Database operations  
🧠 State management decisions  
🧠 Error handling strategies  
🧠 User experience flows  
🧠 Testing and debugging

**Remember:** AI gives you the foundation. You build the intelligence on top of it. This is the best way to learn while staying productive! 🚀
