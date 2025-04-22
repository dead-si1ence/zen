# ZEN - AI Sports Predictions

<div align="center">
  <img src="src/assets/images/zen-logo.svg" alt="ZEN Logo" width="200" height="200" />
</div>

## 🧾 Project Overview

ZEN is an AI-powered sports prediction platform designed to deliver accurate and real-time insights across multiple competitive disciplines including UFC/MMA, Formula 1, Esports, and Football. The system integrates top-tier public and commercial sports APIs with machine learning models—leveraging artificial neural networks to provide actionable forecasts and data visualizations. ZEN is built for scalability, cross-platform support, and seamless integration into modern applications via well-structured APIs and intuitive UI/UX design.

## 🔧 Technologies Used

- React 19
- TypeScript
- Vite
- Framer Motion for animations
- React Router for navigation
- Modern CSS with variables and animations
- HashRouter for GitHub Pages compatibility

## 📋 Features

### Currently Implemented
- Dark, minimalist, dystopian-inspired design theme
- Interactive UI with smooth animations powered by Framer Motion
- Responsive design works across all devices
- Sport-specific pages for UFC/MMA, Formula 1, Football, and Esports
- Custom 404 page for better user experience

### 📝 TODO List
- AI prediction model integration
- Data visualization of prediction metrics
- API integration for each sport category
- User authentication system
- Favorites/bookmarks functionality
- Settings page for user preferences
- Progressive Web App (PWA) capabilities
- Backend API development with Go/Rust
- Machine learning model deployment with Python

## 🧠 System Architecture Overview

### Frontend Technologies:
- Web Application: React + TypeScript
- Desktop Application: Tauri (Rust) + React + TypeScript (planned)
- Mobile Application: React Native or Tauri (planned)

### Backend Technologies:
- Web Services: Go (planned)
- Desktop Services: Rust (planned)
- Machine Learning Services: Python (Artificial Neural Networks) (planned)

### Deployment Strategy:
- Initial Phase: GitHub Pages for static content hosting
- Scalable Deployment: Docker containers hosted on AWS, Azure, or Vercel for backend microservices (planned)

## ⚙️ API Recommendations by Sport

### UFC / MMA
- SportsDataIO MMA API
- Sportradar MMA API
- Fighting Tomatoes API
- UFC API by Postman

### Formula 1
- OpenF1 API
- Ergast Developer API
- Sportradar Formula 1 API

### Esports
- PandaScore API
- Abios Esports API
- GameScorekeeper API

### Football (Soccer)
- API-Football
- Sportmonks Football API
- Football-Data.org

## 🎨 UI/UX Design Guidelines

### Color Palette
- Background: #121212 (Dark Gray)
- Primary Accent: #BB86FC (Purple)
- Secondary Accent: #03DAC6 (Teal)
- Text: #FFFFFF (White)

### Typography
- Headings: 'Roboto Slab', serif
- Body: 'Roboto', sans-serif

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dead-si1ence/zen.git

# Navigate to the project directory
cd zen

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

The project is configured for GitHub Pages deployment:

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
zen/
├── DOCUMENTATION.md
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
└── src/
    ├── App.css
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── assets/
    │   ├── react.svg
    │   ├── images/
    │   │   ├── esports-icon.svg
    │   │   ├── f1-icon.svg
    │   │   ├── football-icon.svg
    │   │   └── ufc-icon.svg
    │   └── videos/
    ├── components/
    │   ├── common/
    │   │   └── VideoBackground.tsx
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   └── Layout.tsx
    │   └── sports/
    ├── pages/
    │   ├── EsportsPage.tsx
    │   ├── FootballPage.tsx
    │   ├── Formula1Page.tsx
    │   ├── Home.tsx
    │   ├── NotFound.tsx
    │   └── UFCPage.tsx
    └── styles/
        ├── Header.css
        ├── Home.css
        ├── Layout.css
        ├── NotFound.css
        ├── SportPage.css
        └── VideoBackground.css
```

## 📄 Documentation

For full documentation on system architecture, API integration details, machine learning model implementation, and UI/UX design strategy, please refer to the [DOCUMENTATION.md](./DOCUMENTATION.md) file.

## 📜 License

MIT

## 🙏 Acknowledgments

- Inspired by the intersection of AI and sports analytics
- Icons used are from various open source collections
