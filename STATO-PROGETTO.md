# Stato del progetto — Fiabe a Bassa Voce

> Scritto il 14 agosto 2026, aggiornato il 15 agosto 2026. Se apri una
> nuova sessione Claude Code, aprila in **questa cartella**
> (`~/personale/fiabe-a-bassa-voce`), non in `~/personale`: da lì Claude
> non vede il repository git né può eseguire `./run.sh`.

## Cos'è

PWA gratuita per aiutare i genitori a trovare fiabe per bambini, filtrabili
per età, morale/tema trattato e aspetti di salute (alimentazione, sonno...).
Lettore multimediale a pagine oggi; audiolibro, generazione AI delle storie
e internazionalizzazione in fasi successive.

Il **piano di evoluzione prodotto completo** (7 fasi, dal MVP al
merchandising, con roadmap lingue e note su privacy/minori) è in un
artifact pubblicato in una conversazione precedente:
https://claude.ai/code/artifact/ef51ecac-7308-4dd2-84d7-41f9d650539f
(privato finché non lo condividi tu). Questo file copre solo lo stato
tecnico e i prossimi passi immediati, non ripete il piano di prodotto.

## Cosa esiste già

> Questa sezione è un registro in ordine cronologico. Le voci che parlano di
> Prisma, Postgres e dell'editor di storie nell'admin descrivono com'era il
> progetto fino al 12 settembre 2026: il database è stato rimosso il giorno
> dopo (ultima voce della sezione).

**Scaffold applicativo** (commit `a1c8323`):
- Area pubblica: home con filtri età/morale, lettore multimediale a pagine
  (`/storie/[slug]`) con due fiabe di esempio scritte per l'occasione
- Area admin: elenco storie ed editor per crearne di nuove (titolo, età,
  tag morale/salute, pagine con testo + URL immagine), collegata via API
  a Prisma
- Schema dati (Story/Page con traduzioni multilingua, tassonomie età/
  morale/salute) già pensato per l'internazionalizzazione futura
- PWA installabile: manifest + service worker (Serwist)

**Ambiente dockerizzato** (commit `9ce9123`), stesso pattern di
`~/personale/template-project-python` e di `fanta-web`/`fanta-api`:
- Codice sotto `app/`, `.build/dockerfiles/Dockerfile` multi-stage
  (base/dev/build/assets/dist), `docker-compose.yml` con Postgres locale,
  `run.sh` con i flag `-s`/`-t`/`-d`/`-i`
- Utente non-root `bob` nel container, uid/gid dell'host mappati
- Postgres locale su porta **5433** (non 5432, occupata da `fanta-api`)

**Aggiornamento dipendenze** (commit `b64e051`), fatto dentro Docker
(Node 22 nel container, quindi senza i vincoli di versione di Node 18
incontrati sviluppando in locale):
- Next.js 15 → **16**, Tailwind v3 → **v4** (config CSS-first),
  Prisma 5 → **7** (passato ai driver adapter, niente più motore Rust
  imbarcato), **shadcn/ui** inizializzato con un primo set di componenti

**Dark mode** (commit `0cda25f`): toggle manuale con `next-themes`
(luna/sole in home e in `/admin`), parte comunque da "system" come default.

**Admin migrato a shadcn/ui + Supabase Auth scaffoldato** (sessione del
15 agosto, da committare):
- `/admin/storie/nuova`, `/admin/storie`, `/admin` ora usano i componenti
  `Button`/`Input`/`Textarea`/`Label`/`Card`/`Badge` invece di HTML scritto
  a mano — testato end-to-end (creazione storia reale via form migrato)
- Login admin con Supabase Auth (email/password, nessuna registrazione
  pubblica: un solo utente admin, creato a mano da dashboard Supabase):
  `/admin/login`, protezione di tutte le `/admin/*` via
  `src/proxy.ts` (Next.js 16 ha rinominato `middleware.ts` in `proxy.ts`,
  stesso meccanismo), pulsante di uscita nel pannello
  - **Sicura di default anche senza Supabase configurato**: se
    `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` non
    sono impostate, `/admin` resta accessibile senza login (comportamento
    identico a prima, non un errore) con un avviso in pagina — non si
    blocca l'accesso per errore, ma non lo protegge nemmeno finché non è
    configurato per davvero
  - **Codice basato sul pattern ufficiale Supabase + Next.js App Router**
    (verificato leggendo l'esempio corrente `vercel/next.js/examples/
    with-supabase` su GitHub, non a memoria), ma il percorso "login con
    credenziali vere → redirect protetto" **non è ancora stato testato
    end-to-end**: serve un progetto Supabase reale per verificarlo (vedi
    prossimo passo). Quello che è verificato: build, lint, e che senza
    Supabase configurato l'app resta nello stato sicuro attuale.

**Redesign UX/UI dell'area pubblica** (sessione del 15 agosto, da
committare) — prima un mockup HTML statico condiviso e approvato, poi
portato nel codice React:
- Direzione: la fascia "notte" (indaco `#171433`, lo stesso del
  `themeColor` della PWA) come soglia fissa del marchio in home, non
  legata al toggle chiaro/scuro — è il rito della sera che il prodotto
  racconta. Un solo accento caldo (ambra, "la lampada") usato con
  parsimonia: pieno (`#e8a23c`) sui fondi scuri, scurito (`#a85a16`)
  come colore dei bottoni sui fondi chiari per restare accessibile.
