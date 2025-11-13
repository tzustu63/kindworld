import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { colors } from '../theme';
import { ParticipationData } from '../types';

export interface ParticipationChartProps {
  data: ParticipationData[];
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32;

export const ParticipationChart: React.FC<ParticipationChartProps> = ({ data }) => {
  // Transform data for Victory
  const chartData = data.map((item) => ({
    x: item.date,
    y: item.participants,
  }));

  return (
    <View style={styles.container}>
      <VictoryChart
        width={CHART_WIDTH}
        height={220}
        theme={VictoryTheme.material}
        padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: colors.gray300 },
            tickLabels: {
              fontSize: 10,
              fill: colors.textSecondary,
              angle: -45,
              textAnchor: 'end',
            },
            grid: { stroke: 'transparent' },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors.gray300 },
            tickLabels: {
              fontSize: 10,
              fill: colors.textSecondary,
            },
            grid: { stroke: colors.gray200, strokeDasharray: '4,4' },
          }}
        />
        <VictoryLine
          data={chartData}
          style={{
            data: {
              stroke: colors.accent,
              strokeWidth: 3,
            },
          }}
          interpolation="monotoneX"
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
