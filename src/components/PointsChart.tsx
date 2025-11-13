import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { PointsHistory } from '../types';

export interface PointsChartProps {
  data: PointsHistory[];
}

const CHART_HEIGHT = 200;
const CHART_WIDTH = Dimensions.get('window').width - spacing.md * 2;
const CHART_PADDING = spacing.md;

export const PointsChart: React.FC<PointsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  // Calculate min and max for scaling
  const points = data.map(d => d.points);
  const minPoints = Math.min(...points);
  const maxPoints = Math.max(...points);
  const range = maxPoints - minPoints || 1;

  // Calculate chart dimensions
  const chartInnerHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const chartInnerWidth = CHART_WIDTH - CHART_PADDING * 2;
  const pointSpacing = chartInnerWidth / (data.length - 1 || 1);

  // Generate path for the line
  const generatePath = (): string => {
    return data
      .map((point, index) => {
        const x = CHART_PADDING + index * pointSpacing;
        const normalizedValue = (point.points - minPoints) / range;
        const y = CHART_HEIGHT - CHART_PADDING - normalizedValue * chartInnerHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Generate gradient fill path
  const generateFillPath = (): string => {
    const linePath = data
      .map((point, index) => {
        const x = CHART_PADDING + index * pointSpacing;
        const normalizedValue = (point.points - minPoints) / range;
        const y = CHART_HEIGHT - CHART_PADDING - normalizedValue * chartInnerHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
    
    const lastX = CHART_PADDING + (data.length - 1) * pointSpacing;
    return `${linePath} L ${lastX} ${CHART_HEIGHT - CHART_PADDING} L ${CHART_PADDING} ${CHART_HEIGHT - CHART_PADDING} Z`;
  };

  // Render dots for each data point
  const renderDots = () => {
    return data.map((point, index) => {
      const x = CHART_PADDING + index * pointSpacing;
      const normalizedValue = (point.points - minPoints) / range;
      const y = CHART_HEIGHT - CHART_PADDING - normalizedValue * chartInnerHeight;

      return (
        <View
          key={index}
          style={[
            styles.dot,
            {
              left: x - 4,
              top: y - 4,
            },
          ]}
        />
      );
    });
  };

  // Render line using positioned views (simplified approach)
  const renderLine = () => {
    const segments = [];
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = CHART_PADDING + i * pointSpacing;
      const normalizedValue1 = (data[i].points - minPoints) / range;
      const y1 = CHART_HEIGHT - CHART_PADDING - normalizedValue1 * chartInnerHeight;

      const x2 = CHART_PADDING + (i + 1) * pointSpacing;
      const normalizedValue2 = (data[i + 1].points - minPoints) / range;
      const y2 = CHART_HEIGHT - CHART_PADDING - normalizedValue2 * chartInnerHeight;

      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      segments.push(
        <View
          key={i}
          style={[
            styles.lineSegment,
            {
              width: length,
              left: x1,
              top: y1,
              transform: [{ rotate: `${angle}deg` }],
            },
          ]}
        />
      );
    }
    return segments;
  };

  // Show Y-axis labels
  const yAxisLabels = [maxPoints, Math.round((maxPoints + minPoints) / 2), minPoints];

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          {yAxisLabels.map((label, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              {label.toLocaleString()}
            </Text>
          ))}
        </View>

        {/* Chart area */}
        <View style={styles.chartArea}>
          {/* Grid lines */}
          <View style={styles.gridLines}>
            {[0, 1, 2].map(i => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>

          {/* Line segments */}
          {renderLine()}

          {/* Dots */}
          {renderDots()}
        </View>
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxis}>
        <Text style={styles.xAxisLabel}>{data[0]?.date || ''}</Text>
        <Text style={styles.xAxisLabel}>
          {data[Math.floor(data.length / 2)]?.date || ''}
        </Text>
        <Text style={styles.xAxisLabel}>{data[data.length - 1]?.date || ''}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  chartContainer: {
    flexDirection: 'row',
    height: CHART_HEIGHT,
  },
  yAxis: {
    width: 50,
    justifyContent: 'space-between',
    paddingVertical: CHART_PADDING,
  },
  yAxisLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: CHART_PADDING,
    left: 0,
    right: 0,
    bottom: CHART_PADDING,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: colors.gray200,
  },
  lineSegment: {
    position: 'absolute',
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 1.5,
    transformOrigin: 'left center',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.white,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingHorizontal: 50,
  },
  xAxisLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