- Tipografia: **Fraunces** (self-hosted via `next/font/google`, variabile,
  con italico) per titoli e per il testo delle pagine lette nel lettore;
  **Karla** per l'interfaccia (filtri, pulsanti, metadati). Sostituiscono
  Geist, che di fatto non era nemmeno collegato correttamente al token
  Tailwind `--font-sans` nello scaffold originale.
- Token colore in `app/src/app/globals.css` (`:root`/`.dark`) aggiornati
  da scala di grigi shadcn di default alla palette notte/ambra — si
  propaga automaticamente a tutti i componenti shadcn, **admin incluso**
  (non ridisegnata a parte, ma coerente perché condivide gli stessi token).
  `--radius` alzato a `0.85rem` per un feel più morbido.
- `PageArt` (copertine storia + illustrazioni pagina) riscritta con un
  bagliore pittorico + stelline invece dei due cerchi sfumati piatti di
  prima; resta procedurale da qualunque colore seed, non hardcoded per
  storia.
- `StoryReader`: card "libro" sospesa, testo in Fraunces, indicatori di
  pagina a forma di stellina (`.star-marker`, clip-path in `globals.css`).
- **Verificato**: lint e build puliti; testato visivamente con Playwright
  headless (installato temporaneamente nel container, non salvato in
  `package.json`) su home/lettore/admin, tema chiaro e scuro — screenshot
  poi rimossi, non fanno parte della repo.
- Mockup di partenza (artifact HTML, non più necessario ora che è in
  codice): https://claude.ai/code/artifact/fb17638f-b659-4b76-9d51-a737e1599aef

**Dieci fiabe nuove + lettore con apertura libro e sfogliamento** (sessione
del 2 settembre 2026):
- `app/src/lib/mock-stories.ts`: 10 fiabe scritte da zero (5 pagine ciascuna,
  età 3-8, temi morale/salute ampliati con `pazienza`, `onestà`, `gentilezza`,
  `movimento`, `igiene`), oltre alle 2 di esempio già esistenti — 12 in totale
  nell'area pubblica, per avere abbastanza contenuto da provare davvero il
  lettore e i filtri
- `PageArt`: oltre al gradiente procedurale, ogni pagina ora porta una
  sagoma illustrativa (`icon`, es. volpe, drago, luna, riccio...) coerente
  con la storia, non solo un blocco di colore
- `StoryReader` riscritto: prima si vede la copertina chiusa del libro
  (titolo, descrizione, pulsante "Apri il libro"), un click la apre con una
  rotazione 3D in CSS; dentro, ogni cambio pagina è un vero sfogliamento
  (flip a 3D con `rotateY`, non più uno scatto istantaneo), sia dai pulsanti
  Indietro/Avanti sia da zone di tap invisibili sui bordi sinistro/destro
  della pagina, oltre alle frecce da tastiera già presenti
- **Verificato**: lint pulito sui file toccati; testato end-to-end con
  Playwright headless (`next dev` locale senza Docker, non serve il
  database per le pagine pubbliche) — copertina, apertura, sfogliamento
  avanti/indietro fino all'ultima pagina, filtri con le nuove categorie,
  tema chiaro e scuro, nessun errore in console

**Contenuti su file, database rimosso** (sessione del 13 settembre 2026) —
scelta di prodotto: il sito nasce gratuito e interamente a carico di chi lo
gestisce, quindi niente database gestito e niente processi che consumino RAM o
CPU a runtime.
- Le 12 fiabe sono ora **file YAML** in `app/content/fiabe/it/`, uno per fiaba,
  con lo schema documentato in `app/content/fiabe/README.md`. Migrazione
  verificata: 12 fiabe e 58 pagine identiche ai testi precedenti.
