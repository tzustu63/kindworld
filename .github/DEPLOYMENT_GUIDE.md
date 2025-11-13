# Quick Deployment Guide

## Deploying to Staging

### iOS TestFlight
```bash
# Option 1: Push to develop branch
git checkout develop
git merge feature-branch
git push origin develop

# Option 2: Create beta tag
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1

# Option 3: Manual trigger via GitHub Actions UI
```

### Android Internal Testing
```bash
# Option 1: Push to develop branch
git checkout develop
git merge feature-branch
git push origin develop

# Option 2: Create beta tag
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1

# Option 3: Manual trigger via GitHub Actions UI
```

## Deploying to Production

### Prerequisites
- All tests passing
- Code reviewed and approved
- Tested in staging environment
- Release notes prepared

### iOS App Store
```bash
# Create production tag
git checkout main
git tag v1.0.0
git push origin v1.0.0

# Workflow will:
# 1. Build the app
# 2. Upload to App Store Connect
# 3. Create GitHub release
# 4. Send notification
```

### Android Google Play
```bash
# Create production tag
git checkout main
git tag v1.0.0
git push origin v1.0.0

# Workflow will:
# 1. Build the app
# 2. Upload to Google Play (10% rollout)
# 3. Create GitHub release
# 4. Send notification
```

## Version Numbering

### Semantic Versioning
- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New features (v1.1.0)
- **PATCH**: Bug fixes (v1.0.1)

### Beta Versions
- Format: `v1.0.0-beta.1`
- Increment beta number for each staging release

### Build Numbers
- Automatically incremented by CI/CD
- Based on GitHub Actions run number

## Monitoring Deployments

### GitHub Actions
1. Go to repository Actions tab
2. Select the workflow
3. View real-time logs
4. Download artifacts if needed

### TestFlight (iOS)
1. Open App Store Connect
2. Go to TestFlight tab
3. Check build status
4. Add testers if needed

### Google Play Console (Android)
1. Open Google Play Console
2. Go to Release > Testing > Internal testing
3. Check build status
4. Manage testers

## Rollback Procedures

### iOS
1. Go to App Store Connect
2. Select previous version
3. Submit for review
4. Or remove current version from sale

### Android
1. Go to Google Play Console
2. Create new release with previous version
3. Or halt rollout of current version
4. Or increase rollout percentage gradually

## Emergency Hotfix

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug

# Make fixes and test
# ...

# Merge to main
git checkout main
git merge hotfix/critical-bug

# Create patch version tag
git tag v1.0.1
git push origin v1.0.1

# Also merge to develop
git checkout develop
git merge hotfix/critical-bug
git push origin develop
```

## Common Commands

### Check Current Version
```bash
# iOS
cd ios
agvtool what-version

# Android
cd android
grep versionName app/build.gradle
```

### Local Fastlane Testing

```bash
# iOS
cd ios
bundle exec fastlane beta

# Android
cd android
bundle exec fastlane deploy_internal
```

### View Workflow Status
```bash
# Using GitHub CLI
gh run list
gh run view <run-id>
gh run watch <run-id>
```

## Troubleshooting

### Build Failing
1. Check GitHub Actions logs
2. Verify all secrets are set
3. Test locally with Fastlane
4. Check for dependency issues

### Upload Failing
1. Verify API credentials
2. Check version numbers
3. Ensure certificates are valid
4. Review App Store Connect/Play Console

### Need Help?
- Check CI_CD_SETUP.md for detailed documentation
- Review workflow logs
- Contact DevOps team
