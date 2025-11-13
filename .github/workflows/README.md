# GitHub Actions Workflows

This directory contains all CI/CD workflows for the KindWorld mobile application.

## Workflow Status

[![CI](https://github.com/YOUR_ORG/kindworld/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/kindworld/actions/workflows/ci.yml)
[![Deploy iOS Staging](https://github.com/YOUR_ORG/kindworld/actions/workflows/deploy-ios-staging.yml/badge.svg)](https://github.com/YOUR_ORG/kindworld/actions/workflows/deploy-ios-staging.yml)
[![Deploy Android Staging](https://github.com/YOUR_ORG/kindworld/actions/workflows/deploy-android-staging.yml/badge.svg)](https://github.com/YOUR_ORG/kindworld/actions/workflows/deploy-android-staging.yml)

> **Note**: Replace `YOUR_ORG/kindworld` with your actual GitHub organization and repository name.

## Available Workflows

### 1. CI (`ci.yml`)
Runs on every pull request and push to main/develop branches.

**Jobs**:
- Lint code with ESLint
- Type check with TypeScript
- Run Jest tests with coverage
- Build Android debug APK
- Build iOS for simulator

**Duration**: ~10-15 minutes

### 2. Deploy iOS Staging (`deploy-ios-staging.yml`)
Deploys to TestFlight for internal testing.

**Triggers**:
- Push to `develop` branch
- Tags matching `v*-beta*`
- Manual dispatch

**Duration**: ~20-30 minutes

### 3. Deploy Android Staging (`deploy-android-staging.yml`)
Deploys to Google Play Internal Testing.

**Triggers**:
- Push to `develop` branch
- Tags matching `v*-beta*`
- Manual dispatch

**Duration**: ~15-20 minutes

### 4. Deploy iOS Production (`deploy-ios-production.yml`)
Deploys to App Store.

**Triggers**:
- Tags matching `v*` (excluding beta)
- Manual dispatch

**Requires**: Production environment approval

**Duration**: ~25-35 minutes

### 5. Deploy Android Production (`deploy-android-production.yml`)
Deploys to Google Play Production with staged rollout.

**Triggers**:
- Tags matching `v*` (excluding beta)
- Manual dispatch

**Requires**: Production environment approval

**Duration**: ~20-25 minutes

## Quick Actions

### Run CI Manually
```bash
gh workflow run ci.yml
```

### Deploy to Staging
```bash
# iOS
gh workflow run deploy-ios-staging.yml

# Android
gh workflow run deploy-android-staging.yml
```

### Deploy to Production
```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0

# Or manually trigger
gh workflow run deploy-ios-production.yml
gh workflow run deploy-android-production.yml
```

### View Workflow Runs
```bash
# List recent runs
gh run list

# View specific run
gh run view <run-id>

# Watch run in real-time
gh run watch <run-id>
```

## Workflow Dependencies

### Required Tools
- Node.js 18+
- Ruby 3.2+
- Java 17 (Android)
- Xcode (iOS, macOS only)
- Fastlane
- CocoaPods (iOS)

### Required Secrets
See [SECRETS_TEMPLATE.md](../SECRETS_TEMPLATE.md) for complete list.

## Troubleshooting

### Workflow Fails on Lint
```bash
# Run locally to fix
npm run lint
npx tsc --noEmit
```

### Workflow Fails on Tests
```bash
# Run locally to debug
npm test
```

### Workflow Fails on Build
```bash
# iOS
cd ios && bundle exec fastlane beta

# Android
cd android && bundle exec fastlane deploy_internal
```

### Workflow Fails on Upload
- Check secrets are correctly configured
- Verify certificates/keystores are valid
- Check App Store Connect/Play Console status

## Monitoring

### GitHub Actions Dashboard
View all workflow runs: `https://github.com/YOUR_ORG/kindworld/actions`

### Notifications
- GitHub notifications for workflow failures
- Slack notifications (if configured)
- Email notifications (configurable in GitHub settings)

## Best Practices

1. **Always run CI locally before pushing**
   ```bash
   npm run lint
   npm test
   ```

2. **Test staging before production**
   - Deploy to staging first
   - Verify functionality
   - Get stakeholder approval

3. **Monitor deployments**
   - Watch workflow logs
   - Check crash reports
   - Monitor analytics

4. **Use semantic versioning**
   - MAJOR.MINOR.PATCH
   - Beta tags for staging

5. **Keep secrets updated**
   - Rotate regularly
   - Document changes
   - Test after rotation

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [CI/CD Setup Guide](../../CI_CD_SETUP.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Secrets Template](../SECRETS_TEMPLATE.md)

## Support

For issues or questions:
1. Check workflow logs
2. Review documentation
3. Contact DevOps team
4. Create issue with `ci-cd` label
