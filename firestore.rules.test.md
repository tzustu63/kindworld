# Firestore Security Rules Test Documentation

This document outlines the security rules implemented for the KindWorld application and provides test scenarios to validate them.

## Overview

The Firestore security rules implement comprehensive access control and data validation for:
- User authentication and authorization (Requirements 1.4, 1.5)
- Role-based access control for admin and company features (Requirements 6.1, 7.1)
- Mission creation and updates validation
- Points transactions and voucher redemptions security

## Security Features Implemented

### 1. Authentication & Authorization

#### User Data Access (Requirement 1.4, 1.5)
- ✅ All authenticated users can read user profiles (for leaderboard)
- ✅ Users can only create their own profile with role='user'
- ✅ Users can only update their own profile (limited fields)
- ✅ Users cannot modify: email, role, points, volunteer hours, createdAt
- ✅ Admins can update any user profile
- ✅ Only admins can delete users

**Validation Rules:**
- Email must be valid format
- Display name: 1-100 characters
- Bio: max 500 characters
- Initial points and volunteer hours must be 0

### 2. Role-Based Access Control

#### Admin Features (Requirement 7.1)
- ✅ Only admins can create missions
- ✅ Only admins can update/delete missions
- ✅ Only admins can create/update/delete vouchers
- ✅ Only admins can create/update/delete badges
- ✅ Only admins can create companies
- ✅ Only admins can create points transactions
- ✅ Only admins can award badges to users

#### Company Features (Requirement 6.1)
- ✅ Companies can read their own analytics
- ✅ Companies can read their sponsored missions
- ✅ Companies can update their own profile (limited fields)
- ✅ Companies cannot modify totalPointsSponsored

### 3. Mission Management (Requirement 7.1)

#### Mission Creation Validation
- ✅ Title: 1-200 characters (required)
- ✅ Description: 1-2000 characters (required)
- ✅ Points reward: 1-10,000 points
- ✅ Status: must be 'draft' or 'published' on creation
- ✅ Category: must be valid enum value
- ✅ Date: must be in the future
- ✅ Location: address and city required
- ✅ Current participants: must start at 0
- ✅ Created by: must match authenticated admin

#### Mission Update Validation
- ✅ Status transitions validated (draft→published→ongoing→completed)
- ✅ Creator cannot be changed
- ✅ Points reward: 1-10,000 if modified
- ✅ Title/description length validated if modified

#### Mission Participation
- ✅ Users can only join published or ongoing missions
- ✅ Users can only create their own participation records
- ✅ Status transitions: joined→completed or cancelled
- ✅ Admins can update any participation

### 4. Points System (Requirement 1.4, 1.5)

#### Points Transactions
- ✅ Only admins can create transactions
- ✅ Amount must be non-zero integer
- ✅ Amount range: -100,000 to +100,000
- ✅ Type must be valid enum
- ✅ Description: 1-500 characters (required)
- ✅ Timestamp required
- ✅ Transactions are immutable (no updates/deletes)

#### Transaction Types
- mission_completion (positive)
- voucher_redemption (negative)
- bonus (positive)
- adjustment (positive or negative)

### 5. Voucher System (Requirement 4.4, 4.5)

#### Voucher Creation Validation
- ✅ Brand name: 1-100 characters (required)
- ✅ Title: 1-200 characters (required)
- ✅ Points cost: 1-100,000 points
- ✅ Monetary value: must be positive
- ✅ Stock: must be non-negative
- ✅ Category: must be valid enum
- ✅ isActive: must be boolean

#### Voucher Updates
- ✅ Points cost: 1-100,000 if modified
- ✅ Stock: must be non-negative if modified
- ✅ System can decrement stock by 1 (for redemptions)

#### Redemption Validation
- ✅ User must have sufficient points
- ✅ Voucher must be active
- ✅ Voucher must have stock > 0
- ✅ Redemption code: 6-50 characters (required)
- ✅ Expiry date must be after redemption date
- ✅ Status must be 'pending' on creation
- ✅ Status transitions validated (pending→issued→used or expired)
- ✅ Redemptions cannot be deleted

### 6. Badge System

#### Badge Creation
- ✅ Name: 1-100 characters (required)
- ✅ Description: 1-500 characters (required)
- ✅ Criteria type: must be valid enum
- ✅ Threshold: 1-1,000,000
- ✅ Rarity: must be valid enum

