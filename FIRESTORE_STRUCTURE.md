# Firestore Data Structure

This document describes the Firestore database structure for the KindWorld application.

## Collections Overview

```
/users/{userId}
  - User profile data
  /earnedBadges/{badgeId}
    - Badges earned by the user

/missions/{missionId}
  - Mission/event data
  /participants/{userId}
    - Users participating in the mission

/pointsTransactions/{transactionId}
  - Immutable ledger of all points transactions

/vouchers/{voucherId}
  - Available vouchers for redemption

/redemptions/{redemptionId}
  - Voucher redemption records

/badges/{badgeId}
  - Badge definitions and criteria

/leaderboard/{entryId}
  - Computed leaderboard rankings (updated by Cloud Functions)

/companies/{companyId}
  - Company sponsor profiles

/analytics/{companyId}
  - Aggregated analytics data for companies (computed by Cloud Functions)
```

## Collection Details

### `/users/{userId}`

Stores user profile information and authentication data.

**Document ID**: Firebase Auth UID

**Fields**:
```typescript
{
  id: string;                    // Same as document ID
  email: string;                 // User email (indexed)
  displayName: string;           // Display name
  photoURL?: string;             // Profile photo URL
  bio?: string;                  // User bio
  compassionPoints: number;      // Current points balance (indexed)
  totalVolunteerHours: number;   // Total hours volunteered
  badges: Badge[];               // Array of earned badges
  followers: string[];           // Array of user IDs
  following: string[];           // Array of user IDs
  role: 'user' | 'company' | 'admin';  // User role (indexed)
  createdAt: Timestamp;          // Account creation time
  updatedAt: Timestamp;          // Last update time
}
```

**Indexes**:
- `email` (ascending)
- `compassionPoints` (descending) - for leaderboard queries
- `role` (ascending)

**Subcollections**:
- `/earnedBadges/{badgeId}` - Badges earned by user with timestamp

---

### `/missions/{missionId}`

Stores mission/event information.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  id: string;                    // Same as document ID
  title: string;                 // Mission title (indexed for search)
  description: string;           // Mission description
  imageUrls: string[];           // Array of image URLs
  date: Timestamp;               // Mission date (indexed)
  location: {
    address: string;
    city: string;                // Indexed for filtering
    coordinates: GeoPoint;       // For distance queries
  };
  pointsReward: number;          // Points awarded on completion
  category: MissionCategory;     // Mission category (indexed)
  sponsorId?: string;            // Company ID if sponsored (indexed)
  maxParticipants?: number;      // Max participants allowed
  currentParticipants: number;   // Current participant count
  status: MissionStatus;         // Mission status (indexed)
  createdBy: string;             // Admin user ID who created
  createdAt: Timestamp;          // Creation time
  updatedAt: Timestamp;          // Last update time
}
```

**Indexes**:
- `status` (ascending), `date` (ascending)
- `category` (ascending), `date` (ascending)
- `location.city` (ascending), `date` (ascending)
- `sponsorId` (ascending), `date` (descending)

**Subcollections**:
- `/participants/{userId}` - Users participating in the mission

---

### `/missions/{missionId}/participants/{userId}`

Tracks user participation in missions.

**Document ID**: User ID

**Fields**:
```typescript
{
  userId: string;
  missionId: string;
  joinedAt: Timestamp;
  completedAt?: Timestamp;
  status: 'joined' | 'completed' | 'cancelled';
  hoursContributed?: number;
}
```

---

### `/pointsTransactions/{transactionId}`

Immutable ledger of all points transactions.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  id: string;                    // Same as document ID
  userId: string;                // User ID (indexed)
  amount: number;                // Points amount (positive or negative)
  type: PointsTransactionType;   // Transaction type (indexed)
  relatedId?: string;            // Mission or Voucher ID
  description: string;           // Human-readable description
  timestamp: Timestamp;          // Transaction time (indexed)
}
```

**Indexes**:
- `userId` (ascending), `timestamp` (descending)
- `type` (ascending), `timestamp` (descending)

---

### `/vouchers/{voucherId}`

Available vouchers for redemption.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  id: string;                    // Same as document ID
  brandName: string;             // Brand name
  brandLogo: string;             // Logo URL
  title: string;                 // Voucher title
  description: string;           // Voucher description
  pointsCost: number;            // Points required (indexed)
  monetaryValue: number;         // Value in NTD
  category: VoucherCategory;     // Category (indexed)
  stock: number;                 // Available quantity
  expiryDate?: Timestamp;        // Voucher expiry
  termsAndConditions: string;    // T&C text
  partnerApiEndpoint?: string;   // Partner API for redemption
  isActive: boolean;             // Active status (indexed)
}
```

**Indexes**:
- `isActive` (ascending), `pointsCost` (ascending)
- `category` (ascending), `isActive` (ascending)

---

### `/redemptions/{redemptionId}`

Voucher redemption records.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  id: string;                    // Same as document ID
  userId: string;                // User ID (indexed)
  voucherId: string;             // Voucher ID
  pointsSpent: number;           // Points deducted
  redemptionCode: string;        // Unique redemption code
  status: RedemptionStatus;      // Redemption status (indexed)
  redeemedAt: Timestamp;         // Redemption time (indexed)
  usedAt?: Timestamp;            // When voucher was used
  expiresAt: Timestamp;          // Expiration time
}
```

**Indexes**:
- `userId` (ascending), `redeemedAt` (descending)
- `status` (ascending), `redeemedAt` (descending)

