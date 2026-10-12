export interface WelcomeQuote {
  id: number;
  quote: string;
  author: string;
  context: string;
  mood: string;
}

export const WELCOME_QUOTES: WelcomeQuote[] = [
  {
    id: 1,
    quote: "Your home should tell the story of who you are, and be a collection of what you love.",
    author: "Nate Berkus",
    context: "Timeless Architecture",
    mood: "✨ Personal Sanctuary",
  },
  {
    id: 2,
    quote: "Craftsmanship is the language of patience, turned into enduring solid teakwood.",
    author: "Master Artisan",
    context: "Dream Comfort Atelier",
    mood: "🪵 Artisanal Heritage",
  },
  {
    id: 3,
    quote: "Luxury is when it seems effortless, achieving perfect harmony between form, soul, and comfort.",
    author: "Jean-Louis Deniot",
    context: "Refined Luxury Living",
    mood: "🛋️ Flawless Design",
  },
  {
    id: 4,
    quote: "A comfortable home is a great source of happiness, ranking immediately after health and peace.",
    author: "Sydney Smith",
    context: "Everyday Living",
    mood: "🏡 Warmth & Comfort",
  },
  {
    id: 5,
    quote: "Wood carries the sacred soul of the forest; our carvers give it a second life in your living room.",
    author: "Heritage Woodwright",
    context: "Solar-Kiln Seasoned Timber",
    mood: "🌿 Living Nature",
  },
  {
    id: 6,
    quote: "The details are not the details. They make the entire design.",
    author: "Charles Eames",
    context: "Master Mortise & Tenon Joinery",
    mood: "🔍 Chiseled Precision",
  },
  {
    id: 7,
    quote: "There is an eternal tranquility in handcrafted solid wood that fleeting synthetic trends can never replace.",
    author: "Royal Woodcraft Guild",
    context: "Generational Heirlooms",
    mood: "👑 Royal Serenity",
  },
  {
    id: 8,
    quote: "Home is where love resides, memories are chiseled, and handcrafted comfort welcomes you every evening.",
    author: "Artisanal Living",
    context: "Bespoke Suites",
    mood: "🌅 Welcoming Haven",
  },
  {
    id: 9,
    quote: "Every timber grain tells a century-old journey of resilience, polished to grace your family for generations.",
    author: "CP Teak Legacy",
    context: "10-Year Termite Proof",
    mood: "🛡️ Generational Strength",
  },
  {
    id: 10,
    quote: "True luxury is not about abundance, but about authentic, honest materials sculpted with reverence.",
    author: "Vedic Craft Traditions",
    context: "Sustainable Solid Sheesham",
    mood: "💎 Authentic Elegance",
  },
];

export function getRandomQuote(): WelcomeQuote {
  const index = Math.floor(Math.random() * WELCOME_QUOTES.length);
  return WELCOME_QUOTES[index];
}

export function getQuoteByIndex(index: number): WelcomeQuote {
  const safeIdx = Math.abs(index) % WELCOME_QUOTES.length;
  return WELCOME_QUOTES[safeIdx];
}
