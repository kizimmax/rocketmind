import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

// Fallback значения — это публичные ключи (NEXT_PUBLIC_*), доступ к БД
// контролируется Firebase Security Rules на сервере, не этими ключами.
// Используются если Build Args не пробросились (Amvera/etc).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBcHj1nOLVyeSf1kYHSbZhXKlvHxpvaTDo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "rm-plan.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "rm-plan",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "rm-plan.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "224295562382",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:224295562382:web:073690e9762715f3c82ddf",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YYV1J92X52",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://rm-plan-default-rtdb.firebaseio.com",
};

function initDb(): Database {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getDatabase(app);
}

export const db: Database = firebaseConfig.databaseURL
  ? initDb()
  : (null as unknown as Database);