---

### `/badges/{badgeId}`

Badge definitions and unlock criteria.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  id: string;                    // Same as document ID
  name: string;                  // Badge name
  description: string;           // Badge description
  iconUrl: string;               // Badge icon URL
  criteria: {
    type: BadgeCriteriaType;     // Criteria type
    threshold: number;           // Threshold value
  };
  rarity: BadgeRarity;           // Badge rarity
}
```

---

### `/users/{userId}/earnedBadges/{badgeId}`

Badges earned by a user.

**Document ID**: Badge ID

**Fields**:
```typescript
{
  badgeId: string;
  earnedAt: Timestamp;
  progress?: number;             // Progress towards next tier
}
```

---

### `/leaderboard/{entryId}`

Computed leaderboard rankings (updated by Cloud Functions).

**Document ID**: User ID (for easy lookup)

**Fields**:
```typescript
{
  userId: string;                // User ID
  displayName: string;           // User display name
  photoURL?: string;             // User photo
  compassionPoints: number;      // Current points (indexed)
  rank: number;                  // Current rank (indexed)
  change: number;                // Rank change from previous period
  lastUpdated: Timestamp;        // Last update time
}
```

**Indexes**:
- `compassionPoints` (descending), `rank` (ascending)

**Note**: This collection is maintained by a scheduled Cloud Function that runs periodically.

---

### `/companies/{companyId}`

Company sponsor profiles.

**Document ID**: Auto-generated or Firebase Auth UID for company users

**Fields**:
```typescript
{
  id: string;                    // Same as document ID
  name: string;                  // Company name
  logo: string;                  // Logo URL
  description: string;           // Company description
  contactEmail: string;          // Contact email
  sponsoredMissions: string[];   // Array of mission IDs
  totalPointsSponsored: number;  // Total points funded
  csrGoals: {
    targetParticipants?: number;
    targetPoints?: number;
    targetMissions?: number;
  };
  createdAt: Timestamp;          // Account creation time
}
```

---

### `/analytics/{companyId}`

Aggregated analytics data for companies (computed by Cloud Functions).

**Document ID**: Company ID

**Fields**:
```typescript
{
  companyId: string;
  totalParticipants: number;
  totalPointsDistributed: number;
  totalMissionsSponsored: number;
  impactScore: number;
  participationOverTime: Array<{
    date: string;
    participants: number;
  }>;
  missionsByCategory: Array<{
    category: string;
    count: number;
  }>;
  geographicDistribution: Array<{
    city: string;
    participants: number;
  }>;
  lastUpdated: Timestamp;
}
```

**Note**: This collection is maintained by Cloud Functions triggered by mission completions.

---

## Security Rules Summary

- **Users**: Can read all profiles, update own profile (limited fields), admins can update any
- **Missions**: Can read published missions, admins can CRUD, system can update participant count
- **Points Transactions**: Immutable ledger, users can read own, only admins/system can create
- **Vouchers**: Can read active vouchers, admins can CRUD, system can decrement stock
- **Redemptions**: Users can read own, only system can create, limited updates allowed
- **Badges**: Anyone can read, only admins can CRUD
- **Leaderboard**: Anyone can read, only system can update
- **Companies**: Anyone can read, companies can update own (limited), admins can CRUD
- **Analytics**: Companies can read own, admins can read all, only system can write

## Cloud Functions Required

The following Cloud Functions are needed to maintain data integrity:

1. **onMissionJoin**: Update mission participant count, create participation record
2. **onMissionComplete**: Award points, create transaction, update user stats
3. **onVoucherRedeem**: Validate points, create redemption, deduct points, decrement stock
4. **updateLeaderboard**: Scheduled function to compute rankings
5. **awardBadges**: Check badge criteria and award badges automatically
6. **updateAnalytics**: Aggregate analytics data for companies

## Indexes to Create

Run these commands in Firebase Console or via Firebase CLI:

```bash
# User indexes
firebase firestore:indexes:create users --field email --order ascending
firebase firestore:indexes:create users --field compassionPoints --order descending
firebase firestore:indexes:create users --field role --order ascending

# Mission indexes
firebase firestore:indexes:create missions --field status --order ascending --field date --order ascending
firebase firestore:indexes:create missions --field category --order ascending --field date --order ascending
firebase firestore:indexes:create missions --field location.city --order ascending --field date --order ascending
firebase firestore:indexes:create missions --field sponsorId --order ascending --field date --order descending

# Points transaction indexes
firebase firestore:indexes:create pointsTransactions --field userId --order ascending --field timestamp --order descending
firebase firestore:indexes:create pointsTransactions --field type --order ascending --field timestamp --order descending

# Voucher indexes
firebase firestore:indexes:create vouchers --field isActive --order ascending --field pointsCost --order ascending
firebase firestore:indexes:create vouchers --field category --order ascending --field isActive --order ascending

# Redemption indexes
firebase firestore:indexes:create redemptions --field userId --order ascending --field redeemedAt --order descending
firebase firestore:indexes:create redemptions --field status --order ascending --field redeemedAt --order descending

# Leaderboard indexes
firebase firestore:indexes:create leaderboard --field compassionPoints --order descending --field rank --order ascending
```

## Data Migration Notes

When deploying to production:

1. Deploy Firestore security rules first
2. Create required indexes (may take several minutes)
3. Deploy Cloud Functions
4. Seed initial data (badges, sample vouchers)
5. Test with a small user group before full rollout
