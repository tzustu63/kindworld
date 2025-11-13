# Firebase Cloud Functions Deployment Guide

## Prerequisites

1. **Firebase CLI**: Install globally
```bash
npm install -g firebase-tools
```

2. **Firebase Project**: Ensure you have a Firebase project set up
```bash
firebase login
firebase projects:list
```

3. **Node.js**: Version 18 or higher
```bash
node --version
```

## Initial Setup

### 1. Initialize Firebase (if not already done)

```bash
# From project root
firebase init functions
```

Select:
- Use existing project
- TypeScript
- ESLint (optional)
- Install dependencies

### 2. Install Dependencies

```bash
cd functions
npm install
```

### 3. Configure Environment

Set up any required environment variables:
```bash
firebase functions:config:set partner.api.key="your-api-key"
firebase functions:config:set partner.api.url="https://api.partner.com"
```

View current config:
```bash
firebase functions:config:get
```

## Local Development

### 1. Start Firebase Emulators

```bash
# From project root
firebase emulators:start
```

This starts:
- Functions emulator (http://localhost:5001)
- Firestore emulator (http://localhost:8080)
- Auth emulator (http://localhost:9099)

### 2. Test Functions Locally

Use the Functions shell:
```bash
cd functions
npm run shell
```

Example test calls:
```javascript
// Test joinMission
joinMission({ missionId: 'test-mission-id' })

// Test redeemVoucher
redeemVoucher({ voucherId: 'test-voucher-id' })

// Test getTopLeaderboard
getTopLeaderboard({ limit: 10 })
```

### 3. Build TypeScript

```bash
cd functions
npm run build
```

## Deployment

### Deploy All Functions

```bash
# From project root
firebase deploy --only functions
```

### Deploy Specific Function

```bash
firebase deploy --only functions:joinMission
firebase deploy --only functions:redeemVoucher
```

### Deploy Multiple Functions

```bash
firebase deploy --only functions:joinMission,functions:completeMission
```

## Firestore Setup

### 1. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### 2. Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

### 3. Deploy Everything

```bash
firebase deploy
```

## Required Firestore Indexes

Add these to `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "pointsTransactions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "missions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "redemptions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "redeemedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "redemptions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "expiresAt", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "rankings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "rank", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "role", "order": "ASCENDING" },
        { "fieldPath": "compassionPoints", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "updatedAt", "order": "DESCENDING" },
        { "fieldPath": "role", "order": "ASCENDING" }
      ]
    }
  ]
}
```

## Monitoring

### View Logs

Real-time logs:
```bash
firebase functions:log
```

Specific function logs:
```bash
firebase functions:log --only joinMission
```

### Firebase Console

Monitor functions at:
https://console.firebase.google.com/project/YOUR_PROJECT_ID/functions

View:
- Invocations
- Execution time
- Memory usage
- Error rate
- Logs

## Troubleshooting

### Build Errors

```bash
cd functions
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Fails

1. Check Firebase CLI version:
```bash
firebase --version
```

2. Update if needed:
```bash
npm install -g firebase-tools
```

3. Re-authenticate:
```bash
firebase logout
firebase login
```

### Function Timeout

Increase timeout in function definition:
```typescript
export const myFunction = functions
  .runWith({ timeoutSeconds: 540 }) // Max 9 minutes
  .https.onCall(async (data, context) => {
    // ...
  });
```

### Memory Issues

Increase memory allocation:
```typescript
export const myFunction = functions
  .runWith({ memory: '2GB' })
  .https.onCall(async (data, context) => {
    // ...
  });
```

## Cost Management

### Optimize Function Execution

1. **Minimize cold starts**: Keep functions warm with scheduled pings
2. **Batch operations**: Process multiple items in single invocation
3. **Use appropriate memory**: Don't over-allocate
4. **Set timeouts**: Prevent runaway functions

### Monitor Costs

View costs at:
https://console.firebase.google.com/project/YOUR_PROJECT_ID/usage

### Free Tier Limits

- 2M invocations/month
- 400,000 GB-seconds/month
- 200,000 CPU-seconds/month
- 5GB outbound networking/month

## Security

### IAM Roles

Ensure proper IAM roles are set:
```bash
firebase projects:list
firebase functions:config:get
```

### Environment Variables

Never commit sensitive data. Use Firebase config:
```bash
firebase functions:config:set api.key="secret"
```

Access in code:
```typescript
const apiKey = functions.config().api.key;
```

## Rollback

If deployment causes issues:

1. View deployment history in Firebase Console
2. Rollback to previous version
3. Or redeploy previous code:
```bash
git checkout <previous-commit>
firebase deploy --only functions
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Functions
on:
  push:
    branches: [main]
    paths:
      - 'functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
        working-directory: functions
      - run: npm run build
        working-directory: functions
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Best Practices

1. **Test locally first**: Always use emulators before deploying
2. **Gradual rollout**: Deploy to staging before production
3. **Monitor after deployment**: Watch logs and metrics
4. **Version control**: Tag releases in git
5. **Documentation**: Keep this guide updated
6. **Error handling**: Implement comprehensive error handling
7. **Logging**: Use structured logging for debugging
8. **Performance**: Monitor and optimize slow functions

## Support

- Firebase Documentation: https://firebase.google.com/docs/functions
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: Tag with `firebase` and `google-cloud-functions`
