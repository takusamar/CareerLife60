import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  birthYear: number;
  birthMonth: number;
  createdAt: Date;
  updatedAt: Date;
}

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: WithFieldValue<User>): DocumentData {
    return {
      name: user.name,
      birthYear: user.birthYear,
      birthMonth: user.birthMonth,
      createdAt: user.createdAt === undefined ? serverTimestamp() : undefined,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      birthYear: data.birthYear,
      birthMonth: data.birthMonth,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
