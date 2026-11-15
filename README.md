# NFT & PKD — A Journey to Forever

Une expérience web romantique en 7 scènes, puis l'outro « NFT & PKD 4 ever ! ».
Le projet utilise React, TypeScript et Vite.

## Tester sur ton ordinateur

1. Installe Node.js (version 18 ou plus).
2. Ouvre un terminal dans ce dossier.
3. Lance `npm install`.
4. Lance `npm run dev`.
5. Ouvre l'adresse affichée (par exemple http://localhost:5173).

## Personnaliser

Tous les textes sont dans **src/config.ts** :

- `herName`, `herFirstName` : son nom et son prénom.
- `signature` : ta signature (PKD).
- `initials` : le texte du sceau de cire (NFT).
- `letter` : la lettre (début, paragraphes, fin, signature).
- `reasons` : les 8 raisons de l'aimer.
- `photos` : les 6 photos de l'album et leurs légendes.
- `questions` : les questions de l'invitation et les réactions.
- `invitation` : le texte de l'invitation.
- `declaration` : la déclaration finale.
- `universe` : le concept de la scène 4 (`'Étoiles'`, `'Rose'` ou `'Lanternes'`).
- `musicUrl` : ta musique (voir public/audio/LISEZ-MOI.txt).

### Photos

1. Copie tes photos dans **public/images/couple/**.
2. Nomme-les photo-01.jpg à photo-06.jpg.
3. Dans src/config.ts, remplace `src: null` par `src: '/images/couple/photo-01.jpg'` (et ainsi de suite).
4. Si une photo est horizontale, mets `orientation: 'paysage'`. Sinon, mets `'portrait'`.

## Mettre en ligne sur Vercel

### Option A : avec GitHub (la plus simple)

1. Crée un dépôt sur github.com et envoie-y ce dossier (sans `node_modules`).
2. Va sur vercel.com et connecte-toi avec GitHub.
3. Clique sur **Add New… → Project**, puis choisis ton dépôt.
4. Vercel détecte Vite tout seul. Garde les réglages proposés :
   - Build Command : `npm run build`
   - Output Directory : `dist`
5. Clique sur **Deploy**.
6. Tu obtiens un lien du type `https://ton-projet.vercel.app`. Envoie-le sur WhatsApp.

Chaque modification envoyée sur GitHub met le site à jour automatiquement.

### Option B : avec la ligne de commande

1. Dans ce dossier, lance `npx vercel`.
2. Connecte-toi quand c'est demandé, puis accepte les réglages proposés.
3. Lance `npx vercel --prod` pour obtenir le lien définitif.

### Option C : sans rien installer

Le dossier **dist/** contient déjà le site prêt à l'emploi.
Tu peux le glisser-déposer sur https://app.netlify.com/drop pour obtenir un lien en quelques secondes.
Attention : si tu modifies src/config.ts, il faut relancer `npm run build` pour mettre dist/ à jour.

## Bon à savoir

- La musique démarre seulement après le premier geste (règle des navigateurs).
- Le bouton en haut à droite coupe ou remet le son.
- L'expérience respecte le réglage « Réduire les animations » du téléphone.
