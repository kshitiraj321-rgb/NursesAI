import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface RetentionData {
  dailyGoal: number;
  todayProgress: number;
  lastActiveDate: string;
  streak: number;
}

export function useRetention(userUid?: string) {
  const [data, setData] = useState<RetentionData>({
    dailyGoal: 10,
    todayProgress: 0,
    lastActiveDate: "",
    streak: 0,
  });

  useEffect(() => {
    const uid = userUid || auth.currentUser?.uid;
    if (!uid) return;

    const unsubscribe = onSnapshot(doc(db, "users", uid, "meta", "retention"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as RetentionData);
      }
    });

    return () => unsubscribe();
  }, [userUid]);

  return data;
}
