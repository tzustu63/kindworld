# Firestore Security Rules Implementation

## Overview

This document describes the comprehensive Firestore security rules implemented for the KindWorld mobile application. The security rules enforce authentication, authorization, role-based access control (RBAC), and data validation across all collections.

## Requirements Coverage

This implementation addresses the following requirements:

- **Requirement 1.4**: User authentication and session management
- **Requirement 1.5**: Secure user data access with field-level protection
- **Requirement 6.1**: Company sponsor access control for CSR analytics
- **Requirement 7.1**: Admin mission management with validation

## Architecture

### Security Layers

1. **Authentication Layer**: Verifies user identity via Firebase Auth
2. **Authorization Layer**: Role-based access control (user, admin, company)
3. **Validation Layer**: Input validation and business rule enforcement
4. **Audit Layer**: Immutable transaction logs and timestamps

### Role Hierarchy

```
Admin (Full Access)
  ├── Can manage all resources
  ├── Can create/update/delete missions
  ├── Can create points transactions
  ├── Can award badges
  └── Can manage companies

Company (Limited Access)
  ├── Can read own analytics
  ├── Can read sponsored missions
  └── Can update own profile (limited fields)

User (Standard Access)
  ├── Can read public data
  ├── Can update own profile (limited fields)
  ├── Can join missions
  └── Can redeem vouchers
```

## Collection Security Rules

### 1. Users Collection

**Read Access:**
- All authenticated users can read user profiles (for leaderboard display)

**Write Access:**
- Users can create their own profile during signup
- Users can update their own profile (limited fields only)
- Admins can update any user profile
- Only admins can delete users

**Protected Fields (Users Cannot Modify):**
- `id` - User identifier
- `email` - Email address
- `role` - User role (user/admin/company)
- `compassionPoints` - Points balance
- `totalVolunteerHours` - Volunteer hours
- `createdAt` - Account creation timestamp

**Validation Rules:**
- Email must match valid format
- Display name: 1-100 characters (required)
- Bio: max 500 characters
- Initial points and volunteer hours must be 0
- New users must have role='user'

### 2. Missions Collection

**Read Access:**
- All authenticated users can read published/ongoing/completed missions
- Admins can read all missions (including drafts)
- Companies can read their sponsored missions

**Write Access:**
- Only admins can create missions
- Only admins can update/delete missions
- System can update participant count via Cloud Functions

**Creation Validation:**
- Title: 1-200 characters (required)
- Description: 1-2000 characters (required)
- Points reward: 1-10,000 points
- Status: must be 'draft' or 'published'
- Category: must be valid enum (volunteer, donation, charity, blood_drive, other)
- Date: must be in the future
- Location: address and city required
- Current participants: must start at 0
- Created by: must match authenticated admin

**Update Validation:**
- Status transitions validated (draft→published→ongoing→completed)
- Creator cannot be changed
- Points reward: 1-10,000 if modified
- Title/description length validated if modified

**Status Transition Rules:**
```
draft → published, cancelled
published → ongoing, cancelled
ongoing → completed, cancelled
completed → completed (no change)
cancelled → cancelled (no change)
```

### 3. Mission Participants Subcollection

**Read Access:**
- Users can read their own participation records
- Admins can read all participants

**Write Access:**
- Users can join missions (create participation record)
- Users can update their own participation status
- Admins can update any participation

**Validation Rules:**
- Users can only join published or ongoing missions
- Status transitions: joined → completed or cancelled
- Cannot modify userId or missionId after creation

### 4. Points Transactions Collection

**Read Access:**
- Users can read their own transactions
- Admins can read all transactions

**Write Access:**
- Only admins can create transactions
- No updates or deletes allowed (immutable ledger)

**Validation Rules:**
- Amount must be non-zero integer
- Amount range: -100,000 to +100,000
- Type must be valid enum (mission_completion, voucher_redemption, bonus, adjustment)
- Description: 1-500 characters (required)
- Timestamp required

