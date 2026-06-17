## Objectif

Intégrer les vraies données des trois établissements, les nouveaux catalogues (coiffures CF + perruques PB/PCC/PEM/PLL/PC), les vrais témoignages et les logos. Sans casser la structure actuelle. Ajout d'effets liquid glass + dorés et d'animations sur les CTA d'accueil.

## 1. Données — `src/lib/salon-data.ts`

- Nouveau export `SALONS` (tableau de 3) :
  - **Parfait Design** — Ouaga centre, +226 70 02 83 36, Maps `?q=12.3664879,-1.4695977`, tags `["services","perruques","meche","mariage","coiffure","promo"]`.
  - **Desmo Hair** — Ouaga 2000, +226 71 71 64 11, Maps `https://maps.app.goo.gl/AQnbR4cyVPYH3PmW7`, mêmes tags.
  - **Beauté Essentielle** — Dassasgo, +226 71 11 57 84, Maps `https://maps.app.goo.gl/TqSPQGnvZsVpRcK6A`, tags `["produits","equipement"]`.
- Helper `waLinkFor(salonId, message?)` : choisit le numéro WhatsApp selon le salon. Helper `pickSalonFor(category)` qui retourne le salon adapté (produits/equipement → Beauté Essentielle, sinon → Parfait Design par défaut, avec possibilité de choisir Desmo Hair dans l'UI). Les exports existants `WHATSAPP_NUMBER`/`waLink`/`LOCATION` sont conservés pour compat (pointent sur Parfait Design).
- Remplacer `CATALOG_ITEMS.coiffure` par les **23 coupes CF1–CF23** avec nom, code, description et prix exacts fournis.
- Remplacer `CATALOG_ITEMS.perruques` par toutes les perruques fournies : **PB1–PB16** (Bouncy), **PCC1–PCC9** (Coupe Carré), **PEM1–PEM7** (Effet Mouillé), **PLL1–PLL9** (Lisse Long), **PC1–PC2** (Cut). Ajouter un champ optionnel `subCategory`, `texture`, `oldPrice` (pour les promos "★ Limité"), `fromPrice` (booléen "À partir de"). Les entrées marquées "★ Limité" sont aussi dupliquées/référencées dans `CATALOG_ITEMS.promotion`.
- Recalculer les `count` / `countLabel` des catégories à partir des données réelles.
- Remplacer `TESTIMONIALS` par les 6 vrais avis fournis (Laitifa Segda, Venance Koffi, Sampawende Maelyse, Nana Yasmine Zoure, Adèle Sawadogo, Eliane Koutiebou Silga).
- Note : mèche, mariage, produits, equipement, promotion restent inchangés pour l'instant — l'utilisateur enverra les vraies données plus tard. Garder les listes actuelles comme placeholders pour ne pas casser l'UI.

## 2. Logos — assets

Extraire `LOGO.zip` puis créer 3 pointeurs Lovable Assets :
- `src/assets/logo-parfait.asset.json`
- `src/assets/logo-desmohair.asset.json`
- `src/assets/logo-beaute.asset.json`

Référencés dans `SALONS[*].logo` (import du `.asset.json`).

## 3. Page Contact — `src/routes/contact.tsx`

- Nouvelle section "Nos établissements" en haut : 3 cartes liquid-glass empilées, chacune avec logo (rond blanc), nom, quartier, bouton "Appeler" (tel:) + bouton "WhatsApp" + bouton "Itinéraire". Les boutons utilisent `GlassButton`.
- Le sélecteur de service dans le formulaire ajoute un champ "Établissement" :
  - auto-sélectionné via `pickSalonFor(service|produit)`, modifiable par l'utilisateur.
  - le submit utilise `waLinkFor(salonId, message)`.
- Iframe Google Maps : remplacé par 3 onglets glass (un par établissement) qui changent l'iframe affichée.

## 4. Redirection commandes par salon

- `services.tsx` : bouton "Réserver via WhatsApp" → `waLinkFor("parfait", …)` (services par défaut, Parfait Design ; option visible "Desmo Hair" via petit sélecteur glass au-dessus du bouton).
- `catalog.$category.tsx` : bouton "Commander" route via `pickSalonFor(category)` — `produits`/`equipement` → Beauté Essentielle (+226 71 11 57 84), tout le reste → Parfait Design. Le message WhatsApp inclut le code (CF/PB/…) et le prix.

## 5. Accueil — effet doré sur "Réserver" & "Catalogue" — `src/routes/index.tsx`

- Réduire la taille et l'opacité du bouton **Réserver** (passer en `size="md"` + `opacity-90`, padding plus serré) tout en gardant la prééminence visuelle via l'effet de texte.
- Texte des deux CTA enveloppé dans un span `.gold-shimmer` :
  - dégradé doré liquid-glass : `background: linear-gradient(110deg, #f5d77a 0%, #fff8e1 35%, #c9962b 50%, #fff8e1 65%, #f5d77a 100%)`
  - `background-size: 250% 100%`, `-webkit-background-clip: text; color: transparent`
  - animation `@keyframes goldShimmer { to { background-position: -250% 0; } }` sur 3.5s, infinite, linear.
  - subtile lueur dorée derrière le texte via `text-shadow: 0 0 12px oklch(0.85 0.1 85 / 0.35)`.
- Respect `prefers-reduced-motion` (animation désactivée).

## 6. Liquid glass étendu — `src/styles.css` + composants

- Renforcer la classe `.liquid-glass` existante (s'assurer du `backdrop-filter: blur(22px) saturate(180%)`, bordure intérieure blanche, reflet haut subtil).
- Tous les `IconBadge` reçoivent le traitement liquid glass (déjà partiellement) : harmoniser pour que **toutes les icônes du site** (header, nav inférieure, sociaux, contact, services, catalog) soient sur fond glass blanc translucide avec teinte colorée selon le contexte.
- Boutons restants encore en aplat → conversion en `GlassButton` (audit rapide de `index.tsx`, `gallery.tsx`, `catalog.tsx`, `splash.tsx`).
- Ajouter transitions globales fluides : `transition: transform .2s cubic-bezier(.2,.7,.2,1), box-shadow .2s` sur `.liquid-glass`, micro hover `translateY(-1px)`.

## 7. Animations & fluidité

- Vérifier `defaultPreload: "intent"` (déjà fait) et ajouter `defaultPreloadDelay: 50` pour réactivité.
- Mémoïser les transformations lourdes dans `index.tsx` (index de recherche déjà mémo — étendre à la nouvelle taille de catalogue).
- Ajouter `content-visibility: auto` sur les grilles longues (gallery, catalog) pour accélérer le scroll.
- Lazy-load systématique : `loading="lazy" decoding="async"` partout.

## 8. Fichiers touchés

- **Modifiés** : `src/lib/salon-data.ts`, `src/routes/contact.tsx`, `src/routes/services.tsx`, `src/routes/catalog.$category.tsx`, `src/routes/index.tsx`, `src/styles.css`, `src/components/AppShell.tsx` (mineur — header peut afficher logo actif), `src/router.tsx`.
- **Créés** : `src/assets/logo-parfait.asset.json`, `src/assets/logo-desmohair.asset.json`, `src/assets/logo-beaute.asset.json`.
- **Aucune nouvelle dépendance.** Aucun changement de routes ni backend.

## Notes

- Les données mèche, mariage, produits, équipement et promotion gardent leurs placeholders actuels — j'attends tes prochains envois pour les remplacer.
- L'effet doré shimmer respecte `prefers-reduced-motion` et n'affecte pas le contraste (le doré reste lisible sur fond glass).
