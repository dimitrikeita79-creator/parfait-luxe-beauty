import logoParfait from "@/assets/logo-parfait.asset.json";
import logoDesmohair from "@/assets/logo-desmohair.asset.json";
import logoBeaute from "@/assets/logo-beaute.asset.json";

export const BRAND = "Parfait.Design/Desmohair";

// ============================================================
// SALONS
// ============================================================
export type SalonId = "parfait" | "desmohair" | "beaute";
export type Salon = {
  id: SalonId;
  name: string;
  area: string;
  city: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string; // digits only
  mapsLink: string;
  embed: string;
  logo: string;
  tags: Array<"services" | "perruques" | "meche" | "mariage" | "coiffure" | "promotion" | "produits" | "equipement">;
};

export const SALONS: Salon[] = [
  {
    id: "parfait",
    name: "Parfait Design",
    area: "Ouaga centre",
    city: "Ouagadougou, Burkina Faso",
    phone: "+22670028336",
    phoneDisplay: "+226 70 02 83 36",
    whatsapp: "22670028336",
    mapsLink: "https://www.google.com/maps?q=12.3664879,-1.4695977",
    embed: "https://www.google.com/maps?q=12.3664879,-1.4695977&hl=fr&z=16&output=embed",
    logo: logoParfait.url,
    tags: ["services", "perruques", "meche", "mariage", "coiffure", "promotion"],
  },
  {
    id: "desmohair",
    name: "Desmo Hair",
    area: "Ouaga 2000",
    city: "Ouagadougou, Burkina Faso",
    phone: "+22671716411",
    phoneDisplay: "+226 71 71 64 11",
    whatsapp: "22671716411",
    mapsLink: "https://maps.app.goo.gl/AQnbR4cyVPYH3PmW7",
    embed: "https://www.google.com/maps?q=Desmo+Hair+Ouaga+2000&hl=fr&z=15&output=embed",
    logo: logoDesmohair.url,
    tags: ["services", "perruques", "meche", "mariage", "coiffure", "promotion"],
  },
  {
    id: "beaute",
    name: "Beauté Essentielle",
    area: "Dassasgo",
    city: "Ouagadougou, Burkina Faso",
    phone: "+22671115784",
    phoneDisplay: "+226 71 11 57 84",
    whatsapp: "22671115784",
    mapsLink: "https://maps.app.goo.gl/TqSPQGnvZsVpRcK6A",
    embed: "https://www.google.com/maps?q=Dassasgo+Ouagadougou&hl=fr&z=15&output=embed",
    logo: logoBeaute.url,
    tags: ["produits", "equipement"],
  },
];

export function getSalon(id: SalonId): Salon {
  return SALONS.find((s) => s.id === id) ?? SALONS[0];
}

export function pickSalonFor(category?: string): Salon {
  if (!category) return SALONS[0];
  if (category === "produits" || category === "equipement") return getSalon("beaute");
  return getSalon("parfait");
}

export function waLinkFor(salonId: SalonId, message?: string) {
  const s = getSalon(salonId);
  const text = message ?? `Bonjour ${s.name},\n\nJe souhaite obtenir plus d'informations.`;
  return `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(text)}`;
}

// ============================================================
// Legacy compat (default = Parfait Design)
// ============================================================
export const WHATSAPP_NUMBER = SALONS[0].whatsapp;
export const WHATSAPP_DISPLAY = SALONS[0].phoneDisplay;
export function waLink(message?: string) {
  return waLinkFor("parfait", message);
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
  city: SALONS[0].city,
  mapsLink: SALONS[0].mapsLink,
  embed: SALONS[0].embed,
};

// ============================================================
// SERVICES
// ============================================================
export type Service = {
  id: string;
  title: string;
  desc: string;
  price: number;
  duration: string;
  tone: string;
};

