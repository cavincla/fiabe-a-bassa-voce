# Fiabe a Bassa Voce

PWA gratuita che aiuta i genitori a trovare fiabe per bambini, categorizzate per età, morale/tema e salute. Lettore multimediale a pagine oggi, audiolibro e AI in fasi successive.

Il piano completo di evoluzione prodotto e tecnico è nell'artifact condiviso in conversazione (fasi 0–6, scelte di stack, roadmap lingue).

Stack: **Next.js 16 + TypeScript + Tailwind CSS v4 + Prisma 7 + shadcn/ui**, dockerizzato con lo stesso pattern (utente non-root, uid/gid dell'host mappati nel container, stage `dev`/`build`/`assets`/`dist`) usato dal template Python di riferimento (`~/personale/template-project-python`) e già adottato da [`fanta-web`](../fanta-web)/[`fanta-api`](../fanta-api) — adattato qui per un'app Next.js con backend proprio (non un bundle statico servito da nginx: lo stage `dist` esegue il server standalone di Next.js con Node).

Note tecniche di questa combinazione di versioni:

- **Serwist forza webpack**: `next dev`/`next build` girano con `--webpack` (vedi `package.json`) perché Serwist (il service worker della PWA) non supporta ancora Turbopack, il bundler di default in Next.js 16.
- **Prisma 7 usa i driver adapters**: niente più motore Rust nello schema (`datasource.url` è stato rimosso da `prisma/schema.prisma`); la connessione vive in `prisma.config.ts` (per la CLI) e in `src/lib/db.ts` (per l'app, via `@prisma/adapter-pg`). Lo stage `dist` del Dockerfile copia esplicitamente `@prisma/adapter-pg` e le sue dipendenze, perché il tracciamento file di Next.js per l'output standalone non le rileva da solo.
- **Dark mode**: l'init di shadcn/ui ha reso il dark mode "a classe" (`.dark` su un antenato) invece che automatico da `prefers-color-scheme`; finché non si aggiunge un toggle (es. `next-themes`), l'app resta sempre in tema chiaro. Vedi il file di riepilogo condiviso in conversazione per i dettagli.

## Getting started

Avvia l'ambiente di sviluppo dockerizzato:

```bash
./run.sh
```

Questo builda l'immagine di sviluppo, avvia il container **app** e un Postgres locale (**db**), esegue `npm install`, sincronizza lo schema Prisma sul database (`prisma db push`) e infine avvia `next dev` con hot-reload, quindi l'app si aggiorna automaticamente ad ogni modifica sotto `app/src`.

Una volta avviato:

- http://localhost:3000/ — area pubblica (elenco fiabe + lettore)
- http://localhost:3000/admin — pannello di amministrazione
- Postgres locale su `localhost:5433` (utente/password/db: `fiabe` / `fiabe_dev_password` / `fiabe`) — porta 5433 e non 5432 per non entrare in conflitto con il Postgres di `fanta-api`, se in esecuzione in parallelo

Altri flag utili di `run.sh`:

- `./run.sh -s` — apre una shell nel container invece di avviare l'app
- `./run.sh -t` — esegue i test (da collegare, vedi commento in `run.sh`)
- `./run.sh -i` — builda ed esegue l'immagine di distribuzione (server standalone Next.js, porta 3000)

## Struttura

```
app/                  codice dell'applicazione Next.js (bind-mounted nel container)
  src/app/            route pubbliche, admin, API
  src/components/     componenti React (es. lettore multimediale)
  src/lib/            client Prisma, dati di esempio
  prisma/schema.prisma  modello dati
.build/dockerfiles/   Dockerfile multi-stage + fix-perm.sh
docker-compose.yml / run.sh   ambiente di sviluppo dockerizzato
.data/bob-s-home/     home persistente dell'utente del container (solo .bashrc versionato)
```

## Variabili d'ambiente

In sviluppo `docker-compose.yml` imposta già `DATABASE_URL` verso il Postgres locale: non serve configurare nulla per partire. `app/.env.example` documenta le variabili per **Supabase** (staging/produzione, o per eseguire l'app senza Docker) — copiale in `app/.env` quando servono davvero:

```bash
cp app/.env.example app/.env
```

## Cosa manca prima di andare online

1. **Progetto Supabase** (Auth + Storage, e Postgres se non si vuole gestire un DB self-hosted in produzione) — richiede login, va creato manualmente su supabase.com.
2. **Autenticazione admin**: `/admin` non è ancora protetta da login; va aggiunto un controllo con Supabase Auth prima della pubblicazione.
3. **Upload immagini reale**: il form storia accetta solo URL; l'upload diretto verso Supabase Storage è da collegare.
4. **Icone PWA**: `app/public/icons/icon.svg` è un placeholder generato; va sostituito con un'illustrazione vera (idealmente anche in PNG per compatibilità iOS).
5. **Deploy**: due strade percorribili, non a vicenda esclusive — collegare il repository GitHub a Vercel (più veloce, zero-config per Next.js), oppure pubblicare l'immagine `dist` già pronta (`./run.sh -i` per provarla in locale) su un host Docker qualsiasi.

## Aggiungere dipendenze

Aggiungi la dipendenza ad `app/package.json` (o lancia `npm install <pkg>` dentro il container con `./run.sh -s`); il prossimo `./run.sh` la installa automaticamente nel container.

Per aggiungere altri componenti shadcn/ui: `./run.sh -s` poi `npx shadcn@latest add <componente>` dentro il container.
