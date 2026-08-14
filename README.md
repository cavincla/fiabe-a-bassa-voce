# Fiabe a Bassa Voce

PWA gratuita che aiuta i genitori a trovare fiabe per bambini, categorizzate per età, morale/tema e salute. Lettore multimediale a pagine oggi, audiolibro e AI in fasi successive.

Il piano completo di evoluzione prodotto e tecnico è nell'artifact condiviso in conversazione (fasi 0–6, scelte di stack, roadmap lingue).

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v3** per lo stile
- **Prisma 5** + **Postgres** (pensato per [Supabase](https://supabase.com): DB + Auth + Storage)
- **Serwist** per il service worker / PWA

## Nota sulla versione di Node

Questo ambiente ha **Node 18.19**. Next.js 16, Tailwind v4, l'ultimo shadcn/ui CLI e le ultime versioni di Prisma e sharp richiedono **Node 20+** e non sono installabili qui: per questo il progetto è pinnato su Next 15 / Tailwind v3 / Prisma 5.22, tutte versioni pienamente supportate e senza funzionalità mancanti per l'MVP.

**Consigliato**: appena possibile aggiorna Node a una versione ≥20 (es. con `nvm install 20`) e poi:

```bash
npm i -D tailwindcss@latest @tailwindcss/postcss   # torna a Tailwind v4
npm i -D prisma@latest && npm i @prisma/client@latest
npx shadcn@latest init                              # componenti UI per l'admin
```

Il deploy su Vercel non risente di questo limite: Vercel usa la propria versione di Node in build, indipendente da questa macchina.

## Setup locale

```bash
npm install
cp .env.example .env   # poi inserisci le credenziali del progetto Supabase
npx prisma db push     # crea le tabelle sul database Supabase
npm run dev
```

Senza un `DATABASE_URL` valido, l'area pubblica (`/`) funziona comunque con dati di esempio; l'area admin (`/admin/storie`) mostra un avviso finché il database non è collegato.

## Struttura

```
src/app/(pubblico)   home + lettore storia (/storie/[slug])
src/app/admin        pannello: elenco + creazione storia
src/app/api/admin    API per l'admin (Prisma)
src/components/reader  componente lettore multimediale
src/lib/mock-stories.ts  dati di esempio per l'area pubblica
src/lib/db.ts         client Prisma
prisma/schema.prisma  modello dati
```

## Cosa manca prima di andare online

1. **Progetto Supabase** (DB + Auth + Storage) — richiede login, va creato manualmente su supabase.com.
2. **Autenticazione admin**: `/admin` non è ancora protetta da login; va aggiunto un controllo con Supabase Auth prima della pubblicazione.
3. **Upload immagini reale**: il form storia accetta solo URL; l'upload diretto verso Supabase Storage è da collegare.
4. **Icone PWA**: `public/icons/icon.svg` è un placeholder generato; va sostituito con un'illustrazione vera (idealmente anche in PNG per compatibilità iOS).
5. **Deploy Vercel**: collegare questo repository GitHub a un progetto Vercel per il primo deploy pubblico.
