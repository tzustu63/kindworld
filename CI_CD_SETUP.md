# CI/CD Pipeline Setup Guide

This document describes the CI/CD pipeline configuration for the KindWorld mobile application.

## Overview

The CI/CD pipeline is built using GitHub Actions and Fastlane, providing automated builds, testing, and deployments for both iOS and Android platforms.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Trigger**: Pull requests and pushes to `main` and `develop` branches

**Jobs**:
- **Lint**: Runs ESLint and TypeScript type checking
- **Test**: Executes Jest tests with coverage reporting
- **Build Android**: Builds debug APK for Android
- **Build iOS**: Builds iOS app for simulator

**Purpose**: Ensures code quality and prevents broken builds from being merged.

### 2. iOS Staging Deployment (`deploy-ios-staging.yml`)

**Trigger**: 
- Pushes to `develop` branch
- Tags matching `v*-beta*` pattern
- Manual workflow dispatch

**Deployment Target**: TestFlight (Internal Testing)

**Steps**:
1. Install dependencies and CocoaPods
2. Import code signing certificates
3. Increment build number
4. Build and archive the app
5. Upload to TestFlight
6. Send Slack notification

### 3. Android Staging Deployment (`deploy-android-staging.yml`)

**Trigger**:
- Pushes to `develop` branch
- Tags matching `v*-beta*` pattern
- Manual workflow dispatch

**Deployment Target**: Google Play Internal Testing

**Steps**:
1. Install dependencies
2. Decode and setup keystore
3. Increment version code
4. Build release AAB
5. Upload to Google Play Internal Testing
6. Send Slack notification

### 4. iOS Production Deployment (`deploy-ios-production.yml`)

**Trigger**:
- Tags matching `v*` (excluding beta tags)
- Manual workflow dispatch

**Deployment Target**: App Store

**Environment**: `production` (requires manual approval)

**Steps**:
1. Install dependencies and CocoaPods
2. Import production code signing certificates
3. Increment build number
4. Build and archive the app
5. Upload to App Store Connect
6. Create GitHub release
7. Send Slack notification

### 5. Android Production Deployment (`deploy-android-production.yml`)

**Trigger**:
- Tags matching `v*` (excluding beta tags)
- Manual workflow dispatch

**Deployment Target**: Google Play Production (10% staged rollout)

**Environment**: `production` (requires manual approval)

**Steps**:
1. Install dependencies
2. Decode and setup production keystore
3. Increment version code
4. Build release AAB
5. Upload to Google Play Production with staged rollout
6. Create GitHub release
7. Send Slack notification

## Required Secrets

### GitHub Repository Secrets

#### iOS Secrets
- `APPLE_ID`: Apple Developer account email
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password for App Store Connect
- `APP_STORE_CONNECT_API_KEY_ID`: App Store Connect API key ID
- `APP_STORE_CONNECT_API_ISSUER_ID`: App Store Connect API issuer ID
- `APP_STORE_CONNECT_API_KEY`: App Store Connect API key (base64 encoded)
- `IOS_CERTIFICATES_P12`: Development/staging certificates (base64 encoded)
- `IOS_CERTIFICATES_PASSWORD`: Password for staging certificates
- `IOS_CERTIFICATES_P12_PROD`: Production certificates (base64 encoded)
- `IOS_CERTIFICATES_PASSWORD_PROD`: Password for production certificates
- `IOS_PROVISIONING_PROFILE_STAGING`: Staging provisioning profile (base64 encoded)
- `IOS_PROVISIONING_PROFILE_PROD`: Production provisioning profile (base64 encoded)
- `IOS_KEYCHAIN_PASSWORD`: Temporary keychain password
- `MATCH_PASSWORD`: Fastlane Match password (if using Match)
- `FASTLANE_TEAM_ID`: Apple Developer Team ID

