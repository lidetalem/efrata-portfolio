"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { FileInput } from "@/components/admin/file-input";
import { saveProfile } from "../actions";

type Profile = {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  bio: string;
  philosophy: string;
  approach: string;
  experience: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  avatarUrl: string | null;
  cvUrl: string | null;
  aboutVideoUrl: string | null;
  aboutVideoThumbUrl: string | null;
  aboutVideoCaptionsUrl: string | null;
  skills: string[];
} | null;

export function ProfileForm({ profile }: { profile: Profile }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSaved(false);
        startTransition(async () => {
          await saveProfile(data);
          setSaved(true);
        });
      }}
      className="space-y-5"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Profile</h1>
          <p className="text-xs text-[var(--ink-muted)]">
            Everything here appears in the hero, About section and footer of the public website.
          </p>
        </div>
        <button type="submit" disabled={pending} className="btn btn-primary !py-2 !text-xs">
          {pending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save changes
        </button>
      </header>

      {saved && (
        <p className="flex items-center gap-2 rounded-xl p-3 text-xs" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
          <CheckCircle2 size={14} /> Profile updated — the website has been refreshed.
        </p>
      )}

      <div className="card grid gap-4 p-5 md:grid-cols-2">
        <Text name="name" label="Name" value={profile?.name} />
        <Text name="title" label="Professional titles" value={profile?.title} help="Separate roles with · or commas." />
        <Text name="tagline" label="Tagline / quote" value={profile?.tagline} full />
        <Area name="intro" label="Hero supporting text" value={profile?.intro} />
        <Area name="bio" label="Biography" value={profile?.bio} rows={7} help="Blank lines create new paragraphs." />
        <Area name="experience" label="Experience" value={profile?.experience} />
        <Area name="philosophy" label="Creative philosophy" value={profile?.philosophy} />
        <Area name="approach" label="Working approach" value={profile?.approach} />
        <Text name="skills" label="Skills (comma separated)" value={profile?.skills?.join(", ")} full />
      </div>

      <div className="card grid gap-4 p-5 md:grid-cols-2">
        <h2 className="text-sm font-bold md:col-span-2">Contact & availability</h2>
        <Text name="email" label="Email" value={profile?.email} />
        <Text name="phone" label="Phone" value={profile?.phone} />
        <Text name="location" label="Location" value={profile?.location} />
        <Text name="availability" label="Availability badge" value={profile?.availability} />
      </div>

      <div className="card grid gap-5 p-5 md:grid-cols-2">
        <h2 className="text-sm font-bold md:col-span-2">Media</h2>
        <FileInput name="avatarUrl" label="Profile picture" kind="image" defaultValue={profile?.avatarUrl} />
        <FileInput name="cvUrl" label="CV (PDF)" kind="file" defaultValue={profile?.cvUrl} />
        <FileInput name="aboutVideoUrl" label="About me video (MP4/WebM)" kind="video" defaultValue={profile?.aboutVideoUrl} />
        <FileInput name="aboutVideoThumbUrl" label="Video thumbnail" kind="image" defaultValue={profile?.aboutVideoThumbUrl} />
        <FileInput
          name="aboutVideoCaptionsUrl"
          label="Video captions (.vtt)"
          kind="file"
          defaultValue={profile?.aboutVideoCaptionsUrl}
          help="Optional WebVTT subtitle file."
        />
      </div>
    </form>
  );
}

function Text({
  name,
  label,
  value,
  help,
  full,
}: {
  name: string;
  label: string;
  value?: string | null;
  help?: string;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="label">{label}</span>
      <input name={name} defaultValue={value ?? ""} className="field" />
      {help && <span className="mt-1 block text-[0.68rem] text-[var(--ink-muted)]">{help}</span>}
    </label>
  );
}

function Area({
  name,
  label,
  value,
  rows = 4,
  help,
}: {
  name: string;
  label: string;
  value?: string | null;
  rows?: number;
  help?: string;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="label">{label}</span>
      <textarea name={name} defaultValue={value ?? ""} rows={rows} className="field" />
      {help && <span className="mt-1 block text-[0.68rem] text-[var(--ink-muted)]">{help}</span>}
    </label>
  );
}
