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
copertina:
  tinta: "#e07a3f"
  sagoma: carrot
pagine:
  - testo: >-
      Cico guardava il piatto con sospetto. C'era di nuovo quella cosa
      arancione e croccante che sua mamma chiamava carota.
    tinta: "#e07a3f"
    sagoma: carrot
```

L'ordine delle pagine è l'ordine in cui appaiono nel file: non serve numerarle.

## Le regole, campo per campo

| Campo | Obbligatorio | Cosa accetta |
| --- | --- | --- |
| `titolo` | sì | Testo. Appare in home, nella copertina e nel titolo della pagina. |
| `descrizione` | sì | Testo. Due righe in home; è quello che fa scegliere la fiaba. |
| `eta.da` / `eta.a` | sì | Numeri interi da 0 a 18, con `da` ≤ `a`. |
| `temi` | no | Elenco tra: `coraggio`, `condivisione`, `amicizia`, `pazienza`, `onestà`, `gentilezza`. Sono i filtri della home. |
| `salute` | no | Elenco tra: `alimentazione`, `sonno`, `movimento`, `igiene`. |
| `copertina.tinta` | sì | Colore esadecimale a 6 cifre, es. `"#e07a3f"` — va tra apici, altrimenti YAML legge `#` come inizio di commento. |
| `copertina.sagoma` | no | Una tra: `carrot`, `raven`, `sprout`, `firefly`, `umbrella`, `hedgehog`, `turtle`, `cat`, `fox`, `bear`, `dragon`, `moon`. |
| `pagine[].testo` | sì | Il testo della pagina. |
| `pagine[].tinta` | sì | Come `copertina.tinta`. |
| `pagine[].sagoma` | no | Come `copertina.sagoma`. |

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
