"use client";

import Link from "next/link";
import { useState } from "react";

export function Incident({ level, title, symptom, fix }) {
  const [open, setOpen] = useState(false);
  const colors = {
    Junior: "bg-green-600/30 text-green-300 border-green-500/40",
    Mid: "bg-yellow-600/30 text-yellow-300 border-yellow-500/40",
    Senior: "bg-red-600/30 text-red-300 border-red-500/40",
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-black/30">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <span
            className={`text-xs font-bold px-2 py-1 rounded border shrink-0 mt-0.5 ${colors[level]}`}
          >
            {level}
          </span>
          <h3 className="flex-1 font-semibold text-gray-100">{title}</h3>
        </div>
        <pre className="bg-black/50 text-amber-100 text-xs leading-relaxed p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
          {symptom}
        </pre>
        <button
          onClick={() => setOpen(!open)}
          className="mt-3 text-sm font-semibold text-amber-300 hover:text-amber-200"
        >
          {open ? "Hide diagnosis and fix" : "Show diagnosis and fix"}
        </button>
        {open && (
          <pre className="mt-3 bg-emerald-950/40 text-emerald-100 text-xs leading-relaxed p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono border border-emerald-500/20">
            {fix}
          </pre>
        )}
      </div>
    </div>
  );
}

export function Lesson({ title, children }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-amber-200 pt-4">{title}</h3>
      {children}
    </section>
  );
}

export function ScenarioPage({
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-amber-400 hover:text-amber-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-gray-300 mb-3">{subtitle}</p>
        <p className="text-sm text-amber-200/80 mb-8 bg-amber-500/10 border border-amber-400/20 rounded-lg px-4 py-3">
          Each card is a production incident. Read the symptom, then open the
          diagnosis and the Mongoose + Express fix. Native MongoDB is used only
          when Mongoose cannot do the operation.
        </p>
        <div className="flex gap-3 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                active === t.id
                  ? "bg-amber-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">{children}</div>
        <div className="flex justify-between items-center pt-10 gap-4 flex-wrap">
          <Link
            href={prev ? prev.href : "/"}
            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ← {prev ? prev.label : "Home"}
          </Link>
          <Link
            href={next ? next.href : "/"}
            className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {next ? next.label + " →" : "Back to Home →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
