/**
 * Manage gantt tracks in Firebase.
 *
 * Usage:
 *   node scripts/gantt-track.mjs add <slug> <name>   — register a new track
 *   node scripts/gantt-track.mjs list                 — list all tracks
 *   node scripts/gantt-track.mjs remove <slug>        — remove track registration (data stays)
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBcHj1nOLVyeSf1kYHSbZhXKlvHxpvaTDo',
  authDomain: 'rm-plan.firebaseapp.com',
  databaseURL: 'https://rm-plan-default-rtdb.firebaseio.com',
  projectId: 'rm-plan',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const [,, cmd, ...args] = process.argv;

async function list() {
  const snap = await get(ref(db, 'gantt_config/tracks'));
  const tracks = snap.val();
  if (!tracks || Object.keys(tracks).length === 0) {
    console.log('No tracks registered.');
    return;
  }
  console.log('Registered tracks:');
  for (const [slug, info] of Object.entries(tracks)) {
    console.log(`  /${slug}  —  ${info.name}`);
  }
}

async function add(slug, name) {
  if (!slug || !name) {
    console.error('Usage: node scripts/gantt-track.mjs add <slug> <name>');
    process.exit(1);
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error('Slug must be lowercase alphanumeric with dashes only.');
    process.exit(1);
  }
  const existing = await get(ref(db, `gantt_config/tracks/${slug}`));
  if (existing.exists()) {
    console.error(`Track "${slug}" already exists: ${existing.val().name}`);
    process.exit(1);
  }
  await set(ref(db, `gantt_config/tracks/${slug}`), { name });
  console.log(`Track added: /${slug} — ${name}`);
  console.log(`Open: http://localhost:3003/gantt/${slug}`);
}

async function rm(slug) {
  if (!slug) {
    console.error('Usage: node scripts/gantt-track.mjs remove <slug>');
    process.exit(1);
  }
  const existing = await get(ref(db, `gantt_config/tracks/${slug}`));
  if (!existing.exists()) {
    console.error(`Track "${slug}" not found.`);
    process.exit(1);
  }
  await remove(ref(db, `gantt_config/tracks/${slug}`));
  console.log(`Track "${slug}" unregistered. Data at gantt_tracks/${slug} is preserved.`);
}

switch (cmd) {
  case 'list': await list(); break;
  case 'add':  await add(args[0], args.slice(1).join(' ')); break;
  case 'remove': case 'rm': await rm(args[0]); break;
  default:
    console.log('Usage:');
    console.log('  node scripts/gantt-track.mjs list');
    console.log('  node scripts/gantt-track.mjs add <slug> <name>');
    console.log('  node scripts/gantt-track.mjs remove <slug>');
}

process.exit(0);
