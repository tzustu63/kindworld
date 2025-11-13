# GitHub Secrets Configuration Template

This document lists all required secrets for the CI/CD pipeline. **DO NOT** commit actual secret values to the repository.

## How to Add Secrets

1. Go to repository Settings
2. Navigate to Secrets and variables > Actions
3. Click "New repository secret"
4. Enter name and value
5. Click "Add secret"

## Required Secrets Checklist

### iOS Secrets

- [ ] `APPLE_ID`
  - **Description**: Apple Developer account email
  - **Example**: developer@kindworld.com
  - **How to get**: Your Apple Developer account email

- [ ] `APPLE_APP_SPECIFIC_PASSWORD`
  - **Description**: App-specific password for App Store Connect
  - **How to get**: Generate at appleid.apple.com > Security > App-Specific Passwords

- [ ] `APP_STORE_CONNECT_API_KEY_ID`
  - **Description**: App Store Connect API key ID
  - **How to get**: App Store Connect > Users and Access > Keys > Generate API Key

- [ ] `APP_STORE_CONNECT_API_ISSUER_ID`
  - **Description**: App Store Connect API issuer ID
  - **How to get**: App Store Connect > Users and Access > Keys (shown at top)

- [ ] `APP_STORE_CONNECT_API_KEY`
  - **Description**: App Store Connect API key (base64 encoded .p8 file)
  - **How to get**: 
    ```bash
    base64 -i AuthKey_XXXXXXXXXX.p8 -o api_key.txt
    cat api_key.txt
    ```

- [ ] `IOS_CERTIFICATES_P12`
  - **Description**: Development/staging certificates (base64 encoded)
  - **How to get**:
    ```bash
    # Export from Keychain as .p12
    base64 -i Certificates.p12 -o cert.txt
    cat cert.txt
    ```

- [ ] `IOS_CERTIFICATES_PASSWORD`
  - **Description**: Password for staging certificates
  - **How to get**: Password you set when exporting .p12

- [ ] `IOS_CERTIFICATES_P12_PROD`
  - **Description**: Production certificates (base64 encoded)
  - **How to get**: Same as staging, but for production certificate

- [ ] `IOS_CERTIFICATES_PASSWORD_PROD`
  - **Description**: Password for production certificates
  - **How to get**: Password you set when exporting production .p12

- [ ] `IOS_PROVISIONING_PROFILE_STAGING`
  - **Description**: Staging provisioning profile (base64 encoded)
  - **How to get**:
    ```bash
    base64 -i Staging.mobileprovision -o profile.txt
    cat profile.txt
    ```

- [ ] `IOS_PROVISIONING_PROFILE_PROD`
  - **Description**: Production provisioning profile (base64 encoded)
  - **How to get**: Same as staging, but for production profile

- [ ] `IOS_KEYCHAIN_PASSWORD`
  - **Description**: Temporary keychain password for CI
  - **How to get**: Generate a strong random password

- [ ] `MATCH_PASSWORD`
  - **Description**: Fastlane Match password (if using Match)
  - **How to get**: Set when initializing Fastlane Match

- [ ] `FASTLANE_TEAM_ID`
  - **Description**: Apple Developer Team ID
  - **How to get**: Apple Developer > Membership > Team ID

### Android Secrets

- [ ] `ANDROID_KEYSTORE_BASE64`
  - **Description**: Staging keystore file (base64 encoded)
  - **How to get**:
    ```bash
    base64 -i staging.keystore -o keystore.txt
    cat keystore.txt
    ```

- [ ] `ANDROID_KEYSTORE_PASSWORD`
  - **Description**: Staging keystore password
  - **How to get**: Password you set when creating keystore

- [ ] `ANDROID_KEY_ALIAS`
  - **Description**: Staging key alias
  - **How to get**: Alias you set when creating keystore

- [ ] `ANDROID_KEY_PASSWORD`
  - **Description**: Staging key password
  - **How to get**: Key password you set when creating keystore

- [ ] `ANDROID_KEYSTORE_BASE64_PROD`
  - **Description**: Production keystore file (base64 encoded)
  - **How to get**: Same as staging, but for production keystore

- [ ] `ANDROID_KEYSTORE_PASSWORD_PROD`
  - **Description**: Production keystore password
  - **How to get**: Password you set when creating production keystore

- [ ] `ANDROID_KEY_ALIAS_PROD`
  - **Description**: Production key alias
  - **How to get**: Alias you set when creating production keystore

- [ ] `ANDROID_KEY_PASSWORD_PROD`
  - **Description**: Production key password
  - **How to get**: Key password you set when creating production keystore

- [ ] `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
  - **Description**: Google Play service account JSON (base64 encoded)
  - **How to get**:
    ```bash
    base64 -i service-account.json -o sa.txt
    cat sa.txt
    ```
  - **Setup**:
    1. Go to Google Cloud Console
    2. Create service account
    3. Download JSON key
    4. Go to Google Play Console > Setup > API access
    5. Link service account and grant permissions

### Notification Secrets (Optional)

- [ ] `SLACK_WEBHOOK_URL`
  - **Description**: Slack webhook URL for deployment notifications
  - **How to get**:
    1. Go to Slack workspace
    2. Create incoming webhook
    3. Copy webhook URL

### Auto-Generated Secrets

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions (no setup needed)

## Security Best Practices

1. **Never commit secrets to repository**
2. **Use strong, unique passwords**
3. **Rotate secrets regularly** (every 90 days recommended)
4. **Limit access** to secrets to necessary team members
5. **Use environment protection rules** for production
6. **Keep backups** of keystores and certificates in secure location
7. **Document secret rotation dates**

## Secret Rotation Schedule

| Secret Type | Last Rotated | Next Rotation | Owner |
|-------------|--------------|---------------|-------|
| iOS Certificates | YYYY-MM-DD | YYYY-MM-DD | Name |
| Android Keystore | YYYY-MM-DD | N/A (25yr) | Name |
| API Keys | YYYY-MM-DD | YYYY-MM-DD | Name |
| Passwords | YYYY-MM-DD | YYYY-MM-DD | Name |

## Verification

After adding all secrets, verify by:

1. Triggering a test workflow
2. Checking workflow logs for authentication errors
3. Confirming successful build and upload
4. Testing downloaded build from TestFlight/Play Console

## Troubleshooting

### Invalid Certificate/Keystore
- Verify base64 encoding is correct
- Check password matches
- Ensure certificate/keystore is not expired

### API Authentication Failed
- Verify API key is correct
- Check permissions in App Store Connect/Play Console
- Ensure service account is linked

### Secret Not Found
- Verify secret name matches exactly (case-sensitive)
- Check secret is added to correct repository
- Ensure secret is not in environment-specific section if not using environments

## Support

For help with secrets setup:
1. Review CI_CD_SETUP.md
2. Check GitHub Actions documentation
3. Contact DevOps team
4. Review platform-specific documentation:
   - [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
   - [Google Play Developer API](https://developers.google.com/android-publisher)