export const SERVICES: Service[] = [
  { id: "pose", title: "Pose Perruque", desc: "Lace frontale, glueless, HD lace — tenue impeccable, fini naturel.", price: 15000, duration: "1h30", tone: "from-amber-300/70 via-yellow-200/50 to-rose-200/40" },
  { id: "tresses", title: "Coiffure & Tresses", desc: "Box braids, locks, twists, finitions soignées.", price: 8000, duration: "2h–4h", tone: "from-amber-200/70 via-rose-200/50 to-yellow-100/40" },
  { id: "mariage", title: "Coiffure Mariage", desc: "Mariée, demoiselles, essais à domicile.", price: 35000, duration: "3h", tone: "from-rose-200/70 via-amber-100/60 to-yellow-200/40" },
  { id: "tissage", title: "Tissage Premium", desc: "Brésilien, péruvien, body wave, deep wave.", price: 25000, duration: "2h30", tone: "from-yellow-300/60 via-amber-200/60 to-rose-100/40" },
  { id: "perruques", title: "Perruques & Mèches", desc: "100% naturel, lace HD, 18'' à 30''.", price: 32000, duration: "Sur mesure", tone: "from-amber-400/60 via-yellow-300/50 to-amber-100/40" },
  { id: "equipement", title: "Produits & Équipements", desc: "Soins capillaires, fers, miroirs, chaises pro.", price: 6500, duration: "Boutique", tone: "from-rose-300/60 via-amber-200/50 to-yellow-100/40" },
];

// ============================================================
// CATALOG ITEMS
// ============================================================
export type CatalogItem = {
  id: string;
  code?: string;
  name: string;
  desc: string;
  price?: number;
  oldPrice?: number;
  fromPrice?: boolean;
  badge?: string;
  subCategory?: string;
  texture?: string;
  salon?: SalonId;
};

// --- Coiffure (CF1–CF23) ---
const COIFFURE: CatalogItem[] = [
  { id: "CF1",  code: "CF1",  name: "Coupe tendance",            desc: "Coupe moderne au style élégant quotidien.",          price: 65000, badge: "Best-seller" },
  { id: "CF2",  code: "CF2",  name: "Catalina version Chioma",   desc: "Look glamour inspiré du style Chioma.",              price: 35000 },
  { id: "CF3",  code: "CF3",  name: "Catalina double frange",    desc: "Double frange légère avec finition naturelle.",      price: 35000 },
  { id: "CF4",  code: "CF4",  name: "Catalina simple",           desc: "Coupe courte simple et facile à porter.",            price: 32000, badge: "Nouveau" },
  { id: "CF5",  code: "CF5",  name: "Catalina bouclée",          desc: "Boucles souples au volume naturel chic.",            price: 32000 },
  { id: "CF6",  code: "CF6",  name: "Catalina frange de côté",   desc: "Frange latérale élégante au rendu naturel.",         price: 32000 },
  { id: "CF7",  code: "CF7",  name: "Catalina closure",          desc: "Finition closure discrète et très réaliste.",        price: 32000 },
  { id: "CF8",  code: "CF8",  name: "Catalina frange de côté",   desc: "Style raffiné avec frange sur le côté.",             price: 32000 },
  { id: "CF9",  code: "CF9",  name: "Catalina frange",           desc: "Frange droite moderne et féminine élégante.",        price: 32000 },
  { id: "CF10", code: "CF10", name: "Catalina frange de côté",   desc: "Coiffure courte avec mouvement naturel fluide.",     price: 32000 },
  { id: "CF11", code: "CF11", name: "Catalina frange de côté",   desc: "Look chic parfait pour toutes occasions.",           price: 32000 },
  { id: "CF12", code: "CF12", name: "Catalina frange de côté",   desc: "Frange légère avec coupe courte tendance.",          price: 32000 },
  { id: "CF13", code: "CF13", name: "Catalina frange de côté",   desc: "Style féminin discret et facile d'entretien.",       price: 32000 },
  { id: "CF14", code: "CF14", name: "Catalina gris",             desc: "Coloris gris moderne au rendu sophistiqué.",         price: 45000 },
  { id: "CF15", code: "CF15", name: "Catalina gris",             desc: "Coupe grise élégante au style affirmé.",             price: 45000 },
  { id: "CF16", code: "CF16", name: "Catalina bouclée",          desc: "Boucles définies avec effet naturel volumineux.",    price: 32000 },
  { id: "CF17", code: "CF17", name: "Catalina",                  desc: "Coupe classique adaptée au quotidien élégant.",      price: 32000 },
  { id: "CF18", code: "CF18", name: "Catalina bouclée",          desc: "Texture bouclée douce avec belle densité.",          price: 32000 },
  { id: "CF19", code: "CF19", name: "Catalina frange",           desc: "Frange stylée avec finition propre naturelle.",      price: 32000 },
  { id: "CF20", code: "CF20", name: "Catalina deux traits",      desc: "Deux traits modernes pour look audacieux.",          price: 35000 },
  { id: "CF21", code: "CF21", name: "Catalina bouclée",          desc: "Boucles courtes souples et très tendance.",          price: 32000 },
  { id: "CF22", code: "CF22", name: "Catalina modifiée",         desc: "Modèle premium revisité avec finition travaillée.",  price: 32000 },
  { id: "CF23", code: "CF23", name: "Catalina modifiée frange",  desc: "Frange revisitée avec coupe moderne raffinée.",      price: 35000 },
];

