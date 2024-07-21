import { ReactNode, useEffect, useState } from "react";
import { initFirebase } from "../services/Firebase";
import { getApp } from "firebase/app";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
} from "reactfire";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        await initFirebase();
        setIsLoaded(true);
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  if (error) {
    return <div>現在調整中です</div>;
  }
  if (!isLoaded) {
    return <div>読み込み中...</div>;
  }
  return (
    <FirebaseAppProvider firebaseApp={getApp()}>
      <_FirebaseProvider>{children}</_FirebaseProvider>
    </FirebaseAppProvider>
  );
};

const _FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
    </AuthProvider>
  );
};
