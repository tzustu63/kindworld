import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Redemption, Voucher } from '../types';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';
import { Button } from './Button';

export interface RedemptionSuccessModalProps {
  visible: boolean;
  redemption: Redemption | null;
  voucher: Voucher | null;
  onClose: () => void;
}

export const RedemptionSuccessModal: React.FC<RedemptionSuccessModalProps> = ({
  visible,
  redemption,
  voucher,
  onClose,
}) => {
  if (!redemption || !voucher) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, shadows.lg]}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Redemption Successful!</Text>
            
            <Text style={styles.message}>
              Your voucher has been redeemed successfully.
            </Text>

            <View style={styles.voucherInfo}>
              <Text style={styles.voucherName}>{voucher.title}</Text>
              <Text style={styles.brandName}>{voucher.brandName}</Text>
            </View>

            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Redemption Code</Text>
              <View style={styles.codeBox}>
                <Text style={styles.code}>{redemption.redemptionCode}</Text>
              </View>
              <Text style={styles.codeHint}>
                Show this code at the store to redeem your voucher
              </Text>
            </View>

            <View style={styles.expiryInfo}>
              <Text style={styles.expiryLabel}>Expires on:</Text>
              <Text style={styles.expiryDate}>
                {redemption.expiresAt.toDate().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            <Button
              title="Done"
              onPress={onClose}
              variant="primary"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  successIcon: {
    backgroundColor: colors.success,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 48,
    color: colors.white,
    fontWeight: 'bold',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  voucherInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  voucherName: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  brandName: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  codeContainer: {
    marginBottom: spacing.lg,
  },
  codeLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  codeBox: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  code: {
    ...typography.h2,
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: 'Courier',
    letterSpacing: 2,
  },
  codeHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  expiryInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  expiryLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  expiryDate: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  button: {
    marginTop: spacing.md,
  },
});
