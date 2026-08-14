"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug (per l&apos;URL)</Label>
            <Input
              id="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="la-carota-coraggiosa"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Descrizione</Label>
          <Textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ageMin">Età minima</Label>
            <Input
              id="ageMin"
              type="number"
              min={0}
              max={12}
              value={ageMin}
              onChange={(e) => setAgeMin(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ageMax">Età massima</Label>
            <Input
              id="ageMax"
              type="number"
              min={0}
              max={12}
              value={ageMax}
              onChange={(e) => setAgeMax(Number(e.target.value))}
            />
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Morale / temi</legend>
          <div className="flex flex-wrap gap-2">
            {moralOptions.map((m) => (
              <Button
                type="button"
                key={m}
                size="sm"
                variant={moralTopics.includes(m) ? "default" : "outline"}
                onClick={() => toggle(moralTopics, m, setMoralTopics)}
              >
                {m}
              </Button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Salute</legend>
          <div className="flex flex-wrap gap-2">
            {healthOptions.map((h) => (
              <Button
                type="button"
                key={h}
                size="sm"
                variant={healthTopics.includes(h) ? "default" : "outline"}
                onClick={() => toggle(healthTopics, h, setHealthTopics)}
              >
                {h}
              </Button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coverImageUrl">URL immagine di copertina</Label>
          <Input
            id="coverImageUrl"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://…"
          />
          <span className="text-xs text-muted-foreground">
            Per ora solo un URL: l&apos;upload diretto arriva con Supabase Storage.
          </span>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Pagine</p>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto p-0 text-muted-foreground"
              onClick={() => setPages((p) => [...p, { text: "", imageUrl: "" }])}
            >
              + Aggiungi pagina
            </Button>
          </div>

          <div className="space-y-4">
            {pages.map((page, i) => (
              <Card key={i} size="sm">
                <CardContent className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Pagina {i + 1}
                  </p>
                  <Input
                    value={page.imageUrl}
                    onChange={(e) => updatePage(i, { imageUrl: e.target.value })}
                    placeholder="URL immagine"
                  />
                  <Textarea
                    value={page.text}
                    onChange={(e) => updatePage(i, { text: e.target.value })}
                    placeholder="Testo della pagina"
                    rows={2}
                  />
                  {pages.length > 1 && (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-destructive"
                      onClick={() => setPages((p) => p.filter((_, idx) => idx !== i))}
                    >
                      Rimuovi pagina
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvataggio…" : "Salva come bozza"}
        </Button>
      </form>
    </main>
  );
}
