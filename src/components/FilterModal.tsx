import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Button } from './Button';
import { colors, typography, spacing, borderRadius } from '../theme';
import { MissionCategory } from '../types';

export interface FilterOptions {
  category?: MissionCategory;
  dateRange?: 'today' | 'week' | 'month' | 'all';
  distance?: number;
}

interface FilterModalProps {
  visible: boolean;
  currentFilters: FilterOptions;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

const CATEGORIES: { value: MissionCategory; label: string }[] = [
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'donation', label: 'Donation' },
  { value: 'charity', label: 'Charity' },
  { value: 'blood_drive', label: 'Blood Drive' },
  { value: 'other', label: 'Other' },
];

const DATE_RANGES: { value: 'today' | 'week' | 'month' | 'all'; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

const DISTANCES: { value: number; label: string }[] = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  currentFilters,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleCategorySelect = (category: MissionCategory) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  };

  const handleDateRangeSelect = (dateRange: 'today' | 'week' | 'month' | 'all') => {
    setFilters(prev => ({
      ...prev,
      dateRange: prev.dateRange === dateRange ? undefined : dateRange,
    }));
  };

  const handleDistanceSelect = (distance: number) => {
    setFilters(prev => ({
      ...prev,
      distance: prev.distance === distance ? undefined : distance,
    }));
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.optionsContainer}>
              {CATEGORIES.map(({ value, label }) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.option,
                    filters.category === value && styles.optionSelected,
                  ]}
                  onPress={() => handleCategorySelect(value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.category === value && styles.optionTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Range</Text>
            <View style={styles.optionsContainer}>
              {DATE_RANGES.map(({ value, label }) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.option,
                    filters.dateRange === value && styles.optionSelected,
                  ]}
                  onPress={() => handleDateRangeSelect(value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.dateRange === value && styles.optionTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distance</Text>
            <View style={styles.optionsContainer}>
              {DISTANCES.map(({ value, label }) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.option,
                    filters.distance === value && styles.optionSelected,
                  ]}
                  onPress={() => handleDistanceSelect(value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.distance === value && styles.optionTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button title="Apply Filters" onPress={handleApply} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  resetText: {
    ...typography.body1,
    color: colors.accent,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
    margin: spacing.xs,
  },
  optionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.white,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
