# Le fiabe

Ogni fiaba è un file YAML in `content/fiabe/<lingua>/`. Non c'è database: questi
file **sono** il contenuto del sito. Vengono letti e validati da
`src/lib/stories.ts` durante `npm run build`, quando Next.js pre-genera una
pagina statica per ciascuna fiaba — a runtime il server non li rilegge mai.

Aggiungere una fiaba = aggiungere un file e ricostruire. Il nome del file (senza
estensione) diventa l'indirizzo della pagina: `la-carota-coraggiosa.yaml` →
`/storie/la-carota-coraggiosa`. Usa solo minuscole, numeri e trattini.

## Come è fatto un file

```yaml
titolo: La carota coraggiosa
descrizione: >-
  Cico non ha mai voluto assaggiare le verdure, finché una sera non incontra
  Carotina, che gli racconta perché vale la pena essere coraggiosi.
eta:
  da: 3
  a: 5
temi: [coraggio]
salute: [alimentazione]
scena:
  cielo: ["#F6BE6E", "#DE7B3F"]
  colline: ["#A85A16", "#6B3A10"]
  luce: "#FFE6BB"
  sagoma: carota
  notte: false
pagine:
  - testo: >-
      Cico guardava il piatto con sospetto. C'era di nuovo quella cosa
      arancione e croccante che sua mamma chiamava carota.
```

L'ordine delle pagine è l'ordine in cui appaiono nel file: non serve numerarle.

## La scena

`scena` è la **direzione artistica di tutta la fiaba**: da quei pochi colori il
sito compone ogni illustrazione a strati — cielo, bagliore della lampada,
stelle, due colline, alberi e il personaggio — copertina compresa. Non serve
scegliere un colore per pagina: **la luce si abbassa da sola** man mano che la
storia avanza, fino al buonanotte. Se una singola pagina mostra un altro
protagonista, si aggiunge solo lì `sagoma: <nome>`.

## Le regole, campo per campo

| Campo | Obbligatorio | Cosa accetta |
| --- | --- | --- |
| `titolo` | sì | Testo. Appare in home, nella copertina e nel titolo della pagina. |
| `descrizione` | sì | Testo. Due righe in home; è quello che fa scegliere la fiaba. |
| `eta.da` / `eta.a` | sì | Numeri interi da 0 a 18, con `da` ≤ `a`. |
| `temi` | no | Elenco tra: `coraggio`, `condivisione`, `amicizia`, `pazienza`, `onestà`, `gentilezza`. Sono i filtri della home. |
| `salute` | no | Elenco tra: `alimentazione`, `sonno`, `movimento`, `igiene`. |
| `scena.cielo` | sì | Coppia di colori esadecimali: alto e basso del cielo. Fra apici, altrimenti YAML legge `#` come commento. |
| `scena.colline` | sì | Coppia di colori: collina lontana e collina vicina. |
| `scena.luce` | sì | Il colore della luce calda (la lampada, la luna, le lucciole). |
| `scena.sagoma` | sì | Il personaggio, una tra: `carota`, `corvo`, `germoglio`, `lucciola`, `ombrello`, `riccio`, `tartaruga`, `gatto`, `volpe`, `orso`, `drago`, `bambina`. |
| `scena.notte` | no | `true` accende stelle e luna. Predefinito `false`. |
| `scena.atmosfera` | no | `neve`, `pioggia` o `lucciole`: cosa si muove nell'aria. |
| `scena.lunaGrande` | no | `true` quando la luna è la protagonista, non un dettaglio. |
| `pagine[].testo` | sì | Il testo della pagina. |
| `pagine[].sagoma` | no | Solo se *questa* pagina mostra un personaggio diverso. |

Se un campo è sbagliato o manca, **il build si ferma** con un messaggio che
nomina il file e il campo: nessuna fiaba rotta arriva online.

## Scrivere la prosa

Usa sempre `>-` per i testi lunghi, come negli esempi: permette di andare a capo
nel file per tenere le righe leggibili, ma il testo resta un paragrafo unico
(i ritorni a capo diventano spazi). Con `|` invece i ritorni a capo verrebbero
mantenuti, e il lettore mostrerebbe righe spezzate a metà.

Le virgolette dei dialoghi sono i caporali italiani: «così». Gli apostrofi non
vanno protetti: dentro `>-` il testo è libero.

## Altre lingue

Una traduzione è la stessa cartella con un'altra lingua: `content/fiabe/en/`,
con gli **stessi nomi di file** (lo slug resta l'identità della fiaba). Le
chiavi restano in italiano: sono struttura, non testo da tradurre.
