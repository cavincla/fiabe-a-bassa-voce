"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { stories, type MoralTopic, type HealthTopic } from "@/lib/mock-stories";
import { ThemeToggle } from "@/components/theme-toggle";

const moralLabels: Record<MoralTopic, string> = {
  coraggio: "Coraggio",
  condivisione: "Condivisione",
  amicizia: "Amicizia",
};

const healthLabels: Record<HealthTopic, string> = {
  alimentazione: "Alimentazione",
  sonno: "Sonno",
};

export default function Home() {
  const [age, setAge] = useState<number | null>(null);
  const [moral, setMoral] = useState<MoralTopic | null>(null);

  const filtered = useMemo(
    () =>
      stories.filter((s) => {
        const ageMatch = age === null || (age >= s.ageMin && age <= s.ageMax);
        const moralMatch = moral === null || s.moralTopics.includes(moral);
        return ageMatch && moralMatch;
      }),
    [age, moral]
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">Fiabe a Bassa Voce</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Trova la fiaba giusta per stasera
          </h1>
          <p className="mt-2 max-w-prose text-neutral-600 dark:text-neutral-400">
            Gratis, per età, per il tema che vuoi affrontare con il tuo bambino.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {[3, 5, 7].map((a) => (
          <button
            key={a}
            onClick={() => setAge(age === a ? null : a)}
            className={`rounded-full border px-3 py-1 text-sm ${
              age === a
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300"
            }`}
          >
            ~{a} anni
          </button>
        ))}
        <span className="mx-1 self-center text-neutral-300">|</span>
        {(Object.keys(moralLabels) as MoralTopic[]).map((m) => (
          <button
            key={m}
            onClick={() => setMoral(moral === m ? null : m)}
            className={`rounded-full border px-3 py-1 text-sm ${
              moral === m
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300"
            }`}
          >
            {moralLabels[m]}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {filtered.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/storie/${s.slug}`}
              className="block rounded-xl border border-black/10 p-4 transition hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
            >
              <div
                className="mb-3 h-24 rounded-lg"
                style={{ background: s.coverSeed }}
              />
              <h2 className="font-semibold">{s.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                {s.description}
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                {s.ageMin}–{s.ageMax} anni
                {s.healthTopics.length > 0 &&
                  ` · ${s.healthTopics.map((h) => healthLabels[h]).join(", ")}`}
              </p>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="col-span-full text-sm text-neutral-500">
            Nessuna fiaba corrisponde ai filtri scelti.
          </li>
        )}
      </ul>
    </main>
  );
}