// --- Perruques: Bouncy (PB1–PB16) ---
const PERR_BOUNCY: CatalogItem[] = [
  { id: "PB1",  code: "PB1",  name: "Perruque Bouncy Closure sur le côté", desc: "Closure latérale avec effet naturel élégant.",    price: 72000,  fromPrice: true,  subCategory: "Bouncy", texture: "Virgin", badge: "Best-seller" },
  { id: "PB2",  code: "PB2",  name: "Bouncy SDD Closure 5x5",              desc: "Perruque fluide avec closure discrète moderne.",   price: 67000,  fromPrice: true,  subCategory: "Bouncy", texture: "Raw" },
  { id: "PB3",  code: "PB3",  name: "Bouncy Hairline",                     desc: "Hairline réaliste avec volume naturel parfait.",   price: 67000,  fromPrice: true,  subCategory: "Bouncy", texture: "Brazilian" },
  { id: "PB4",  code: "PB4",  name: "Collection Hanriette",                desc: "Collection premium au rendu soyeux luxueux.",      price: 115000, fromPrice: true,  subCategory: "Bouncy", texture: "Indian", badge: "Nouveau" },
  { id: "PB5",  code: "PB5",  name: "Bouncy Anastasie Closure 6x6",        desc: "Closure large avec finition haute définition.",    price: 137000, subCategory: "Bouncy", texture: "Raw" },
  { id: "PB6",  code: "PB6",  name: "Collection Hanriette",                desc: "Style élégant avec texture douce naturelle.",      price: 155000, fromPrice: true,  subCategory: "Bouncy", texture: "Peruvian" },
  { id: "PB7",  code: "PB7",  name: "Collection Hanriette",                desc: "Perruque chic idéale pour usage quotidien.",       price: 115000, subCategory: "Bouncy", texture: "Malaysian" },
  { id: "PB8",  code: "PB8",  name: "Black Beauty Hanriette",              desc: "Mélange coloré moderne avec brillance naturelle.", price: 105000, subCategory: "Bouncy", texture: "Brazilian" },
  { id: "PB9",  code: "PB9",  name: "Léa Bouncy",                          desc: "Longueur glamour avec mouvement très fluide.",     price: 87000,  subCategory: "Bouncy", texture: "Vietnamese" },
  { id: "PB10", code: "PB10", name: "Collection Hanriette",                desc: "Coloration élégante avec finition haut de gamme.", price: 207000, subCategory: "Bouncy", texture: "Peruvian" },
  { id: "PB11", code: "PB11", name: "Frange Closure 5x5",                  desc: "Frange naturelle avec closure parfaitement discrète.", price: 67000, fromPrice: true, subCategory: "Bouncy", texture: "Virgin" },
  { id: "PB12", code: "PB12", name: "Foumi Frange",                        desc: "Coupe frange moderne au look raffiné.",            price: 75000,  subCategory: "Bouncy", texture: "Brazilian" },
  { id: "PB13", code: "PB13", name: "Black Beauty Bounce HD Lace",         desc: "Lace HD invisible avec rendu réaliste.",           price: 115000, subCategory: "Bouncy", texture: "Brazilian" },
  { id: "PB14", code: "PB14", name: "Bouncy Closure 5x5",                  desc: "Couleur lumineuse avec texture souple naturelle.", price: 82000,  subCategory: "Bouncy", texture: "Virgin" },
  { id: "PB15", code: "PB15", name: "Bouncy Closure 5x5",                  desc: "Effet piano élégant au rendu brillant. Promo limitée.", price: 82000, oldPrice: 105000, badge: "★ Limité", subCategory: "Bouncy", texture: "Vietnamese" },
  { id: "PB16", code: "PB16", name: "Bouncy Closure 5x5",                  desc: "Dégradé piano avec belle densité naturelle. Promo limitée.", price: 58000, oldPrice: 70000, badge: "★ Limité", subCategory: "Bouncy", texture: "Peruvian" },
];