**Transaction Types:**
- `mission_completion`: Points earned from completing missions (positive)
- `voucher_redemption`: Points spent on vouchers (negative)
- `bonus`: Bonus points awarded (positive)
- `adjustment`: Manual adjustment by admin (positive or negative)

### 5. Vouchers Collection

**Read Access:**
- All authenticated users can read active vouchers
- Admins can read all vouchers

**Write Access:**
- Only admins can create vouchers
- Admins can update vouchers
- System can decrement stock by 1 (for redemptions)
- Only admins can delete vouchers

**Creation Validation:**
- Brand name: 1-100 characters (required)
- Title: 1-200 characters (required)
- Points cost: 1-100,000 points
- Monetary value: must be positive
- Stock: must be non-negative
- Category: must be valid enum (7-eleven, familymart, px-mart, other)
- isActive: must be boolean

**Update Validation:**
- Points cost: 1-100,000 if modified
- Stock: must be non-negative if modified

### 6. Redemptions Collection

**Read Access:**
- Users can read their own redemptions
- Admins can read all redemptions

**Write Access:**
- Only admins/system can create redemptions
- System can update redemption status
- No deletes allowed

**Creation Validation:**
- User must have sufficient points
- Voucher must be active
- Voucher must have stock > 0
- Redemption code: 6-50 characters (required)
- Expiry date must be after redemption date
- Status must be 'pending' on creation

**Status Transition Rules:**
```
pending → issued, expired
issued → used, expired
used → used (no change)
expired → expired (no change)
```

### 7. Badges Collection

**Read Access:**
- All authenticated users can read badges

**Write Access:**
- Only admins can create badges
- Only admins can update badges
- Only admins can delete badges

**Validation Rules:**
- Name: 1-100 characters (required)
- Description: 1-500 characters (required)
- Criteria type: must be valid enum (hours, missions, points, streak)
- Threshold: 1-1,000,000
- Rarity: must be valid enum (common, rare, epic, legendary)

### 8. User Badges Subcollection

**Read Access:**
- Users can read their own badges
- All authenticated users can read badges (for profile display)

**Write Access:**
- Only admins/system can award badges
- No updates or deletes allowed (immutable)

**Validation Rules:**
- Badge must exist before awarding
- Earned timestamp required

### 9. Leaderboard Collection

**Read Access:**
- All authenticated users can read leaderboard

**Write Access:**
- Only system (Cloud Functions) can update leaderboard
- No manual writes allowed

### 10. Companies Collection

**Read Access:**
- All authenticated users can read company info
- Company users can read their own company data

**Write Access:**
- Only admins can create companies
- Companies can update their own profile (limited fields)
- Admins can update any company
- Only admins can delete companies

**Protected Fields (Companies Cannot Modify):**
- `id` - Company identifier
- `createdAt` - Creation timestamp
- `totalPointsSponsored` - Total points (system managed)

**Creation Validation:**
- Name: 1-200 characters (required)
- Contact email: valid format (required)
- Total points sponsored: must start at 0

**Update Validation:**
- Description: max 1000 characters

### 11. Analytics Collection

**Read Access:**
- Companies can read their own analytics
- Admins can read all analytics

**Write Access:**
- Only system (Cloud Functions) can write analytics
- No manual writes allowed

## Helper Functions

The security rules include several helper functions for common checks:

### Authentication Helpers
- `isAuthenticated()`: Checks if user is logged in
- `isOwner(userId)`: Checks if user owns the resource
- `isAdmin()`: Checks if user has admin role
- `isCompany()`: Checks if user has company role
- `isAdminOrCompany()`: Checks if user is admin or company

### Validation Helpers
- `isValidEmail(email)`: Validates email format
- `isValidPointsAmount(amount)`: Validates points amount
- `isNonEmptyString(value)`: Checks for non-empty strings
- `isValidMissionStatusTransition(old, new)`: Validates mission status changes
- `isFutureTimestamp(timestamp)`: Checks if timestamp is in future
- `hasSufficientPoints(userId, cost)`: Checks if user has enough points

