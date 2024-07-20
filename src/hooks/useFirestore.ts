import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { userConverter } from "../models/User";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { historyConverter } from "../models/History";

export function useUser(userId: string, suspense?: boolean) {
  const db = useFirestore();
  const ref = doc(db, "users", userId).withConverter(userConverter);
  try {
    return useFirestoreDocData(ref, { suspense });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

export function useHistories(userId: string, suspense?: boolean) {
  const db = useFirestore();
  const col = collection(db, "users", userId, "histories").withConverter(
    historyConverter
  );
  const q = query(col, orderBy("start"));
  try {
    return useFirestoreCollectionData(q, { suspense });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}