// --- Perruques: Coupe Carré (PCC1–PCC9) ---
const PERR_CC: CatalogItem[] = [
  { id: "PCC1", code: "PCC1", name: "Frange dégradée",       desc: "Dégradé gris moderne avec frange stylée.",       price: 85000, subCategory: "Coupe Carré", texture: "Brazilian" },
  { id: "PCC2", code: "PCC2", name: "Raw Hair",              desc: "Raw hair premium au toucher soyeux.",            price: 90000, subCategory: "Coupe Carré", texture: "Vietnamese" },
  { id: "PCC3", code: "PCC3", name: "SDD Closure 5x5",       desc: "Closure discrète avec rendu naturel impeccable.",price: 57000, subCategory: "Coupe Carré", texture: "Raw" },
  { id: "PCC4", code: "PCC4", name: "Raw Hair Closure 2x6",  desc: "Couleur ginger élégante avec texture fluide.",   price: 85000, subCategory: "Coupe Carré", texture: "Indian" },
  { id: "PCC5", code: "PCC5", name: "Frange Closure 5x5",    desc: "Frange tendance avec finition très naturelle.",  price: 57000, subCategory: "Coupe Carré", texture: "Malaysian" },
  { id: "PCC6", code: "PCC6", name: "Raw Hair Closure 2x6",  desc: "Texture premium avec coloration brown sophistiquée.", price: 90000, subCategory: "Coupe Carré", texture: "Peruvian" },
  { id: "PCC7", code: "PCC7", name: "Frange",                desc: "Coupe courte pratique avec frange légère.",      price: 37000, subCategory: "Coupe Carré", texture: "Malaysian" },
  { id: "PCC8", code: "PCC8", name: "Plongeon",              desc: "Coupe plongeante moderne au style féminin.",     price: 57000, subCategory: "Coupe Carré", texture: "Indian" },
  { id: "PCC9", code: "PCC9", name: "Raw Hair",              desc: "Raw hair brillant avec couleur intense.",        price: 90000, subCategory: "Coupe Carré", texture: "Raw" },
];