#### Badge Awarding
- ✅ Only admins/system can award badges
- ✅ Badge must exist before awarding
- ✅ Earned timestamp required
- ✅ Badges are immutable once awarded

### 7. Company Management

#### Company Creation
- ✅ Name: 1-200 characters (required)
- ✅ Contact email: valid format (required)
- ✅ Total points sponsored: must start at 0

#### Company Updates
- ✅ Companies can update description (max 1000 chars)
- ✅ Companies cannot modify totalPointsSponsored
- ✅ Admins can update any company field

### 8. Analytics & Leaderboard

#### Analytics Access
- ✅ Companies can only read their own analytics
- ✅ Admins can read all analytics
- ✅ Only system can write analytics (via Cloud Functions)

#### Leaderboard
- ✅ All authenticated users can read leaderboard
- ✅ Only system can update leaderboard (via Cloud Functions)

## Test Scenarios

### Authentication Tests

```javascript
// Test 1: Unauthenticated user cannot read data
// Expected: DENIED

// Test 2: User can create own profile with valid data
// Expected: ALLOWED

// Test 3: User cannot create profile with role='admin'
// Expected: DENIED

// Test 4: User cannot create profile with initial points > 0
// Expected: DENIED
```

### Mission Tests

```javascript
// Test 5: Admin can create mission with valid data
// Expected: ALLOWED

// Test 6: Regular user cannot create mission
// Expected: DENIED

// Test 7: Admin cannot create mission with points > 10,000
// Expected: DENIED

// Test 8: Admin cannot create mission with past date
// Expected: DENIED

// Test 9: User can join published mission
// Expected: ALLOWED

// Test 10: User cannot join draft mission
// Expected: DENIED
```

### Points Transaction Tests

```javascript
// Test 11: Admin can create valid transaction
// Expected: ALLOWED

// Test 12: Regular user cannot create transaction
// Expected: DENIED

// Test 13: Cannot update existing transaction
// Expected: DENIED

// Test 14: Cannot delete transaction
// Expected: DENIED
```

### Voucher Redemption Tests

```javascript
// Test 15: User with sufficient points can redeem voucher
// Expected: ALLOWED

// Test 16: User without sufficient points cannot redeem
// Expected: DENIED

// Test 17: Cannot redeem inactive voucher
// Expected: DENIED

// Test 18: Cannot redeem voucher with 0 stock
// Expected: DENIED
```

### Role-Based Access Tests

```javascript
// Test 19: Company can read own analytics
// Expected: ALLOWED

// Test 20: Company cannot read other company's analytics
// Expected: DENIED

// Test 21: Admin can read all analytics
// Expected: ALLOWED

// Test 22: Regular user cannot read analytics
// Expected: DENIED
```

## Security Best Practices Implemented

1. **Principle of Least Privilege**: Users only have access to data they need
2. **Immutable Ledgers**: Transactions and badges cannot be modified/deleted
3. **Input Validation**: All user inputs are validated for type, length, and format
4. **Status Transitions**: State machines prevent invalid status changes
5. **Resource Verification**: Cross-document checks ensure referenced resources exist
6. **Rate Limiting**: Enforced through Firebase quotas
7. **Audit Trail**: All operations logged with timestamps and user IDs

## Requirements Coverage

✅ **Requirement 1.4**: User authentication and session management
- Implemented via Firebase Auth integration
- Session validation on all requests
- Secure token management

✅ **Requirement 1.5**: Secure user data access
- Users can only modify their own profiles
- Protected fields (points, role, email) cannot be changed by users
- Admin override for support scenarios

✅ **Requirement 6.1**: Company sponsor access control
- Companies can only access their own data
- Analytics restricted to sponsored missions
- Cannot modify point totals

✅ **Requirement 7.1**: Admin mission management
- Only admins can create/update/delete missions
- Comprehensive validation on all mission fields
- Status transition controls prevent invalid states

## Testing with Firebase Emulator

To test these rules locally:

```bash
# Start Firebase emulator
firebase emulators:start

# Run security rules tests (if implemented)
firebase emulators:exec --only firestore "npm test"
```

## Monitoring & Alerts

Recommended monitoring:
1. Failed authentication attempts
2. Unauthorized access attempts
3. Invalid data validation failures
4. Unusual transaction patterns
5. Stock depletion on vouchers

## Future Enhancements

1. Rate limiting per user for redemptions
2. Geolocation validation for missions
3. Time-based access controls
4. Advanced fraud detection rules
5. Automated security rule testing in CI/CD
