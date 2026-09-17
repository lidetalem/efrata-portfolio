"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { FileInput } from "./file-input";
import type { Field, ResourceConfig, ResourceKey } from "@/lib/resources";

type Row = Record<string, unknown> & { id: number };

export function ResourceManager({
  config,
  rows,
  actions,
  note,
}: {
  config: ResourceConfig;
  rows: Row[];
  actions: {
    save: (resource: ResourceKey, data: FormData) => Promise<{ ok: boolean }>;
    remove: (resource: ResourceKey, id: number) => Promise<{ ok: boolean }>;
    toggle: (resource: ResourceKey, id: number, field: string, value: boolean) => Promise<{ ok: boolean }>;
    move: (resource: ResourceKey, id: number, direction: -1 | 1) => Promise<{ ok: boolean }>;
  };
  note?: string;
}) {
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    startTransition(async () => {
      try {
        await actions.save(config.key, data);
        setEditing(null);
      } catch (e) {
        setError((e as Error).message || "Could not save. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{config.label}</h1>
          <p className="text-xs text-[var(--ink-muted)]">
            {rows.length} {rows.length === 1 ? "entry" : "entries"}
            {note ? ` · ${note}` : ""}
          </p>
        </div>
        <button type="button" onClick={() => setEditing("new")} className="btn btn-primary !py-2 !text-xs">
          <Plus size={14} /> New {config.singular.toLowerCase()}
        </button>
      </div>

      {editing && (
        <form onSubmit={submit} className="card space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">
              {editing === "new" ? `New ${config.singular.toLowerCase()}` : `Edit: ${String(editing[config.titleField] ?? editing.id)}`}
            </h2>
            <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost !p-2" aria-label="Close editor">
              <X size={14} />
            </button>
          </div>

          {editing !== "new" && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <div key={field.name} className={field.full || field.type === "textarea" ? "md:col-span-2" : ""}>
                <FieldControl field={field} value={editing === "new" ? undefined : editing[field.name]} />
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-[var(--accent)]">{error}</p>}

          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn btn-primary !py-2 !text-xs">
              {pending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost !py-2 !text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {rows.length === 0 && (
          <li className="card p-8 text-center text-sm text-[var(--ink-muted)]">
            Nothing here yet. Create your first {config.singular.toLowerCase()}.
          </li>
        )}
        {rows.map((row, index) => (
          <li key={row.id} className="card flex flex-wrap items-center gap-3 p-4">
            <span className="flex-1 min-w-40">
              <span className="block truncate text-sm font-semibold">
                {String(row[config.titleField] || `#${row.id}`)}
              </span>
              <span className="text-[0.7rem] text-[var(--ink-muted)]">
                ID {row.id}
                {row.category ? ` · ${row.category}` : ""}
                {row.section ? ` · ${row.section}` : ""}
                {row.isSample ? " · sample" : ""}
              </span>
            </span>

            {config.hasPublish && "published" in row && (
              <button
                type="button"
                onClick={() => startTransition(() => actions.toggle(config.key, row.id, "published", !row.published).then(() => {}))}
                className="btn btn-ghost !py-1.5 !text-[0.7rem]"
                aria-label={row.published ? "Unpublish" : "Publish"}
              >
                {row.published ? <Eye size={13} /> : <EyeOff size={13} />}
                {row.published ? "Visible" : "Hidden"}
              </button>
            )}

            {config.hasOrder && (
              <span className="flex gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => startTransition(() => actions.move(config.key, row.id, -1).then(() => {}))}
                  className="btn btn-ghost !p-2 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  disabled={index === rows.length - 1}
                  onClick={() => startTransition(() => actions.move(config.key, row.id, 1).then(() => {}))}
                  className="btn btn-ghost !p-2 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown size={13} />
                </button>
              </span>
            )}

            <button type="button" onClick={() => setEditing(row)} className="btn btn-ghost !py-1.5 !text-[0.7rem]">
              <Pencil size={13} /> Edit
            </button>
            <button
              type="button"
              onClick={() => {
                if (!confirm(`Delete “${String(row[config.titleField] || row.id)}”? This cannot be undone.`)) return;
                startTransition(() => actions.remove(config.key, row.id).then(() => {}));
              }}
              className="btn btn-ghost !py-1.5 !text-[0.7rem] text-[var(--accent)]"
            >
              <Trash2 size={13} /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FieldControl({ field, value }: { field: Field; value: unknown }) {
  const common = { name: field.name, required: field.required, className: "field" };

  if (field.type === "image" || field.type === "video" || field.type === "file") {
    return (
      <FileInput
        name={field.name}
        label={field.label}
        kind={field.type}
        defaultValue={typeof value === "string" ? value : ""}
        help={field.help}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 pt-6 text-sm">
        <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} />
        {field.label}
      </label>
    );
  }

  return (
    <label className="block">
      <span className="label">
        {field.label} {field.required && <span className="text-[var(--accent)]">*</span>}
      </span>
      {field.type === "textarea" ? (
        <textarea {...common} rows={4} defaultValue={String(value ?? "")} />
      ) : field.type === "select" ? (
        <select {...common} defaultValue={String(value ?? field.options?.[0] ?? "")}>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "number" ? (
        <input {...common} type="number" defaultValue={Number(value ?? 0)} />
      ) : field.type === "list" ? (
        <input {...common} defaultValue={Array.isArray(value) ? value.join(", ") : String(value ?? "")} />
      ) : (
        <input {...common} defaultValue={String(value ?? "")} />
      )}
      {field.help && <span className="mt-1 block text-[0.68rem] text-[var(--ink-muted)]">{field.help}</span>}
    </label>
  );
}