// --- Perruques: Effet Mouillé (PEM1–PEM7) ---
const PERR_EM: CatalogItem[] = [
  { id: "PEM1", code: "PEM1", name: "Pixie Curl",                desc: "Boucles pixie volumineuses au rendu glamour.",        price: 137000, subCategory: "Effet Mouillé", texture: "Indian" },
  { id: "PEM2", code: "PEM2", name: "Pixie Curl Closure 5x5",    desc: "Closure naturelle avec boucles définies élégantes.",  price: 117000, subCategory: "Effet Mouillé", texture: "Vietnamese" },
  { id: "PEM3", code: "PEM3", name: "Burmess Curl",              desc: "Boucles profondes avec couleur bordeaux chic.",       price: 117000, subCategory: "Effet Mouillé", texture: "Brazilian" },
  { id: "PEM4", code: "PEM4", name: "Burmess Curl",              desc: "Texture souple avec volume harmonieux naturel. Promo limitée.", price: 58000, oldPrice: 70000, badge: "★ Limité", subCategory: "Effet Mouillé", texture: "Raw" },
  { id: "PEM5", code: "PEM5", name: "Pixie Curl",                desc: "Effet piano brillant avec boucles légères. Promo limitée.",     price: 78000, oldPrice: 87000, badge: "★ Limité", subCategory: "Effet Mouillé", texture: "Indian" },
  { id: "PEM6", code: "PEM6", name: "Burmess Curl",              desc: "Boucles piano modernes et faciles à coiffer. Promo limitée.",   price: 58000, oldPrice: 70000, badge: "★ Limité", subCategory: "Effet Mouillé", texture: "Malaysian" },
  { id: "PEM7", code: "PEM7", name: "Burmess Curl Closure 5x4",  desc: "Closure pratique avec texture curly naturelle.",      price: 87000, subCategory: "Effet Mouillé", texture: "Peruvian" },
];

// --- Perruques: Lisse Long (PLL1–PLL9) ---
const PERR_LL: CatalogItem[] = [
  { id: "PLL1", code: "PLL1", name: "Frange longue",           desc: "Frange longue avec mouvement élégant naturel.",       price: 62000,  fromPrice: true, subCategory: "Lisse Long", texture: "Virgin" },
  { id: "PLL2", code: "PLL2", name: "Collection Hanriette",    desc: "Modèle luxueux avec finition haut de gamme.",         price: 115000, fromPrice: true, subCategory: "Lisse Long", texture: "Brazilian" },
  { id: "PLL3", code: "PLL3", name: "Raw Hair Closure 5x5",    desc: "Longueur premium avec closure invisible naturelle.",  price: 175000, subCategory: "Lisse Long", texture: "Vietnamese" },
  { id: "PLL4", code: "PLL4", name: "Raw Hair Closure 2x6",    desc: "Texture raw hair douce et réaliste.",                 price: 165000, subCategory: "Lisse Long", texture: "Indian" },
  { id: "PLL5", code: "PLL5", name: "Raw Hair",                desc: "Longue perruque brillante couleur bordeaux intense.", price: 175000, subCategory: "Lisse Long", texture: "Raw" },
  { id: "PLL6", code: "PLL6", name: "Raw Hair",                desc: "Coloration brown chic avec texture fluide.",          price: 175000, subCategory: "Lisse Long", texture: "Virgin" },
  { id: "PLL7", code: "PLL7", name: "Anastasie",               desc: "Style glamour avec belle densité naturelle.",         price: 137000, subCategory: "Lisse Long", texture: "Peruvian" },
  { id: "PLL8", code: "PLL8", name: "Collection Hanriette",    desc: "Mélange piano élégant avec finition premium.",        price: 207000, subCategory: "Lisse Long", texture: "Indian" },
  { id: "PLL9", code: "PLL9", name: "Raw Hair 6x6",            desc: "Closure large avec rendu naturel impeccable.",        price: 137000, subCategory: "Lisse Long", texture: "Raw" },
];

// --- Perruques: Cut (PC1–PC2) ---
const PERR_CUT: CatalogItem[] = [
  { id: "PC1", code: "PC1", name: "Coupe Catalina", desc: "Coupe courte colorée au style moderne.",  price: 32000, subCategory: "Cut", texture: "Malaysian" },
  { id: "PC2", code: "PC2", name: "Coupe Catalina", desc: "Coupe naturelle élégante facile à porter.", price: 32000, subCategory: "Cut", texture: "Raw" },
];

