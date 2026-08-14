"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PageDraft = { text: string; imageUrl: string };

const moralOptions = ["coraggio", "condivisione", "amicizia"];
const healthOptions = ["alimentazione", "sonno"];

export default function NuovaStoria() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ageMin, setAgeMin] = useState(3);
  const [ageMax, setAgeMax] = useState(6);
  const [moralTopics, setMoralTopics] = useState<string[]>([]);
  const [healthTopics, setHealthTopics] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [pages, setPages] = useState<PageDraft[]>([{ text: "", imageUrl: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function updatePage(index: number, patch: Partial<PageDraft>) {
    setPages((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/storie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        title,
        description,
        ageMin,
        ageMax,
        moralTopics,
        healthTopics,
        coverImageUrl,
        pages,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Salvataggio non riuscito. Il database è collegato?");
      return;
    }

    router.push("/admin/storie");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/storie" className="text-sm text-neutral-500 hover:underline">
        ← Storie
      </Link>

      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        Nuova storia
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Titolo
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Slug (per l&apos;URL)
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="la-carota-coraggiosa"
              className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          Descrizione
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Età minima
            <input
              type="number"
              min={0}
              max={12}
              value={ageMin}
              onChange={(e) => setAgeMin(Number(e.target.value))}
              className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Età massima
            <input
              type="number"
              min={0}
              max={12}
              value={ageMax}
              onChange={(e) => setAgeMax(Number(e.target.value))}
              className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Morale / temi</legend>
          <div className="flex flex-wrap gap-2">
            {moralOptions.map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => toggle(moralTopics, m, setMoralTopics)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  moralTopics.includes(m)
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-300 dark:border-neutral-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Salute</legend>
          <div className="flex flex-wrap gap-2">
            {healthOptions.map((h) => (
              <button
                type="button"
                key={h}
                onClick={() => toggle(healthTopics, h, setHealthTopics)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  healthTopics.includes(h)
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-300 dark:border-neutral-700"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1 text-sm">
          URL immagine di copertina
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://…"
            className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <span className="text-xs text-neutral-500">
            Per ora solo un URL: l&apos;upload diretto arriva con Supabase Storage.
          </span>
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Pagine</p>
            <button
              type="button"
              onClick={() => setPages((p) => [...p, { text: "", imageUrl: "" }])}
              className="text-sm text-neutral-500 hover:underline"
            >
              + Aggiungi pagina
            </button>
          </div>

          <div className="space-y-4">
            {pages.map((page, i) => (
              <div
                key={i}
                className="rounded-lg border border-neutral-300 p-3 dark:border-neutral-700"
              >
                <p className="mb-2 text-xs font-medium text-neutral-500">
                  Pagina {i + 1}
                </p>
                <input
                  value={page.imageUrl}
                  onChange={(e) => updatePage(i, { imageUrl: e.target.value })}
                  placeholder="URL immagine"
                  className="mb-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
                <textarea
                  value={page.text}
                  onChange={(e) => updatePage(i, { text: e.target.value })}
                  placeholder="Testo della pagina"
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPages((p) => p.filter((_, idx) => idx !== i))}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    Rimuovi pagina
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {submitting ? "Salvataggio…" : "Salva come bozza"}
        </button>
      </form>
    </main>
  );
}
