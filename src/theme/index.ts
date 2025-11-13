export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { shadows } from './shadows';
export { borderRadius } from './borderRadius';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
};

export type Theme = typeof theme;
