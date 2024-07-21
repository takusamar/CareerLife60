import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  initializeFirestore,
  setDoc,
} from "firebase/firestore";
import { History, historyConverter } from "../models/History";
import { User } from "../models/User";

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

export async function setUser(
  uid: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
) {
  try {
    const db = getFirestore();
    const ref = doc(db, "users", uid);
    return await setDoc(ref, data);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

export async function createHistory(
  userId: string,
  data: Partial<Omit<History, "id" | "createdAt" | "updatedAt">>
) {
  try {
    const db = getFirestore();
    const col = collection(db, "users", userId, "histories").withConverter(
      historyConverter
    );
    return await addDoc(col, data);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

export async function updateHistory(
  userId: string,
  historyId: string,
  data: Partial<Omit<History, "id" | "updatedAt">>
) {
  try {
    const db = getFirestore();
    const ref = doc(db, "users", userId, "histories", historyId).withConverter(
      historyConverter
    );
    return await setDoc(ref, data);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

export async function deleteHistory(userId: string, historyId: string) {
  try {
    const db = getFirestore();
    const ref = doc(db, "users", userId, "histories", historyId);
    return await deleteDoc(ref);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}
