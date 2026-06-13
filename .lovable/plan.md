
## Objectif
Restructurer les services et le catalogue de Parfait Design Des Mohair, intégrer le logo officiel, et améliorer la qualité visuelle des cadres (sans icônes/emojis superposés sur les photos).

## 1. Logo officiel
- Uploader `Parfait design.jpg` via `lovable-assets` → `src/assets/logo.jpg.asset.json`.
- Afficher le logo dans :
  - Le header de `AppShell` (remplace l'initiale/texte actuel).
  - L'écran `splash.tsx` (logo animé central).
  - Le footer/section "À propos".

## 2. Services (mise à jour `src/lib/salon-data.ts`)
Remplacer les 8 services actuels par les 6 officiels :
1. **Pose Perruque** — Lace frontale, glueless, HD lace
2. **Coiffure & Tresses** — Box braids, locks, twists
3. **Coiffure Mariage** — Mariée, demoiselles, essais à domicile
4. **Tissage Premium** — Brésilien, péruvien, body/deep wave
5. **Perruques & Mèches** — 100% naturel, lace HD, 18″–30″
6. **Produits & Équipements** — Soins, fers, miroirs, chaises pro

Chacun garde prix indicatif, durée, et tonalité dorée.

## 3. Catalogue par catégories (nouvelle page `/catalog`)
Refonte du catalogue avec 7 cases (cards) — chacune affiche image visuelle + nom + compteur :

| Catégorie | Compteur |
|---|---|
| Coiffure | 23 Créations |
| Perruques | 43 Créations |
| Mèche | Bientôt disponible |
| Mariage | 18 Créations |
| Produits | 23 Produits |
| Équipement | 21 Équipements |
| Promotion | 11 Promo |

- Chaque case ouvre une vue détaillée (route `/catalog/$category`) listant les éléments.
- La case **Mèche** est désactivée (badge "Bientôt disponible", non cliquable).
- Mettre à jour la bottom-nav : remplacer "Products" par "Catalogue".

## 4. Section "Offres du mois" (accueil)
Le CTA de la promo sur `index.tsx` redirige désormais vers `/catalog/promotion` au lieu de WhatsApp direct.

## 5. Amélioration visuelle des cadres
- **Retirer tous les emojis** superposés/centrés dans les cadres photo (services, produits, galerie, accueil).
- Remplacer par de vrais visuels :
  - Utiliser des dégradés sophistiqués multi-stops (ambre/or/rosé) + grain doux + reflets brillants (`bg-gradient-to-br` + overlay `bg-[radial-gradient(...)]`).
  - Ajouter un cadre doré fin (`ring-1 ring-[var(--gold)]/30`), coins plus arrondis (`rounded-[28px]`), ombres `shadow-luxe` renforcées.
  - Ratio uniformisé (4/5 pour produits, 1/1 pour galerie, 16/10 pour services).
  - Léger effet glass au survol + bordure dorée animée.
- Le nom/catégorie reste en overlay bas (sans emoji).
- Préparer la structure pour de vraies images (champ `image?` dans `Product`/`Service`/`Gallery`) — fallback sur dégradé pur si absent.

## 6. Fichiers impactés
- `src/lib/salon-data.ts` — services, catégories catalogue, compteurs, types enrichis
- `src/components/AppShell.tsx` — logo en header, nav "Catalogue"
- `src/routes/splash.tsx` — logo centré animé
- `src/routes/index.tsx` — CTA promo → /catalog/promotion, cadres sans emoji
- `src/routes/services.tsx` — cadres premium sans emoji
- `src/routes/products.tsx` — supprimé OU redirige vers /catalog
- **Nouveau** `src/routes/catalog.tsx` — grille 7 catégories
- **Nouveau** `src/routes/catalog.$category.tsx` — détail par catégorie
- `src/routes/gallery.tsx` — cadres sans emoji
- `src/assets/logo.jpg.asset.json` — pointeur CDN du logo

## Notes
- Les compteurs sont affichés tels quels (pas de génération de 43 vraies fiches perruques) — les listes de détail reprendront les éléments existants enrichis pour atteindre une présentation crédible.
- Aucune logique métier/backend modifiée (WhatsApp reste le canal de commande).
