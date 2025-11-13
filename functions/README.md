# KindWorld Firebase Cloud Functions

This directory contains Firebase Cloud Functions that provide backend logic for the KindWorld mobile application.

## Overview

The Cloud Functions handle critical backend operations including:
- Mission participation and completion
- Voucher redemption and points management
- Leaderboard calculations and rankings
- Badge awarding and notifications

## Functions

### Mission Functions (`missions.ts`)

#### `joinMission`
- **Type**: Callable HTTPS function
- **Purpose**: Handle mission join requests
- **Authentication**: Required
- **Parameters**: `{ missionId: string }`
- **Validates**:
  - Mission exists and is available
  - User hasn't already joined
  - Mission hasn't reached max participants
- **Returns**: Success confirmation

#### `completeMission`
- **Type**: Callable HTTPS function
- **Purpose**: Verify and complete missions, award points
- **Authentication**: Required
- **Parameters**: `{ missionId: string, verificationData: any }`
- **Actions**:
  - Verifies user participation
  - Awards compassion points
  - Creates transaction record
  - Marks mission as completed for user
- **Returns**: Points awarded and new balance

#### `awardPoints`
- **Type**: Callable HTTPS function
- **Purpose**: Manually award points (admin only)
- **Authentication**: Required (admin role)
- **Parameters**: `{ userId: string, amount: number, description: string, type?: string }`
- **Returns**: Points awarded and new balance

### Voucher Functions (`vouchers.ts`)

#### `redeemVoucher`
- **Type**: Callable HTTPS function
- **Purpose**: Process voucher redemptions
- **Authentication**: Required
- **Parameters**: `{ voucherId: string }`
- **Validates**:
  - Voucher is active and in stock
  - User has sufficient points
  - Voucher hasn't expired
- **Actions**:
  - Deducts points from user
  - Generates unique redemption code
  - Creates redemption record
  - Integrates with partner API (placeholder)
- **Returns**: Redemption code and details

#### `markVoucherAsUsed`
- **Type**: Callable HTTPS function
- **Purpose**: Mark voucher as used at partner location
- **Authentication**: Required
- **Parameters**: `{ redemptionId: string }`
- **Returns**: Success confirmation

#### `expireOldRedemptions`
- **Type**: Scheduled function (runs every 24 hours)
- **Purpose**: Automatically expire old redemptions
- **Actions**: Marks expired redemptions as 'expired' status

### Leaderboard Functions (`leaderboard.ts`)

#### `updateLeaderboard`
- **Type**: Scheduled function (runs every hour)
- **Purpose**: Calculate and update leaderboard rankings
- **Optimizations**:
  - Batch processing for large user base
  - Stores top 1000 in main document
  - Full rankings in subcollection for scalability
- **Actions**:
  - Fetches all users sorted by points
  - Calculates rank changes from previous period
  - Updates leaderboard document

#### `getUserLeaderboardPosition`
- **Type**: Callable HTTPS function
- **Purpose**: Get specific user's leaderboard position
- **Authentication**: Required
- **Parameters**: `{ userId?: string, period?: string }`
- **Returns**: User's rank, change, and points

#### `getTopLeaderboard`
- **Type**: Callable HTTPS function
- **Purpose**: Get top N users from leaderboard
- **Parameters**: `{ limit?: number, period?: string }`
- **Returns**: Top users array with rankings

#### `getLeaderboardAroundUser`
- **Type**: Callable HTTPS function
- **Purpose**: Get leaderboard entries around a specific user
- **Authentication**: Required
- **Parameters**: `{ userId?: string, period?: string, range?: number }`
- **Returns**: Users ranked above and below specified user

#### `onUserPointsChange`
- **Type**: Firestore trigger (users/{userId})
- **Purpose**: Update leaderboard when user points change
- **Trigger**: User document update
- **Actions**: Updates user's ranking in real-time

### Badge Functions (`badges.ts`)

#### `checkAndAwardBadges`
- **Type**: Callable HTTPS function
- **Purpose**: Check and award eligible badges to user
- **Authentication**: Required
- **Parameters**: `{ userId?: string }`
- **Actions**:
  - Checks all badge criteria
  - Awards eligible badges
  - Sends notifications
- **Returns**: List of newly earned badges

#### `onMissionCompleted`
- **Type**: Firestore trigger (missions/{missionId})
- **Purpose**: Auto-award badges when mission completed
- **Trigger**: Mission document update
- **Actions**: Checks and awards badges for users who completed mission

#### `onUserPointsChangeForBadges`
- **Type**: Firestore trigger (users/{userId})
- **Purpose**: Auto-award point-based badges
- **Trigger**: User document update
- **Actions**: Awards badges when point thresholds reached

#### `checkStreakBadges`
- **Type**: Scheduled function (runs daily)
- **Purpose**: Check and award streak-based badges
- **Actions**: Calculates user streaks and awards eligible badges

#### `createBadge`
- **Type**: Callable HTTPS function
- **Purpose**: Create new badge (admin only)
- **Authentication**: Required (admin role)
- **Parameters**: `{ name, description, iconUrl, criteria, rarity }`
- **Returns**: Badge ID

## Setup

### Prerequisites
- Node.js 18 or higher
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project configured

### Installation

1. Navigate to functions directory:
```bash
cd functions
```

2. Install dependencies:
```bash
npm install
```

3. Build TypeScript:
```bash
npm run build
```

### Development

Run functions locally with Firebase emulators:
```bash
npm run serve
```

### Deployment

Deploy all functions:
```bash
npm run deploy
```

Deploy specific function:
```bash
firebase deploy --only functions:functionName
```

## Data Models

See `src/types.ts` for complete TypeScript interfaces including:
- User
- Mission
- PointsTransaction
- Voucher
- Redemption
- Badge
- LeaderboardEntry

## Security

- All callable functions verify authentication
- Admin functions verify user role
- Transactions ensure data consistency
- Input validation on all parameters
- Error handling with user-friendly messages

## Performance Optimizations

### Leaderboard
- Batch processing for large datasets
- Pagination to handle millions of users
- Subcollections for scalable storage
- Indexed queries for fast lookups

### Badge Checking
- Triggered automatically on relevant events
- Efficient queries with proper indexes
- Caching of badge criteria

### Voucher Redemption
- Atomic transactions prevent double-spending
- Stock management with race condition protection
- Async partner API integration

## Monitoring

Functions are automatically monitored via:
- Firebase Console Functions dashboard
- Cloud Functions logs
- Error reporting
- Performance metrics

View logs:
```bash
npm run logs
```

## Testing

The functions can be tested using:
1. Firebase Emulator Suite (local testing)
2. Firebase Functions shell (interactive testing)
3. Integration tests with the mobile app

## Environment Variables

Configure environment variables using Firebase config:
```bash
firebase functions:config:set partner.api.key="your-key"
```

## Firestore Indexes

Required indexes are defined in `firestore.indexes.json`. Deploy with:
```bash
firebase deploy --only firestore:indexes
```

## Cost Optimization

- Scheduled functions run at optimal intervals
- Batch operations reduce function invocations
- Efficient queries minimize reads
- Proper indexing improves performance

## Support

For issues or questions, refer to:
- Firebase Documentation: https://firebase.google.com/docs/functions
- Project README: ../README.md
