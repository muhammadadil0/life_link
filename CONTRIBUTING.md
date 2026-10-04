# Contributing to LifeLink 🩸

Thank you for your interest in contributing to **LifeLink**! LifeLink is an open-source, non-commercial emergency blood donation network dedicated to connecting critical patients directly with volunteer donors across Pakistan and beyond.

By contributing, you are directly helping save lives and improving healthcare access.

---

## 📋 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Branching & Pull Request Workflow](#branching--pull-request-workflow)
4. [Local Development Setup](#local-development-setup)
5. [Coding Guidelines & Standards](#coding-guidelines--standards)
6. [Commit Conventions](#commit-conventions)

---

## 🤝 Code of Conduct
Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions, discussions, and pull requests.

---

## 🚀 How to Contribute

### 1. Fork & Clone
1. Fork the official repository: [muhammadadil0/life_link](https://github.com/muhammadadil0/life_link).
2. Clone your personal fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/life_link.git
   cd life_link
   ```
3. Set the upstream remote:
   ```bash
   git remote add upstream https://github.com/muhammadadil0/life_link.git
   ```

### 2. Local Development Setup
- **Install Root & Backend dependencies:**
  ```bash
  npm install
  cd backend && npm install && cd ..
  ```
- **Install Frontend dependencies:**
  ```bash
  cd frontend && npm install && cd ..
  ```
- **Run the local servers:**
  - Start Backend (Port 5050):
    ```bash
    cd backend && npm run dev
    ```
  - Start Frontend (Port 3002):
    ```bash
    cd frontend && npm run dev -- --port 3002
    ```
- Open `http://localhost:3002` in your browser.

---

## 🌿 Branching & Pull Request Workflow

> [!IMPORTANT]
> **Direct pushes to the `main` branch are restricted.** All contributions must be submitted via a Pull Request (PR) from a feature or bugfix branch.

1. **Always branch from `upstream/main`:**
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feat/your-feature-name
   # OR for bug fixes:
   git checkout -b fix/issue-description
   ```
2. **Make your changes:**
   - Keep commits small, logical, and focused.
   - Test your changes thoroughly locally.
   - Run the build command before submitting:
     ```bash
     cd frontend && npm run build
     ```
3. **Commit your changes:**
   Follow conventional commits:
   ```bash
   git commit -m "feat: add SMS notification fallback for urgent emergencies"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feat/your-feature-name
   ```
5. **Open a Pull Request:**
   - Go to [muhammadadil0/life_link](https://github.com/muhammadadil0/life_link) and click **"Compare & pull request"**.
   - Fill out the provided **PR Template** thoroughly.
   - Request review and address any feedback politely.

---

## 🎨 Coding Guidelines & Standards

- **React / Frontend:**
  - Functional components with React hooks.
  - Tailwind CSS for all utility styling.
  - Maintain full bilingual support using `useLanguage()` and `LanguageContext.jsx` for any new user-facing strings.
  - Ensure mobile responsiveness across phones, tablets, and desktops.
- **Node.js / Express Backend:**
  - Clean route handlers in `backend/routes/`.
  - Mongoose models in `backend/models/`.
  - Maintain graceful in-memory fallbacks when MongoDB is offline.

---

## 📝 Commit Conventions
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` A new feature or user-facing capability.
- `fix:` A bug fix or patch.
- `docs:` Documentation updates or guides.
- `style:` Formatting, missing semi-colons, styling changes with no code logic impact.
- `refactor:` Code restructuring without changing functional behavior.
- `perf:` Performance improvements.
- `test:` Adding or updating tests.

---

### Questions or Suggestions?
Feel free to open an **Issue** or reach out directly to the maintainer at `adilraxiq64@gmail.com`. Thank you for contributing to save lives!
