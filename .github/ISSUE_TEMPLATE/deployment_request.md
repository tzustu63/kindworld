---
name: Deployment Request
about: Request a deployment to staging or production
title: '[DEPLOY] '
labels: deployment
assignees: ''
---

## Deployment Type
<!-- Mark one -->
- [ ] Staging (TestFlight/Internal Testing)
- [ ] Production (App Store/Google Play)

## Platform
<!-- Mark all that apply -->
- [ ] iOS
- [ ] Android

## Version
**Version Number**: v

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] No known critical bugs
- [ ] Performance tested

### Testing
- [ ] Tested on iOS devices
- [ ] Tested on Android devices
- [ ] Tested on different screen sizes
- [ ] Tested with different OS versions
- [ ] Accessibility tested
- [ ] Offline functionality tested

### Documentation
- [ ] Release notes prepared
- [ ] CHANGELOG updated
- [ ] Documentation updated
- [ ] API changes documented (if applicable)

### Configuration
- [ ] Environment variables configured
- [ ] Secrets updated (if needed)
- [ ] Firebase configuration verified
- [ ] Third-party integrations tested

### Staging Verification (for Production deployments)
- [ ] Deployed to staging
- [ ] Tested in staging environment
- [ ] No critical issues found
- [ ] Stakeholder approval received

## Release Notes

### New Features
<!-- List new features -->
- 

### Bug Fixes
<!-- List bug fixes -->
- 

### Improvements
<!-- List improvements -->
- 

### Breaking Changes
<!-- List any breaking changes -->
- 

## Rollback Plan
<!-- Describe how to rollback if issues occur -->

## Post-Deployment Verification
<!-- How to verify the deployment was successful -->

- [ ] App launches successfully
- [ ] Core features working
- [ ] No crash reports
- [ ] Analytics tracking properly
- [ ] Push notifications working (if applicable)

## Additional Notes
<!-- Any additional information -->

## Deployment Timeline
**Requested Deployment Date**: YYYY-MM-DD
**Requested Deployment Time**: HH:MM (timezone)

## Approvals Required
<!-- For production deployments -->
- [ ] Product Owner
- [ ] Tech Lead
- [ ] QA Lead

## Monitoring Plan
<!-- How will you monitor the deployment -->

- [ ] Monitor crash reports for 24 hours
- [ ] Check analytics dashboard
- [ ] Monitor user feedback
- [ ] Review performance metrics

## Rollout Strategy (Production Only)
<!-- For Android production deployments -->
- [ ] 10% rollout initially
- [ ] Increase to 25% after 24 hours
- [ ] Increase to 50% after 48 hours
- [ ] Full rollout after 72 hours

## Communication Plan
- [ ] Notify team in Slack
- [ ] Update status page (if applicable)
- [ ] Notify beta testers
- [ ] Prepare support team
