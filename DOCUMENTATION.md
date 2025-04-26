# ZEN - AI Sports Predictions

## 🧠 System Architecture Overview

### Frontend Architecture:

- **Web Application**: React 18+ with TypeScript 5+ for type safety and improved developer experience
- **Desktop Application**: Tauri (Rust) + React + TypeScript (planned)
- **Mobile Application**: React Native or Tauri Mobile (planned)

### Backend Architecture:

- **Web Services**: Go (planned) - For high-performance API endpoints and data processing
- **Desktop Services**: Rust (planned) - For native, cross-platform functionality
- **Machine Learning Services**: Python with PyTorch/TensorFlow (planned) - For prediction models

### Core Components:

- **API Layer**: Centralized API service with robust error handling
- **Data Processing**: Stream-based data processing for real-time analytics
- **Prediction Engine**: Neural network models for generating predictions
- **User Interface**: Responsive, accessible UI with smooth animations

### Deployment Strategy:

- **Initial Phase**: GitHub Pages for static content hosting
- **Scaled Phase**: Docker containers for backend microservices on AWS, Azure, or Vercel
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment

---

## ⚙️ API Recommendations by Sport

### **UFC / MMA**

- **SportsDataIO MMA API**: Offers real-time coverage of every MMA fight, including scores, stats, odds, projections, and news.
- **Sportradar MMA API**: Provides schedules and live results for all UFC events, including Dana White's Contender Series, with additional stats like win probabilities and competitor profiles.
- **Fighting Tomatoes API**: Provides data about past UFC fights, including event details and outcomes.

### **Formula 1**

- **OpenF1 API**: A free and open-source API offering real-time and historical Formula 1 data, including lap timings and car telemetry.
- **Ergast Developer API**: Provides a historical record of motor racing data for non-commercial purposes, covering Formula One series from 1950 onwards.
- **Sportradar Formula 1 API**: Delivers schedules and live coverage for all F1 Championship races, with additional stats like racer profiles and team profiles.

### **Esports**

- **PandaScore API**: Provides reliable and extensive statistics and odds for esports titles like LoL, CS2, and Dota 2, with in-play statistics and odds.
- **Abios Esports API**: Offers access to a large esports database with in-depth statistics, live scores, and more, covering over 15 games.
- **GameScorekeeper API**: Connects to various data sources to track the entire ecosystem of esports, including tournaments, matches, teams, and individual players.

### **Football (Soccer)**

- **API-Football**: Covers over 1,100 leagues and cups with live scores, standings, events, line-ups, players, pre-match odds, and statistics.
- **Sportmonks Football API**: Provides live scores, lineups, odds, and stats across 2,500+ football leagues globally.
- **Football-Data.org**: Offers football data and statistics in a machine-readable format, including live scores, fixtures, tables, squads, and lineups.

---

## 📄 Technical Documentation

### 1. **Project Structure**

The application follows a modular architecture with clear separation of concerns:

```
zen/
├── src/
│   ├── assets/        - Images, videos, and other static resources
│   ├── components/    - Reusable UI components
│   │   ├── common/    - Generic components used across the app
│   │   ├── layout/    - Layout-related components (header, footer)
│   │   └── sports/    - Sport-specific components
│   ├── hooks/         - Custom React hooks
│   ├── pages/         - Page components for each route
│   ├── services/      - API services and data fetching logic
│   ├── styles/        - CSS files for components
│   ├── types/         - TypeScript type definitions
│   └── utils/         - Helper functions and utilities
```

### 2. **Key Features**

#### Error Handling System

The application implements a robust error handling system with:

- **Enhanced API Error Types**: Specialized error classes for different API failures
- **Network Error Detection**: Automatic detection and handling of network connectivity issues
- **Timeout Handling**: Configurable request timeouts with appropriate user feedback
- **Retry Mechanism**: Automatic retry for transient failures with exponential backoff

#### Async Operations

The `useAsync` hook provides a standardized way to handle asynchronous operations:

