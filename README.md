# CogniTrack 🧠

CogniTrack is an intelligent bad habit tracker built with React Native. It's a personal app designed to help you log, visualize, and understand your habit loops through data-driven analysis and AI-powered insights.

## 🎯 Core Concept

This app is inspired by the "Habit Scoreboard" concept from _Atomic Habits_ and the productivity principle that simply logging your distractions helps to reduce their power.

The goal is not to be a comprehensive life-planner, but to be a frictionless, specialized tool for one thing: building awareness around your bad habits. By providing a one-tap method to log an impulse, CogniTrack helps you identify patterns in your behavior, ultimately giving you the power to change them.

## ✨ Key Features

- **Frictionless Logging:** A "Quick-Add" grid on the dashboard to log your most common habits with a single tap.
- **Daily Counters:** See at-a-glance how many times you've performed each habit today, right on the Quick-Add button.
- **Dynamic Visual Feedback:** A global icon for all habits that dynamically changes in "tiers" (e.g., `⚪` -> `✖️` -> `🚫`) based on the daily count, providing immediate visual feedback on your progress.
- **Today's Log:** A chronological list of every specific habit entry logged for the current day.
- **AI-Powered Insights:** (Powered by the Gemini API) The `CognitiveInsight` feature analyzes your habit data—looking at time, location, and notes—to find hidden patterns and provide you with actionable reflections.
  - **Saved Reports:** View and manage previously generated AI insight reports with full CRUD capabilities.
  - **Editable Notes:** Add personal notes and reflections to your AI-generated insights.
- **Data Visualization (Stats Screen):**
  - **Pie Charts:** To identify which bad habits occur most frequently.
  - **Vertical Bar Graphs:** To visualize habit frequency by day, week, or month.
- **Historical View:** An "Overall Bad Habits" screen to see a filterable list of all habits you've ever logged.
- **Data Management (Settings Screen):**
  - **Export/Import:** Create JSON backups of all your data and restore from previous backups.
  - **Danger Zone:** Clear all habit logs or AI insights with confirmation prompts.
- **CRUD Operations:** Full control to create, read, update, and delete habit types and individual log entries.

## 📱 Screens

1.  **Dashboard Screen:** The main screen featuring the "Quick-Add" grid and "Today's Log."
2.  **Stats Screen:** Displays the pie and bar charts for visual analysis with date range filtering.
3.  **AI Insights Screen:** An interface to ask the Gemini API for analysis of your data (e.g., "Analyze my habits from last week").
4.  **Insight Reports Screen:** View, manage, and add notes to all previously generated AI insight reports.
5.  **Overall Bad Habits Screen:** A searchable and filterable history of all habit entries with date-based filtering.
6.  **Settings Screen:** Manage app data with export/import functionality and data clearing options.

## 🛠️ Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Programming Language:** TypeScript (strict mode)
- **Database:** SQLite via expo-sqlite (persistent, on-device storage)
- **AI Integration:** Google Gemini API 2.0 Flash
- **File System:** expo-file-system for backup/restore operations
- **Architecture Pattern:** Clean Architecture (Domain, Application, Infrastructure, Presentation layers)

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/DragunWF/CogniTrack.git

# 2. Navigate to the project directory
cd CogniTrack

# 3. Install dependencies
npm install

# 4. Set up environment variables
# Create a .env file and add your Gemini API key:
# EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here

# 5. Run the app with Expo
npx expo start

# Then choose your platform:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app for physical device
```

## 🏗️ Project Architecture

CogniTrack follows **Clean Architecture** principles with clear separation of concerns:

- **Domain Layer:** Core business entities (BadHabit, InsightReport)
- **Application Layer:** Use cases and business logic
- **Infrastructure Layer:** Database repositories and external services (Gemini API)
- **Presentation Layer:** React Native screens and UI components

This architecture ensures maintainability, testability, and adherence to SOLID principles.
