## Objectif

Refondre Parfait.Design/Desmohair en thème **blanc profond + liquid glass + touches de doré discrètes**, supprimer le mode sombre, intégrer le WhatsApp officiel dans la barre de navigation, ajouter un carrousel d'accueil, nettoyer les bugs et préparer l'export Android.

---

## 1. Identité & nommage

- Renommer partout « Parfait Design Des Mohair » → **« Parfait.Design/Desmohair »** (header, splash, footer, contact, meta SEO, `__root.tsx`).
- Le logo officiel reste affiché (déjà uploadé).

## 2. Thème : blanc profond + liquid glass + doré réduit

- `src/styles.css` : 
  - Fond `--background` → blanc pur (oklch 1 0 0) avec subtil dégradé ivoire.
  - Réduire la saturation/présence du doré : `--gold` plus pâle, utilisé uniquement en accents fins (filets, texte de titre, badges), plus en aplats.
  - Renforcer le **liquid glass** : `glass` et `glass-strong` avec `backdrop-filter: blur(40px) saturate(180%)`, bordure blanche translucide, reflets internes.
  - Nouveau utilitaire `.liquid-glass` (multi-couches : blanc translucide + highlight radial + bordure intérieure blanche).
- **Supprimer le mode sombre** : retirer `.dark { … }`, retirer `ThemeProvider`, retirer le bouton lune/soleil, supprimer `src/lib/theme.tsx`. Forcer light côté `<html>`.

## 3. WhatsApp officiel dans la barre de navigation

- Retirer le FAB flottant WhatsApp.
- Ajouter une **6e entrée WhatsApp** dans la bottom-nav (`AppShell.tsx`) avec l'**icône SVG officielle WhatsApp** (téléphone + bulle) et **fond vert officiel `#25D366`** (cercle saillant au-dessus de la barre).
- Ouvre `waLink()` en target=_blank.

## 4. Cadres & icônes en liquid glass (plus de doré)

- `Frame.tsx` : remplacer le ring doré + dégradé ambré par **glass blanc + accent noir subtil** (ring `ring-black/10`, fond `bg-white/40 backdrop-blur-xl`, highlight blanc en haut-gauche, ombre douce).
- Toutes les icônes (services, catégories, contact) : enveloppe `liquid-glass` blanche avec icône Lucide en **noir**, plus de pastilles dorées.
- Améliorer les cadres du **catalogue** (`catalog.tsx`) : ratio 4/5, glass blanc, voile sombre bas pour lisibilité du titre, badge "Bientôt" en noir/blanc, accent doré fin uniquement sur le compteur.

## 5. Accueil : carrousel de couvertures

- Dans `index.tsx`, ajouter en haut une **section carrousel** (10 cadres) au-dessus de la grille de services :
  - Carrousel horizontal snap (`overflow-x-auto snap-x snap-mandatory`), auto-play léger (interval 4s, pause au touch).
  - Chaque slide = `Frame` glass blanc 16/10 avec titre + sous-titre (ex: « Mariage », « Pose Perruque », « Tissage Premium »…).
  - Indicateurs (dots) discrets en bas.
  - Aucune image binaire ajoutée : on utilise des dégradés liquid glass + libellés (préparé pour brancher de vraies images plus tard via `image` prop de `Frame`).

## 6. Retirer la section « À propos »

- Supprimer `src/routes/about.tsx`.
- Retirer tout lien `/about` (footer accueil, etc.).
- Laisser la route-tree régénérer.

## 7. Fluidité & bugs

- Nettoyer imports inutilisés (`Moon`, `Sun`, `MessageCircle` du shell après retrait FAB/theme).
- S'assurer que `routeTree.gen.ts` se régénère après suppression `about.tsx` (restart dev).
- Vérifier toutes les `<Link>` (params typés) et retirer les `<a href>` internes.
- Animations : transitions plus courtes (200ms), `will-change` sur éléments animés, `prefers-reduced-motion` respecté.
- Vérifier qu'aucun composant ne référence `useTheme` après suppression.

## 8. Export Android (PWA → APK/AAB via Capacitor)

Préparer la structure pour exporter en application Android :

- Créer `public/manifest.webmanifest` (nom « Parfait.Design/Desmohair », icônes, theme_color blanc, background blanc, display standalone, start_url `/`).
- Référencer manifest + icônes dans `__root.tsx` (`<link rel="manifest">`, apple-touch-icon, theme-color blanc).
- Créer `capacitor.config.ts` (appId `bf.parfaitdesign.desmohair`, appName, webDir `dist`).
- Créer `android/README.md` avec les commandes d'export :
  ```
  bun run build
  npx cap add android
  npx cap sync android
  npx cap open android   # build APK / AAB depuis Android Studio
  ```
- Ajouter `EXPORT_ANDROID.md` à la racine expliquant la procédure pas-à-pas pour l'utilisateur (prérequis Android Studio, signature, génération AAB Play Store).
- Ne **pas** installer Capacitor dans cette itération (lourd, fait par l'utilisateur en local) — fournir uniquement la config et la doc.

---

## Fichiers touchés

**Modifiés** : `src/styles.css`, `src/components/AppShell.tsx`, `src/components/Frame.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/splash.tsx`, `src/routes/services.tsx`, `src/routes/gallery.tsx`, `src/routes/contact.tsx`, `src/routes/catalog.tsx`, `src/routes/catalog.$category.tsx`, `src/lib/salon-data.ts` (nom marque).

**Créés** : `src/components/CoverCarousel.tsx`, `public/manifest.webmanifest`, `capacitor.config.ts`, `EXPORT_ANDROID.md`, `android/README.md`.

**Supprimés** : `src/routes/about.tsx`, `src/lib/theme.tsx`.

## Hors scope

- Pas de génération d'images réelles (gardé pour quand vous fournirez vos photos).
- Pas d'installation Capacitor (commandes fournies pour exécution locale).
- Pas de changement backend (WhatsApp reste le canal de commande).