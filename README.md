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
- **Data Visualization (Stats Screen):**
  - **Pie Charts:** To identify which bad habits occur most frequently.
  - **Vertical Bar Graphs:** To visualize habit frequency by day, week, or month.
- **Historical View:** An "Overall Bad Habits" screen to see a filterable list of all habits you've ever logged.
- **CRUD Operations:** Full control to create, read, update, and delete habit types and individual log entries.

## 📱 Screens

1.  **Dashboard Screen:** The main screen featuring the "Quick-Add" grid and "Today's Log."
2.  **Stats Screen:** Displays the pie and bar charts for visual analysis.
3.  **AI Insights Screen:** An interface to ask the Gemini API for analysis of your data (e.g., "Analyze my habits from last week").
4.  **Overall Habits Screen:** A searchable and filterable history of all habit entries.

## 🛠️ Tech Stack

- **Mobile Development Library:** React Native
- **Programming/Scripting Language:** TypeScript
- **Database:** SQLite (for persistent, on-device storage)
- **Artificial Intelligence (AI):** Google Gemini API

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone [https://github.com/DragunWF/CogniTrack.git](https://github.com/DragunWF/CogniTrack.git)

# 2. Navigate to the project directory
cd CogniTrack

# 3. Install dependencies
npm install

# 4. Run the app
# For iOS
npm run ios

# For Android
npm run android
```
