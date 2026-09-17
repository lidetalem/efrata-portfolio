"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

const ACCEPT: Record<string, string> = {
  image: "image/png,image/jpeg,image/webp,image/svg+xml,image/gif",
  video: "video/mp4,video/webm,video/quicktime",
  file: "image/*,video/*,application/pdf,text/vtt",
};

export function FileInput({
  name,
  label,
  kind = "image",
  defaultValue,
  help,
}: {
  name: string;
  label: string;
  kind?: "image" | "video" | "file";
  defaultValue?: string | null;
  help?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setUrl(json.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-center gap-3">
        {url && kind === "image" && (
          <span className="relative h-16 w-16 overflow-hidden rounded-lg border" style={{ borderColor: "var(--surface-border)" }}>
            <Image src={url} alt="" fill sizes="64px" className="object-cover" />
          </span>
        )}
        <label className="btn btn-ghost cursor-pointer !py-2 !text-xs">
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {url ? "Replace file" : "Upload file"}
          <input
            type="file"
            className="hidden"
            accept={ACCEPT[kind]}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </label>
        {url && (
          <button type="button" onClick={() => setUrl("")} className="btn btn-ghost !py-2 !text-xs" aria-label={`Remove ${label}`}>
            <X size={13} /> Remove
          </button>
        )}
      </div>

      {url && (
        <p className="mt-1.5 truncate text-[0.68rem] text-[var(--ink-muted)]" title={url}>
          {url}
        </p>
      )}
      {help && <p className="mt-1 text-[0.68rem] text-[var(--ink-muted)]">{help}</p>}
      {error && <p className="mt-1 text-[0.7rem] text-[var(--accent)]">{error}</p>}
      <p className="mt-1 text-[0.66rem] text-[var(--ink-muted)]">
        Or paste an external URL:{" "}
        <input
          className="field !mt-1 !py-1.5 !text-[0.72rem]"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
        />
      </p>
    </div>
  );
}
