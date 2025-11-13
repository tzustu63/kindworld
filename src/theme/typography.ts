import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontFamily: 'SF Pro Display',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
  },
  h2: {
    fontFamily: 'SF Pro Display',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  h3: {
    fontFamily: 'SF Pro Display',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },

  // Body
  body1: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  body2: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },

  // UI Elements
  button: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  overline: {
    fontFamily: 'SF Pro Text',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};
