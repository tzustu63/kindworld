# KindWorld Web Application

A modern web application for KindWorld - Transform Kindness into Impact through gamified volunteering.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
web/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   ├── pages/            # Page components
│   │   ├── SignInPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── MissionsPage.tsx
│   │   ├── MissionDetailPage.tsx
│   │   ├── VouchersPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── LeaderboardPage.tsx
│   ├── store/            # Redux state management
│   │   ├── index.ts
│   │   └── slices/
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Firebase (Authentication, Firestore, Storage)

## 📱 Features

### ✅ Implemented
- **Authentication**: Email and OAuth sign-in (Google, Apple)
- **Dashboard**: Points display, growth chart, leaderboard
- **Missions**: Browse, filter, and view volunteer opportunities
- **Vouchers**: Redeem Compassion Points for rewards
- **Profile**: View badges, stats, and achievements
- **Leaderboard**: Full rankings with podium display
- **Responsive Design**: Mobile-first, works on all devices

### 🎨 Design
- Minimalist, modern interface
- Clean typography and spacing
- Smooth transitions and animations
- Accessible color contrast
- Mobile-optimized navigation

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🌐 Pages

### Public Routes
- `/signin` - Sign in / Sign up page

### Protected Routes (require authentication)
- `/` - Dashboard with points and leaderboard
- `/missions` - Browse volunteer missions
- `/missions/:id` - Mission detail page
- `/vouchers` - Voucher store
- `/profile` - User profile and badges
- `/leaderboard` - Full leaderboard rankings

## 🎯 Key Components

### Layout Components
- **Header**: Top navigation with logo and menu
- **BottomNav**: Mobile bottom navigation bar
- **Layout**: Wrapper component with header and nav

### Page Components
- **DashboardPage**: Main dashboard with points chart
- **MissionsPage**: Mission listing with filters
- **MissionDetailPage**: Detailed mission view
- **VouchersPage**: Voucher redemption store
- **ProfilePage**: User profile with badges
- **LeaderboardPage**: Rankings and podium

## 🔐 Authentication

Currently using mock authentication for demo purposes. To integrate with Firebase:

1. Create Firebase project
2. Add Firebase config to environment variables
3. Update auth slice to use Firebase Auth
4. Implement OAuth providers

## 📊 State Management

Redux Toolkit slices:
- **auth**: User authentication state
- **dashboard**: Points history and leaderboard
- **missions**: Mission listings and filters
- **vouchers**: Available vouchers
- **profile**: User badges and stats

## 🎨 Styling

Using Tailwind CSS with custom configuration:

### Brand Colors
- Primary: `#000000` (Black)
- Accent: `#4A90E2` (Blue)
- Success: `#4CAF50` (Green)
- Warning: `#FF9800` (Orange)
- Error: `#F44336` (Red)

### Custom Classes
- `.btn` - Base button styles
- `.btn-primary` - Primary button (black)
- `.btn-secondary` - Secondary button (white)
- `.card` - Card container with shadow
- `.input` - Form input styles

## 📱 Responsive Breakpoints

- Mobile: < 768px (bottom navigation)
- Tablet: 768px - 1024px
- Desktop: > 1024px (top navigation)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy Options

**Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Firebase Hosting**
```bash
firebase deploy --only hosting
```

## 🔄 Future Enhancements

- [ ] Firebase integration for real data
- [ ] Real-time updates with Firestore
- [ ] Push notifications
- [ ] Social sharing features
- [ ] Advanced filtering and search
- [ ] Mission recommendations
- [ ] Achievement animations
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)

## 🐛 Known Issues

- Mock data is used for demo purposes
- Authentication is simulated (not connected to Firebase)
- No real API calls yet

## 📝 Environment Variables

Create a `.env` file in the web directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

© 2025 KindWorld. All rights reserved.

## 📞 Support

- Email: support@kindworld.app
- Website: https://kindworld.app
- Documentation: See README files in project

---

**Built with ❤️ for making the world a kinder place**
