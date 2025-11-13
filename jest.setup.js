import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-native-firebase/app', () => ({
  firebase: {
    app: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/auth', () => ({
  auth: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  })),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  firestore: jest.fn(() => ({
    collection: jest.fn(),
  })),
}));
