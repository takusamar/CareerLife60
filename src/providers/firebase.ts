// Import the functions you need from the SDKs you need
import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

function _initFirebase(config: FirebaseOptions) {
  // Initialize Firebase
  const app = initializeApp(config);
  initializeFirestore(app, { ignoreUndefinedProperties: true });
}

export async function initFirebase(name?: string) {
  if (!getApps().some((app) => app.name === name)) {
    const config = import.meta.env.VITE_FIREBASE_CONFIG;
    if (config !== undefined) {
      // localhost
      _initFirebase(JSON.parse(config));
    } else {
      const response = await fetch("/__/firebase/init.json");
      const config = await response.json();
      _initFirebase(config);
    }
  }
}
