# KindWorld Web - Quick Start Guide

Get the KindWorld web application running in 5 minutes!

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
cd web
npm install
```

This will install all required packages including:
- React & React DOM
- Redux Toolkit
- React Router
- Tailwind CSS
- Recharts (for charts)
- Lucide React (for icons)
- Vite (build tool)

### Step 2: Start Development Server

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

## 🎯 What You'll See

### 1. Sign In Page
- Email input field
- Google OAuth button
- Apple Sign-In button
- For demo: Enter any email and click "Continue"

### 2. Dashboard (Home)
- **Points Display**: 28,760 Compassion Points
- **Growth Chart**: 30-day points history
- **Leaderboard**: Top 5 volunteers
- **Month Selector**: Filter by month

### 3. Missions Page
- Browse volunteer opportunities
- Filter and sort options
- Mission cards with:
  - Image
  - Title and description
  - Date and location
  - Points reward
  - Participant count

### 4. Mission Detail
- Full mission information
- Location details
- "Join Mission" button
- Points reward display

### 5. Vouchers Page
- Your points balance
- Category filters (7-Eleven, FamilyMart, PX Mart)
- Voucher cards with redemption
- Point cost display

### 6. Profile Page
- User information
- Total volunteer hours
- Earned badges
- Leaderboard position
- Stats overview

### 7. Leaderboard Page
- Top 3 podium display
- Full rankings
- Your position highlighted
- Rank changes

## 📱 Navigation

### Desktop (> 768px)
- Top header with navigation links
- Logo on the left
- Profile avatar on the right

### Mobile (< 768px)
- Top header with hamburger menu
- Bottom navigation bar with 4 tabs:
  - Home
  - Missions
  - Vouchers
  - Profile

## 🎨 Features to Try

1. **Browse Missions**
   - Go to Missions page
   - Click on any mission card
   - View full details

2. **Check Leaderboard**
   - See your ranking
   - View top performers
   - Check rank changes

3. **Redeem Vouchers**
   - Go to Vouchers page
   - Browse available vouchers
   - Try to redeem (demo mode)

4. **View Profile**
   - Check your badges
   - See volunteer hours
   - View stats

5. **Track Progress**
   - Dashboard shows points chart
   - Month-over-month growth
   - Historical data

## 🔧 Development Commands

```bash
# Start dev server
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

## 🎯 Demo Data

The app comes with mock data:

**User Profile:**
- Name: Alex Chen
- Points: 28,760
- Hours: 156
- Rank: #4

**Missions:**
- Beach Cleanup Drive (500 pts)
- Food Bank Volunteer (750 pts)
- Blood Donation Drive (1000 pts)

**Vouchers:**
- 7-Eleven NT$100 (1000 pts)
- FamilyMart NT$100 (1000 pts)
- PX Mart NT$200 (2000 pts)

**Leaderboard:**
1. Sarah Martinez - 45,230 pts
2. James Chen - 42,180 pts
3. Emma Patel - 38,950 pts
4. Alex Chen (You) - 28,760 pts
5. Maria Johnson - 26,420 pts

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: '#000000',    // Black
  accent: '#4A90E2',     // Blue
  success: '#4CAF50',    // Green
}
```

### Modify Mock Data
Edit Redux slices in `src/store/slices/`:
- `authSlice.ts` - User data
- `dashboardSlice.ts` - Points & leaderboard
- `missionsSlice.ts` - Mission listings
- `vouchersSlice.ts` - Voucher data

## 🔥 Hot Tips

1. **Responsive Testing**
   - Resize browser to see mobile view
   - Bottom nav appears on mobile
   - Top nav on desktop

2. **State Management**
   - All data is in Redux store
   - Check Redux DevTools extension
   - State persists during development

3. **Routing**
   - Uses React Router v6
   - Protected routes require auth
   - Clean URLs (no hash routing)

4. **Styling**
   - Tailwind CSS utility classes
   - Custom components in `index.css`
   - Responsive by default

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run type-check

# Run linter
npm run lint
```

## 📚 Next Steps

1. **Connect to Firebase**
   - Add Firebase config
   - Implement real authentication
   - Connect to Firestore

2. **Add Features**
   - Real-time updates
   - Push notifications
   - Social sharing

3. **Deploy**
   - Build for production
   - Deploy to Vercel/Netlify
   - Set up CI/CD

## 🎉 You're Ready!

The app is now running and you can:
- ✅ Browse missions
- ✅ View leaderboard
- ✅ Check vouchers
- ✅ Manage profile
- ✅ Track progress

Enjoy exploring KindWorld! 🌟

---

**Need Help?**
- Check `README.md` for detailed docs
- Review code in `src/` directory
- Open an issue on GitHub