- `app/src/lib/stories.ts` li legge e li **valida durante `next build`**: un
  campo mancante o un valore fuori elenco ferma il build nominando file e campo
  (provato per davvero su colore non valido e tema inesistente). I tipi
  condivisi stanno in `story-types.ts`, importabili anche dai componenti client.
- Tutto il sito è pre-generato: home e `/admin` statiche, una pagina SSG per
  ciascuna fiaba. A runtime i file YAML non vengono mai riletti.
- **Rimosso lo strato database**, che oltre a pesare impediva perfino il build
  (`prisma generate` pretende `DATABASE_URL`): via `prisma/schema.prisma`,
  `prisma.config.ts`, `src/lib/db.ts`, l'API `POST /api/admin/storie` e il form
  `/admin/storie/nuova`; via le dipendenze `prisma`, `@prisma/client`,
  `@prisma/adapter-pg`, `pg`, `@types/pg`; via il servizio `db` e il volume
  `pgdata` da `docker-compose.yml`, `prisma generate`/`db push` da `run.sh`, e
  dal Dockerfile sia OpenSSL sia le cinque copie esplicite dei pacchetti Prisma
  nello stage `dist`. Una sola dipendenza aggiunta (`yaml`), usata solo in build.
- `/admin` resta come **vista di redazione in sola lettura** (elenco fiabe, età,
  temi, numero di pagine, letti dai file). Il login Supabase è stato lasciato
  intatto: non costa nulla a runtime e servirà ancora.
- Conseguenza da tenere a mente: non esiste più un modo di aggiungere fiabe dal
  browser. Si aggiunge un file e si ricostruisce. Se un domani servisse un
  editor senza codice, la strada è un CMS che scrive sul repository, non un
  database.

