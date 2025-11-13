import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { GeographicData } from '../types';

export interface GeographicDistributionProps {
  data: GeographicData[];
}

export const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ data }) => {
  // Sort by participants descending
  const sortedData = [...data].sort((a, b) => b.participants - a.participants);
  
  // Calculate max for bar width
  const maxParticipants = sortedData[0]?.participants || 1;

  const renderItem = ({ item }: { item: GeographicData }) => {
    const barWidth = (item.participants / maxParticipants) * 100;
    
    return (
      <View style={styles.locationItem}>
        <View style={styles.locationHeader}>
          <Text style={styles.cityName}>{item.city}</Text>
          <Text style={styles.participantCount}>
            {item.participants.toLocaleString()}
          </Text>
        </View>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { width: `${barWidth}%` }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.city}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  locationItem: {
    paddingVertical: spacing.sm,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cityName: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  participantCount: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
  },
  separator: {
    height: spacing.sm,
  },
});
