# Getting Started with KindWorld Web

Welcome! This guide will help you get the KindWorld web application running on your machine.

## 🎯 What You'll Get

A fully functional web application with:
- ✅ Beautiful, responsive design
- ✅ 7 complete pages (Dashboard, Missions, Vouchers, Profile, etc.)
- ✅ Mock data for testing
- ✅ State management with Redux
- ✅ Routing with React Router
- ✅ Charts and visualizations
- ✅ Mobile-optimized navigation

## 📋 Prerequisites

Before you begin, make sure you have:

### Required
- **Node.js** (version 16 or higher)
  - Download from: https://nodejs.org/
  - Check version: `node --version`

### Optional
- **Git** (for cloning the repository)
- **VS Code** (recommended code editor)

## 🚀 Installation Methods

### Method 1: Automated Setup (Easiest)

#### On Mac/Linux:
```bash
cd web
./setup.sh
```

#### On Windows:
```bash
cd web
setup.bat
```

The script will:
1. Check Node.js installation
2. Install all dependencies
3. Start the development server
4. Open the app in your browser

### Method 2: Manual Setup

```bash
# 1. Navigate to web directory
cd web

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 📱 First Time Using the App

### 1. Sign In Page
When you first open the app, you'll see the sign-in page.

**For Demo:**
- Enter any email (e.g., `demo@kindworld.app`)
- Click "Continue"
- You'll be signed in automatically

### 2. Explore the Dashboard
After signing in, you'll see:
- Your Compassion Points: **28,760**
- Growth chart showing 30-day history
- Top 5 leaderboard
- Month selector

### 3. Browse Missions
Click "Missions" in the navigation to:
- View available volunteer opportunities
- See mission details
- Check points rewards
- View participant counts

### 4. Check Vouchers
Click "Vouchers" to:
- See your points balance
- Browse available vouchers
- Try redeeming rewards
- Filter by category

### 5. View Profile
Click "Profile" to:
- See your stats
- View earned badges
- Check leaderboard position
- See volunteer hours

## 🎨 Navigation Guide

### Desktop (Wide Screen)
- **Top Navigation Bar**
  - Logo (left) - Click to go home
  - Menu links (center) - Home, Missions, Vouchers, Leaderboard
  - Profile avatar (right) - Click to view profile

### Mobile (Small Screen)
- **Top Bar**
  - Logo and hamburger menu
- **Bottom Navigation**
  - Home icon
  - Missions (search) icon
  - Vouchers (activity) icon
  - Profile (user) icon

## 🎯 Key Features to Try

### 1. Points Chart
- Go to Dashboard
- Scroll to "Points Statement"
- Hover over the chart to see daily points
- Change months using the selector

### 2. Mission Details
- Go to Missions page
- Click any mission card
- View full details
- Click "Join Mission" button

### 3. Leaderboard
- Click "Leaderboard" in navigation
- See top 3 podium
- Find your position (highlighted)
- Check rank changes

### 4. Voucher Redemption
- Go to Vouchers page
- Browse available vouchers
- Click "Redeem" on affordable vouchers
- See "Insufficient Points" for expensive ones

### 5. Profile Badges
- Go to Profile page
- Scroll to "Your Badges"
- See earned achievements
- View badge descriptions

## 🔧 Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

## 📊 Understanding the Mock Data

The app comes with demo data:

### Your Profile
- **Name**: Alex Chen
- **Email**: alex.chen@example.com
- **Points**: 28,760
- **Volunteer Hours**: 156
- **Rank**: #4
- **Badges**: 3 earned

### Available Missions
1. **Beach Cleanup Drive**
   - Reward: 500 points
   - Location: Taipei City
   - Participants: 32/50

2. **Food Bank Volunteer**
   - Reward: 750 points
   - Location: Taipei City
   - Participants: 18/30

3. **Blood Donation Drive**
   - Reward: 1000 points
   - Location: Taipei City
   - Participants: 67/100

### Available Vouchers
- 7-Eleven NT$100 - 1,000 points
- FamilyMart NT$100 - 1,000 points
- PX Mart NT$200 - 2,000 points
- 7-Eleven NT$500 - 4,500 points

### Leaderboard
1. Sarah Martinez - 45,230 pts 🥇
2. James Chen - 42,180 pts 🥈
3. Emma Patel - 38,950 pts 🥉
4. **Alex Chen (You)** - 28,760 pts
5. Maria Johnson - 26,420 pts

## 🎨 Customization

### Change Your Profile
Edit `src/store/slices/authSlice.ts`:
```typescript
user: {
  displayName: 'Your Name',
  email: 'your@email.com',
  compassionPoints: 50000,
  // ... other fields
}
```

### Add More Missions
Edit `src/store/slices/missionsSlice.ts`:
```typescript
const mockMissions: Mission[] = [
  // Add your missions here
]
```

### Modify Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#000000',  // Change to your color
  accent: '#4A90E2',   // Change to your color
}
```

## 🐛 Troubleshooting

### Problem: Port 3000 is already in use
**Solution:**
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

### Problem: Dependencies won't install
**Solution:**
```bash
# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: Page is blank
**Solution:**
1. Check browser console for errors (F12)
2. Make sure you're at `http://localhost:3000`
3. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Problem: Changes not showing
**Solution:**
- Vite has hot reload, but sometimes you need to:
  1. Save the file
  2. Wait a second
  3. Refresh browser if needed

## 📱 Testing Responsive Design

### Method 1: Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select device (iPhone, iPad, etc.)
4. See mobile view with bottom navigation

### Method 2: Resize Browser
1. Make browser window narrow (< 768px)
2. Bottom navigation appears
3. Top navigation becomes hamburger menu

## 🚀 Next Steps

### 1. Explore the Code
```
src/
├── pages/          # Page components
├── components/     # Reusable components
├── store/          # Redux state
└── types/          # TypeScript types
```

### 2. Make Changes
- Edit any file in `src/`
- Changes appear instantly (hot reload)
- No need to restart server

### 3. Add Features
- Create new pages
- Add new components
- Modify existing features
- Connect to real backend

### 4. Deploy
- Build: `npm run build`
- Deploy to Vercel, Netlify, or Firebase
- See README.md for deployment guides

## 📚 Additional Resources

### Documentation
- **README.md** - Full project documentation
- **QUICKSTART.md** - 5-minute quick start
- **WEB_APP_SUMMARY.md** - Implementation details

### Technologies Used
- **React** - https://react.dev/
- **TypeScript** - https://www.typescriptlang.org/
- **Tailwind CSS** - https://tailwindcss.com/
- **Redux Toolkit** - https://redux-toolkit.js.org/
- **React Router** - https://reactrouter.com/
- **Vite** - https://vitejs.dev/

### Learning Resources
- React Tutorial: https://react.dev/learn
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Tailwind Docs: https://tailwindcss.com/docs

## ✅ Checklist

Before you start developing:
- [ ] Node.js installed (v16+)
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] App opens in browser
- [ ] Can navigate between pages
- [ ] Can see mock data
- [ ] Responsive design works

## 🎉 You're Ready!

You now have a fully functional KindWorld web application running locally. 

**What you can do:**
- ✅ Browse all pages
- ✅ Test all features
- ✅ Modify the code
- ✅ Add new features
- ✅ Deploy to production

**Need help?**
- Check the documentation files
- Review the code comments
- Open browser console for errors
- Contact: support@kindworld.app

---

**Happy coding! 🌟**

Transform kindness into impact, one line of code at a time.