#### Android Secrets
- `ANDROID_KEYSTORE_BASE64`: Staging keystore file (base64 encoded)
- `ANDROID_KEYSTORE_PASSWORD`: Staging keystore password
- `ANDROID_KEY_ALIAS`: Staging key alias
- `ANDROID_KEY_PASSWORD`: Staging key password
- `ANDROID_KEYSTORE_BASE64_PROD`: Production keystore file (base64 encoded)
- `ANDROID_KEYSTORE_PASSWORD_PROD`: Production keystore password
- `ANDROID_KEY_ALIAS_PROD`: Production key alias
- `ANDROID_KEY_PASSWORD_PROD`: Production key password
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`: Google Play service account JSON (base64 encoded)

#### Notification Secrets
- `SLACK_WEBHOOK_URL`: Slack webhook URL for deployment notifications (optional)

#### Other Secrets
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Setup Instructions

### Initial Setup

1. **Install Fastlane**:
   ```bash
   # iOS
   cd ios
   bundle install
   
   # Android
   cd android
   bundle install
   ```

2. **Configure iOS Code Signing**:
   - Create certificates in Apple Developer Portal
   - Create provisioning profiles for staging and production
   - Export certificates as .p12 files
   - Base64 encode certificates and profiles:
     ```bash
     base64 -i certificate.p12 -o certificate.txt
     base64 -i profile.mobileprovision -o profile.txt
     ```
   - Add to GitHub secrets

3. **Configure Android Signing**:
   - Generate release keystore:
     ```bash
     keytool -genkey -v -keystore release.keystore -alias kindworld -keyalg RSA -keysize 2048 -validity 10000
     ```
   - Base64 encode keystore:
     ```bash
     base64 -i release.keystore -o keystore.txt
     ```
   - Add to GitHub secrets

4. **Setup Google Play Service Account**:
   - Create service account in Google Cloud Console
   - Grant access in Google Play Console
   - Download JSON key file
   - Base64 encode and add to GitHub secrets

5. **Setup App Store Connect API Key**:
   - Generate API key in App Store Connect
   - Download .p8 file
   - Base64 encode and add to GitHub secrets

6. **Configure GitHub Environments** (optional):
   - Create `production` environment in repository settings
   - Add required reviewers for production deployments
   - Configure environment secrets if needed

### Running Workflows

#### Automatic Triggers

- **CI**: Automatically runs on all PRs and pushes to main/develop
- **Staging**: Automatically deploys when pushing to develop branch
- **Production**: Automatically deploys when creating a version tag

#### Manual Triggers

1. Go to Actions tab in GitHub repository
2. Select the workflow you want to run
3. Click "Run workflow"
4. Select branch and fill in any required inputs
5. Click "Run workflow" button

### Version Tagging

#### Staging/Beta Releases
```bash
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1
```

#### Production Releases
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Fastlane Configuration

### iOS Lanes

- `fastlane beta`: Build and upload to TestFlight
- `fastlane release`: Build and upload to App Store
- `fastlane certificates`: Download certificates and provisioning profiles
- `fastlane test`: Run unit tests

### Android Lanes

- `fastlane deploy_internal`: Deploy to Google Play Internal Testing
- `fastlane deploy_production`: Deploy to Google Play Production
- `fastlane promote_to_beta`: Promote Internal Testing build to Beta
- `fastlane test`: Run unit tests

## Monitoring and Notifications

### Build Status

- Check the Actions tab in GitHub for workflow status
- Each workflow provides detailed logs for debugging

### Slack Notifications

If configured, Slack notifications are sent for:
- ✅ Successful deployments
- ❌ Failed deployments

Notifications include:
- Platform (iOS/Android)
- Environment (Staging/Production)
- Build number
- Version tag (for production)

### Artifacts

Failed builds upload artifacts for debugging:
- Build logs
- Fastlane reports
- Test output

Successful builds upload:
- APK/AAB files (Android)
- Build logs

## Troubleshooting

### Common Issues

#### iOS Code Signing Errors
- Verify certificates are not expired
- Check provisioning profile matches bundle identifier
- Ensure keychain password is correct
- Verify team ID matches

#### Android Build Failures
- Check keystore password and alias
- Verify Gradle configuration
- Ensure service account has proper permissions

#### Upload Failures
- Verify API credentials are correct
- Check network connectivity
- Ensure version/build numbers are incremented

### Debug Steps

1. Check workflow logs in GitHub Actions
2. Review Fastlane output
3. Verify all secrets are correctly set
4. Test locally using Fastlane commands
5. Check Apple Developer/Google Play Console for errors

## Best Practices

1. **Branch Strategy**:
   - `main`: Production-ready code
   - `develop`: Staging/development code
   - Feature branches: New features and fixes

2. **Version Numbering**:
   - Follow semantic versioning (MAJOR.MINOR.PATCH)
   - Use beta tags for staging releases
   - Increment build numbers automatically

3. **Testing**:
   - All PRs must pass CI checks
   - Run tests locally before pushing
   - Review test coverage reports

4. **Deployments**:
   - Test in staging before production
   - Use staged rollouts for production (10% initially)
   - Monitor crash reports after deployment
   - Keep release notes updated

5. **Security**:
   - Never commit secrets to repository
   - Rotate credentials regularly
   - Use environment protection rules
   - Review access permissions periodically

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Review and rotate secrets quarterly
- Update Fastlane and GitHub Actions versions
- Monitor build times and optimize as needed
- Review and update documentation

### Certificate Renewal

iOS certificates expire annually:
1. Generate new certificates in Apple Developer Portal
2. Update provisioning profiles
3. Base64 encode new files
4. Update GitHub secrets
5. Test deployment workflow

### Keystore Management

Android keystores are valid for 25+ years, but:
- Keep secure backups
- Document passwords securely
- Never lose the production keystore (cannot be recovered)

## Support

For issues or questions:
1. Check workflow logs
2. Review this documentation
3. Consult Fastlane documentation
4. Contact DevOps team

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [React Native Deployment Guide](https://reactnative.dev/docs/signed-apk-android)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [Google Play Developer API](https://developers.google.com/android-publisher)
