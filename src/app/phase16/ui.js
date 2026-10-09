"use client";

import Link from "next/link";
import { useState } from "react";

export function QA({ level, q, a }) {
  const [open, setOpen] = useState(false);
  const colors = {
    Junior: "bg-green-600/30 text-green-300 border-green-500/40",
    Mid: "bg-yellow-600/30 text-yellow-300 border-yellow-500/40",
    Senior: "bg-red-600/30 text-red-300 border-red-500/40",
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-black/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-white/5 transition-all"
      >
        <span
          className={`text-xs font-bold px-2 py-1 rounded border shrink-0 mt-0.5 ${colors[level]}`}
        >
          {level}
        </span>
        <span className="flex-1 font-medium text-gray-100">{q}</span>
        <span className="text-gray-400 shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <pre className="px-4 pb-4 md:pl-20 text-emerald-100 text-xs leading-relaxed border-t border-white/5 pt-3 whitespace-pre-wrap font-mono overflow-x-auto">
          {a}
        </pre>
      )}
    </div>
  );
}

export function Lesson({ title, children }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-cyan-200 pt-4">{title}</h3>
      {children}
    </section>
  );
}

export function QueryPage({
  title,
  subtitle,
  tabs,
  active,
  setActive,
  prev,
  next,
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-sky-400 hover:text-sky-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-gray-300 mb-3">{subtitle}</p>
        <p className="text-sm text-sky-200/80 mb-8 bg-sky-500/10 border border-sky-400/20 rounded-lg px-4 py-3">
          Answers are Mongoose. Native MongoDB appears only when the operation
          cannot be expressed with Mongoose, and those answers are labeled
          MongoDB fallback.
        </p>

        <div className="flex gap-3 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                active === t.id
                  ? "bg-sky-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">{children}</div>

        <div className="flex justify-between items-center pt-10 gap-4 flex-wrap">
          {prev ? (
            <Link
              href={prev.href}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              ← {prev.label}
            </Link>
          ) : (
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              ← Home
            </Link>
          )}
          {next ? (
            <Link
              href={next.href}
              className="bg-gradient-to-r from-sky-600 to-cyan-700 hover:from-sky-500 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {next.label} →
            </Link>
          ) : (
            <Link
              href="/"
              className="bg-gradient-to-r from-sky-600 to-cyan-700 hover:from-sky-500 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Home →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
