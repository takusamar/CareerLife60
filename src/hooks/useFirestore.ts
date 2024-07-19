import { useFirestore, useFirestoreDocData } from "reactfire";
import { userConverter } from "../models/User";
import { doc } from "firebase/firestore";

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
