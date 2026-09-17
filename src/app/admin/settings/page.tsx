import { getSettings } from "@/lib/queries";
import { saveSettingsForm } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS = [
  { key: "statProjects", label: "Statistic — Projects completed" },
  { key: "statServices", label: "Statistic — Creative services" },
  { key: "statClients", label: "Statistic — Happy clients" },
  { key: "statYears", label: "Statistic — Years of experience" },
  { key: "siteTitle", label: "SEO site title" },
  { key: "siteDescription", label: "SEO site description" },
];

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <form action={saveSettingsForm} className="space-y-5">
      <header>
        <h1 className="text-xl font-bold">Site settings</h1>
        <p className="text-xs text-[var(--ink-muted)]">
          The statistics below are placeholders until you enter your own real numbers.
        </p>
      </header>

      <div className="card grid gap-4 p-5 md:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="label">{field.label}</span>
            <input name={field.key} defaultValue={settings[field.key] ?? ""} className="field" />
          </label>
        ))}
      </div>

      <button type="submit" className="btn btn-primary !py-2 !text-xs">
        Save settings
      </button>
    </form>
  );
}
