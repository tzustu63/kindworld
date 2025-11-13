# Firebase Cloud Functions - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Build TypeScript

```bash
npm run build
```

### 3. Start Local Emulators

```bash
# From project root
firebase emulators:start
```

The emulators will start on:
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Auth: http://localhost:9099

### 4. Test a Function

Open another terminal and test with curl:

```bash
# Test getTopLeaderboard (no auth required for testing)
curl -X POST http://localhost:5001/YOUR_PROJECT_ID/us-central1/getTopLeaderboard \
  -H "Content-Type: application/json" \
  -d '{"data": {"limit": 10}}'
```

## 📋 Available Functions

### Mission Functions
- `joinMission` - Join a mission
- `completeMission` - Complete a mission and earn points
- `awardPoints` - Manually award points (admin)

### Voucher Functions
- `redeemVoucher` - Redeem a voucher with points
- `markVoucherAsUsed` - Mark voucher as used
- `expireOldRedemptions` - Auto-expire old redemptions (scheduled)

### Leaderboard Functions
- `updateLeaderboard` - Update rankings (scheduled)
- `getUserLeaderboardPosition` - Get user's rank
- `getTopLeaderboard` - Get top users
- `getLeaderboardAroundUser` - Get users around specific rank

### Badge Functions
- `checkAndAwardBadges` - Check and award badges
- `createBadge` - Create new badge (admin)
- `checkStreakBadges` - Check streak badges (scheduled)

## 🧪 Testing Functions Locally

### Using Firebase Functions Shell

```bash
cd functions
npm run shell
```

Then test functions interactively:

```javascript
// Join a mission
joinMission({ missionId: 'test-mission-123' })

// Redeem voucher
redeemVoucher({ voucherId: 'test-voucher-456' })

// Get leaderboard
getTopLeaderboard({ limit: 10 })

// Check badges
checkAndAwardBadges({ userId: 'test-user-789' })
```

### Using the Mobile App

Configure the app to use emulators:

```typescript
import { connectFunctionsEmulator } from 'firebase/functions';

const functions = getFunctions();
connectFunctionsEmulator(functions, 'localhost', 5001);
```

## 📦 Deploy to Production

### Deploy All Functions

```bash
firebase deploy --only functions
```

### Deploy Specific Function

```bash
firebase deploy --only functions:joinMission
```

### Deploy with Indexes

```bash
firebase deploy --only functions,firestore:indexes
```

## 🔍 View Logs

### Real-time Logs

```bash
firebase functions:log
```

### Specific Function Logs

```bash
firebase functions:log --only joinMission
```

### Last N Lines

```bash
firebase functions:log --lines 100
```

## 🐛 Common Issues

### Build Errors

```bash
cd functions
rm -rf node_modules lib
npm install
npm run build
```

### Emulator Not Starting

```bash
# Kill existing processes
lsof -ti:5001 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Restart
firebase emulators:start
```

### Function Not Found

Make sure you've built the TypeScript:
```bash
npm run build
```

## 📚 Documentation

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Implementation Summary**: See `../CLOUD_FUNCTIONS_IMPLEMENTATION.md`

## 🔐 Authentication Testing

For functions requiring authentication, use Firebase Auth emulator:

1. Create test user in Auth emulator UI (http://localhost:9099)
2. Get auth token
3. Include in function calls

## 💡 Tips

1. **Always test locally first** using emulators
2. **Check logs** if functions fail: `firebase functions:log`
3. **Use transactions** for data consistency
4. **Monitor costs** in Firebase Console
5. **Set timeouts** to prevent runaway functions
6. **Use proper indexes** for Firestore queries

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Build TypeScript
3. ✅ Start emulators
4. ✅ Test functions locally
5. ⬜ Deploy to staging
6. ⬜ Test with mobile app
7. ⬜ Deploy to production
8. ⬜ Monitor and optimize

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Check `DEPLOYMENT.md` for deployment issues
- View Firebase Console for monitoring
- Check Firebase documentation: https://firebase.google.com/docs/functions

Happy coding! 🎉
