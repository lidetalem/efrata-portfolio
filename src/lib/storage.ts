import "server-only";
import crypto from "node:crypto";
import path from "node:path";
import { mkdir, writeFile, unlink } from "node:fs/promises";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB
export const MAX_DOC_BYTES = 15 * 1024 * 1024; // 15 MB

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const DOC_TYPES = ["application/pdf", "text/vtt", "text/plain"];

export type UploadKind = "image" | "video" | "doc";

export function detectKind(mime: string): UploadKind | null {
  if (IMAGE_TYPES.includes(mime)) return "image";
  if (VIDEO_TYPES.includes(mime)) return "video";
  if (DOC_TYPES.includes(mime)) return "doc";
  return null;
}

export function limitFor(kind: UploadKind) {
  return kind === "video" ? MAX_VIDEO_BYTES : kind === "doc" ? MAX_DOC_BYTES : MAX_IMAGE_BYTES;
}

export function safeName(original: string) {
  const ext = path.extname(original).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 10);
  const base = path
    .basename(original, path.extname(original))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
  return `${base}-${crypto.randomBytes(6).toString("hex")}${ext}`;
}

export type StoredFile = { url: string; provider: string; key: string };

/** Validates a browser File and stores it with the configured provider. */
export async function storeFile(file: File): Promise<StoredFile> {
  const kind = detectKind(file.type);
  if (!kind) throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  const limit = limitFor(kind);
  if (file.size > limit) {
    throw new Error(`File too large. Maximum for ${kind} files is ${Math.round(limit / 1024 / 1024)} MB.`);
  }

  const provider = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
  const name = safeName(file.name || `upload.${kind}`);

  if (provider === "cloudinary") return uploadToCloudinary(file, name, kind);
  if (provider === "vercel-blob") return uploadToVercelBlob(file, name);
  return uploadToLocalDisk(file, name);
}

async function uploadToLocalDisk(file: File, name: string): Promise<StoredFile> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);
  return { url: `/uploads/${name}`, provider: "local", key: name };
}

async function uploadToCloudinary(file: File, name: string, kind: UploadKind): Promise<StoredFile> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.STORAGE_API_KEY;
  const secretKey = process.env.STORAGE_API_SECRET;
  if (!cloud || !key || !secretKey) {
    throw new Error(
      "Cloudinary is selected but CLOUDINARY_CLOUD_NAME / STORAGE_API_KEY / STORAGE_API_SECRET are missing."
    );
  }
  const resource = kind === "video" ? "video" : kind === "doc" ? "raw" : "image";
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER || "efrata-portfolio";
  const publicId = name.replace(/\.[^.]+$/, "");
  const toSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${secretKey}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", key);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${resource}/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${await res.text()}`);
  const json = (await res.json()) as { secure_url: string; public_id: string };
  return { url: json.secure_url, provider: "cloudinary", key: json.public_id };
}

async function uploadToVercelBlob(file: File, name: string): Promise<StoredFile> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("STORAGE_PROVIDER=vercel-blob requires BLOB_READ_WRITE_TOKEN.");
  const res = await fetch(`https://blob.vercel-storage.com/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "x-api-version": "7",
      "x-content-type": file.type,
      "x-add-random-suffix": "1",
    },
    body: file,
  });
  if (!res.ok) throw new Error(`Vercel Blob upload failed: ${await res.text()}`);
  const json = (await res.json()) as { url: string; pathname: string };
  return { url: json.url, provider: "vercel-blob", key: json.pathname };
}

/** Best-effort deletion for locally stored files. Remote files are managed in the provider console. */
export async function deleteLocalFile(url: string) {
  if (!url.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    /* ignore */
  }
}