## Client-Side Validation

The `src/utils/firestoreValidation.ts` file provides client-side validation that mirrors the security rules. This provides immediate feedback to users before attempting operations that would be rejected by security rules.

### Usage Example

```typescript
import { validators } from '@/utils/firestoreValidation';

// Validate mission creation
const result = validators.mission.validateCreation({
  title: 'Beach Cleanup',
  description: 'Help clean up the local beach',
  pointsReward: 100,
  status: 'published',
  category: 'volunteer',
  date: new Date('2025-12-01'),
  location: {
    address: '123 Beach St',
    city: 'Taipei',
  },
});

if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

## Security Best Practices

### 1. Principle of Least Privilege
Users only have access to data they need. Default deny with explicit allow rules.

### 2. Immutable Ledgers
Critical data like transactions and badges cannot be modified or deleted once created.

### 3. Input Validation
All user inputs are validated for:
- Type correctness
- Length constraints
- Format requirements
- Business rule compliance

### 4. Status Transitions
State machines prevent invalid status changes for missions and redemptions.

### 5. Resource Verification
Cross-document checks ensure referenced resources exist before allowing operations.

### 6. Audit Trail
All operations include timestamps and user IDs for audit purposes.

## Testing

### Local Testing with Firebase Emulator

```bash
# Start Firebase emulator
firebase emulators:start

# Test security rules
firebase emulators:exec --only firestore "npm test"
```

### Manual Testing Checklist

- [ ] Unauthenticated users cannot access any data
- [ ] Users can only modify their own profiles
- [ ] Users cannot change protected fields (points, role, email)
- [ ] Only admins can create missions
- [ ] Mission validation rules are enforced
- [ ] Users can only join published/ongoing missions
- [ ] Points transactions are immutable
- [ ] Voucher redemption checks sufficient points
- [ ] Voucher redemption checks stock availability
- [ ] Companies can only access their own analytics
- [ ] Badge awarding is restricted to admins
- [ ] Status transitions are validated

## Monitoring & Alerts

### Recommended Monitoring

1. **Failed Authentication Attempts**: Track repeated failures
2. **Unauthorized Access Attempts**: Alert on permission denied errors
3. **Invalid Data Validation Failures**: Monitor validation errors
4. **Unusual Transaction Patterns**: Detect potential fraud
5. **Stock Depletion**: Alert when vouchers run low

### Firebase Console Monitoring

- Navigate to Firestore → Rules → Metrics
- Monitor read/write operations
- Track permission denied errors
- Review rule evaluation performance

## Deployment

### Deploy Security Rules

```bash
# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy with indexes
firebase deploy --only firestore
```

### Rollback

```bash
# View rule history
firebase firestore:rules:list

# Rollback to previous version
firebase firestore:rules:release <release-id>
```

## Troubleshooting

### Common Issues

**Issue**: Permission denied errors
- **Solution**: Check user authentication status and role
- **Debug**: Enable Firestore debug logging in Firebase Console

**Issue**: Validation failures
- **Solution**: Review validation error messages
- **Debug**: Use client-side validators for immediate feedback

**Issue**: Status transition errors
- **Solution**: Verify current status before attempting transition
- **Debug**: Check status transition rules in documentation

## Future Enhancements

1. **Rate Limiting**: Implement per-user rate limits for redemptions
2. **Geolocation Validation**: Verify user location for location-based missions
3. **Time-Based Access**: Restrict access based on time windows
4. **Advanced Fraud Detection**: ML-based anomaly detection
5. **Automated Testing**: CI/CD integration for security rule testing

## Support

For questions or issues related to security rules:
1. Review this documentation
2. Check Firebase Console for error details
3. Review client-side validation errors
4. Contact the development team

## References

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Best Practices](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Testing Security Rules](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
