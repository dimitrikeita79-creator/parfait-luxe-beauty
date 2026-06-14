# Exporter Parfait.Design/Desmohair en application Android

Cette application web est prête à être empaquetée en APK / AAB Android via **Capacitor**.

## Prérequis (sur votre machine)

- Node.js 20+ et `bun` (ou `npm`)
- **Android Studio** (avec SDK Android 34)
- JDK 17

## 1. Récupérer le code

Depuis Lovable : bouton **GitHub** en haut à droite → *Connect to GitHub* → clonez ensuite le dépôt localement :

```bash
git clone <votre-repo>
cd <votre-repo>
bun install
```

## 2. Installer Capacitor

```bash
bun add @capacitor/core @capacitor/cli @capacitor/android
```

## 3. Construire le bundle web

```bash
bun run build
```

## 4. Ajouter la plateforme Android

```bash
npx cap add android
npx cap sync android
```

## 5. Ouvrir dans Android Studio

```bash
npx cap open android
```

Dans Android Studio :

- **Build > Build Bundle(s) / APK(s) > Build APK(s)** → APK de test (debug)
- **Build > Generate Signed Bundle / APK** → AAB signé pour Google Play

## 6. Icônes & splash

Le logo fourni est utilisé comme favicon/PWA. Pour les icônes adaptatives Android, lancez :

```bash
npx @capacitor/assets generate --android
```

(Placez `logo.png` 1024×1024 à la racine `resources/icon.png`.)

## 7. Identité de l'app

- **App ID** : `bf.parfaitdesign.desmohair`
- **App name** : `Parfait.Design/Desmohair`
- Voir `capacitor.config.ts`

## Notes

- L'application reste 100% web (TanStack Start + Vite) ; Capacitor n'est qu'un conteneur natif.
- WhatsApp s'ouvre via lien universel `wa.me` — fonctionne nativement sur Android.
- Pour publier sur Google Play : créer un compte développeur, signer en AAB, et soumettre.