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
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  createdAt: Date;
  updatedAt: Date;
}

export const historyConverter: FirestoreDataConverter<History> = {
  toFirestore(history: WithFieldValue<History>): DocumentData {
    return {
      title: history.title,
      startYear: history.startYear,
      startMonth: history.startMonth,
      endYear: history.endYear,
      endMonth: history.endMonth,
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
      startYear: data.startYear,
      startMonth: data.startMonth,
      endYear: data.endYear,
      endMonth: data.endMonth,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
