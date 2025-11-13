import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

const SearchScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search Screen</Text>
      <Text style={styles.subtext}>Event Feed will be implemented in task 8</Text>
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

export default SearchScreen;