- **Loading States**: Automatic tracking of loading states
- **Error Handling**: Consistent error handling across the app
- **Cancellation**: Proper cleanup on component unmount
- **Debouncing**: Optional debouncing for frequently called operations
- **Retry Logic**: Configurable retry mechanism for failed requests

#### Video Background System

The `VideoBackground` component offers a high-performance video background with:

- **Adaptive Quality**: Network-aware quality switching based on connection type
- **Performance Optimization**: Pauses when not visible or tab inactive
- **iOS Compatibility**: HLS fallback for iOS devices
- **Reduced Motion Support**: Respects user accessibility preferences
- **Fallback System**: Graceful degradation to static images or gradients
- **Battery Awareness**: Reduces quality on low battery

### 3. **API Integration**

The application uses a centralized API service with:

- **Standardized Interface**: Consistent methods for all HTTP operations
- **Automatic Authentication**: Transparent token handling
- **Error Normalization**: Consistent error format across different APIs
- **Offline Detection**: Automatic detection of network connectivity issues
- **Configurable Timeouts**: Request timeout handling with user feedback

### 4. **State Management**

The application uses a combination of:

- **React Context**: For global application state
- **Component State**: For component-specific state
- **Custom Hooks**: For reusable stateful logic

### 5. **UI/UX Design Principles**

#### Design Theme

- **Style**: Modern, minimalist, dark theme with dystopian/esoteric elements
- **Color Palette**:
  - **Background**: `#121212` (Dark Gray)
  - **Primary Accent**: `#BB86FC` (Purple)
  - **Secondary Accent**: `#03DAC6` (Teal)
  - **Text**: `#FFFFFF` (White)
- **Typography**:
  - **Headings**: 'Roboto Slab', serif
  - **Body**: 'Roboto', sans-serif

#### UI Components

The application features:

- **Fluid Animations**: Smooth transitions using Framer Motion
- **Responsive Design**: Adapts to all device sizes
- **Accessible Interface**: Follows WCAG 2.1 AA guidelines
- **Error States**: Informative error messages with recovery options
- **Loading States**: Visual feedback during data fetching
- **Empty States**: User-friendly messaging when no data is available

### 6. **Machine Learning Integration (Planned)**

- **Model Type**: Artificial Neural Networks
- **Framework**: TensorFlow or PyTorch
- **Training Data**: Historical sports data from selected APIs
- **Prediction Types**:
  - **Match Outcomes**: Winner predictions
  - **Score Predictions**: Exact score or point spreads
  - **Performance Metrics**: Individual athlete performance predictions

### 7. **Deployment**

- **Current**: GitHub Pages for static frontend
- **Future Plans**:
  - API server on cloud infrastructure
  - Containerized deployment with Docker
  - CI/CD pipeline with GitHub Actions

---

## 🔧 Development Guidelines

### Setup Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Development Workflow

1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Make changes following the style guide
5. Test on multiple devices and browsers
6. Submit pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write unit tests for new features
- Document public APIs and complex logic
- Use named exports over default exports

### Performance Considerations

- Lazy load non-critical components
- Optimize images and videos for web
- Implement proper memoization for expensive calculations
- Use efficient CSS selectors and minimize DOM operations

---

## 📱 Accessibility Guidelines

The application follows these accessibility guidelines:

1. **Color Contrast**: Maintain minimum 4.5:1 ratio for text
2. **Keyboard Navigation**: All interactive elements accessible via keyboard
3. **Screen Reader Support**: Proper ARIA attributes and semantic HTML
4. **Motion Reduction**: Respect prefers-reduced-motion setting
5. **Focus Management**: Visible focus indicators for keyboard users

---

## 🔄 Continuous Improvement

The codebase is continuously improved with:

1. **Regular Dependency Updates**: Keep dependencies current
2. **Performance Profiling**: Identify and fix bottlenecks
3. **Accessibility Audits**: Regular testing with screen readers
4. **Cross-browser Testing**: Ensure compatibility across browsers
5. **User Feedback Integration**: Adjust based on user experience
