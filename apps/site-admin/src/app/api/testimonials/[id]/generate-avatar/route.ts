import { NextResponse } from "next/server";
import path from "path";

export const maxDuration = 180;

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const FILE = path.join(SITE_ROOT, "content", "_testimonials.json");
const PUBLIC_DIR = path.join(SITE_ROOT, "public");
const TESTIMONIALS_DIR = path.join(PUBLIC_DIR, "images", "testimonials");

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

type StoredTestimonial = {
  id: string;
  order: number;
  paragraphs: string[];
  name: string;
  position: string;
  avatar: string | null;
  gender: "m" | "f";
};

function readAll(fs: typeof import("fs")): StoredTestimonial[] {
  if (!fs.existsSync(FILE)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8")) as { items?: Partial<StoredTestimonial>[] };
    const items = Array.isArray(raw.items) ? raw.items : [];
    return items.map((t) => ({
      id: String(t.id ?? ""),
      order: typeof t.order === "number" ? t.order : 0,
      paragraphs: Array.isArray(t.paragraphs) ? t.paragraphs.filter((p): p is string => typeof p === "string") : [],
      name: typeof t.name === "string" ? t.name : "",
      position: typeof t.position === "string" ? t.position : "",
      avatar: typeof t.avatar === "string" ? t.avatar : null,
      gender: t.gender === "f" ? "f" : "m",
    }));
  } catch {
    return [];
  }
}

function writeAll(fs: typeof import("fs"), items: StoredTestimonial[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify({ items }, null, 2), "utf-8");
}

