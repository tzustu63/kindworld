# KindWorld TypeScript Type Definitions

This directory contains all TypeScript interfaces and type definitions for the KindWorld application.

## Overview

The type system is organized into separate files by domain, with a central `index.ts` that exports all types for easy importing throughout the application.

## Files

### Core Data Models

- **`user.ts`** - User profile and authentication types
- **`mission.ts`** - Mission/event data structures
- **`points.ts`** - Points transactions and history
- **`voucher.ts`** - Vouchers and redemptions
- **`badge.ts`** - Badge definitions and criteria
- **`leaderboard.ts`** - Leaderboard entries
- **`company.ts`** - Company sponsor profiles

### API Types

- **`api.ts`** - Request and response types for all API endpoints

## Usage

Import types from the central index:

```typescript
import { User, Mission, PointsTransaction } from '@/types';
```

Or import specific types directly:

```typescript
import { User, UserRole } from '@/types/user';
import { ListMissionsRequest, ListMissionsResponse } from '@/types/api';
```

## Data Models

### User

Represents a user account with profile information, points balance, and social connections.

```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  compassionPoints: number;
  totalVolunteerHours: number;
  badges: Badge[];
  followers: string[];
  following: string[];
  role: 'user' | 'company' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Mission

Represents a volunteer mission or donation opportunity.

```typescript
interface Mission {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  date: Timestamp;
  location: MissionLocation;
  pointsReward: number;
  category: MissionCategory;
  sponsorId?: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: MissionStatus;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### PointsTransaction

Immutable record of points earned or spent.

```typescript
interface PointsTransaction {
  id: string;
  userId: string;
  amount: number; // Positive for earning, negative for spending
  type: 'mission_completion' | 'voucher_redemption' | 'bonus' | 'adjustment';
  relatedId?: string; // Mission ID or Voucher ID
  description: string;
  timestamp: Timestamp;
}
```

### Voucher

Represents a redeemable reward from partner brands.

```typescript
interface Voucher {
  id: string;
  brandName: string;
  brandLogo: string;
  title: string;
  description: string;
  pointsCost: number;
  monetaryValue: number;
  category: VoucherCategory;
  stock: number;
  expiryDate?: Timestamp;
  termsAndConditions: string;
  partnerApiEndpoint?: string;
  isActive: boolean;
}
```

### Redemption

Record of a voucher redemption by a user.

```typescript
interface Redemption {
  id: string;
  userId: string;
  voucherId: string;
  pointsSpent: number;
  redemptionCode: string;
  status: 'pending' | 'issued' | 'used' | 'expired';
  redeemedAt: Timestamp;
  usedAt?: Timestamp;
  expiresAt: Timestamp;
}
```

### Badge

Achievement badge with unlock criteria.

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: {
    type: 'hours' | 'missions' | 'points' | 'streak';
    threshold: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

### LeaderboardEntry

User ranking on the leaderboard.

```typescript
interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  compassionPoints: number;
  rank: number;
  change: number; // Position change from previous period
}
```

### Company

Corporate sponsor profile.

```typescript
interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  contactEmail: string;
  sponsoredMissions: string[];
  totalPointsSponsored: number;
  csrGoals: CSRGoals;
  createdAt: Timestamp;
}
```

## API Types

All API endpoints have corresponding request and response types defined in `api.ts`. These follow a consistent naming pattern:

- Request types: `{Action}{Resource}Request`
- Response types: `{Action}{Resource}Response`

### Examples

```typescript
// Authentication
interface EmailSignInRequest {
  email: string;
  password?: string;
}

interface EmailSignInResponse {
  user: User;
  token: string;
}

// Missions
interface ListMissionsRequest {
  category?: MissionCategory;
  status?: MissionStatus;
  city?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'relevance' | 'distance';
  limit?: number;
  offset?: number;
}

interface ListMissionsResponse {
  missions: Mission[];
  total: number;
  hasMore: boolean;
}

// Vouchers
interface RedeemVoucherRequest {
  voucherId: string;
  userId: string;
}

interface RedeemVoucherResponse {
  redemption: Redemption;
  remainingPoints: number;
}
```

## Type Guards

You can create type guards for runtime type checking:

```typescript
function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.compassionPoints === 'number'
  );
}

function isMission(obj: any): obj is Mission {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.pointsReward === 'number'
  );
}
```

## Firestore Integration

All data models use Firebase Firestore types for timestamps and geolocation:

```typescript
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Timestamp
createdAt: FirebaseFirestoreTypes.Timestamp;

// GeoPoint
coordinates: FirebaseFirestoreTypes.GeoPoint;
```

When converting to/from Firestore:

```typescript
// To Firestore
const userData = {
  ...user,
  createdAt: firestore.Timestamp.now(),
  location: new firestore.GeoPoint(latitude, longitude),
};

// From Firestore
const user: User = {
  ...doc.data(),
  createdAt: doc.data().createdAt, // Already a Timestamp
};
```

## Best Practices

1. **Always use types** - Import and use these types throughout the application
2. **Don't use `any`** - Use proper types or `unknown` if type is truly unknown
3. **Extend, don't modify** - Create new types that extend existing ones rather than modifying
4. **Document complex types** - Add JSDoc comments for complex or non-obvious types
5. **Keep types DRY** - Reuse common patterns and create utility types

## Related Files

- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore index configuration
- `FIRESTORE_STRUCTURE.md` - Detailed database structure documentation
