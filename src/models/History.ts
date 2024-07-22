import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export interface History {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const historyConverter: FirestoreDataConverter<History> = {
  toFirestore(history: WithFieldValue<History>): DocumentData {
    return {
      title: history.title,
      start: history.start,
      end: history.end,
      createdAt:
        history.createdAt === undefined ? serverTimestamp() : undefined,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): History {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      start: data.start.toDate(),
      end: data.end?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
