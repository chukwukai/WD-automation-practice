

# Walker & Dunlop Automation Assignment

This project contains the automation suite for the Walker & Dunlop technical assessment. It uses **Playwright** for end-to-end testing.

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:
* **Node.js**: `v24.14.1` (or latest LTS)
* **IDE**: [Visual Studio Code](https://code.visualstudio.com/) (recommended) or any appropriate editor.

## ⚙️ Installation

Follow these step-by-step instructions to get your development environment running:

1. **Clone the repository**
   ```bash
   git clone git@github.com:chukwukai/WD-automation-practice.git
   cd WD-automation-practice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize Playwright**
   Run the following command and follow the on-screen prompts to complete the setup:
   ```bash
   npm init playwright@latest
   ```

## 🚀 Running Tests

You can run the tests using the following commands:

* **Headless Mode** (Runs all tests in the background):
  ```bash
  npx playwright test
  ```
* **UI Mode** (Opens the interactive test runner):
  ```bash
  npx playwright test --ui
  ```
* **Specific Test File**:
  ```bash
  npx playwright test tests/example.spec.ts
  ```

---
