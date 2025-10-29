# Clean Architecture

## Description

This React Native project utilizes **Robert C. Martin's Clean Architecture** principles, organizing the codebase into four distinct layers with clear separation of concerns. Each layer has specific responsibilities and dependencies flow inward (outer layers depend on inner layers, never vice versa).

The architecture follows the **Dependency Inversion Principle**: high-level business logic doesn't depend on low-level implementation details. Instead, both depend on abstractions (interfaces).

---

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│         Presentation Layer (UI)                 │
│   Components, Screens, Navigation               │
├─────────────────────────────────────────────────┤
│         Application Layer (Use Cases)           │
│   Business Logic, Validation, Interfaces        │
├─────────────────────────────────────────────────┤
│         Domain Layer (Entities)                 │
│   Core Business Models                          │
├─────────────────────────────────────────────────┤
│         Infrastructure Layer (Data)             │
│   Database, External Services, Implementations  │
└─────────────────────────────────────────────────┘

Dependencies flow: Presentation → Application → Domain ← Infrastructure
```

---

## 1. Domain Layer (`/src/domain`)

**Purpose:** Contains the core business entities and models. This is the **innermost layer** with no dependencies on other layers.

**Characteristics:**

- Pure TypeScript interfaces
- No framework dependencies
- No external library imports
- Represents the fundamental business concepts

**Structure:**

```
domain/
├── entities/
│   ├── badHabit.ts          # Bad habit entity definition
│   └── insightReport.ts     # Insight report entity definition
```

**Example:**

```typescript
// domain/entities/badHabit.ts
export default interface BadHabit {
  id?: number;
  name: string;
  description: string;
  datetime: number; // Unix timestamp
  notes?: string;
}
```

**Responsibilities:**

- Define data structures
- Establish business object contracts
- Remain framework-agnostic
- No business logic (just data shapes)

---

## 2. Application Layer (`/src/application`)

**Purpose:** Contains business logic, use cases, validation rules, and repository interfaces. This layer **orchestrates** the application's behavior.

**Characteristics:**

- Defines **what** the app can do (use cases)
- Contains repository interfaces (contracts)
- Implements validation rules
- Independent of UI and infrastructure details

**Structure:**

```
application/
├── useCases/
│   ├── badHabitUseCases.ts         # CRUD operations
│   └── insightReportUseCases.ts    # Report operations
├── repositories/
│   ├── iBadHabitRepository.ts      # Repository interface
│   └── iInsightReportRepository.ts # Repository interface
├── validators/
│   └── badHabitValidator.ts        # Business rules/constraints
└── services/
    └── (future service interfaces)
```

**Key Concepts:**

### Use Cases

Encapsulate single business operations. Each use case does **one thing**.

```typescript
// application/useCases/badHabitUseCases.ts
export class CreateBadHabitUseCase {
  async execute(badHabitData: BadHabit): Promise<number> {
    const badHabitRepository = new BadHabitRepository();
    const newBadHabitId = await badHabitRepository.create(badHabitData);
    return newBadHabitId;
  }
}

export class GetAllTodayBadHabitsUseCase {
  async execute(): Promise<BadHabit[]> {
    const badHabitRepository = new BadHabitRepository();
    const badHabitsToday = await badHabitRepository.getAllToday();
    return badHabitsToday;
  }
}
```

**Use Case Examples:**

- `CreateBadHabitUseCase` - Create new habit entry
- `UpdateBadHabitUseCase` - Update existing habit
- `DeleteBadHabitUseCase` - Delete habit
- `GetAllTodayBadHabitsUseCase` - Fetch today's habits
- `GetBadHabitByIdUseCase` - Fetch specific habit

### Repository Interfaces

Define contracts for data access **without** specifying implementation.

```typescript
// application/repositories/iBadHabitRepository.ts
export default interface IBadHabitRepository {
  create(badHabit: BadHabit): Promise<number>;
  update(badHabit: BadHabit): Promise<boolean>;
  delete(id: number): Promise<void>;
  getAll(): Promise<BadHabit[]>;
  getById(id: number): Promise<BadHabit | null>;
}
```

**Benefits:**

- Use cases depend on **interfaces**, not concrete implementations
- Easy to swap data sources (SQLite → Firebase → API)
- Enables unit testing with mocks

### Validators

Business rules and constraints.

```typescript
// application/validators/badHabitValidator.ts
export const NAME_CONSTRAINTS = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
};

export const DESCRIPTION_CONSTRAINTS = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 1000,
};
```

**Responsibilities:**

- Define business rules
- Coordinate use cases
- Validate data before persistence
- Return domain entities

---

## 3. Infrastructure Layer (`/src/infrastructure`)

**Purpose:** Implements the **technical details** defined by the application layer interfaces. Contains concrete implementations of data access, external services, and third-party integrations.

**Characteristics:**

- Implements repository interfaces
- Handles database operations
- Manages external API calls
- Framework/library-specific code

**Structure:**

```
infrastructure/
├── database/
│   ├── coreStorage.ts              # Database initialization
│   ├── badHabitRepository.ts       # SQLite implementation
│   └── insightReportRepository.ts  # SQLite implementation
└── services/
    └── (future external service implementations)
