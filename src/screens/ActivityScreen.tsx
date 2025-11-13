import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

const ActivityScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Activity Screen</Text>
      <Text style={styles.subtext}>Activity content will be implemented in future tasks</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  text: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtext: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 8,
  },
});

export default ActivityScreen;
