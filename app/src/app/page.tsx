"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { stories, type MoralTopic, type HealthTopic } from "@/lib/mock-stories";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageArt } from "@/components/reader/PageArt";

const moralLabels: Record<MoralTopic, string> = {
  coraggio: "Coraggio",
  condivisione: "Condivisione",
  amicizia: "Amicizia",
  pazienza: "Pazienza",
  onestà: "Onestà",
  gentilezza: "Gentilezza",
};

const healthLabels: Record<HealthTopic, string> = {
  alimentazione: "Alimentazione",
  sonno: "Sonno",
  movimento: "Movimento",
  igiene: "Igiene",
};

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(232,162,60,0.16)]"
          : "border-white/15 text-white/65 hover:border-white/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

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
    <main className="bg-background">
      {/* Fascia notturna: soglia fissa del marchio, non segue il tema
          chiaro/scuro del sito — è il rito della sera che il prodotto
          racconta, sempre uguale a sé stesso. */}
      <section className="relative overflow-hidden bg-[#171433] px-6 py-14 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(220px 160px at 88% -10%, rgba(232,162,60,0.28), transparent 70%)," +
              "radial-gradient(2px 2px at 12% 30%, rgba(237,233,249,0.7), transparent 60%)," +
              "radial-gradient(2px 2px at 30% 70%, rgba(237,233,249,0.5), transparent 60%)," +
              "radial-gradient(1.5px 1.5px at 62% 18%, rgba(237,233,249,0.55), transparent 60%)," +
              "radial-gradient(1.5px 1.5px at 78% 55%, rgba(237,233,249,0.45), transparent 60%)," +
              "radial-gradient(1.5px 1.5px at 48% 10%, rgba(237,233,249,0.5), transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                Fiabe a Bassa Voce
              </p>
              <h1 className="mt-2 max-w-sm font-heading text-4xl font-semibold leading-[1.1] text-balance text-white">
                Trova la fiaba giusta per{" "}
                <em className="font-medium italic text-[#f4b968]">stasera</em>
              </h1>
              <p className="mt-3 max-w-sm text-white/60">
                Gratis, per età, per il tema che vuoi affrontare con il tuo bambino.
              </p>
            </div>
            <ThemeToggle className="text-white/70 hover:bg-white/10 hover:text-white" />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[3, 5, 7].map((a) => (
              <FilterChip key={a} active={age === a} onClick={() => setAge(age === a ? null : a)}>
                ~{a} anni
              </FilterChip>
            ))}
            <span className="mx-1 w-px self-stretch bg-white/15" />
            {(Object.keys(moralLabels) as MoralTopic[]).map((m) => (
              <FilterChip key={m} active={moral === m} onClick={() => setMoral(moral === m ? null : m)}>
                {moralLabels[m]}
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/storie/${s.slug}`}
                className="block overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-18px_rgba(23,20,51,0.35)]"
              >
                <div className="h-32 w-full">
                  <PageArt seed={s.coverSeed} label={s.title} />
                </div>
                <div className="p-4">
                  <h2 className="font-heading text-lg font-semibold text-card-foreground">
                    {s.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {s.description}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span>{s.ageMin}–{s.ageMax} anni</span>
                    {s.healthTopics.length > 0 && (
                      <span className="rounded-full border border-border px-2 py-0.5">
                        {s.healthTopics.map((h) => healthLabels[h]).join(", ")}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="col-span-full text-sm text-muted-foreground">
              Nessuna fiaba corrisponde ai filtri scelti.
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}
