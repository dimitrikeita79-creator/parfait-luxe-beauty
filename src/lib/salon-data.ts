export const WHATSAPP_NUMBER = "22670028336";
export const WHATSAPP_DISPLAY = "+226 70 02 83 36";

export function waLink(message?: string) {
  const text = message ?? "Bonjour Parfait Design Des Mohair,\n\nJe souhaite obtenir plus d'informations concernant vos services.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const SOCIALS = {
  facebook: "https://www.facebook.com/Faso.Perruque/",
  instagram: "https://www.instagram.com/parfaitdesign",
  tiktok: "https://www.tiktok.com/@desmohair.faso.perruque",
  website: "https://parfaitdesign-desmohair.com/",
};

export const LOCATION = {
  lat: 12.3664879,
  lng: -1.4695977,
  city: "Ouagadougou, Burkina Faso",
  mapsLink: "https://www.google.com/maps/dir/?api=1&destination=12.3664879,-1.4695977",
  embed: "https://www.google.com/maps?q=12.3664879,-1.4695977&hl=fr&z=16&output=embed",
};

export type Service = {
  id: string;
  title: string;
  desc: string;
  price: number;
  duration: string;
  emoji: string;
  tone: string;
};

export const SERVICES: Service[] = [
  { id: "tresses", title: "Tresses Africaines", desc: "Tresses traditionnelles & modernes, finitions soignées.", price: 8000, duration: "2h–4h", emoji: "💇🏾‍♀️", tone: "from-amber-200/60 to-rose-200/40" },
  { id: "mariage", title: "Coiffure Mariage", desc: "Coiffure d'exception pour votre jour J.", price: 35000, duration: "3h", emoji: "👰🏾", tone: "from-rose-200/60 to-amber-100/50" },
  { id: "pose", title: "Pose de Perruque", desc: "Pose lace experte, résultat naturel HD.", price: 15000, duration: "1h30", emoji: "✨", tone: "from-amber-300/50 to-yellow-100/40" },
  { id: "entretien", title: "Entretien de Perruque", desc: "Lavage, soin et restructuration.", price: 7000, duration: "1h", emoji: "🧴", tone: "from-yellow-200/50 to-rose-100/40" },
  { id: "coloration", title: "Coloration", desc: "Couleurs riches, balayages & reflets.", price: 20000, duration: "2h", emoji: "🎨", tone: "from-rose-300/50 to-amber-200/40" },
  { id: "lissage", title: "Lissage", desc: "Lissage doux longue tenue.", price: 25000, duration: "2h30", emoji: "💆🏾‍♀️", tone: "from-amber-200/60 to-rose-100/40" },
  { id: "extensions", title: "Extensions", desc: "Extensions naturelles & brésiliennes.", price: 18000, duration: "2h", emoji: "🌟", tone: "from-yellow-300/50 to-amber-100/40" },
  { id: "conseils", title: "Conseils Beauté", desc: "Consultation personnalisée.", price: 5000, duration: "45min", emoji: "💎", tone: "from-rose-200/60 to-yellow-100/40" },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  desc: string;
  emoji: string;
  badge?: string;
};

export const PRODUCT_CATEGORIES = [
  "Tout",
  "Perruques Naturelles",
  "Perruques Brésiliennes",
  "Lace Front",
  "Mèches Naturelles",
  "Mèches Brésiliennes",
  "Produits Capillaires",
];

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Lace Front Brésilienne 20\"", category: "Lace Front", price: 145000, desc: "Lace HD invisible, densité 180%.", emoji: "💁🏾‍♀️", badge: "Best-seller" },
  { id: "p2", name: "Perruque Naturelle Bouclée", category: "Perruques Naturelles", price: 95000, desc: "100% cheveux naturels, bouclés.", emoji: "👩🏾‍🦱" },
  { id: "p3", name: "Perruque Brésilienne Lisse 24\"", category: "Perruques Brésiliennes", price: 120000, desc: "Lisse soyeux longueur 24 pouces.", emoji: "💆🏾‍♀️", badge: "Nouveau" },
  { id: "p4", name: "Mèches Naturelles Bundle x3", category: "Mèches Naturelles", price: 75000, desc: "3 bundles 18\"–22\" colorables.", emoji: "✨" },
  { id: "p5", name: "Mèches Brésiliennes Body Wave", category: "Mèches Brésiliennes", price: 85000, desc: "Body wave, double trame.", emoji: "🌊" },
  { id: "p6", name: "Huile Capillaire Premium", category: "Produits Capillaires", price: 8500, desc: "Soin nourrissant argan + ricin.", emoji: "🧴" },
  { id: "p7", name: "Shampoing Hydratant", category: "Produits Capillaires", price: 6500, desc: "Sans sulfates, doux quotidien.", emoji: "🛁" },
  { id: "p8", name: "Lace Front 360 Frontale", category: "Lace Front", price: 165000, desc: "360 lace, coiffure libre.", emoji: "👑", badge: "Luxe" },
];

export const GALLERY_CATEGORIES = ["Tout", "Avant / Après", "Mariage", "Perruques", "Tresses", "Coloration"];

export const GALLERY = [
  { id: 1, cat: "Mariage", h: 280, emoji: "👰🏾", tone: "from-rose-300 to-amber-200" },
  { id: 2, cat: "Perruques", h: 220, emoji: "💁🏾‍♀️", tone: "from-amber-300 to-yellow-200" },
  { id: 3, cat: "Tresses", h: 320, emoji: "💇🏾‍♀️", tone: "from-amber-200 to-rose-300" },
  { id: 4, cat: "Avant / Après", h: 200, emoji: "✨", tone: "from-yellow-200 to-amber-300" },
  { id: 5, cat: "Coloration", h: 260, emoji: "🎨", tone: "from-rose-200 to-amber-300" },
  { id: 6, cat: "Perruques", h: 240, emoji: "👑", tone: "from-amber-400 to-yellow-300" },
  { id: 7, cat: "Mariage", h: 300, emoji: "💍", tone: "from-rose-300 to-yellow-200" },
  { id: 8, cat: "Tresses", h: 220, emoji: "🌟", tone: "from-amber-200 to-rose-200" },
  { id: 9, cat: "Coloration", h: 280, emoji: "🌈", tone: "from-rose-300 to-amber-300" },
  { id: 10, cat: "Avant / Après", h: 240, emoji: "💎", tone: "from-amber-300 to-yellow-300" },
  { id: 11, cat: "Perruques", h: 320, emoji: "💖", tone: "from-rose-200 to-amber-200" },
  { id: 12, cat: "Mariage", h: 260, emoji: "🤍", tone: "from-yellow-200 to-rose-200" },
];

export const TESTIMONIALS = [
  { name: "Aïcha K.", text: "Service impeccable, je suis sortie transformée. Merci Parfait Design !", rating: 5 },
  { name: "Mariam S.", text: "Ma coiffure de mariage était parfaite, équipe à l'écoute.", rating: 5 },
  { name: "Fatou D.", text: "Les meilleures perruques de Ouaga, qualité au top.", rating: 5 },
];

export function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}