# Wanderlust - Premium AI-Powered Travel Experience 🌍

[![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-55.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Material 3](https://img.shields.io/badge/Design-Material_3-757575?logo=materialdesign&logoColor=white)](https://m3.material.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, aesthetically pleasing travel application built with **React Native** and **Expo**. This project showcases modern mobile development practices, including modular architecture, dynamic theming (Material 3), and fluid micro-animations to provide a premium user experience.

---

## 🚀 Project Overview

Wanderlust is designed for the modern traveler who values both functionality and aesthetics. It serves as a comprehensive travel companion, allowing users to explore trending destinations, view detailed itineraries, and manage their favorite spots—all within a sleek, high-refresh-rate interface.

### Key Highlights for Recruiters:
- **Clean Architecture:** Implements a feature-based modular folder structure for high scalability and maintainability.
- **Advanced UI/UX:** Adheres to Material 3 design guidelines with custom elevations, glassmorphism, and dynamic lighting.
- **Performance Optimized:** Leverages `react-native-reanimated` for 60FPS transitions and shimmer effects for optimized perceived latency.

---

## ✨ Features

- **🌓 Dynamic Dark Mode:** Full system-wide dark and light mode support using React Context API.
- **🎨 Material 3 Design:** Implements the latest M3 color palettes, typography (DM Sans), and component shapes.
- **✨ Premium Animations:** 
  - Shimmer loading states for destination cards.
  - Image fade-in effects on load.
  - Smooth scale transitions on interaction.
- **📍 Smart Feed:** Interactive destination feed with category filtering and personalized recommendations.
- **📖 Rich Detail Screens:** Immersive details with floating headers, map integration placeholders, and descriptive itineraries.
- **🔐 Secure Authentication:** Seamless login and register flow with layout transitions.
- **⭐ Favorites Management:** Persistent storage for user-bookmarked destinations.

---

## 🛠️ Tech Stack

- **Core:** [React Native](https://reactnative.dev/) + [Expo SDK 55](https://expo.dev/)
- **Navigation:** [React Navigation v7](https://reactnavigation.org/) (Native Stack & Bottom Tabs)
- **State/Theme:** React Context API & [Async Storage](https://react-native-async-storage.github.io/async-storage/)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [Lottie](https://airbnb.io/lottie/)
- **Styling:** Material 3 System with custom CSS-in-JS
- **Typography:** DM Sans (Google Fonts)
- **Icons:** Expo Vector Icons (Material Community Icons & Lucide)

---

## 🏗️ Architecture

The project follows a **Feature-Based Modular Architecture**, ensuring that each domain (Auth, Destinations, Favorites) is self-contained.

```text
src/
├── assets/          # Global images, fonts, and lottie files
├── components/      # Shared UI atoms (Buttons, Typography, ScreenWrappers)
├── config/          # ThemeContext, API configs, and constants
├── features/        # Business logic split by modules
│   ├── auth/        # Login, Signup, Welcome logic
│   ├── destinations/# Feed, Detail, Map screens
│   └── favorites/   # User's saved places
├── navigation/      # Root and Tab Navigators
├── theme/           # Color tokens and global style variables
└── utils/           # Helper functions and validators
```

### Design Patterns Used:
- **Provider Pattern:** Centralized theme and auth state management.
- **Higher-Order Components (HOC) / Wrappers:** Standardized screen layouts via `ScreenWrapper`.
- **Custom Hooks:** Decoupling UI logic from presentation components.

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vimal004/Travel-App.git
   cd RN-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on Device/Emulator:**
   - Scan the QR code with the **Expo Go** app (Android/iOS).
   - Press `a` for Android emulator or `i` for iOS simulator.

---

## 🔮 Future Roadmap

- [ ] **AI Integration:** Personalized travel recommendations based on user behavior.
- [ ] **Real-world Maps:** Deep integration with Google Maps API for live navigation.
- [ ] **Offline Mode:** Enable viewing of favorite destinations without internet.
- [ ] **Social Integration:** Allow users to share itineraries with friends.

---

## 👨‍💻 Author

**Vimal Manoharan**  
*B.Tech Final Year Student*  
[LinkedIn](https://www.linkedin.com/in/vimalmanoharan/) | [GitHub](https://github.com/vimal004) | [Portfolio](https://vimalmanoharan.com)

---

> [!TIP]
> This project was built with a focus on "Pixel Perfect" UI implementation and clean code standards. Feel free to explore the codebase and provide feedback!
