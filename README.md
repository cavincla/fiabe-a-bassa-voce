# Fiabe a Bassa Voce

PWA gratuita che aiuta i genitori a trovare fiabe per bambini, categorizzate per età, morale/tema e salute. Lettore multimediale a pagine oggi, audiolibro e AI in fasi successive.

Il piano completo di evoluzione prodotto e tecnico è nell'artifact condiviso in conversazione (fasi 0–6, scelte di stack, roadmap lingue).

Stack: **Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui**, **senza database**, dockerizzato con lo stesso pattern (utente non-root, uid/gid dell'host mappati nel container, stage `dev`/`build`/`assets`/`dist`) usato dal template Python di riferimento (`~/personale/template-project-python`) e già adottato da [`fanta-web`](../fanta-web)/[`fanta-api`](../fanta-api) — adattato qui per un'app Next.js con backend proprio (non un bundle statico servito da nginx: lo stage `dist` esegue il server standalone di Next.js con Node).

Note tecniche di questa combinazione di versioni:

- **Serwist forza webpack**: `next dev`/`next build` girano con `--webpack` (vedi `package.json`) perché Serwist (il service worker della PWA) non supporta ancora Turbopack, il bundler di default in Next.js 16.
- **Le fiabe sono file, non righe di tabella**: ogni fiaba è un YAML in `app/content/fiabe/<lingua>/`, letto e validato da `src/lib/stories.ts` durante `next build`, che pre-genera una pagina statica per ciascuna. Nessun database, nessuna connessione aperta, nessuna RAM occupata a runtime: il server in produzione serve HTML già pronto. Lo schema dei campi è in `app/content/fiabe/README.md`; un file incompleto **ferma il build** indicando file e campo. Il parser YAML è una dipendenza di sola compilazione.
- **Dark mode**: toggle manuale con `next-themes` (pulsante luna/sole in home e in `/admin`), parte comunque da "system" come default.
- **`src/proxy.ts`, non `middleware.ts`**: Next.js 16 ha rinominato il meccanismo. Protegge tutte le `/admin/*` con Supabase Auth (login email/password, un solo utente admin creato a mano su Supabase, nessuna registrazione pubblica). Se `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` non sono configurate, `/admin` resta aperta senza login (comportamento sicuro di default, non un errore) con un avviso in pagina.

## Getting started

Avvia l'ambiente di sviluppo dockerizzato:

```bash
./run.sh
```

Questo builda l'immagine di sviluppo, avvia il container **app**, esegue `npm install` e infine avvia `next dev` con hot-reload, quindi l'app si aggiorna automaticamente ad ogni modifica sotto `app/src` e `app/content`. Nessun database da avviare: un solo container.

Una volta avviato:

- http://localhost:3000/ — area pubblica (elenco fiabe + lettore)
- http://localhost:3000/admin — pannello di amministrazione

Altri flag utili di `run.sh`:

- `./run.sh -s` — apre una shell nel container invece di avviare l'app
- `./run.sh -t` — esegue i test (da collegare, vedi commento in `run.sh`)
- `./run.sh -i` — builda ed esegue l'immagine di distribuzione (server standalone Next.js, porta 3000)

## Struttura

```
app/                  codice dell'applicazione Next.js (bind-mounted nel container)
  src/app/            route pubbliche, admin, API
  src/components/     componenti React (es. lettore multimediale)
  src/lib/            loader dei contenuti (stories.ts) e tipi condivisi
  content/fiabe/it/   le fiabe, un file YAML ciascuna (+ README con lo schema)
.build/dockerfiles/   Dockerfile multi-stage + fix-perm.sh
docker-compose.yml / run.sh   ambiente di sviluppo dockerizzato
.data/bob-s-home/     home persistente dell'utente del container (solo .bashrc versionato)
```

## Variabili d'ambiente

Per far girare il sito non serve configurare nulla: i contenuti sono file nel repository. `app/.env.example` documenta le variabili **Supabase**, che servono solo a proteggere `/admin` con un login — copiale in `app/.env` quando ti servono davvero:

```bash
cp app/.env.example app/.env
```

## Cosa manca prima di andare online

1. **Illustrazioni vere**: oggi ogni pagina ha un'illustrazione generata da codice (`PageArt`) a partire da un colore e una sagoma. Vanno sostituite da immagini reali, da tenere nel repository accanto ai testi e servire come file statici.
2. **Icone PWA**: `app/public/icons/icon.svg` è un placeholder generato; va sostituito con un'illustrazione vera (idealmente anche in PNG per compatibilità iOS).
3. **Deploy**: essendo tutto pre-generato, va bene qualsiasi hosting statico gratuito, oppure l'immagine `dist` già pronta (`./run.sh -i` per provarla in locale) su un host Docker qualsiasi. Su hosting statico l'unica cosa da rivedere è `/admin`, che con Supabase configurato richiede un runtime.
4. **Login admin** (facoltativo): `/admin` è di sola lettura, ma finché Supabase non è configurato resta accessibile a chiunque. Istruzioni in `STATO-PROGETTO.md`.

## Aggiungere dipendenze

Aggiungi la dipendenza ad `app/package.json` (o lancia `npm install <pkg>` dentro il container con `./run.sh -s`); il prossimo `./run.sh` la installa automaticamente nel container.

Per aggiungere altri componenti shadcn/ui: `./run.sh -s` poi `npx shadcn@latest add <componente>` dentro il container.
