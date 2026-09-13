// Le fiabe vivono in file YAML sotto `content/fiabe/<lingua>/`, uno per fiaba:
// nessun database, nessuna connessione da tenere aperta, nessuna RAM occupata a
// runtime. Questo modulo li legge e li valida **durante `next build`**, quando
// le pagine vengono pre-generate; il server in produzione serve solo HTML già
// pronto e non rilegge mai questi file.
//
// Non importarlo da un componente client: usa `node:fs`, quindi il bundler si
// rifiuterebbe (i tipi stanno in `story-types.ts`, importabili da entrambi i lati).
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { ART_ICONS, type ArtIcon } from "@/components/reader/PageArt";
import {
  HEALTH_TOPICS,
  MORAL_TOPICS,
  type HealthTopic,
  type MoralTopic,
  type Story,
  type StoryPage,
} from "./story-types";

export const DEFAULT_LOCALE = "it";

const CONTENT_ROOT = path.join(process.cwd(), "content", "fiabe");
const HEX = /^#[0-9a-fA-F]{6}$/;

/** Forma del file YAML: chiavi in italiano, perché sono file d'autore. */
type FiabaYaml = {
  titolo?: unknown;
  descrizione?: unknown;
  eta?: { da?: unknown; a?: unknown };
  temi?: unknown;
  salute?: unknown;
  copertina?: { tinta?: unknown; sagoma?: unknown };
  pagine?: unknown;
};

class ContentError extends Error {
  constructor(file: string, dettaglio: string) {
    super(`Fiaba non valida in content/fiabe/${file}: ${dettaglio}`);
    this.name = "ContentError";
  }
}

function testo(valore: unknown, file: string, campo: string): string {
  if (typeof valore !== "string" || valore.trim() === "") {
    throw new ContentError(file, `"${campo}" deve essere testo non vuoto`);
  }
  return valore.trim();
}

function intero(valore: unknown, file: string, campo: string): number {
  if (typeof valore !== "number" || !Number.isInteger(valore) || valore < 0 || valore > 18) {
    throw new ContentError(file, `"${campo}" deve essere un'età tra 0 e 18`);
  }
  return valore;
}

function tinta(valore: unknown, file: string, campo: string): string {
  const v = testo(valore, file, campo);
  if (!HEX.test(v)) {
    throw new ContentError(file, `"${campo}" deve essere un colore esadecimale, es. "#e07a3f" (trovato "${v}")`);
  }
  return v;
}

function sagoma(valore: unknown, file: string, campo: string): ArtIcon | undefined {
  if (valore === undefined || valore === null) return undefined;
  const v = testo(valore, file, campo);
  if (!(ART_ICONS as readonly string[]).includes(v)) {
    throw new ContentError(file, `"${campo}" vale "${v}", che non è una sagoma disponibile (${ART_ICONS.join(", ")})`);
  }
  return v as ArtIcon;
}

function elenco<T extends string>(
  valore: unknown,
  ammessi: readonly T[],
  file: string,
  campo: string
): T[] {
  if (valore === undefined || valore === null) return [];
  if (!Array.isArray(valore)) {
    throw new ContentError(file, `"${campo}" deve essere un elenco, es. [coraggio, amicizia]`);
  }
  return valore.map((v) => {
    const s = testo(v, file, campo);
    if (!(ammessi as readonly string[]).includes(s)) {
      throw new ContentError(file, `"${campo}" contiene "${s}", che non è previsto (${ammessi.join(", ")})`);
    }
    return s as T;
  });
}

function leggiFiaba(locale: string, nomeFile: string): Story {
  const relativo = `${locale}/${nomeFile}`;
  const grezzo = fs.readFileSync(path.join(CONTENT_ROOT, locale, nomeFile), "utf8");

  let dati: FiabaYaml;
  try {
    dati = parseYaml(grezzo) as FiabaYaml;
  } catch (e) {
    throw new ContentError(relativo, `YAML illeggibile — ${(e as Error).message}`);
  }
  if (!dati || typeof dati !== "object") {
    throw new ContentError(relativo, "il file è vuoto");
  }

  const ageMin = intero(dati.eta?.da, relativo, "eta.da");
  const ageMax = intero(dati.eta?.a, relativo, "eta.a");
  if (ageMin > ageMax) {
    throw new ContentError(relativo, `"eta.da" (${ageMin}) non può superare "eta.a" (${ageMax})`);
  }

  const pagineGrezze = dati.pagine;
  if (!Array.isArray(pagineGrezze) || pagineGrezze.length === 0) {
    throw new ContentError(relativo, '"pagine" deve contenere almeno una pagina');
  }

  const pages: StoryPage[] = pagineGrezze.map((p, i) => {
    const dove = `pagine[${i + 1}]`;
    if (!p || typeof p !== "object") throw new ContentError(relativo, `${dove} non è una pagina`);
    const pagina = p as { testo?: unknown; tinta?: unknown; sagoma?: unknown };
    return {
      order: i + 1,
      text: testo(pagina.testo, relativo, `${dove}.testo`),
      artSeed: tinta(pagina.tinta, relativo, `${dove}.tinta`),
      icon: sagoma(pagina.sagoma, relativo, `${dove}.sagoma`),
    };
  });

  return {
    slug: nomeFile.replace(/\.ya?ml$/, ""),
    title: testo(dati.titolo, relativo, "titolo"),
    description: testo(dati.descrizione, relativo, "descrizione"),
    ageMin,
    ageMax,
    moralTopics: elenco<MoralTopic>(dati.temi, MORAL_TOPICS, relativo, "temi"),
    healthTopics: elenco<HealthTopic>(dati.salute, HEALTH_TOPICS, relativo, "salute"),
    coverSeed: tinta(dati.copertina?.tinta, relativo, "copertina.tinta"),
    coverIcon: sagoma(dati.copertina?.sagoma, relativo, "copertina.sagoma"),
    pages,
  };
}

// I file non cambiano durante un build: leggerli una volta sola basta.
const cache = new Map<string, Story[]>();

export function getStories(locale: string = DEFAULT_LOCALE): Story[] {
  const inCache = cache.get(locale);
  if (inCache) return inCache;

  const cartella = path.join(CONTENT_ROOT, locale);
  if (!fs.existsSync(cartella)) {
    throw new Error(`Nessuna cartella di contenuti per la lingua "${locale}" (attesa: content/fiabe/${locale}/)`);
  }

  const fiabe = fs
    .readdirSync(cartella)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => leggiFiaba(locale, f))
    .sort((a, b) => a.title.localeCompare(b.title, locale));

  cache.set(locale, fiabe);
  return fiabe;
}

export function getStoryBySlug(slug: string, locale: string = DEFAULT_LOCALE): Story | undefined {
  return getStories(locale).find((f) => f.slug === slug);
}
