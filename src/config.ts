/* ════════════════════════════════════════════════════════════
   CONFIGURATION — tous les textes de l'expérience sont ici.
   Photos : place tes fichiers dans public/images/couple/ puis
   remplace src: null par src: '/images/couple/photo-01.jpg', etc.
   ════════════════════════════════════════════════════════════ */
export const CONFIG: any = {
  herName: 'Ndeye Fatou Thioye',
  herFirstName: 'Ndeye Fatou',
  signature: 'PKD',
  initials: 'NFT',
  finalSignature: 'NFT & PKD 4\u00A0ever\u00A0!',

  intro: {
    line1: 'Ndeye Fatou Thioye…',
    line2: 'J’ai préparé quelque chose spécialement pour toi.',
    button: 'Découvrir ma surprise'
  },

  letter: {
    greeting: 'Ma Ndeye Fatou,',
    paragraphs: [
      'Il y a des choses que l’on pense chaque jour sans prendre le temps de les dire. Alors aujourd’hui, j’ai voulu les écrire, rien que pour toi.',
      'J’aime ta façon d’être toi, simplement. Ton sourire, ta douceur, ta force tranquille. J’aime la paix que je ressens quand tu es là.',
      'Tu es devenue mon repère. Mon endroit préféré n’est pas un lieu : c’est à côté de toi.',
      'Je te fais une promesse : être là, dans les jours simples comme dans les jours difficiles, et continuer chaque jour à mériter ta confiance.'
    ],
    closing: 'Avec tout mon amour,',
    signature: 'PKD'
  },

  reasons: [
    'Ton sourire, qui rend mes journées plus légères.',
    'Ta douceur, même quand le monde ne l’est pas.',
    'Ta force, discrète mais immense.',
    'Ta façon de m’écouter, vraiment.',
    'Ton rire, ma musique préférée.',
    'Ton cœur, si généreux avec les autres.',
    'Ta présence, qui m’apaise.',
    'Toi, tout simplement. Telle que tu es.'
  ],

  photos: [
    { file: 'photo-01.jpg', orientation: 'portrait', caption: 'Légende de la photo 1', src: null as string | null },
    { file: 'photo-02.jpg', orientation: 'paysage',  caption: 'Légende de la photo 2', src: null as string | null },
    { file: 'photo-03.jpg', orientation: 'portrait', caption: 'Légende de la photo 3', src: null as string | null },
    { file: 'photo-04.jpg', orientation: 'portrait', caption: 'Légende de la photo 4', src: null as string | null },
    { file: 'photo-05.jpg', orientation: 'paysage',  caption: 'Légende de la photo 5', src: null as string | null },
    { file: 'photo-06.jpg', orientation: 'portrait', caption: 'Légende de la photo 6', src: null as string | null }
  ],

  questions: [
    { q: 'Qui est le plus chanceux dans cette relation ?', answers: [
      { label: 'Toi', reaction: 'Exact. Et je le sais chaque jour un peu plus.' },
      { label: 'Moi', reaction: 'Jolie tentative… mais le plus chanceux, c’est moi.' }
    ]},
    { q: 'Qui est le plus têtu entre nous ?', answers: [
      { label: 'Toi', reaction: 'Je plaide coupable. Surtout quand il s’agit de t’aimer.' },
      { label: 'Moi', reaction: 'Je ne dirai rien. Je tiens beaucoup trop à toi.' }
    ]},
    { q: 'Si nous pouvions partir ensemble demain, quelle destination choisirais-tu ?', answers: [
      { label: 'Malaisie', reaction: 'Va pour la Malaisie. Je prépare déjà les valises.' },
      { label: 'Dubaï', reaction: 'Dubaï, le soleil, et toi. Programme parfait.' },
      { label: 'Peu importe, si c’est avec toi', reaction: 'Meilleure réponse possible. Je dis exactement pareil.' }
    ]},
    { q: 'Prête à créer encore des milliers de souvenirs avec moi ?', answers: [
      { label: 'Oui', reaction: 'Alors c’est signé. Pour toujours.' },
      { label: 'Évidemment', reaction: 'Je n’en attendais pas moins de toi.' },
      { label: 'Non', reaction: 'Ce bouton ne fonctionne pas. Il n’a jamais fonctionné.' }
    ]}
  ],

  invitation: {
    title: 'Tu es invitée',
    text: 'à écrire avec moi la suite de notre histoire.',
    details: [
      { label: 'Date', value: 'Chaque jour' },
      { label: 'Lieu', value: 'À mes côtés' },
      { label: 'Tenue', value: 'Ton plus beau sourire' }
    ],
    button: 'J’accepte l’invitation'
  },

  declaration: [
    'Je ne sais pas de quoi demain sera fait.\nMais je sais avec qui j’ai envie de le vivre.',
    'Tu es ma plus belle évidence.\nEt chaque jour, je choisis de t’aimer un peu plus.',
    'Je t’aime.'
  ],

  // Concept de la scène 4 : 'Étoiles', 'Rose' ou 'Lanternes'
  universe: 'Étoiles',

  // Musique : mets par exemple '/audio/musique.mp3' (fichier dans public/audio/)
  musicUrl: null
};

/* ════════════════════════════════════════════════════════════ */

export function rng(seed) { let s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

export const UNIVERSES: any = {
  'Rose': { title: 'Chaque pétale est une raison de t’aimer.', hint: 'Cueille les pétales un à un.', unit: 'pétales cueillis', done: 'Il ne reste que mon cœur. Il est à toi.', item: 'Pétale' },
  'Étoiles': { title: 'Chaque étoile est une raison de t’aimer.', hint: 'Touche-les une à une.', unit: 'étoiles allumées', done: 'Notre constellation est complète.', item: 'Étoile' },
  'Lanternes': { title: 'Chaque lanterne emporte une raison de t’aimer.', hint: 'Touche une lanterne pour la laisser s’envoler.', unit: 'lanternes envolées', done: 'Le ciel tout entier sait que je t’aime.', item: 'Lanterne' }
};

