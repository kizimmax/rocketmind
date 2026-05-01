import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT || "";
const region = process.env.S3_REGION || "ru-central1";
const bucket = process.env.S3_BUCKET || "";
const accessKeyId = process.env.S3_ACCESS_KEY || "";
const secretAccessKey = process.env.S3_SECRET_KEY || "";
const publicUrlBase = process.env.S3_PUBLIC_URL_BASE || `${endpoint}/${bucket}`;

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 не настроен. Нужны ENV: S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY",
    );
  }
  _client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
  return _client;
}

export interface UploadResult {
  key: string;
  publicUrl: string;
}

export async function uploadBuffer(
  buffer: Buffer,
  key: string,
  mimeType: string,
): Promise<UploadResult> {
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read",
    }),
  );
  return {
    key,
    publicUrl: `${publicUrlBase}/${key}`,
  };
}

export async function deleteByKey(key: string): Promise<void> {
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export function publicUrlFor(key: string): string {
  return `${publicUrlBase}/${key}`;
}

export interface ParsedDataUrl {
  buffer: Buffer;
  mimeType: string;
  ext: string;
}

export function parseDataUrl(dataUrl: string): ParsedDataUrl | null {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const ext = mimeType.split("/")[1]?.split("+")[0] || "bin";
  return { buffer, mimeType, ext };
}
