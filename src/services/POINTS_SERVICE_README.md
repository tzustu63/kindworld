# Points Service Documentation

## Overview

The Points Service provides a complete system for managing Compassion Points in the KindWorld application. It includes service layer functions, Redux state management, a reusable UI component, and a custom React hook.

## Architecture

### 1. Service Layer (`pointsService.ts`)

Core functions for points operations:

- **`awardPointsForMission(userId, missionId, points, description)`** - Award points when a user completes a mission
- **`deductPointsForVoucher(userId, voucherId, points, description)`** - Deduct points when redeeming a voucher
- **`getTransactionHistory(userId, limit)`** - Retrieve transaction history
- **`getCurrentBalance(userId)`** - Get current points balance
- **`awardBonusPoints(userId, points, description)`** - Award bonus points
- **`adjustPoints(userId, points, description)`** - Make admin adjustments

All operations use Firestore batch writes to ensure atomicity.

### 2. Redux State Management (`pointsSlice.ts`)

State structure:
```typescript
{
  currentBalance: number;
  transactions: PointsTransaction[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  lastUpdated: number | null;
  monthlyGrowth: number; // Percentage
}
```

**Async Thunks:**
- `fetchCurrentBalance` - Load user's balance
- `fetchTransactionHistory` - Load transaction history
- `awardMissionPoints` - Award points for mission
- `redeemVoucherPoints` - Deduct points for voucher
- `awardBonus` - Award bonus points
- `makeAdjustment` - Admin adjustment

**Selectors:**
- `selectCurrentBalance` - Current points balance
- `selectTransactions` - All transactions
- `selectMonthlyGrowth` - Growth percentage
- `selectRecentTransactions(limit)` - Recent transactions
- `selectTotalEarned` - Total points earned
- `selectTotalSpent` - Total points spent

### 3. UI Component (`PointsDisplay.tsx`)

A reusable component for displaying points with animations.

**Props:**
```typescript
{
  points: number;
  size?: 'small' | 'medium' | 'large';
  showGrowth?: boolean;
  growthPercentage?: number;
  label?: string;
}
```

**Features:**
- Animated number transitions
- Size variants (small, medium, large)
- Growth indicators with color coding
- Responsive typography

**Usage:**
```tsx
import { PointsDisplay } from '../components';

<PointsDisplay
  points={28760}
  size="large"
  showGrowth={true}
  growthPercentage={20}
  label="Points"
/>
```

### 4. Custom Hook (`usePoints.ts`)

Simplified interface for points operations.

**Usage:**
```tsx
import { usePoints } from '../hooks';

const MyComponent = () => {
  const {
    currentBalance,
    monthlyGrowth,
    isLoading,
    awardForMission,
    redeemVoucher,
  } = usePoints(userId);

  // Award points
  await awardForMission('mission123', 100, 'Completed beach cleanup');

  // Redeem voucher
  await redeemVoucher('voucher456', 500, '7-Eleven NTD 100 voucher');
};
```

## Data Flow

1. **Awarding Points:**
   ```
   User completes mission → awardForMission() → 
   pointsService.awardPointsForMission() → 
   Firestore batch write (transaction + user update) →
   Redux state update → UI refresh
   ```

2. **Redeeming Voucher:**
   ```
   User redeems voucher → redeemVoucher() →
   Check sufficient balance →
   pointsService.deductPointsForVoucher() →
   Firestore batch write → Redux state update → UI refresh
   ```

## Error Handling

All service functions throw errors that are caught by Redux thunks:
- `'Points must be greater than 0'` - Invalid point amount
- `'User not found'` - User doesn't exist
- `'Insufficient points'` - Not enough points for redemption

Errors are stored in Redux state and can be displayed to users.

## Firestore Structure

### Collections

**`pointsTransactions`:**
```typescript
{
  id: string;
  userId: string;
  amount: number; // Positive for earning, negative for spending
  type: 'mission_completion' | 'voucher_redemption' | 'bonus' | 'adjustment';
  relatedId?: string; // Mission ID or Voucher ID
  description: string;
  timestamp: Timestamp;
}
```

**`users` (updated fields):**
```typescript
{
  compassionPoints: number; // Current balance
  updatedAt: Timestamp;
}
```

## Performance Considerations

- Batch writes ensure atomic operations
- Transaction history limited to 50 by default
- Monthly growth calculated client-side from transactions
- Redux state persists across app sessions (if Redux Persist is configured)

## Security

- All operations require valid userId
- Voucher redemption checks balance before deducting
- Admin operations (adjustPoints) should be protected by role-based access control
- Firestore security rules should validate all writes

## Testing

Test coverage should include:
- Service layer functions (unit tests)
- Redux slice reducers and thunks (integration tests)
- PointsDisplay component rendering (component tests)
- usePoints hook behavior (hook tests)

## Future Enhancements

- Real-time points updates using Firestore listeners
- Points expiration system
- Referral bonus system
- Streak bonuses for consecutive days
- Points transfer between users
