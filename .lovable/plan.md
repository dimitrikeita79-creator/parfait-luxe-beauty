## Objectifs

Améliorations visuelles et UX sur l'accueil, la navigation, les icônes, les cadres, et la page Contact. Aucune modification backend.

## 1. Accueil — Carrousel

- Supprimer l'auto-play du `CoverCarousel` (la fonction qui appelle `scrollIntoView` faisait remonter la page entière sur certains navigateurs).
- Garder le défilement manuel (swipe) + indicateurs cliquables pour naviguer.
- Conserver les 10 cadres de couverture.

## 2. Barre de navigation

- Retirer le bouton WhatsApp central surélevé du bottom-nav.
- Revenir à 5 onglets équilibrés : Accueil · Services · Galerie · Catalogue · Contact.
- Garder le bouton WhatsApp uniquement dans la top-bar (header), avec effet liquid-glass + icône officielle verte.

## 3. Système d'icônes (liquid glass + couleurs douces)

- Créer un composant `IconBadge` réutilisable : pastille en liquid-glass (blanc translucide, blur, légère bordure dorée), icône `lucide` en gris-anthracite (`text-neutral-700`) au lieu de noir pur.
- Ajouter une micro-animation au survol/tap : `transition-transform`, `active:scale-95`, `hover:scale-105`, léger halo doré.
- Remplacer toutes les pastilles `bg-black text-white` (Contact, Services, Catalogue, Frame) par `IconBadge`.
- Adoucir les couleurs : nav active passe de `bg-black/90` à un glass sombre translucide (`bg-neutral-900/85` + blur).

## 4. Cadres d'images (Frame)

- Fond systématiquement blanc pur derrière les visuels.
- Bordure : `ring-1 ring-black/5` + `shadow-soft` + coin intérieur liquid-glass.
- Ajouter un léger reflet en haut du cadre (gradient blanc translucide) pour l'effet verre.
- Retirer définitivement tout résidu doré sur le contour, garder uniquement un mince filet ivoire optionnel.

## 5. Design global & palette

- Palette : blanc dominant, gris très clair (`oklch(0.97 …)`) pour les surfaces, accents doré pâle (`--gold-soft`) uniquement sur titres/diviseurs.
- Boutons primaires : liquid-glass blanc + texte anthracite, accent doré en hover.
- Boutons WhatsApp et réseaux sociaux : fond liquid-glass blanc + icône colorée officielle (au lieu du fond plein vert/noir).
- Typographie : conserver la pile actuelle, augmenter légèrement le `letter-spacing` des labels d'onglet.

## 6. Icônes sociales colorées (Contact)

- Facebook : bleu `#1877F2`
- Instagram : dégradé rose/orange `#E1306C → #F77737`
- TikTok : noir + cyan/rose officiels (`#000` base, accents `#25F4EE` / `#FE2C55`)
- WhatsApp : vert `#25D366`
- Site web : doré pâle
- Chaque icône posée sur une pastille `IconBadge` liquid-glass + animation `hover:scale-110` + halo coloré subtil.

## 7. Page Contact — refonte du formulaire

- Réorganiser : carte unique liquid-glass avec sections claires (Coordonnées · Demande · Date).
- Ajouter un champ **Produit** (select alimenté par `CATALOG_PRODUCTS` de `salon-data.ts`) en plus du champ Service existant. Option « Aucun ».
- Pré-remplir le message WhatsApp avec service + produit choisi.
- Améliorer les inputs : fond blanc translucide, focus ring doré, padding plus aéré, icônes lucide en début de champ.
- Bloc CTA WhatsApp : grand bouton liquid-glass avec icône officielle verte, sous-titre « Réponse rapide ».
- Cartes Téléphone/Adresse : passer en liquid-glass avec `IconBadge` colorés (téléphone = doré, carte = vert sapin).
- Carte Maps : conserver, mais cadre arrondi liquid-glass et bouton « Itinéraire » blanc + texte doré.

## 8. Animations & fluidité

- Ajouter `transition-all duration-200` aux IconBadge.
- `hover:scale-105 active:scale-95` sur tous les boutons d'action.
- Respect `prefers-reduced-motion`.

## Fichiers modifiés

- `src/components/CoverCarousel.tsx` — retire auto-play.
- `src/components/AppShell.tsx` — retire bouton WhatsApp central, 5 onglets équilibrés, nav active en glass.
- `src/components/IconBadge.tsx` *(nouveau)* — pastille liquid-glass réutilisable.
- `src/components/Frame.tsx` — fond blanc + reflet glass.
- `src/styles.css` — affine tokens (glass, gold-soft, ombres).
- `src/routes/contact.tsx` — formulaire enrichi (Produit), icônes sociales colorées, boutons liquid-glass.
- `src/routes/index.tsx`, `services.tsx`, `catalog.tsx`, `catalog.$category.tsx` — remplacent les pastilles noires par `IconBadge`.

Aucune dépendance ajoutée, aucun changement de routes ni de logique métier.