```

**Key Components:**

### Database Initialization

```typescript
// infrastructure/database/coreStorage.ts
let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("cognitrack.db");
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS badHabits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      datetime INTEGER NOT NULL,
      notes TEXT
    );
  `);
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}
```

### Repository Implementation

```typescript
// infrastructure/database/badHabitRepository.ts
export default class BadHabitRepository implements IBadHabitRepository {
  async create(badHabit: BadHabit): Promise<number> {
    const db = getDatabase();
    const result = await db.runAsync(
      `INSERT INTO badHabits (name, description, datetime, notes) VALUES (?, ?, ?, ?);`,
      [
        badHabit.name,
        badHabit.description,
        badHabit.datetime,
        badHabit.notes || null,
      ]
    );
    return result.lastInsertRowId;
  }

  async getAllToday(): Promise<BadHabit[]> {
    const db = getDatabase();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const results = await db.getAllAsync<BadHabit>(
      `SELECT * FROM badHabits WHERE datetime BETWEEN ? AND ?;`,
      [startOfDay.getTime(), endOfDay.getTime()]
    );
    return results as BadHabit[];
  }

  // ... other methods
}
```

**Responsibilities:**

- Execute SQL queries
- Handle database connections
- Implement data persistence
- Transform database results to domain entities
- Manage external API integrations
- Handle file system operations

**Why Separation Matters:**

- Can switch from SQLite to Firebase without changing use cases
- Database schema changes stay isolated
- Testing becomes easier (mock repositories)

---

## 4. Presentation Layer (`/src/presentation`)

**Purpose:** Everything related to the **user interface**. Displays data and captures user interactions. This is the **outermost layer**.

**Characteristics:**

- React Native components
- Navigation logic
- UI state management
- User interaction handlers
- Styled components

**Structure:**

```
presentation/
├── screens/
│   ├── BadHabitScreen.tsx       # Main tracking screen
│   ├── OverviewScreen.tsx       # Overview/dashboard
│   ├── StatsScreen.tsx          # Analytics/statistics
│   └── InsightScreen.tsx        # AI insights
├── components/
│   ├── badHabit/
│   │   ├── HabitCounter.tsx     # Counter card component
│   │   ├── HabitLogItem.tsx     # Log entry component
│   │   └── HabitModal.tsx       # Add/edit modal
│   └── ui/
│       ├── Button.tsx           # Reusable button
│       ├── Card.tsx             # Card container
│       ├── TextInput.tsx        # Form input
│       └── FloatingActionButton.tsx
└── navigation/
    ├── NavigationWrapper.tsx    # Navigation provider
    └── AppNavigator.tsx         # Tab navigation
```

**Key Concepts:**

### Screens

Top-level views that orchestrate UI components and use cases.

```typescript
// presentation/screens/BadHabitScreen.tsx
function BadHabitScreen() {
  const [todayLog, setTodayLog] = useState<BadHabit[]>([]);

  // Fetch data using use case
  const fetchHabitData = async () => {
    const getTodayBadHabits = new GetAllTodayBadHabitsUseCase();
    const todayBadHabits = await getTodayBadHabits.execute();
    setTodayLog(todayBadHabits);
  };

  // Handle user action via use case
  const handleIncrement = async (habitId: string) => {
    const createBadHabit = new CreateBadHabitUseCase();
    await createBadHabit.execute({
      /* data */
    });
    await fetchHabitData(); // Refresh UI
  };

  return (
    <View>
      <HabitCounter onIncrement={handleIncrement} />
      <HabitLogItem data={todayLog} />
    </View>
  );
}
```

**Screen Responsibilities:**

- Call use cases to fetch/mutate data
- Manage UI state (loading, errors, data)
- Handle user interactions
- Compose reusable components
- Navigate between screens

### Components

Reusable UI building blocks.

```typescript
// presentation/components/badHabit/HabitCounter.tsx
interface HabitCounterProps {
  name: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function HabitCounter({
  name,
  count,
  onIncrement,
  onDecrement,
}: HabitCounterProps) {
  return (
    <Card>
      <Text>{name}</Text>
      <Text>{count}</Text>
      <Button onPress={onIncrement}>+</Button>
      <Button onPress={onDecrement}>-</Button>
    </Card>
  );
}
```

**Component Types:**

- **Feature Components** (`/badHabit`) - Domain-specific UI (HabitCounter, HabitModal)
- **UI Components** (`/ui`) - Generic reusable elements (Button, Card, TextInput)

### Navigation

React Navigation structure.

