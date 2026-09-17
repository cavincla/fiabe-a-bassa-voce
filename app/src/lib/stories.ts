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
import {
  HEALTH_TOPICS,
  MORAL_TOPICS,
  SILHOUETTES,
  WEATHERS,
  type HealthTopic,
  type MoralTopic,
  type Scene,
  type Silhouette,
  type Story,
  type StoryPage,
  type Weather,
} from "./story-types";

export const DEFAULT_LOCALE = "it";

const CONTENT_ROOT = path.join(process.cwd(), "content", "fiabe");
const HEX = /^#[0-9a-fA-F]{6}$/;

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

function colore(valore: unknown, file: string, campo: string): string {
  const v = testo(valore, file, campo);
  if (!HEX.test(v)) {
    throw new ContentError(file, `"${campo}" deve essere un colore esadecimale, es. "#e07a3f" (trovato "${v}")`);
  }
  return v;
}

function coppiaColori(valore: unknown, file: string, campo: string): readonly [string, string] {
  if (!Array.isArray(valore) || valore.length !== 2) {
    throw new ContentError(file, `"${campo}" deve essere una coppia di colori, es. ["#4E4184", "#1A1740"]`);
  }
  return [colore(valore[0], file, `${campo}[1]`), colore(valore[1], file, `${campo}[2]`)] as const;
}

function daElenco<T extends string>(
  valore: unknown,
  ammessi: readonly T[],
  file: string,
  campo: string
): T {
  const v = testo(valore, file, campo);
  if (!(ammessi as readonly string[]).includes(v)) {
    throw new ContentError(file, `"${campo}" vale "${v}", che non è previsto (${ammessi.join(", ")})`);
  }
  return v as T;
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
  return valore.map((v) => daElenco(v, ammessi, file, campo));
}

function booleano(valore: unknown, file: string, campo: string, predefinito: boolean): boolean {
  if (valore === undefined || valore === null) return predefinito;
  if (typeof valore !== "boolean") {
    throw new ContentError(file, `"${campo}" deve essere true o false`);
  }
  return valore;
}

function leggiScena(valore: unknown, file: string): Scene {
  if (!valore || typeof valore !== "object") {
    throw new ContentError(file, '"scena" manca: serve la direzione artistica (cielo, colline, luce, sagoma)');
  }
  const s = valore as Record<string, unknown>;
  return {
    sky: coppiaColori(s.cielo, file, "scena.cielo"),
    hills: coppiaColori(s.colline, file, "scena.colline"),
    light: colore(s.luce, file, "scena.luce"),
    silhouette: daElenco<Silhouette>(s.sagoma, SILHOUETTES, file, "scena.sagoma"),
    night: booleano(s.notte, file, "scena.notte", false),
    weather:
      s.atmosfera === undefined || s.atmosfera === null
        ? undefined
        : daElenco<Weather>(s.atmosfera, WEATHERS, file, "scena.atmosfera"),
    bigMoon: booleano(s.lunaGrande, file, "scena.lunaGrande", false),
  };
}

function leggiFiaba(locale: string, nomeFile: string): Story {
  const relativo = `${locale}/${nomeFile}`;
  const grezzo = fs.readFileSync(path.join(CONTENT_ROOT, locale, nomeFile), "utf8");

  let dati: Record<string, unknown>;
  try {
    dati = parseYaml(grezzo) as Record<string, unknown>;
  } catch (e) {
    throw new ContentError(relativo, `YAML illeggibile — ${(e as Error).message}`);
  }
  if (!dati || typeof dati !== "object") {
    throw new ContentError(relativo, "il file è vuoto");
  }

  const eta = (dati.eta ?? {}) as Record<string, unknown>;
  const ageMin = intero(eta.da, relativo, "eta.da");
  const ageMax = intero(eta.a, relativo, "eta.a");
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
    const pagina = p as Record<string, unknown>;
    return {
      order: i + 1,
      text: testo(pagina.testo, relativo, `${dove}.testo`),
      silhouette:
        pagina.sagoma === undefined || pagina.sagoma === null
          ? undefined
          : daElenco<Silhouette>(pagina.sagoma, SILHOUETTES, relativo, `${dove}.sagoma`),
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
    scene: leggiScena(dati.scena, relativo),
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
