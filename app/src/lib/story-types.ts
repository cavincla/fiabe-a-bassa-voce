// Tipi condivisi tra server e client. Stanno in un file a parte perché il
// loader (`stories.ts`) legge dal filesystem e non può essere importato da un
// componente client: i tipi invece servono a entrambi i lati.
import type { ArtIcon } from "@/components/reader/PageArt";

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

export type MoralTopic = (typeof MORAL_TOPICS)[number];
export type HealthTopic = (typeof HEALTH_TOPICS)[number];

export type StoryPage = {
  order: number;
  text: string;
  artSeed: string; // colore di base per l'illustrazione
  icon?: ArtIcon;
};

export type Story = {
  slug: string;
  title: string;
  description: string;
  ageMin: number;
  ageMax: number;
  moralTopics: MoralTopic[];
  healthTopics: HealthTopic[];
  coverSeed: string;
  coverIcon?: ArtIcon;
  pages: StoryPage[];
};
