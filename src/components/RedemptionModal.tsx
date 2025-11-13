import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Voucher } from '../types';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';
import { Button } from './Button';

export interface RedemptionModalProps {
  visible: boolean;
  voucher: Voucher | null;
  userPoints: number;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RedemptionModal: React.FC<RedemptionModalProps> = ({
  visible,
  voucher,
  userPoints,
  loading,
  onConfirm,
  onCancel,
}) => {
  if (!voucher) return null;

  const hasEnoughPoints = userPoints >= voucher.pointsCost;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, shadows.lg]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: voucher.brandLogo }}
              style={styles.brandImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Confirm Redemption</Text>
            
            <Text style={styles.voucherName}>{voucher.title}</Text>
            <Text style={styles.brandName}>{voucher.brandName}</Text>

            <View style={styles.divider} />

            <View style={styles.pointsRow}>
              <Text style={styles.label}>Cost:</Text>
              <Text style={styles.pointsCost}>{voucher.pointsCost} points</Text>
            </View>

            <View style={styles.pointsRow}>
              <Text style={styles.label}>Your Balance:</Text>
              <Text style={[
                styles.pointsBalance,
                !hasEnoughPoints && styles.insufficientPoints
              ]}>
                {userPoints} points
              </Text>
            </View>

            {!hasEnoughPoints && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Insufficient points. You need {voucher.pointsCost - userPoints} more points.
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              <Button
                title="Cancel"
                onPress={onCancel}
                variant="secondary"
                style={styles.button}
                disabled={loading}
              />
              <Button
                title="Redeem"
                onPress={onConfirm}
                variant="primary"
                style={styles.button}
                disabled={!hasEnoughPoints || loading}
                loading={loading}
              />
            </View>
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
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: colors.gray100,
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  voucherName: {
    ...typography.body1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  brandName: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.md,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  pointsCost: {
    ...typography.h3,
    fontSize: 18,
    color: colors.primary,
  },
  pointsBalance: {
    ...typography.h3,
    fontSize: 18,
    color: colors.success,
  },
  insufficientPoints: {
    color: colors.error,
  },
  warningBox: {
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  warningText: {
    ...typography.body2,
    color: colors.error,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
  },
});
