# Stato del progetto — Fiabe a Bassa Voce

> Scritto il 14 agosto 2026. Se apri una nuova sessione Claude Code, aprila
> in **questa cartella** (`~/personale/fiabe-a-bassa-voce`), non in
> `~/personale`: da lì Claude non vede il repository git né può eseguire
> `./run.sh`.

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
  (button, input, textarea, label, card, badge)

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

**In questo momento l'ambiente è già in esecuzione** (container
`fiabe-a-bassa-voce-app-1` e `fiabe-a-bassa-voce-db-1`, avviati durante
questa sessione): puoi aprire subito http://localhost:3000/ senza
rilanciare `./run.sh`. Se non risponde più, `./run.sh` lo rimette in piedi.

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
- **Dark mode**: risolto (commit successivo a `b64e051`) aggiungendo
  `next-themes` invece di tornare al solo `prefers-color-scheme` — dà un
  toggle manuale (pulsante luna/sole in home e in `/admin`) che parte
  comunque da "system" come default. `ThemeProvider` è in
  `src/components/theme-provider.tsx`, il pulsante in
  `src/components/theme-toggle.tsx`. Nota: il guard "mounted" nel toggle
  (pattern standard di next-themes per evitare mismatch di idratazione)
  richiede un `eslint-disable-next-line react-hooks/set-state-in-effect`
  intenzionale — non toglierlo pensando sia superfluo.
- **shadcn/ui inizializzato ma non applicato**: i componenti in
  `app/src/components/ui/` (button, input, textarea, label, card, badge)
  sono pronti ma le pagine admin esistenti (`/admin/storie/nuova`, ecc.)
  usano ancora HTML/Tailwind scritti a mano, non i componenti shadcn.

## Prossimi passi

In ordine ragionevole, non tutti bloccanti:

1. **(Opzionale) Migrare l'admin ai componenti shadcn/ui** — sostituire
   gli `<input>`/`<button>` scritti a mano in `/admin/storie/nuova` con
   quelli in `src/components/ui/`, per coerenza visiva quando si
   aggiungeranno altre pagine.
2. **Progetto Supabase** (Auth + Storage) — richiede login, va creato
   manualmente su supabase.com. Non serve per Postgres in sviluppo (già
   locale via Docker), ma serve per login admin e upload immagini.
3. **Autenticazione admin** — `/admin` non è protetta da login; da
   collegare a Supabase Auth prima di pubblicare online.
4. **Upload immagini reale** — il form storia accetta solo URL; da
   collegare a Supabase Storage.
5. **Icone PWA vere** — `app/public/icons/icon.svg` è un placeholder
   generato; da sostituire con un'illustrazione vera (anche in PNG, per
   compatibilità iOS).
6. **Deploy** — collegare il repo GitHub (`cavincla/fiabe-a-bassa-voce`,
   già configurato come remote) a Vercel, oppure pubblicare l'immagine
   `dist` (`./run.sh -i`) su un host Docker qualsiasi.

## File utili

- `README.md` — guida rapida stack + comandi (più sintetica di questo file)
- `.build/dockerfiles/Dockerfile` — build multi-stage commentata
- `app/prisma/schema.prisma` — modello dati
- `app/src/lib/mock-stories.ts` — le due fiabe di esempio nell'area pubblica
