import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Voucher } from '../types';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';

export interface VoucherCardProps {
  voucher: Voucher;
  onPress: () => void;
}

const VoucherCardComponent: React.FC<VoucherCardProps> = ({ voucher, onPress }) => {
  const stockWarning = voucher.stock < 10 ? `, only ${voucher.stock} left` : '';
  const accessibilityLabel = `${voucher.brandName} voucher: ${voucher.title}, costs ${voucher.pointsCost} points${stockWarning}`;

  return (
    <TouchableOpacity
      style={[styles.card, shadows.md]}
      onPress={onPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Double tap to redeem this voucher"
    >
      <View style={styles.imageContainer} accessible={false}>
        <Image
          source={{ uri: voucher.brandLogo }}
          style={styles.brandImage}
          resizeMode="cover"
          accessible={false}
        />
      </View>
      
      <View style={styles.content} accessible={false}>
        <Text style={styles.brandName} numberOfLines={1} accessible={false}>
          {voucher.brandName}
        </Text>
        <Text style={styles.voucherType} numberOfLines={2} accessible={false}>
          {voucher.title}
        </Text>
        <View style={styles.footer} accessible={false}>
          <View style={styles.pointsBadge} accessible={false}>
            <Text style={styles.pointsText} accessible={false}>
              {voucher.pointsCost}
            </Text>
            <Text style={styles.pointsLabel} accessible={false}>
              points
            </Text>
          </View>
          {voucher.stock < 10 && (
            <Text style={styles.stockWarning} accessible={false}>
              Only {voucher.stock} left
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Memoize component to prevent unnecessary re-renders
export const VoucherCard = React.memo(VoucherCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.voucher.id === nextProps.voucher.id &&
    prevProps.voucher.stock === nextProps.voucher.stock &&
    prevProps.voucher.pointsCost === nextProps.voucher.pointsCost
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: colors.gray100,
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.md,
  },
  brandName: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  voucherType: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsText: {
    ...typography.h2,
    fontSize: 24,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  pointsLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  stockWarning: {
    ...typography.caption,
    color: colors.warning,
  },
});
