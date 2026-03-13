import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBcHj1nOLVyeSf1kYHSbZhXKlvHxpvaTDo",
  authDomain: "rm-plan.firebaseapp.com",
  projectId: "rm-plan",
  storageBucket: "rm-plan.firebasestorage.app",
  messagingSenderId: "224295562382",
  appId: "1:224295562382:web:073690e9762715f3c82ddf",
  measurementId: "G-YYV1J92X52",
  databaseURL: "https://rm-plan-default-rtdb.firebaseio.com",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
