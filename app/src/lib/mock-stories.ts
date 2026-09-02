import type { ArtIcon } from "@/components/reader/PageArt";

export type MoralTopic =
  | "coraggio"
  | "condivisione"
  | "amicizia"
  | "pazienza"
  | "onestà"
  | "gentilezza";
export type HealthTopic = "alimentazione" | "sonno" | "movimento" | "igiene";

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
    coverIcon: "carrot",
    pages: [
      {
        order: 1,
        text: "Cico guardava il piatto con sospetto. C'era di nuovo quella cosa arancione e croccante che sua mamma chiamava carota.",
        artSeed: "#e07a3f",
        icon: "carrot",
      },
      {
        order: 2,
        text: "«Non la voglio» disse Cico, incrociando le braccia. Ma la carota, con sua grande sorpresa, gli strizzò l'occhio.",
        artSeed: "#d9a94d",
        icon: "carrot",
      },
      {
        order: 3,
        text: "«Mi chiamo Carotina» disse la verdura «e so che fa paura provare cose nuove. Ma un piccolo morso è un piccolo atto di coraggio.»",
        artSeed: "#6e8b7a",
        icon: "carrot",
      },
      {
        order: 4,
        text: "Cico ci pensò su, poi ne prese un pezzettino. Croccante, dolce, buonissima! Da quella sera, ogni verdura nuova divenne una piccola avventura.",
        artSeed: "#3f6b59",
        icon: "carrot",
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
    coverIcon: "raven",
    pages: [
      {
        order: 1,
        text: "Nerino il corvo aveva il nido più pieno del bosco: bottoni, monetine, pezzetti di vetro colorato. Tutto suo, e di nessun altro.",
        artSeed: "#333066",
        icon: "raven",
      },
      {
        order: 2,
        text: "Una notte di neve, il piccolo scoiattolo Nocciola bussò tremante: «Ho freddo, hai un po' di paglia in più?» Nerino scosse la testa.",
        artSeed: "#232244",
        icon: "raven",
      },
      {
        order: 3,
        text: "Nerino restò solo nel suo nido pieno di cose scintillanti, ma quella notte il freddo sembrava entrare lo stesso, dritto nel petto.",
        artSeed: "#5b5468",
        icon: "raven",
      },
      {
        order: 4,
        text: "Il giorno dopo portò metà del suo tesoro a Nocciola. Il nido di Nerino era più vuoto, ma per la prima volta non sentiva più freddo.",
        artSeed: "#8a5f22",
        icon: "raven",
      },
    ],
  },
  {
    slug: "il-seme-che-non-voleva-aspettare",
    title: "Il seme che non voleva aspettare",
    description:
      "Nocciolina il seme vuole diventare subito un albero enorme. Una lumaca gentile le insegna che le cose belle, per crescere, hanno bisogno di tempo.",
    ageMin: 4,
    ageMax: 6,
    moralTopics: ["pazienza"],
    healthTopics: [],
    coverSeed: "#4a7c3f",
    coverIcon: "sprout",
    pages: [
      {
        order: 1,
        text: "Nocciolina era un piccolo seme appena caduto nella terra scura. «Voglio essere già un albero!» borbottava, spingendo con tutte le sue forze.",
        artSeed: "#6fae55",
        icon: "sprout",
      },
      {
        order: 2,
        text: "Passò una lumaca lucida e lenta. «Perché tanta fretta?» chiese. «Perché aspettare è noiosissimo!» rispose Nocciolina, spingendo ancora più forte.",
        artSeed: "#4a7c3f",
        icon: "sprout",
      },
      {
        order: 3,
        text: "«Guarda me» disse la lumaca. «Faccio un passo alla volta, eppure arrivo sempre dove voglio andare.» Nocciolina si fermò un momento, quasi senza fiato.",
        artSeed: "#dfc36a",
        icon: "sprout",
      },
      {
        order: 4,
        text: "Così Nocciolina smise di spingere e cominciò semplicemente a respirare la pioggia, il sole, il buio della notte. Un giorno dopo l'altro, senza più fretta.",
        artSeed: "#3f6b4a",
        icon: "sprout",
      },
      {
        order: 5,
        text: "Una mattina di primavera, senza che se ne accorgesse, una minuscola foglia verde spuntò dalla terra. Le cose belle, aveva imparato, arrivano quando è il momento giusto.",
        artSeed: "#2f5c3f",
        icon: "sprout",
      },
    ],
  },
  {
    slug: "la-lucciola-che-aveva-paura-del-buio",
    title: "La lucciola che aveva paura del buio",
    description:
      "Buffa la lucciola ha una lucina tutta sua, ma di notte si nasconde lo stesso. Le altre lucciole le mostrano che la propria luce basta a rischiarare la paura.",
    ageMin: 3,
    ageMax: 5,
    moralTopics: ["coraggio"],
    healthTopics: ["sonno"],
    coverSeed: "#f4c15a",
    coverIcon: "firefly",
    pages: [
      {
        order: 1,
        text: "Buffa era una lucciola con una lucina gialla proprio sulla pancia. Ma ogni sera, quando il cielo si scuriva, si nascondeva sotto una foglia tremando.",
        artSeed: "#d9a94d",
        icon: "firefly",
      },
      {
        order: 2,
        text: "«Il buio è troppo grande» diceva. «E se mi perdessi dentro?» Le altre lucciole danzavano nel prato, lasciando dietro di sé piccole scie dorate.",
        artSeed: "#33285a",
        icon: "firefly",
      },
      {
        order: 3,
        text: "Una lucciola anziana si posò accanto a lei. «Non devi vedere tutto il buio insieme» le disse piano. «Basta accendere la tua luce, un pezzetto alla volta.»",
        artSeed: "#171433",
        icon: "firefly",
      },
      {
        order: 4,
        text: "Buffa fece un respiro profondo e lasciò accendere la sua lucina. Il buio intorno non sparì, ma quel piccolo cerchio dorato era tutto suo, ed era abbastanza.",
        artSeed: "#241f45",
        icon: "firefly",
      },
      {
        order: 5,
        text: "Quella notte Buffa volò tra i fili d'erba, e per la prima volta il buio non le sembrò più una cosa da cui scappare, ma un cielo tutto da illuminare.",
        artSeed: "#f4c15a",
        icon: "firefly",
      },
    ],
  },
  {
    slug: "due-amiche-e-un-solo-ombrello",
    title: "Due amiche e un solo ombrello",
    description:
      "Improvvisa pioggia sulla via di casa, un solo ombrello per due amiche. Mati e Sole scoprono che condividere qualcosa di piccolo può renderlo abbastanza grande per tutti.",
    ageMin: 4,
    ageMax: 6,
    moralTopics: ["condivisione", "amicizia"],
    healthTopics: [],
    coverSeed: "#3f7ea8",
    coverIcon: "umbrella",
    pages: [
      {
        order: 1,
        text: "Mati e Sole uscirono da scuola proprio mentre il cielo si apriva in un temporale. Solo Mati aveva portato l'ombrello, piccolo e a righe blu.",
        artSeed: "#6fa8c9",
        icon: "umbrella",
      },
      {
        order: 2,
        text: "«Puoi stare sotto anche tu» disse Mati, ma l'ombrello era stretto, e a ogni passo una spalla restava fuori, bagnata dalla pioggia fredda.",
        artSeed: "#3f7ea8",
        icon: "umbrella",
      },
      {
        order: 3,
        text: "Sole si fermò. «E se camminassimo più vicine, appoggiate una all'altra?» Provarono, ridendo, ad andare alla stessa velocità, un passo dopo l'altro.",
        artSeed: "#2b5b7a",
        icon: "umbrella",
      },
      {
        order: 4,
        text: "Sotto quel piccolo cerchio a righe blu, strette l'una all'altra, non c'era più spazio per il freddo. La pioggia batteva sopra, ma dentro faceva quasi caldo.",
        artSeed: "#234a63",
        icon: "umbrella",
      },
      {
        order: 5,
        text: "Arrivarono a casa fradice solo sulle scarpe, ridendo a crepapelle. Da quel giorno, ogni volta che pioveva, si cercavano prima ancora di uscire da scuola.",
        artSeed: "#3f7ea8",
        icon: "umbrella",
      },
    ],
  },
  {
    slug: "il-riccio-che-disse-la-verita",
    title: "Il riccio che disse la verità",
    description:
      "Pino il riccio ha rotto per sbaglio il fischietto di legno del nonno. Nascondere l'accaduto sembra la via più facile, finché non scopre che dire la verità pesa molto meno.",
    ageMin: 5,
    ageMax: 7,
    moralTopics: ["onestà"],
    healthTopics: [],
    coverSeed: "#8a5a3f",
    coverIcon: "hedgehog",
    pages: [
      {
        order: 1,
        text: "Pino stava giocando a palla in salotto, anche se sapeva di non doverlo fare. La palla rimbalzò contro la mensola e il fischietto di legno del nonno cadde, spaccandosi in due.",
        artSeed: "#a9754f",
        icon: "hedgehog",
      },
      {
        order: 2,
        text: "Il cuore di Pino batteva forte. Prese i due pezzi e li nascose in fondo al cassetto, sotto le calze. «Nessuno se ne accorgerà» si disse, ma non ci credeva davvero.",
        artSeed: "#8a5a3f",
        icon: "hedgehog",
      },
      {
        order: 3,
        text: "Per tutta la sera, ogni volta che il nonno gli sorrideva, Pino sentiva un peso strano nello stomaco, come un sasso ingoiato per sbaglio.",
        artSeed: "#6b4530",
        icon: "hedgehog",
      },
      {
        order: 4,
        text: "Prima di andare a dormire, Pino tornò in salotto con i due pezzi in mano. «Nonno, ho rotto il tuo fischietto giocando dove non dovevo. Mi dispiace tanto.»",
        artSeed: "#543522",
        icon: "hedgehog",
      },
      {
        order: 5,
        text: "Il nonno lo guardò a lungo, poi sorrise piano. «Un fischietto si aggiusta con la colla. La verità di un nipote, quella non si aggiusta se si rompe.» Il sasso nello stomaco di Pino sparì.",
        artSeed: "#8a5a3f",
        icon: "hedgehog",
      },
    ],
  },
  {
    slug: "la-tartaruga-che-imparo-a-correre-piano",
    title: "La tartaruga che imparò a correre piano",
    description:
      "Tilla la tartaruga vuole tenere il passo dei suoi amici veloci e finisce sempre stanca e triste. Un vecchio airone del laghetto le insegna il valore di andare alla propria velocità.",
    ageMin: 4,
    ageMax: 6,
    moralTopics: ["pazienza"],
    healthTopics: ["movimento"],
    coverSeed: "#3f6b59",
    coverIcon: "turtle",
    pages: [
      {
        order: 1,
        text: "Tilla guardava i suoi amici scoiattoli e lepri sfrecciare da un capo all'altro del prato. Provava a correre anche lei, ma dopo tre passi era già senza fiato.",
        artSeed: "#4a8a6e",
        icon: "turtle",
      },
      {
        order: 2,
        text: "«Aspettatemi!» gridava sempre, arrivando ultima, con le zampe stanche e il cuore un po' triste. Gli altri, gentili, la aspettavano, ma lei si sentiva comunque lenta e sbagliata.",
        artSeed: "#3f6b59",
        icon: "turtle",
      },
      {
        order: 3,
        text: "Un vecchio airone del laghetto la vide fermarsi, sfinita. «Perché corri come una lepre, se sei nata tartaruga?» le chiese, senza cattiveria, solo con curiosità.",
        artSeed: "#2f5346",
        icon: "turtle",
      },
      {
        order: 4,
        text: "Tilla ci pensò su. Quel giorno, invece di correre, camminò con calma lungo il sentiero, osservando ogni fiore, ogni sasso lucido, ogni nuvola nel cielo.",
        artSeed: "#274238",
        icon: "turtle",
      },
      {
        order: 5,
        text: "Arrivò ultima, come sempre. Ma per la prima volta non era stanca né triste: aveva visto cose che gli altri, di corsa, si erano persi del tutto.",
        artSeed: "#3f6b59",
        icon: "turtle",
      },
    ],
  },
  {
    slug: "il-gatto-che-non-voleva-lavarsi",
    title: "Il gatto che non voleva lavarsi",
    description:
      "Baffo il gattino trova la propria lingua troppo faticosa per lavarsi il pelo. Una giornata tra i cespugli gli mostra perché prendersi cura di sé è un piccolo gesto d'amore.",
    ageMin: 3,
    ageMax: 5,
    moralTopics: [],
    healthTopics: ["igiene"],
    coverSeed: "#c96a5c",
    coverIcon: "cat",
    pages: [
      {
        order: 1,
        text: "Baffo era il gattino più pigro del cortile. Ogni sera, quando sua madre iniziava a lavargli il pelo con la lingua ruvida, lui scappava a nascondersi dietro il vaso di gerani.",
        artSeed: "#e08a7a",
        icon: "cat",
      },
      {
        order: 2,
        text: "«È troppo lungo, troppo noioso!» miagolava. Preferiva rotolarsi nella terra e nell'erba, lasciando che il pelo si riempisse di semini, foglioline e piccoli grumi appiccicosi.",
        artSeed: "#c96a5c",
        icon: "cat",
      },
      {
        order: 3,
        text: "Un giorno provò a correre veloce come sempre, ma il pelo incollato gli tirava, gli pizzicava, e persino il naso gli prudeva senza sosta.",
        artSeed: "#a8503f",
        icon: "cat",
      },
      {
        order: 4,
        text: "Sua madre lo trovò tutto arruffato dietro il vaso. Senza dire nulla, cominciò a pulirlo pian piano, un ciuffo alla volta, con pazienza infinita.",
        artSeed: "#8a3f30",
        icon: "cat",
      },
      {
        order: 5,
        text: "Baffo scoprì che, una volta pulito, correre era di nuovo leggero e veloce come il vento. Da quella sera, aspettò lui stesso il momento di farsi lavare il pelo.",
        artSeed: "#c96a5c",
        icon: "cat",
      },
    ],
  },
  {
    slug: "la-volpe-che-rubava-le-stelle",
    title: "La volpe che rubava le stelle",
    description:
      "Rossana la volpe raccoglie di nascosto le stelline cadute nel bosco, tenendole tutte per sé in una tana scintillante. Il bosco al buio le insegna cosa significa davvero condividere la luce.",
    ageMin: 5,
    ageMax: 7,
    moralTopics: ["condivisione", "onestà"],
    healthTopics: [],
    coverSeed: "#2b2856",
    coverIcon: "fox",
    pages: [
      {
        order: 1,
        text: "Ogni notte, quando una stella cadeva nel bosco, Rossana la volpe correva a raccoglierla prima di chiunque altro, portandola di nascosto nella sua tana sotto la quercia.",
        artSeed: "#3d3a70",
        icon: "fox",
      },
      {
        order: 2,
        text: "La sua tana ormai scintillava come un piccolo cielo tutto per sé. Ma fuori, il bosco era diventato buio, sempre più buio, notte dopo notte.",
        artSeed: "#2b2856",
        icon: "fox",
      },
      {
        order: 3,
        text: "Gli animali del bosco iniziarono a inciampare nei sentieri, a perdersi tra gli alberi. «Dove sono finite tutte le nostre stelle?» si chiedevano, spaventati.",
        artSeed: "#201d40",
        icon: "fox",
      },
      {
        order: 4,
        text: "Rossana guardò la sua tana piena di luce e poi pensò al bosco buio fuori. Per la prima volta si vergognò di quel bagliore tutto suo.",
        artSeed: "#171433",
        icon: "fox",
      },
      {
        order: 5,
        text: "Portò fuori le stelle, una a una, e le rimise a danzare nel cielo sopra gli alberi. Il bosco tornò a brillare per tutti, e Rossana, dalla sua tana ora buia, si sentì stranamente più leggera.",
        artSeed: "#2b2856",
        icon: "fox",
      },
    ],
  },
  {
    slug: "il-piccolo-orso-e-la-torta-di-miele",
    title: "Il piccolo orso e la torta di miele",
    description:
      "Bruno l'orsetto ha preparato una torta di miele solo per sé, ma davanti alla porta trova tre amici affamati. Scopre che una torta condivisa sa ancora più buona.",
    ageMin: 3,
    ageMax: 5,
    moralTopics: ["condivisione"],
    healthTopics: ["alimentazione"],
    coverSeed: "#c98a2e",
    coverIcon: "bear",
    pages: [
      {
        order: 1,
        text: "Bruno l'orsetto aveva impastato per tutto il pomeriggio: farina, miele dorato e un pizzico di cannella. La torta uscì dal forno profumata e perfetta, tutta per lui.",
        artSeed: "#e0a94a",
        icon: "bear",
      },
      {
        order: 2,
        text: "Stava per tagliarsene una grande fetta quando bussarono alla porta: il tasso Tobia, lo scoiattolo Nino e la piccola lepre Mora, con la pancia che brontolava.",
        artSeed: "#c98a2e",
        icon: "bear",
      },
      {
        order: 3,
        text: "«Che buon profumo!» disse Tobia, guardando la torta con occhi grandi. Bruno strinse il piatto al petto. «È mia» pensò, ma non riuscì a dirlo ad alta voce.",
        artSeed: "#a8701f",
        icon: "bear",
      },
      {
        order: 4,
        text: "Guardò i suoi amici, poi la torta, poi di nuovo i suoi amici. Prese il coltello e cominciò a tagliare quattro fette, una per ciascuno, l'ultima più piccola per sé.",
        artSeed: "#8a5c18",
        icon: "bear",
      },
      {
        order: 5,
        text: "Seduti tutti insieme sul prato, la torta sparì in pochi minuti tra risate e briciole di miele sui musi. Bruno pensò che non l'aveva mai sentita così buona.",
        artSeed: "#c98a2e",
        icon: "bear",
      },
    ],
  },
  {
    slug: "il-drago-che-aveva-paura-di-volare",
    title: "Il drago che aveva paura di volare",
    description:
      "Ignazio è un draghetto con ali enormi che non ha mai osato aprire. Un salto dalla cima della montagna gli insegna che il coraggio, a volte, è solo un primo battito d'ali.",
    ageMin: 5,
    ageMax: 8,
    moralTopics: ["coraggio"],
    healthTopics: [],
    coverSeed: "#7a2d2d",
    coverIcon: "dragon",
    pages: [
      {
        order: 1,
        text: "Ignazio era un draghetto rosso con ali enormi, più grandi di quelle di ogni altro drago della montagna. Eppure non le aveva mai aperte davvero, nemmeno una volta.",
        artSeed: "#a8433f",
        icon: "dragon",
      },
      {
        order: 2,
        text: "«E se cadessi?» pensava, guardando gli altri draghetti volteggiare nel cielo sopra le nuvole. Restava sempre sul bordo della roccia, con le ali strette al corpo.",
        artSeed: "#7a2d2d",
        icon: "dragon",
      },
      {
        order: 3,
        text: "Un vecchio drago con la barba di fumo si sedette accanto a lui. «Le ali non servono a non cadere» disse. «Servono a decidere dove andare, mentre cadi.»",
        artSeed: "#5c2020",
        icon: "dragon",
      },
      {
        order: 4,
        text: "Ignazio chiuse gli occhi, respirò forte, e si lasciò cadere dal bordo della roccia. Per un istante lunghissimo ci fu solo vento, e nient'altro sotto di lui.",
        artSeed: "#3f1616",
        icon: "dragon",
      },
      {
        order: 5,
        text: "Poi le sue ali si aprirono da sole, enormi e dorate nel sole del tramonto, e Ignazio smise di cadere e cominciò, finalmente, a volare.",
        artSeed: "#7a2d2d",
        icon: "dragon",
      },
    ],
  },
  {
    slug: "la-bambina-che-parlava-con-la-luna",
    title: "La bambina che parlava con la luna",
    description:
      "Ogni sera Vera non riesce a prendere sonno, finché non scopre di poter raccontare le sue giornate alla luna dalla finestra. Un piccolo rito che rende la notte meno grande.",
    ageMin: 4,
    ageMax: 6,
    moralTopics: ["gentilezza"],
    healthTopics: ["sonno"],
    coverSeed: "#171433",
    coverIcon: "moon",
    pages: [
      {
        order: 1,
        text: "Vera restava sveglia nel suo letto ogni sera, con la testa piena di pensieri che giravano come trottole: la scuola, i litigi, le cose non dette durante il giorno.",
        artSeed: "#201c48",
        icon: "moon",
      },
      {
        order: 2,
        text: "Una notte, guardando fuori dalla finestra, vide la luna tonda e silenziosa sopra i tetti. «Ciao» le sussurrò piano, tanto per provare. La luna non rispose, ma sembrò ascoltare.",
        artSeed: "#171433",
        icon: "moon",
      },
      {
        order: 3,
        text: "Da quella sera, Vera cominciò a raccontarle tutto: la caduta in cortile, la torta buona, l'amica che le mancava. Parola dopo parola, i pensieri si facevano più leggeri.",
        artSeed: "#2b2650",
        icon: "moon",
      },
      {
        order: 4,
        text: "«Grazie per avermi ascoltata» diceva sempre, alla fine, prima di tirare su le coperte. La luna restava lì, paziente, come fa da sempre con chiunque alzi lo sguardo.",
        artSeed: "#33285a",
        icon: "moon",
      },
      {
        order: 5,
        text: "Vera scoprì che raccontare la giornata a qualcuno, anche solo a una luna silenziosa, era il modo più dolce per lasciarla andare e finalmente addormentarsi.",
        artSeed: "#f4b968",
        icon: "moon",
      },
    ],
  },
];

export function getStoryBySlug(slug: string) {
  return stories.find((s) => s.slug === slug);
}
