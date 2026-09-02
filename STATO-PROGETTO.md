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

## Come riprendere il lavoro

```bash
cd ~/personale/fiabe-a-bassa-voce
./run.sh
```

Builda, avvia `app` + `db`, installa le dipendenze, sincronizza lo schema
Prisma e lancia `next dev`. Poi:

- http://localhost:3000/ — area pubblica
- http://localhost:3000/admin — pannello admin
- Postgres su `localhost:5433` (`fiabe` / `fiabe_dev_password` / `fiabe`)

## Decisioni tecniche da tenere a mente

- **`--webpack` forzato** su `next dev`/`next build` (in `package.json`):
  Serwist (il service worker PWA) non supporta ancora Turbopack, il
  bundler di default in Next 16. Da rimuovere quando Serwist lo supporterà
  (issue: serwist/serwist#54).
- **Prisma 7 = driver adapter**: la connessione non è più nello schema
  Prisma (`prisma/schema.prisma` non ha più `url`), ma in
  `app/prisma.config.ts` (per la CLI: `db push`, `migrate`, `studio`) e in
  `app/src/lib/db.ts` (per l'app, via `@prisma/adapter-pg`). Nel Dockerfile,
  lo stage `dist` copia esplicitamente `@prisma/adapter-pg` e le sue
  dipendenze nel bundle standalone, perché il tracciamento file di Next.js
  non le rileva da sé (stesso problema già noto per `.prisma`/`@prisma/client`).
- **`src/proxy.ts`, non `middleware.ts`**: Next.js 16 ha rinominato il
  meccanismo. Se cerchi documentazione o esempi più vecchi troverai
  `middleware.ts` — stesso concetto, nome diverso in questa versione.
- **Un solo admin**: niente registrazione pubblica. L'utente va creato a
  mano nella dashboard Supabase (Authentication > Users), non tramite
  un form nel sito.

## Prossimi passi

1. **Creare il progetto Supabase e collegarlo** — è il vero collo di
   bottiglia, sblocca login admin, upload immagini e (in parte) il
   deploy. Serve login su supabase.com:
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
2. **Upload immagini reale** — il form storia accetta solo URL; da
   collegare a Supabase Storage (stesso progetto del punto 1).
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
- `app/prisma/schema.prisma` — modello dati
- `app/src/lib/mock-stories.ts` — le due fiabe di esempio nell'area pubblica
- `app/src/lib/supabase/` — client browser/server e logica del proxy di autenticazione
