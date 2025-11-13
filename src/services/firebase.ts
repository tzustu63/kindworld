import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
// Note: GOOGLE_WEB_CLIENT_ID should be set in your .env file
// Get it from Firebase Console > Authentication > Sign-in method > Google
const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID || '';

if (GOOGLE_WEB_CLIENT_ID) {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
  });
}

export const firebaseAuth = auth;
export const firebaseFirestore = firestore;
export const firebaseStorage = storage;
export const firebaseAnalytics = analytics;
export const firebaseCrashlytics = crashlytics;
export const firebasePerf = perf;

export default {
  auth,
  firestore,
  storage,
  analytics,
  crashlytics,
  perf,
};
