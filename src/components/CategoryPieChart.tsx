import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { colors, typography, spacing } from '../theme';
import { CategoryData } from '../types';

export interface CategoryPieChartProps {
  data: CategoryData[];
}

const CHART_COLORS = [
  colors.accent,
  '#FF6B6B',
  '#4ECDC4',
  '#FFD93D',
  '#95E1D3',
  '#A8E6CF',
];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  // Transform data for Victory
  const chartData = data.map((item, index) => ({
    x: item.category,
    y: item.count,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          width={280}
          height={280}
          colorScale={CHART_COLORS}
          innerRadius={60}
          labelRadius={100}
          style={{
            labels: {
              fontSize: 12,
              fill: colors.textPrimary,
              fontWeight: '600',
            },
          }}
          labels={({ datum }) => `${datum.y}`}
        />
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={item.category} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: CHART_COLORS[index % CHART_COLORS.length] },
              ]}
            />
            <Text style={styles.legendText}>
              {item.category} ({item.percentage.toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    marginTop: spacing.md,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  legendText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
});