const PERRUQUES: CatalogItem[] = [...PERR_BOUNCY, ...PERR_CC, ...PERR_EM, ...PERR_LL, ...PERR_CUT];

// Promotions = items marqués ★ Limité
const PROMOTION: CatalogItem[] = PERRUQUES.filter((p) => p.badge === "★ Limité");

// Placeholders pour les autres catégories (données réelles à venir)
function placeholder(prefix: string, names: string[], basePrice: number, descs: string[]): CatalogItem[] {
  return names.map((n, i) => ({
    id: `${prefix}-${i + 1}`,
    name: n,
    desc: descs[i % descs.length],
    price: basePrice + (i % 5) * 7500,
    badge: i === 0 ? "Best-seller" : i === 3 ? "Nouveau" : undefined,
  }));
}

const MARIAGE = placeholder("mar",
  Array.from({ length: 18 }, (_, i) => {
    const styles = ["Chignon Romantique", "Tresse Couronne", "Onde Glamour", "Updo Élégant", "Voile & Fleurs", "Chignon Bas", "Tresse Latérale"];
    return `${styles[i % styles.length]} #${i + 1}`;
  }),
  35000,
  ["Coiffure d'exception pour votre jour J.", "Essai inclus, ajustement personnalisé."],
);

const PRODUITS = placeholder("prod",
  ["Huile Argan Premium", "Shampoing Hydratant", "Masque Réparateur", "Sérum Brillance",
   "Spray Thermo-Protecteur", "Mousse Coiffante", "Lait Capillaire", "Gel Edge Control",
   "Beurre Karité Pur", "Crème Démêlante", "Soin Sans Rinçage", "Huile Ricin Noir",
   "Shampoing Sans Sulfate", "Après-shampoing Doux", "Spray Lustrant", "Mousse Définition",
   "Lotion Pousse", "Gelée Hydratante", "Crème Boucles", "Soin Pointes",
   "Spray Hydratant", "Masque Nuit", "Sérum Anti-Casse"],
  6500,
  ["Soin nourrissant haute qualité.", "Formule premium pour cheveux exigeants.", "Résultat visible dès la 1ère utilisation."],
);

const EQUIPEMENT = placeholder("eq",
  ["Fer à Lisser Pro", "Boucleur Céramique", "Sèche-cheveux Ionique", "Brosse Soufflante",
   "Miroir LED Maquillage", "Chaise Salon Pro", "Bac à Shampoing", "Casque Chauffant",
   "Tondeuse Précision", "Ciseaux Pro Inox", "Peigne Chauffant", "Brosse Démêlante",
   "Vaporisateur Pro", "Capes Coiffure", "Rangement Outils", "Chariot Salon",
   "Table Manucure", "Lampe UV LED", "Stérilisateur UV", "Diffuseur Boucles",
   "Mannequin Coiffure"],
  15000,
  ["Équipement professionnel haut de gamme.", "Idéal salon ou usage personnel."],
);

export const CATALOG_ITEMS: Record<string, CatalogItem[]> = {
  coiffure: COIFFURE,
  perruques: PERRUQUES,
  meche: [],
  mariage: MARIAGE,
  produits: PRODUITS,
  equipement: EQUIPEMENT,
  promotion: PROMOTION,
};

export type CatalogCategory = {
  slug: string;
  name: string;
  count: number | null;
  countLabel: string;
  tone: string;
  comingSoon?: boolean;
};

function countFor(slug: string, singular: string, plural?: string) {
  const n = CATALOG_ITEMS[slug]?.length ?? 0;
  const word = n > 1 ? (plural ?? `${singular}s`) : singular;
  return { count: n, countLabel: `${n} ${word}` };
}

