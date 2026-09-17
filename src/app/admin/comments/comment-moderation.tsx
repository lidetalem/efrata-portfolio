"use client";

import { useState, useTransition } from "react";
import { Check, EyeOff, Flag, Trash2 } from "lucide-react";
import { moderateComment } from "../actions";
import { formatDate } from "@/lib/utils";

type Row = {
  id: number;
  projectId: number | null;
  authorName: string;
  body: string;
  approved: boolean;
  reported: boolean;
  createdAt: string;
};

export function CommentModeration({ rows }: { rows: Row[] }) {
  const [tab, setTab] = useState<"pending" | "approved" | "all">("pending");
  const [pending, startTransition] = useTransition();

  const visible = rows.filter((row) =>
    tab === "all" ? true : tab === "pending" ? !row.approved : row.approved
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold">Comments</h1>
        <p className="text-xs text-[var(--ink-muted)]">
          Visitor comments stay hidden until you approve them.
        </p>
      </header>

      <div className="flex gap-2">
        {(["pending", "approved", "all"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`chip ${tab === value ? "!border-[var(--accent)] !text-[var(--accent)]" : ""}`}
          >
            {value}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {visible.length === 0 && (
          <li className="card p-8 text-center text-sm text-[var(--ink-muted)]">No comments in this view.</li>
        )}
        {visible.map((row) => (
          <li key={row.id} className="card p-4">
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              {row.authorName}
              {row.reported && (
                <span className="chip !py-0.5 !text-[0.6rem] !text-[var(--accent)]">
                  <Flag size={10} /> reported
                </span>
              )}
              {row.projectId && <span className="chip !py-0.5 !text-[0.6rem]">project #{row.projectId}</span>}
              <span className="ml-auto text-[0.7rem] font-normal text-[var(--ink-muted)]">{formatDate(row.createdAt)}</span>
            </p>
            <p className="mt-2 whitespace-pre-wrap text-xs text-[var(--ink-soft)]">{row.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {!row.approved && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => moderateComment(row.id, "approve").then(() => {}))}
                  className="btn btn-primary !py-1.5 !text-[0.7rem]"
                >
                  <Check size={12} /> Approve
                </button>
              )}
              {row.approved && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => moderateComment(row.id, "hide").then(() => {}))}
                  className="btn btn-ghost !py-1.5 !text-[0.7rem]"
                >
                  <EyeOff size={12} /> Hide
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!confirm("Delete this comment?")) return;
                  startTransition(() => moderateComment(row.id, "delete").then(() => {}));
                }}
                className="btn btn-ghost !py-1.5 !text-[0.7rem] text-[var(--accent)]"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
