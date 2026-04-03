/**
 * One-time migration: copies Firebase data from `gantt` → `gantt_tracks/siteandsaas`
 * and registers the track in `gantt_config/tracks`.
 *
 * Usage: node scripts/migrate-gantt-to-tracks.mjs
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBcHj1nOLVyeSf1kYHSbZhXKlvHxpvaTDo',
  authDomain: 'rm-plan.firebaseapp.com',
  databaseURL: 'https://rm-plan-default-rtdb.firebaseio.com',
  projectId: 'rm-plan',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function migrate() {
  // 1. Read existing data
  const snap = await get(ref(db, 'gantt'));
  if (!snap.exists()) {
    console.log('No data at "gantt" — nothing to migrate.');
    process.exit(0);
  }
  const data = snap.val();
  console.log(`Found data: ${Object.keys(data).join(', ')}`);

  // 2. Check if target already has data
  const targetSnap = await get(ref(db, 'gantt_tracks/siteandsaas'));
  if (targetSnap.exists()) {
    console.log('Target "gantt_tracks/siteandsaas" already has data. Aborting to avoid overwrite.');
    process.exit(1);
  }

  // 3. Copy data to new path
  await set(ref(db, 'gantt_tracks/siteandsaas'), data);
  console.log('Copied gantt → gantt_tracks/siteandsaas');

  // 4. Register track
  await set(ref(db, 'gantt_config/tracks/siteandsaas'), { name: 'Сайт и SaaS' });
  console.log('Registered track "siteandsaas" in gantt_config/tracks');

  // 5. Verify
  const verify = await get(ref(db, 'gantt_tracks/siteandsaas'));
  console.log(`Verification: ${verify.exists() ? 'OK' : 'FAILED'}`);

  console.log('\nDone! Old data at "gantt" is preserved. Delete it manually after confirming.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