**Lettore immersivo e illustrazioni a carta stratificata** (sessione del
17 settembre 2026) — prima tranche della direzione approvata nell'artifact
"Il Rito della Sera" (https://claude.ai/code/artifact/e5aba86f-770e-452f-85ae-c5fd1e735015).
- **Illustrazioni**: `PageArt` (gradiente + sagoma piatta) sostituita da
  `StoryScene`, che compone la scena a strati — cielo, bagliore della lampada,
  stelle e luna, due colline, alberi, personaggio, grana e vignettatura — con
  neve/pioggia/lucciole dove serve. Il rumore è pseudo-casuale con seme
  derivato dai prop, non `Math.random()`: server e client devono generare lo
  stesso SVG, altrimenti React segnala un errore di hydration. Due impianti
  (`tall`/`wide`) perché una scena orizzontale ritagliata su un telefono perde
  cielo, orizzonte e personaggio insieme.
- **Contenuti semplificati**: al posto di un colore per pagina, ogni fiaba ha
  una sola direzione artistica in `scena:` (cielo, colline, luce, sagoma,
  notte, atmosfera). Sono spariti 58 campi `tinta` dai file: **la luce si
  abbassa da sola** in funzione della pagina. `pagine[].sagoma` resta come
  eccezione, per una pagina che mostri un altro protagonista.
- **`StoryReader` riscritto**: la copertina resta nel flusso della pagina, ma
  aprendola si entra in un livello immersivo a tutto schermo — illustrazione a
  pieno formato col testo su velatura, **doppia pagina da 64rem in su**
  (illustrazione a sinistra, testo sulla carta a destra, ombra del dorso al
  centro). Si sfoglia **trascinando col dito** (la pagina segue e gira se si
  supera la metà), o con zone di tap, pulsanti e frecce. La luce cala pagina
  dopo pagina fino a **"Buonanotte"**, con "Spegni la luce" che porta al nero.
  Il **tasto indietro del telefono chiude il libro** invece di uscire dal sito
  (`history.pushState` + `popstate`), e chi ha chiesto meno animazioni cambia
  pagina di scatto (`useSyncExternalStore` su `prefers-reduced-motion`).
- **Pagina della fiaba**: metadati per la condivisione (`generateMetadata`),
  minuti di lettura calcolati dal testo, e **il testo completo in chiaro** sotto
  il libro — serve a chi legge dallo schermo, agli screen reader e ai motori di
  ricerca, che per un sito gratuito sono l'unico canale di scoperta.
- **Verificato** con Playwright su telefono e desktop: apertura, sfoglio col
  trascinamento (`1 di 5` → `2 di 5`), luce che si abbassa, buonanotte, spegni
  la luce, ritorno alla copertina, tasto indietro che chiude, doppia pagina su
  desktop, nessun errore in console. Due difetti trovati così e corretti: il
  pannello del buonanotte era trasparente (una utility Tailwind che contiene
  gradiente *e* colore non produce il fondo opaco: ora è stile inline) e il
  contatore restava sulla pagina uscente durante lo sfoglio.
- Non ancora fatto, prossimo passo naturale: **la voce narrante** (nel mockup
  era un prototipo con la sintesi del browser) e poi la **home editoriale** con
  "Stasera" e gli scaffali per intenzione.

## Come riprendere il lavoro

```bash
cd ~/personale/fiabe-a-bassa-voce
./run.sh
```

Builda, avvia il container `app`, installa le dipendenze e lancia
`next dev`. Non c'è nessun database da avviare né schema da sincronizzare. Poi:

- http://localhost:3000/ — area pubblica
- http://localhost:3000/admin — vista di redazione (sola lettura)

## Decisioni tecniche da tenere a mente

- **`--webpack` forzato** su `next dev`/`next build` (in `package.json`):
  Serwist (il service worker PWA) non supporta ancora Turbopack, il
  bundler di default in Next 16. Da rimuovere quando Serwist lo supporterà
  (issue: serwist/serwist#54).
- **Niente database, per scelta**: i contenuti sono file YAML versionati con
  il codice e il sito è tutto pre-generato. Prima di reintrodurre un database,
  chiediti se il dato in questione cambia davvero *senza* un deploy: i testi
  delle fiabe no. Cambierebbero le cose per utente (preferiti, "continua a
  leggere"), che però stanno bene nel browser (`localStorage`) finché non serve
  sincronizzarle tra dispositivi.
- **`src/proxy.ts`, non `middleware.ts`**: Next.js 16 ha rinominato il
  meccanismo. Se cerchi documentazione o esempi più vecchi troverai
  `middleware.ts` — stesso concetto, nome diverso in questa versione.
- **Un solo admin**: niente registrazione pubblica. L'utente va creato a
  mano nella dashboard Supabase (Authentication > Users), non tramite
  un form nel sito.

## Prossimi passi

1. **Illustrazioni vere** — è il vero collo di bottiglia estetico: oggi ogni
   pagina ha un'illustrazione generata da codice. Le immagini definitive vanno
   nel repository accanto ai testi e servite come file statici. Il login
   Supabase qui sotto resta facoltativo (serve solo a proteggere `/admin`):
   1. Crea un nuovo progetto (nome libero, password del DB a scelta —
      non serve ricordarla se non si userà anche come Postgres di
      produzione, scegli una regione europea)
   2. **Project Settings > API**: copia "Project URL" e la chiave
      "publishable" (o "anon public" se l'interfaccia mostra ancora il
      nome vecchio) — vanno in `app/.env` come `NEXT_PUBLIC_SUPABASE_URL`
      e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   3. **Authentication > Users > Add user > Create new user**: crea il
      tuo utente admin con email e password, spuntando "Auto Confirm
      User" (altrimenti serve confermare via email)
   4. Salva `app/.env`, poi dentro il container: riavvia `next dev`
      (o rilancia `./run.sh`) perché legga le nuove variabili
   5. Vai su `/admin/login` e prova ad accedere — **questo è il primo
      test reale del flusso di login**, non ancora verificato in questa
      sessione
2. **Lettore immersivo e home editoriale** — direzione di design approvata
   in anteprima, da portare in React (vedi l'artifact "Il Rito della Sera").
3. **Icone PWA vere** — `app/public/icons/icon.svg` è un placeholder
   generato; da sostituire con un'illustrazione vera (anche in PNG, per
   compatibilità iOS).
4. **Deploy** — collegare il repo GitHub (`cavincla/fiabe-a-bassa-voce`,
   già configurato come remote) a Vercel, oppure pubblicare l'immagine
   `dist` (`./run.sh -i`) su un host Docker qualsiasi. Su Vercel vanno
   replicate le stesse variabili d'ambiente di `app/.env` (incluse quelle
   Supabase) nelle impostazioni del progetto.

## File utili

- `README.md` — guida rapida stack + comandi (più sintetica di questo file)
- `.build/dockerfiles/Dockerfile` — build multi-stage commentata
- `app/content/fiabe/README.md` — schema dei file delle fiabe, campo per campo
- `app/content/fiabe/it/*.yaml` — le fiabe pubblicate
- `app/src/lib/stories.ts` — lettura e validazione dei contenuti in fase di build
- `app/src/lib/supabase/` — client browser/server e logica del proxy di autenticazione
