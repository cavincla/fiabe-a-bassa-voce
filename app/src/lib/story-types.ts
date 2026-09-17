// Tipi condivisi tra server e client. Stanno in un file a parte perché il
// loader (`stories.ts`) legge dal filesystem e non può essere importato da un
// componente client: i tipi invece servono a entrambi i lati.

export const MORAL_TOPICS = [
  "coraggio",
  "condivisione",
  "amicizia",
  "pazienza",
  "onestà",
  "gentilezza",
] as const;

export const HEALTH_TOPICS = [
  "alimentazione",
  "sonno",
  "movimento",
  "igiene",
] as const;

/** Le sagome disegnabili da `StoryScene`: il personaggio o l'oggetto che
 *  ricorre nella fiaba, ritagliato come una figura di carta sul paesaggio. */
export const SILHOUETTES = [
  "carota",
  "corvo",
  "germoglio",
  "lucciola",
  "ombrello",
  "riccio",
  "tartaruga",
  "gatto",
  "volpe",
  "orso",
  "drago",
  "bambina",
] as const;

/** Cosa si muove nell'aria, se qualcosa si muove. */
export const WEATHERS = ["neve", "pioggia", "lucciole"] as const;

export type MoralTopic = (typeof MORAL_TOPICS)[number];
export type HealthTopic = (typeof HEALTH_TOPICS)[number];
export type Silhouette = (typeof SILHOUETTES)[number];
export type Weather = (typeof WEATHERS)[number];

/** Direzione artistica di una fiaba: da questi pochi valori `StoryScene`
 *  compone tutte le illustrazioni della storia, copertina inclusa. */
export type Scene = {
  sky: readonly [string, string];
  hills: readonly [string, string];
  light: string;
  silhouette: Silhouette;
  night: boolean;
  weather?: Weather;
  bigMoon: boolean;
};

export type StoryPage = {
  order: number;
  text: string;
  /** Solo se questa pagina mostra qualcosa di diverso dal resto della fiaba. */
  silhouette?: Silhouette;
};

export type Story = {
  slug: string;
  title: string;
  description: string;
  ageMin: number;
  ageMax: number;
  moralTopics: MoralTopic[];
  healthTopics: HealthTopic[];
  scene: Scene;
  pages: StoryPage[];
};

/** Minuti di lettura ad alta voce, ~120 parole al minuto, mai meno di due. */
export function readingMinutes(story: Story): number {
  const parole = story.pages.reduce((n, p) => n + p.text.split(/\s+/).length, 0);
  return Math.max(2, Math.round(parole / 120));
}
