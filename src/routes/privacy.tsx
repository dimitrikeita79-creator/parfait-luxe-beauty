import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Parfait.design" },
      { name: "description", content: "Politique de confidentialité de l'application Parfait.design." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="px-4 pb-32">
      <div className="mt-4 rounded-[28px] border border-stone-200 bg-white p-6 shadow-lg">
        <h1 className="font-display text-2xl font-semibold">Politique de confidentialité</h1>
        <p className="mt-1 text-xs text-muted-foreground">Dernière mise à jour : Août 2026</p>

        <div className="mt-6 space-y-4 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold">1. Collecte des données</h2>
            <p className="mt-2 text-muted-foreground">
              L'application Parfait.design collecte uniquement les données nécessaires au fonctionnement du service :
              informations de profil (nom, email), préférences (thème), données de panier et favoris.
              Aucune donnée sensible (santé, localisation précise, contacts) n'est collectée sans consentement explicite.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">2. Utilisation des données</h2>
            <p className="mt-2 text-muted-foreground">
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
              <li>Gérer votre compte et vos préférences</li>
              <li>Traiter vos commandes et réservations</li>
              <li>Vous envoyer des notifications liées à vos activités</li>
              <li>Améliorer l'expérience utilisateur</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">3. Partage des données</h2>
            <p className="mt-2 text-muted-foreground">
              Nous ne vendons, n'échangeons ni ne transférons vos données personnelles à des tiers.
              Les données sont hébergées de manière sécurisée via Supabase.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">4. Sécurité</h2>
            <p className="mt-2 text-muted-foreground">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données
              contre tout accès, modification ou divulgation non autorisés.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">5. Vos droits</h2>
            <p className="mt-2 text-muted-foreground">
              Vous avez le droit d'accéder, de corriger ou de supprimer vos données personnelles.
              Pour exercer ces droits, contactez-nous via la section Contact de l'application.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">6. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              Pour toute question concernant cette politique, veuillez nous contacter à l'adresse
              indiquée dans la section Contact de l'application.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