export const CATALOG: CatalogCategory[] = [
  { slug: "coiffure",  name: "Coiffure",   ...countFor("coiffure", "Création", "Créations"),   tone: "from-amber-300/70 via-rose-200/50 to-yellow-100/40" },
  { slug: "perruques", name: "Perruques",  ...countFor("perruques", "Création", "Créations"),  tone: "from-amber-400/70 via-yellow-300/50 to-amber-100/40" },
  { slug: "meche",     name: "Mèche",      count: null, countLabel: "Bientôt disponible",       tone: "from-rose-200/60 via-amber-100/40 to-yellow-100/30", comingSoon: true },
  { slug: "mariage",   name: "Mariage",    ...countFor("mariage", "Création", "Créations"),    tone: "from-rose-300/70 via-amber-100/50 to-yellow-200/40" },
  { slug: "produits",  name: "Produits",   ...countFor("produits", "Produit", "Produits"),     tone: "from-yellow-300/70 via-amber-200/50 to-rose-100/40" },
  { slug: "equipement",name: "Équipement", ...countFor("equipement", "Équipement", "Équipements"), tone: "from-amber-200/70 via-yellow-200/50 to-rose-200/40" },
  { slug: "promotion", name: "Promotion",  ...countFor("promotion", "Promo", "Promos"),       tone: "from-rose-400/70 via-amber-300/50 to-yellow-200/40" },
];

// ============================================================
// Gallery
// ============================================================
export const GALLERY_CATEGORIES = ["Tout", "Avant / Après", "Mariage", "Perruques", "Tresses", "Coloration"];
export const GALLERY = [
  { id: 1, cat: "Mariage", h: 280, tone: "from-rose-300/80 via-amber-200/70 to-yellow-200/60" },
  { id: 2, cat: "Perruques", h: 220, tone: "from-amber-300/80 via-yellow-200/70 to-rose-100/60" },
  { id: 3, cat: "Tresses", h: 320, tone: "from-amber-200/80 via-rose-300/70 to-yellow-200/60" },
  { id: 4, cat: "Avant / Après", h: 200, tone: "from-yellow-200/80 via-amber-300/70 to-rose-200/60" },
  { id: 5, cat: "Coloration", h: 260, tone: "from-rose-200/80 via-amber-300/70 to-yellow-100/60" },
  { id: 6, cat: "Perruques", h: 240, tone: "from-amber-400/80 via-yellow-300/70 to-amber-100/60" },
  { id: 7, cat: "Mariage", h: 300, tone: "from-rose-300/80 via-yellow-200/70 to-amber-200/60" },
  { id: 8, cat: "Tresses", h: 220, tone: "from-amber-200/80 via-rose-200/70 to-yellow-100/60" },
  { id: 9, cat: "Coloration", h: 280, tone: "from-rose-300/80 via-amber-300/70 to-yellow-200/60" },
  { id: 10, cat: "Avant / Après", h: 240, tone: "from-amber-300/80 via-yellow-300/70 to-rose-100/60" },
  { id: 11, cat: "Perruques", h: 320, tone: "from-rose-200/80 via-amber-200/70 to-yellow-200/60" },
  { id: 12, cat: "Mariage", h: 260, tone: "from-yellow-200/80 via-rose-200/70 to-amber-200/60" },
];

// ============================================================
// Avis clientes — vraies citations
// ============================================================
export const TESTIMONIALS = [
  { name: "Laitifa Segda",          text: "C'était super et magique à la fois",            rating: 5 },
  { name: "Venance Koffi",          text: "Très bien",                                     rating: 5 },
  { name: "Sampawende Maelyse",     text: "Perfect",                                       rating: 5 },
  { name: "Nana Yasmine Zoure",     text: "C'est vraiment cool",                           rating: 5 },
  { name: "Adèle Sawadogo",         text: "C'est jolie dès 😍🥰",                          rating: 5 },
  { name: "Eliane Koutiebou Silga", text: "Paaatiiiiii, très joli et moins cher ❤️",      rating: 5 },
];

export function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}
