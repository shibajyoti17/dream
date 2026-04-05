/**
 * Edit this file to personalize the gift. All UI reads from here.
 */

export type Memory = {
  /** Shown as a small label, e.g. "March 2024" */
  dateLabel: string;
  title: string;
  body: string;
  /** Optional: place images in public/memories/ and use "/memories/photo.jpg" */
  imageSrc?: string;
  imageAlt?: string;
};

const memories: Memory[] = [
  {
    dateLabel: "27th February 2026",
    title: "First look in Bumble",
    body: "I saw my queen for the first time in Bumble. I got awestruck by her beauty and charm.",
  },
  {
    dateLabel: "21st March 2026",
    title: "First Meet",
    body: "I saw you running towards me in the airport. I was mesmerized, elated and nervous at the same time. I was overwhelmed by your beauty, your kindness and your presence.",
  },
  {
    dateLabel: "22nd March 2026",
    title: "Magic moment at the James Princep Ghat",
    body: "We spent a magical moment at the James Princep Ghat. We walked along the ghat, talked about our lives, our dreams, our hopes and our fears. We shared a lot of laughs and smiles. We felt like we were in a different world. We felt like we were in love. You glittered like a crown jewel on the ghats of Ganga.",
  },
  {
    dateLabel: "23rd March 2026",
    title: "The homely lunch at Tripura Bhawan and the city walk",
    body: "Every bite of daal bhat seems like heaven on earth with you by my side. Every step of the city walk feels like a journey of a lifetime with you by my side.",
  },
];

export const gift = {
  /** Her name (or nickname) */
  recipientName: "Kuttus",
  /** Your name, shown subtly */
  giverName: "Tintin",

  /** Romantic copy on the passphrase screen — edit freely */
  vault: {
    eyebrow: "Our little corner of the internet",
    subtitle: "I tucked something here — just for you.",
    quote:
      "“Whatever souls are made of, his and mine are the same.”",
    quoteAside: "— Emily Brontë, with extra room for cats",
    invite:
      "This place only wakes up for the two of us. Type the secret phrase we share — the one that means you & me — and step inside.",
    footnotePrefix: "With love",
  },
  /** Hero line under her name */
  tagline: "A tiny corner of the internet, just for you and cats.",
  /** Opening paragraph — write in your voice */
  dedication:
    "I made this because you love cats, and because I love seeing you light up when you talk about them. Every section below is yours to revisit whenever you want a smile.",

  memories,

  /** Shuffled messages for the “Daily whisker” card */
  notesForHer: [
    "Thinking of you today.",
    "You deserve something soft and warm.",
    "Paws, pause, breathe — you’re wonderful.",
  ],

  /** Fun facts; swap for ones she doesn’t know yet */
  catFacts: [
    "Cats have a special organ, the Jacobson’s organ, to “taste” smells.",
    "A group of cats is called a clowder.",
    "Cats can make over 100 vocal sounds; dogs, around 10.",
    "Slow blinking at a cat is like a kitty “I love you.”",
  ],
};
