## Objectifs

Refonte visuelle et fonctionnelle ciblée, sans toucher au backend ni aux routes.

## 1. Services — version texte uniquement (`src/routes/services.tsx`)

- Retirer le composant `Frame` de chaque carte service (plus aucune image / vignette colorée).
- Nouvelle carte liquid-glass plein largeur : titre en gros, description, badge durée + prix, boutons d'action en bas.
- Ajouter une petite pastille `IconBadge` (icône lucide spécifique au service : `Scissors`, `Sparkles`, `Heart`, `Gem`, `Crown`, `Package`) à gauche du titre — pas de photo.
- Idem dans la section "Services populaires" de l'accueil : carte texte uniquement (retirer le `Frame` dans `src/routes/index.tsx`).

## 2. Recherche ultra-performante (accueil)

Refondre `handleSearch` dans `src/routes/index.tsx` :

1. Construire un index plat à partir de `SERVICES` (titre/desc) et `CATALOG_ITEMS` (tous les produits de toutes les catégories, avec leur `category` slug).
2. Algorithme : normaliser la requête (lowercase, sans accents), tokeniser, scorer chaque entrée (match exact > préfixe > sous-chaîne sur n'importe quel mot).
3. Routage :
   - Si un **item catalogue** matche (ex. "huile argan") → `/catalog/$category` de l'item, puis scroller/mettre en évidence (hash `#item-id`).
   - Si un **service** matche → `/services` (filtre activé via search param `?s=<title>` lu par services.tsx).
   - Si un mot-clé matche une **catégorie** (perruque, promo, mariage…) → catégorie correspondante.
   - Sinon → page dédiée `/catalog` avec message "Aucun résultat pour …" via search param `?q=…` + bandeau d'info.
4. Ajouter un menu déroulant de suggestions sous la barre (top 5 résultats) en temps réel : clic = navigation directe. Fermeture sur blur/escape.
5. Debounce léger (100 ms) pour l'index — l'index lui-même est mémoïsé (`useMemo`) car les données sont statiques.

`src/routes/catalog.$category.tsx` : lire `?highlight=<id>` et appliquer un anneau doré + scrollIntoView sur la carte ciblée.
`src/routes/catalog.tsx` : afficher le bandeau "Aucun résultat trouvé pour <q>" quand `?q=` est présent sans match.
`src/routes/services.tsx` : pré-sélectionner le filtre si `?s=` présent.

## 3. Barre de navigation inférieure (`src/components/AppShell.tsx`)

- Renforcer le liquid-glass : conteneur translucide blanc avec blur fort (`blur(24px) saturate(180%)`), bordure intérieure blanche, ombre douce dorée.
- Icônes : supprimer le noir, utiliser `oklch(0.42 0.015 60)` au repos, accent doré au survol.
- État actif : pastille glass blanche **claire** (non noire) avec halo doré subtil + icône colorée selon onglet (Accueil = doré, Services = rose, Galerie = bleu, Catalogue = neutre foncé glass, Contact = vert). Indicateur arrondi animé qui glisse sous l'onglet sélectionné (`transition-transform`).
- Micro-animations : `hover:-translate-y-0.5`, `active:scale-95`, icône `transition-transform` (légère rotation/scale au tap).
- Label en petites capitales avec `tracking-wider`.

## 4. Liquid glass partout sur les boutons

Créer un composant utilitaire **`src/components/GlassButton.tsx`** (variantes : `primary` (dark glass), `light` (white glass), `whatsapp` (white glass + icône verte), `gold` (white glass + accent doré)). Forme : `rounded-full`, padding généreux, bordure intérieure blanche, ombre colorée selon variante, micro-anim `hover:scale-[1.02] active:scale-95`.

Remplacer les boutons actuellement en aplat dans :
- `services.tsx` → boutons "Réserver via WhatsApp" (variante `whatsapp`) et "Détails" (variante `light`).
- `catalog.$category.tsx` → bouton "Commander / J'en profite" (variante `whatsapp`) ; badge "Best-seller/Nouveau" en glass clair (retirer le fond noir actuel).
- `index.tsx` → "Réserver" (primary glass), "Catalogue" (light glass), bouton OK de la recherche (gold glass), "Découvrir les promos" (whatsapp/gold).
- `contact.tsx` → CTA WhatsApp en `whatsapp`, bouton "Itinéraire" en `gold`.
- `gallery.tsx` → pills de catégories en variante glass.

## 5. Grilles blanches — Galerie & Catalogue

- `Frame.tsx` : ajouter prop `variant?: "tinted" | "plain"`. En `plain`, on retire le gradient teinté (`tone`) et la radial sombre — il reste blanc pur + fin ring + léger reflet glass haut. Le ring devient `ring-black/8` pour mieux délimiter.
- `src/routes/gallery.tsx` : passer toutes les vignettes en `variant="plain"` (grille blanche uniforme) ; conserver uniquement le label de catégorie dans une pill glass en bas.
- `src/routes/catalog.tsx` : pareil pour les cartes de catégories — fond blanc, contour fin, titre + countLabel en bas dans une bande glass blanche (au lieu du dégradé sombre actuel). Le nom et le compteur passent en `text-neutral-900` / `text-[var(--gold-deep)]`.
- `src/routes/catalog.$category.tsx` : items en `variant="plain"`, l'image future sera posée par-dessus. Cadre blanc épuré.

## 6. Animations & fluidité globale

- Ajouter dans `src/styles.css` :
  - utilitaire `.glass-nav` (blur 24, saturate 180, bordures blanches).
  - keyframes `nav-pop` (scale + ease-out 180 ms) appliquée à l'icône active.
  - `transition: transform .18s cubic-bezier(.2,.7,.2,1)` sur boutons.
- Respect `prefers-reduced-motion` : désactiver les translate/scale.
- Préchargement de routes : `defaultPreload: "intent"` dans `src/router.tsx` (déjà ou ajouter) + `<Link preload="intent">` implicite. Pour les liens critiques (nav inférieure, CTA accueil), forcer `preload="render"`.
- Mémoïser les listes lourdes (`CATALOG_ITEMS`) avec `useMemo` côté accueil/recherche.
- Lazy-loading `loading="lazy"` déjà présent sur `Frame` — vérifier aussi `decoding="async"`.

## 7. Détails techniques

- **Pas de nouvelle dépendance.**
- Nouveaux fichiers : `src/components/GlassButton.tsx`.
- Modifiés : `AppShell.tsx`, `Frame.tsx`, `styles.css`, `router.tsx`, `routes/index.tsx`, `routes/services.tsx`, `routes/catalog.tsx`, `routes/catalog.$category.tsx`, `routes/gallery.tsx`, `routes/contact.tsx`.
- Normalisation accents : `str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")`.
- Search params via `validateSearch` de TanStack si nécessaire, sinon lecture simple via `useSearch({ strict: false })`.

Aucun changement de routes ni de logique métier — uniquement présentation, recherche et fluidité.
