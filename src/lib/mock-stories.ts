export type MoralTopic = "coraggio" | "condivisione" | "amicizia";
export type HealthTopic = "alimentazione" | "sonno";

export type StoryPage = {
  order: number;
  text: string;
  artSeed: string; // colore di base per l'illustrazione placeholder
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
  pages: StoryPage[];
};

export const stories: Story[] = [
  {
    slug: "la-carota-coraggiosa",
    title: "La carota coraggiosa",
    description:
      "Cico non ha mai voluto assaggiare le verdure, finché una sera non incontra Carotina, che gli racconta perché vale la pena essere coraggiosi anche a tavola.",
    ageMin: 3,
    ageMax: 5,
    moralTopics: ["coraggio"],
    healthTopics: ["alimentazione"],
    coverSeed: "#e07a3f",
    pages: [
      {
        order: 1,
        text: "Cico guardava il piatto con sospetto. C'era di nuovo quella cosa arancione e croccante che sua mamma chiamava carota.",
        artSeed: "#e07a3f",
      },
      {
        order: 2,
        text: "«Non la voglio» disse Cico, incrociando le braccia. Ma la carota, con sua grande sorpresa, gli strizzò l'occhio.",
        artSeed: "#d9a94d",
      },
      {
        order: 3,
        text: "«Mi chiamo Carotina» disse la verdura «e so che fa paura provare cose nuove. Ma un piccolo morso è un piccolo atto di coraggio.»",
        artSeed: "#6e8b7a",
      },
      {
        order: 4,
        text: "Cico ci pensò su, poi ne prese un pezzettino. Croccante, dolce, buonissima! Da quella sera, ogni verdura nuova divenne una piccola avventura.",
        artSeed: "#3f6b59",
      },
    ],
  },
  {
    slug: "il-corvo-che-non-sapeva-condividere",
    title: "Il corvo che non sapeva condividere",
    description:
      "Nerino il corvo nasconde ogni cosa luccicante che trova. Una sera d'inverno impara che tenere tutto per sé, a volte, è la scelta più fredda.",
    ageMin: 5,
    ageMax: 7,
    moralTopics: ["condivisione", "amicizia"],
    healthTopics: [],
    coverSeed: "#333066",
    pages: [
      {
        order: 1,
        text: "Nerino il corvo aveva il nido più pieno del bosco: bottoni, monetine, pezzetti di vetro colorato. Tutto suo, e di nessun altro.",
        artSeed: "#333066",
      },
      {
        order: 2,
        text: "Una notte di neve, il piccolo scoiattolo Nocciola bussò tremante: «Ho freddo, hai un po' di paglia in più?» Nerino scosse la testa.",
        artSeed: "#232244",
      },
      {
        order: 3,
        text: "Nerino restò solo nel suo nido pieno di cose scintillanti, ma quella notte il freddo sembrava entrare lo stesso, dritto nel petto.",
        artSeed: "#5b5468",
      },
      {
        order: 4,
        text: "Il giorno dopo portò metà del suo tesoro a Nocciola. Il nido di Nerino era più vuoto, ma per la prima volta non sentiva più freddo.",
        artSeed: "#8a5f22",
      },
    ],
  },
];

export function getStoryBySlug(slug: string) {
  return stories.find((s) => s.slug === slug);
}
