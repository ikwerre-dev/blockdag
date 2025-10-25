"use client";

import { useMemo, useState } from "react";

type Props = {
  record: {
    id: string;
    title: string;
    description?: string | null;
    type: string | { toString: () => string };
    warningNotes?: string | null;
    data: string;
    hash?: string | null;
    createdAt: string | Date;
  };
};

function tryParseJson(input: string): any | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    return null;
  }
}

function summarizeJson(json: any): string | null {
  if (!json) return null;
  if (Array.isArray(json)) {
    return `Items: ${json.length}`;
  }
  const keys = Object.keys(json);
  if (keys.length === 0) return null;
  // Show up to 3 key/value previews
  const preview = keys.slice(0, 3).map((k) => {
    const v = json[k];
    const vs = typeof v === "string" ? v : JSON.stringify(v);
    return `${k}: ${vs.length > 40 ? vs.slice(0, 40) + "…" : vs}`;
  });
  return preview.join(" · ");
}

export default function PublicRecordItem({ record }: Props) {
  const [expanded, setExpanded] = useState(false);

  const created = useMemo(() => new Date(record.createdAt), [record.createdAt]);
  const date = useMemo(
    () => created.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
    [created]
  );
  const time = useMemo(
    () => created.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    [created]
  );
  const hashShort = useMemo(() => (record.hash ? `${record.hash.slice(0, 8)}…` : null), [record.hash]);

  const parsed = useMemo(() => tryParseJson(record.data), [record.data]);
  const summary = useMemo(() => summarizeJson(parsed), [parsed]);

  return (
    <div className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-slate-900">{record.title}</div>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {String(record.type).replace("_", " ")}
        </span>
      </div>
      <div className="mt-1 text-xs text-slate-500 flex items-center gap-2">
        <span>
          {date} • {time}
        </span>
        {hashShort && <span className="text-slate-400">• hash {hashShort}</span>}
      </div>
      {record.description && (
        <div className="text-sm text-slate-700 mt-2">{record.description}</div>
      )}
      {record.warningNotes && (
        <div className="text-sm mt-2 rounded-md bg-amber-50 text-amber-800 border border-amber-200 p-2">
          Warning: {record.warningNotes}
        </div>
      )}

      {/* JSON details hidden by default, show summary and toggle */}
      {parsed && (
        <div className="mt-2">
          {!expanded ? (
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">Details: {summary ?? "Available"}</div>
              <button
                type="button"
                className="text-slate-700 text-xs inline-flex items-center gap-1 hover:text-slate-900"
                onClick={() => setExpanded(true)}
              >
                Show more <span aria-hidden>▾</span>
              </button>
            </div>
          ) : (
            <div>
              <div className="text-xs text-slate-500">Details</div>
              <div className="mt-1 text-sm bg-slate-50 border border-slate-200 rounded-md p-2 overflow-x-auto max-h-72">
                {Array.isArray(parsed) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {parsed.slice(0, 50).map((item, idx) => (
                      <li key={idx} className="text-slate-700 break-words">
                        {typeof item === "string" ? item : JSON.stringify(item)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                    {Object.entries(parsed).map(([k, v]) => (
                      <div key={k} className="flex items-start gap-2">
                        <div className="text-slate-500 text-xs min-w-[120px]">{k}</div>
                        <div className="text-slate-800 text-sm break-words">
                          {typeof v === "string" ? v : JSON.stringify(v)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  className="text-slate-700 text-xs inline-flex items-center gap-1 hover:text-slate-900"
                  onClick={() => setExpanded(false)}
                >
                  Show less <span aria-hidden>▴</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}