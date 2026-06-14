export const BRAND = "Parfait.Design/Desmohair";
export const WHATSAPP_NUMBER = "22670028336";
export const WHATSAPP_DISPLAY = "+226 70 02 83 36";

export function waLink(message?: string) {
  const text = message ?? `Bonjour ${BRAND},\n\nJe souhaite obtenir plus d'informations concernant vos services.`;
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
  tone: string;
};

export const SERVICES: Service[] = [
  { id: "pose", title: "Pose Perruque", desc: "Lace frontale, glueless, HD lace — tenue impeccable, fini naturel.", price: 15000, duration: "1h30", tone: "from-amber-300/70 via-yellow-200/50 to-rose-200/40" },
  { id: "tresses", title: "Coiffure & Tresses", desc: "Box braids, locks, twists, finitions soignées.", price: 8000, duration: "2h–4h", tone: "from-amber-200/70 via-rose-200/50 to-yellow-100/40" },
  { id: "mariage", title: "Coiffure Mariage", desc: "Mariée, demoiselles, essais à domicile.", price: 35000, duration: "3h", tone: "from-rose-200/70 via-amber-100/60 to-yellow-200/40" },
  { id: "tissage", title: "Tissage Premium", desc: "Brésilien, péruvien, body wave, deep wave.", price: 25000, duration: "2h30", tone: "from-yellow-300/60 via-amber-200/60 to-rose-100/40" },
  { id: "perruques", title: "Perruques & Mèches", desc: "100% naturel, lace HD, 18'' à 30''.", price: 95000, duration: "Sur mesure", tone: "from-amber-400/60 via-yellow-300/50 to-amber-100/40" },
  { id: "equipement", title: "Produits & Équipements", desc: "Soins capillaires, fers, miroirs, chaises pro.", price: 6500, duration: "Boutique", tone: "from-rose-300/60 via-amber-200/50 to-yellow-100/40" },
];

export type CatalogCategory = {
  slug: string;
  name: string;
  count: number | null;
  countLabel: string;
  tone: string;
  comingSoon?: boolean;
};

export const CATALOG: CatalogCategory[] = [
  { slug: "coiffure", name: "Coiffure", count: 23, countLabel: "23 Créations", tone: "from-amber-300/70 via-rose-200/50 to-yellow-100/40" },
  { slug: "perruques", name: "Perruques", count: 43, countLabel: "43 Créations", tone: "from-amber-400/70 via-yellow-300/50 to-amber-100/40" },
  { slug: "meche", name: "Mèche", count: null, countLabel: "Bientôt disponible", tone: "from-rose-200/60 via-amber-100/40 to-yellow-100/30", comingSoon: true },
  { slug: "mariage", name: "Mariage", count: 18, countLabel: "18 Créations", tone: "from-rose-300/70 via-amber-100/50 to-yellow-200/40" },
  { slug: "produits", name: "Produits", count: 23, countLabel: "23 Produits", tone: "from-yellow-300/70 via-amber-200/50 to-rose-100/40" },
  { slug: "equipement", name: "Équipement", count: 21, countLabel: "21 Équipements", tone: "from-amber-200/70 via-yellow-200/50 to-rose-200/40" },
  { slug: "promotion", name: "Promotion", count: 11, countLabel: "11 Promo", tone: "from-rose-400/70 via-amber-300/50 to-yellow-200/40" },
];

export type CatalogItem = {
  id: string;
  name: string;
  desc: string;
  price?: number;
  badge?: string;
  tone?: string;
};

function makeItems(prefix: string, names: string[], basePrice: number, descs: string[]): CatalogItem[] {
  return names.map((n, i) => ({
    id: `${prefix}-${i + 1}`,
    name: n,
    desc: descs[i % descs.length],
    price: basePrice + (i % 5) * 7500,
    badge: i === 0 ? "Best-seller" : i === 3 ? "Nouveau" : undefined,
  }));
}