function deleteAvatarFiles(fs: typeof import("fs"), id: string) {
  for (const ext of IMAGE_EXTS) {
    const fp = path.join(TESTIMONIALS_DIR, id + ext);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
}

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const ETHNICITY = [
  "Slavic Eastern European features",
  "Russian Caucasian features",
  "Northern European features",
  "East Asian features",
  "Central Asian Kazakh features",
  "Mongolian features",
] as const;

const ANGLE = [
  "frontal portrait, looking straight into the camera",
  "three-quarter view, head slightly turned to the left",
  "three-quarter view, head slightly turned to the right",
  "subtle side angle, eyes toward the camera",
] as const;

const FRAMING = [
  "tight close-up of the face, head fills the frame",
  "classic headshot, head and upper shoulders",
  "head and shoulders shot with a bit of collar visible",
] as const;

const BACKGROUND = [
  "clean neutral gray studio background",
  "softly blurred modern open-space office background",
  "softly blurred corporate boardroom with glass partitions",
  "premium executive car interior as background, blurred window",
  "blurred floor-to-ceiling office window with city skyline behind",
  "plain soft white seamless background",
] as const;

const WOMEN_OUTFIT = [
  "classic fitted business dress",
  "crisp tailored white shirt",
  "tailored blazer over a blouse",
  "structured formal jacket with a silk blouse",
  "elegant sheath dress with a thin jacket",
] as const;

const MEN_OUTFIT = [
  "dark charcoal business suit with shirt and tie",
  "navy tailored two-piece suit with white shirt",
  "well-fitted blazer over a dress shirt, no tie",
  "classic three-piece business suit",
  "slim grey suit with open-collar shirt",
] as const;

const AGES = ["age 28 to 38", "age 35 to 45", "age 42 to 55"] as const;

function buildPrompt(gender: "m" | "f"): string {
  const ethnicity = pick(ETHNICITY);
  const angle = pick(ANGLE);
  const framing = pick(FRAMING);
  const background = pick(BACKGROUND);
  const outfit = gender === "f" ? pick(WOMEN_OUTFIT) : pick(MEN_OUTFIT);
  const age = pick(AGES);

  const subject = gender === "f"
    ? `professional businesswoman, female executive, ${ethnicity}, natural professional hairstyle, minimal subtle makeup, wearing ${outfit}`
    : `professional businessman, male executive, ${ethnicity}, short clean professional haircut, clean shaven or neatly trimmed stubble, wearing ${outfit}`;

  return [
    "corporate editorial headshot",
    "square 1:1 composition, face centered in frame, symmetric framing",
    framing,
    angle,
    subject,
    age,
    background,
    "black and white photography, monochrome, grayscale only, no color",
    "formal confident expression, natural direct gaze",
    "studio softbox lighting, sharp focus on the eyes, shallow depth of field, photorealistic, Canon EOS 85mm",
    "no sunglasses, no flower crown, no wreath, no hipster beard, no long beard, no beach clothes, no casual wear, no t-shirt, no hoodie, no tattoos, no props, no logos, not South Asian, not Indian, not African, not dark skinned",
  ].join(", ");
}

// ── Module-level serialization ──────────────────────────────────────────────
// Pollinations free tier: max 1 queued request per IP. Serialize our calls so
// concurrent clicks don't race each other into 429. Cap the wait on `prev` so
// a hung previous call can't block future requests forever.
let chain: Promise<unknown> = Promise.resolve();
const COOLDOWN_MS = 15_000;
const PREV_WAIT_CAP_MS = 120_000;

function runSerialized<T>(fn: () => Promise<T>): Promise<T> {
  const prev = chain;
  const run = (async () => {
    await Promise.race([
      prev.catch(() => {}),
      new Promise<void>((r) => setTimeout(r, PREV_WAIT_CAP_MS)),
    ]);
    try {
      return await fn();
    } finally {
      await new Promise((r) => setTimeout(r, COOLDOWN_MS));
    }
  })();
  chain = run.catch(() => {});
  return run;
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });
  const fs = await import("fs");
  const { id } = await params;

  const items = readAll(fs);
  const idx = items.findIndex((t) => t.id === id);
  if (idx < 0) return NextResponse.json({ error: "not found" }, { status: 404 });

  const cur = items[idx];

  const describeError = (e: unknown): string => {
    if (!(e instanceof Error)) return String(e);
    const parts = [e.message];
    const cause = (e as { cause?: unknown }).cause;
    if (cause && typeof cause === "object") {
      const c = cause as { code?: string; errno?: string; hostname?: string; message?: string };
      const bits = [c.code, c.errno, c.hostname, c.message].filter(Boolean);
      if (bits.length) parts.push(`(cause: ${bits.join(" ")})`);
    }
    return parts.join(" ");
  };

  const fetchImage = async (model: "flux" | "turbo", timeoutMs: number): Promise<Buffer> => {
    const prompt = buildPrompt(cur.gender);
    const seed = Math.floor(Math.random() * 1_000_000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=384&height=384&seed=${seed}&model=${model}&referrer=rocketmind-admin`;
    const started = Date.now();
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "image/*" },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`);
    }
    const ct = res.headers.get("content-type") || "";
    const buf = Buffer.from(await res.arrayBuffer());
    if (!ct.startsWith("image/") || buf.length < 1024) {
      const head = buf.slice(0, 200).toString("utf-8").replace(/\s+/g, " ");
      throw new Error(`bad response (${ct || "no content-type"}, ${buf.length}b): ${head}`);
    }
    console.log(`[generate-avatar] ${model} fetched in ${Date.now() - started}ms, ${buf.length}b`);
    return buf;
  };

  // 3 попытки: flux → turbo → flux. Ретрай при 429/5xx/network/timeout.
  const attemptWithRetries = async (): Promise<Buffer> => {
    // План: первая попытка flux; если 429 → долгая пауза и turbo (другой очереди
    // может достаться слот); ещё попытка flux. Не-429 ошибки проходят по тому же
    // плану, но с короткими паузами.
    const plan: Array<{ model: "flux" | "turbo"; waitOn429: number; waitOther: number; timeout: number }> = [
      { model: "flux", waitOn429: 0, waitOther: 0, timeout: 30_000 },
      { model: "turbo", waitOn429: 25_000, waitOther: 5_000, timeout: 30_000 },
      { model: "flux", waitOn429: 35_000, waitOther: 10_000, timeout: 25_000 },
    ];
    let lastErr: unknown;
    let lastWas429 = false;
    for (let i = 0; i < plan.length; i++) {
      const { model, waitOn429, waitOther, timeout } = plan[i];
      const wait = lastWas429 ? waitOn429 : waitOther;
      if (wait > 0) {
        console.log(`[generate-avatar] waiting ${wait}ms before attempt ${i + 1} (${model})`);
        await new Promise((r) => setTimeout(r, wait));
      }
      try {
        return await fetchImage(model, timeout);
      } catch (e) {
        lastErr = e;
        const desc = describeError(e);
        console.warn(`[generate-avatar] attempt ${i + 1} (${model}) failed: ${desc}`);
        lastWas429 = desc.startsWith("429");
        const retriable =
          lastWas429 ||
          desc.startsWith("5") ||
          desc.includes("timeout") ||
          desc.includes("aborted") ||
          desc.includes("fetch failed") ||
          desc.includes("ECONN") ||
          desc.includes("EAI_AGAIN") ||
          desc.includes("UND_ERR");
        if (!retriable) break;
      }
    }
    if (lastErr instanceof Error) {
      const desc = describeError(lastErr);
      if (desc.startsWith("429")) {
        throw new Error("Pollinations: свободный тариф перегружен. Попробуйте ещё раз через минуту или подключите токен на https://enter.pollinations.ai");
      }
      throw new Error(desc);
    }
    throw new Error("unknown generator error");
  };

  // Hard overall budget so the client never hangs forever.
  const withOverallTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`overall timeout after ${ms}ms`)), ms)),
    ]);

  let buffer: Buffer;
  try {
    buffer = await withOverallTimeout(runSerialized(attemptWithRetries), 170_000);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generate-avatar] failed:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  fs.mkdirSync(TESTIMONIALS_DIR, { recursive: true });
  deleteAvatarFiles(fs, id);
  const ext = ".jpg";
  fs.writeFileSync(path.join(TESTIMONIALS_DIR, id + ext), buffer);
  const avatarPath = `/images/testimonials/${id}${ext}`;

  items[idx] = { ...cur, avatar: avatarPath };
  writeAll(fs, items);

  const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  return NextResponse.json({ ...items[idx], avatar: dataUrl });
}
