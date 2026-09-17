"use client";

import { useMemo, useState, useTransition } from "react";
import { Archive, Check, Download, Mail, Paperclip, Phone, Trash2 } from "lucide-react";
import { deleteInquiry, updateInquiry } from "../actions";
import { INQUIRY_STATUSES, formatDate } from "@/lib/utils";

type Row = {
  id: number;
  kind: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  deadline: string | null;
  preferredContact: string | null;
  message: string;
  attachmentUrl: string | null;
  status: string;
  notes: string;
  isRead: boolean;
  archived: boolean;
  createdAt: string;
};

export function InquiryTable({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const [showArchived, setShowArchived] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  const visible = useMemo(
    () =>
      rows.filter(
        (row) => (showArchived ? row.archived : !row.archived) && (filter === "ALL" || row.status === filter)
      ),
    [rows, filter, showArchived]
  );

  function exportCsv() {
    const headers = [
      "id","kind","name","email","phone","company","service","budget","deadline","preferredContact","status","message","notes","createdAt",
    ];
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [
      headers.join(","),
      ...visible.map((row) => headers.map((h) => escape(row[h as keyof Row])).join(",")),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Messages & inquiries</h1>
          <p className="text-xs text-[var(--ink-muted)]">{visible.length} shown · {rows.length} total</p>
        </div>
        <button type="button" onClick={exportCsv} className="btn btn-ghost !py-2 !text-xs">
          <Download size={13} /> Export CSV
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {["ALL", ...INQUIRY_STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`chip ${filter === status ? "!border-[var(--accent)] !text-[var(--accent)]" : ""}`}
          >
            {status}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          className={`chip ${showArchived ? "!border-[var(--accent)] !text-[var(--accent)]" : ""}`}
        >
          <Archive size={12} /> Archived
        </button>
      </div>

      <ul className="space-y-2">
        {visible.length === 0 && (
          <li className="card p-8 text-center text-sm text-[var(--ink-muted)]">No messages in this view.</li>
        )}
        {visible.map((row) => (
          <li key={row.id} className={`card p-4 ${row.isRead ? "" : "border-l-4 border-l-[var(--accent)]"}`}>
            <button
              type="button"
              onClick={() => {
                setOpen(open === row.id ? null : row.id);
                if (!row.isRead) startTransition(() => updateInquiry(row.id, { isRead: true }).then(() => {}));
              }}
              className="flex w-full flex-wrap items-center gap-2 text-left"
              aria-expanded={open === row.id}
            >
              <span className="text-sm font-semibold">{row.name}</span>
              <span className="chip !py-0.5 !text-[0.6rem]">{row.kind}</span>
              <span className="chip !py-0.5 !text-[0.6rem]">{row.status}</span>
              {row.service && <span className="text-[0.7rem] text-[var(--ink-muted)]">{row.service}</span>}
              <span className="ml-auto text-[0.7rem] text-[var(--ink-muted)]">{formatDate(row.createdAt)}</span>
            </button>

            {open === row.id && (
              <div className="mt-4 space-y-4 border-t pt-4 text-xs" style={{ borderColor: "var(--surface-border)" }}>
                <dl className="grid gap-3 sm:grid-cols-3">
                  <Item label="Email" value={row.email} href={`mailto:${row.email}`} icon={<Mail size={12} />} />
                  <Item label="Phone" value={row.phone} href={row.phone ? `tel:${row.phone}` : undefined} icon={<Phone size={12} />} />
                  <Item label="Company" value={row.company} />
                  <Item label="Budget" value={row.budget} />
                  <Item label="Deadline" value={row.deadline} />
                  <Item label="Preferred contact" value={row.preferredContact} />
                </dl>

                <p className="whitespace-pre-wrap rounded-lg p-3" style={{ background: "var(--bg-sunken)" }}>
                  {row.message}
                </p>

                {row.attachmentUrl && (
                  <a href={row.attachmentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !py-1.5 !text-[0.7rem]">
                    <Paperclip size={12} /> Open attachment
                  </a>
                )}

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    startTransition(() =>
                      updateInquiry(row.id, {
                        status: String(data.get("status")),
                        notes: String(data.get("notes")),
                      }).then(() => {})
                    );
                  }}
                  className="flex flex-wrap items-end gap-3"
                >
                  <label className="block">
                    <span className="label">Status</span>
                    <select name="status" defaultValue={row.status} className="field !py-1.5 !text-xs">
                      {INQUIRY_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block min-w-60 flex-1">
                    <span className="label">Internal notes</span>
                    <input name="notes" defaultValue={row.notes} className="field !py-1.5 !text-xs" />
                  </label>
                  <button type="submit" disabled={pending} className="btn btn-primary !py-2 !text-[0.7rem]">
                    <Check size={12} /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => startTransition(() => updateInquiry(row.id, { archived: !row.archived }).then(() => {}))}
                    className="btn btn-ghost !py-2 !text-[0.7rem]"
                  >
                    <Archive size={12} /> {row.archived ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm("Delete this inquiry permanently?")) return;
                      startTransition(() => deleteInquiry(row.id).then(() => {}));
                    }}
                    className="btn btn-ghost !py-2 !text-[0.7rem] text-[var(--accent)]"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Item({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value?: string | null;
  href?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="label !mb-0.5">{label}</dt>
      <dd className="flex items-center gap-1.5">
        {icon}
        {href && value ? (
          <a href={href} className="underline">
            {value}
          </a>
        ) : (
          value || "—"
        )}
      </dd>
    </div>
  );
}