export const CATALOG_ITEMS: Record<string, CatalogItem[]> = {
  coiffure: makeItems(
    "coif",
    [
      "Box Braids Classique", "Knotless Braids", "Twists Sénégalaises", "Locks Soignées",
      "Tresses Cornrows", "Tresses Triangle", "Faux Locs", "Passion Twists",
      "Tresses Bohème", "Tresses Collées", "Tresses Goddess", "Tresses Tribales",
      "Tresses Couleur", "Tresses Longues", "Tresses Courtes", "Chignon Tressé",
      "Fulani Braids", "Bantu Knots", "Cornrows Design", "Tresses Mèche",
      "Tresses Naturelles", "Tresses Express", "Tresses Enfant",
    ],
    8000,
    ["Finitions soignées, longue tenue.", "Style moderne et élégant.", "Pose confortable, racines respectées."],
  ),
  perruques: makeItems(
    "wig",
    Array.from({ length: 43 }, (_, i) => {
      const styles = ["Lace HD 20\"", "Lace Frontale 22\"", "Bob Lace 14\"", "Bouclée 18\"", "Lisse 24\"", "Body Wave 26\"", "Deep Wave 22\"", "Glueless 20\"", "360 Lace 24\"", "Curly 18\""];
      return `Perruque ${styles[i % styles.length]} #${i + 1}`;
    }),
    65000,
    ["100% cheveux naturels, densité 180%.", "Lace HD invisible, fini peau.", "Tenue confortable, coiffable à volonté."],
  ),
  meche: [],
  mariage: makeItems(
    "mar",
    Array.from({ length: 18 }, (_, i) => {
      const styles = ["Chignon Romantique", "Tresse Couronne", "Onde Glamour", "Updo Élégant", "Voile & Fleurs", "Chignon Bas", "Tresse Latérale"];
      return `${styles[i % styles.length]} #${i + 1}`;
    }),
    35000,
    ["Coiffure d'exception pour votre jour J.", "Essai inclus, ajustement personnalisé."],
  ),
  produits: makeItems(
    "prod",
    [
      "Huile Argan Premium", "Shampoing Hydratant", "Masque Réparateur", "Sérum Brillance",
      "Spray Thermo-Protecteur", "Mousse Coiffante", "Lait Capillaire", "Gel Edge Control",
      "Beurre Karité Pur", "Crème Démêlante", "Soin Sans Rinçage", "Huile Ricin Noir",
      "Shampoing Sans Sulfate", "Après-shampoing Doux", "Spray Lustrant", "Mousse Définition",
      "Lotion Pousse", "Gelée Hydratante", "Crème Boucles", "Soin Pointes",
      "Spray Hydratant", "Masque Nuit", "Sérum Anti-Casse",
    ],
    6500,
    ["Soin nourrissant haute qualité.", "Formule premium pour cheveux exigeants.", "Résultat visible dès la 1ère utilisation."],
  ),
  equipement: makeItems(
    "eq",
    [
      "Fer à Lisser Pro", "Boucleur Céramique", "Sèche-cheveux Ionique", "Brosse Soufflante",
      "Miroir LED Maquillage", "Chaise Salon Pro", "Bac à Shampoing", "Casque Chauffant",
      "Tondeuse Précision", "Ciseaux Pro Inox", "Peigne Chauffant", "Brosse Démêlante",
      "Vaporisateur Pro", "Capes Coiffure", "Rangement Outils", "Chariot Salon",
      "Table Manucure", "Lampe UV LED", "Stérilisateur UV", "Diffuseur Boucles",
      "Mannequin Coiffure",
    ],
    15000,
    ["Équipement professionnel haut de gamme.", "Idéal salon ou usage personnel."],
  ),
  promotion: makeItems(
    "promo",
    [
      "-20% Pose Perruque", "-15% Tissage Premium", "Pack Mariage -25%", "Entretien Offert",
      "Bundle Mèches -30%", "Lace HD -10%", "Pack Tresses Duo", "Conseils Beauté Offerts",
      "Coloration -20%", "Soins Cheveux Pack", "Black Friday -40%",
    ],
    0,
    ["Offre limitée du mois.", "Profitez vite avant épuisement !"],
  ),
};

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

export const TESTIMONIALS = [
  { name: "Aïcha K.", text: "Service impeccable, je suis sortie transformée. Merci Parfait Design !", rating: 5 },
  { name: "Mariam S.", text: "Ma coiffure de mariage était parfaite, équipe à l'écoute.", rating: 5 },
  { name: "Fatou D.", text: "Les meilleures perruques de Ouaga, qualité au top.", rating: 5 },
];

export function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}