```typescript
// presentation/navigation/AppNavigator.tsx
function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tracker" component={BadHabitScreen} />
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Insights" component={InsightScreen} />
    </Tab.Navigator>
  );
}
```

**Responsibilities:**

- Render UI components
- Handle user input
- Display loading/error states
- Call use cases for business operations
- Manage local UI state
- Show toast notifications

---

## 5. Shared Layer (`/src/shared`)

**Purpose:** Cross-cutting concerns used by multiple layers.

**Structure:**

```
shared/
├── constants/
│   └── colors.ts           # Theme colors
└── helpers/
    └── (utility functions)
```

**Examples:**

- Theme constants
- Date formatting utilities
- String helpers
- Type guards
- Common validators

---

## Data Flow Example

Let's trace what happens when a user adds a bad habit:

```
1. USER ACTION
   User presses "Add Habit" button
   ↓
2. PRESENTATION LAYER
   BadHabitScreen.handleAddHabit()
   - Opens modal
   - User fills form
   - Validates input
   ↓
3. PRESENTATION → APPLICATION
   handleSubmitHabit() calls CreateBadHabitUseCase
   ↓
4. APPLICATION LAYER
   CreateBadHabitUseCase.execute(badHabitData)
   - Receives domain entity
   - Calls repository interface
   ↓
5. APPLICATION → INFRASTRUCTURE
   badHabitRepository.create(badHabitData)
   ↓
6. INFRASTRUCTURE LAYER
   BadHabitRepository.create()
   - Executes SQL INSERT
   - Returns new ID
   ↓
7. INFRASTRUCTURE → APPLICATION → PRESENTATION
   ID flows back up
   - Use case returns ID
   - Screen refreshes data
   - Shows success toast
   ↓
8. UI UPDATE
   Screen calls fetchHabitData()
   - GetAllTodayBadHabitsUseCase
   - Updates state
   - React re-renders
```

---

## Benefits of This Architecture

### 1. **Separation of Concerns**

Each layer has a single, well-defined responsibility.

### 2. **Testability**

- Mock repositories for use case testing
- Test UI components in isolation
- No database needed for business logic tests

### 3. **Maintainability**

- Changes isolated to specific layers
- Easy to locate bugs
- Clear folder structure

### 4. **Flexibility**

- Swap SQLite for Firebase without changing use cases
- Replace React Native with React Web (reuse domain + application)
- Add new features without affecting existing code

### 5. **Dependency Inversion**

- Business logic doesn't depend on implementation details
- Infrastructure depends on application interfaces
- Easy to change data sources

### 6. **Scalability**

- Add new entities without restructuring
- New use cases don't affect existing ones
- Clear patterns for new developers

---

## Key Principles Applied

### 1. **Dependency Rule**

Dependencies point **inward**. Outer layers depend on inner layers.

```
Presentation → Application → Domain ← Infrastructure
```

### 2. **Interface Segregation**

Use cases depend on repository **interfaces**, not implementations.

### 3. **Single Responsibility**

Each use case does **one thing** (Create, Update, Delete, GetById, GetAll).

### 4. **Don't Repeat Yourself (DRY)**

Shared utilities in `/shared`, reusable components in `/presentation/components/ui`.

### 5. **Separation of Concerns**

UI logic ≠ Business logic ≠ Data access logic.

---

## Migration Guide (If Needed)

### Switching from SQLite to Firebase

1. Create `firebaseBadHabitRepository.ts` in infrastructure
2. Implement `IBadHabitRepository` interface
3. Update use cases to instantiate Firebase repository
4. **Zero changes** to presentation or domain layers

### Adding a New Feature

1. **Domain:** Define entity in `/domain/entities`
2. **Application:** Create use cases and repository interface
3. **Infrastructure:** Implement repository (database queries)
4. **Presentation:** Build UI components and screens

---

## Common Patterns

### Use Case Pattern

```typescript
export class [Action][Entity]UseCase {
  async execute(params: Type): Promise<Result> {
    const repository = new Repository();
    return await repository.method(params);
  }
}
```

### Repository Pattern

```typescript
export default class Repository implements IRepository {
  async create(entity: Entity): Promise<number> {
    const db = getDatabase();
    // SQL operations
    return id;
  }
}
```

### Screen Pattern

```typescript
function Screen() {
  const [data, setData] = useState<Entity[]>([]);

  const fetchData = async () => {
    const useCase = new GetDataUseCase();
    const result = await useCase.execute();
    setData(result);
  };

  useFocusEffect(useCallback(() => fetchData(), []));

  return <View>{/* components */}</View>;
}
```

---

## Conclusion

This architecture provides:

- ✅ Clear separation between UI, business logic, and data access
- ✅ Easy testing at all layers
- ✅ Flexibility to change technologies
- ✅ Scalable structure for growing applications
- ✅ Maintainable codebase with well-defined boundaries

By following these principles, **CogniTrack** remains clean, testable, and ready to evolve with changing requirements.
