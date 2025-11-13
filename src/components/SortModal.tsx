import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Button } from './Button';
import { colors, typography, spacing, borderRadius } from '../theme';

export type SortOption = 'date' | 'relevance' | 'distance';

interface SortModalProps {
  visible: boolean;
  currentSort: SortOption;
  onClose: () => void;
  onApply: (sortOption: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string; description: string }[] = [
  {
    value: 'date',
    label: 'Date',
    description: 'Sort by event date (earliest first)',
  },
  {
    value: 'relevance',
    label: 'Relevance',
    description: 'Sort by most relevant to you',
  },
  {
    value: 'distance',
    label: 'Distance',
    description: 'Sort by closest to your location',
  },
];

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  currentSort,
  onClose,
  onApply,
}) => {
  const [selectedSort, setSelectedSort] = useState<SortOption>(currentSort);

  const handleApply = () => {
    onApply(selectedSort);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Sort By</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View style={styles.content}>
            {SORT_OPTIONS.map(({ value, label, description }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.option,
                  selectedSort === value && styles.optionSelected,
                ]}
                onPress={() => setSelectedSort(value)}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedSort === value && styles.optionLabelSelected,
                    ]}
                  >
                    {label}
                  </Text>
                  <Text style={styles.optionDescription}>{description}</Text>
                </View>
                {selectedSort === value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Button title="Apply" onPress={handleApply} />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  optionSelected: {
    backgroundColor: colors.gray100,
    borderColor: colors.accent,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  optionLabelSelected: {
    color: colors.accent,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkmark: {
    fontSize: 20,
    color: colors.accent,
    marginLeft: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
