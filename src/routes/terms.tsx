import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation — Parfait.design" },
      { name: "description", content: "Conditions d'utilisation de l'application Parfait.design." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="px-4 pb-32">
      <div className="mt-4 rounded-[28px] border border-stone-200 bg-white p-6 shadow-lg">
        <h1 className="font-display text-2xl font-semibold">Conditions d'utilisation</h1>
        <p className="mt-1 text-xs text-muted-foreground">Dernière mise à jour : Août 2026</p>

        <div className="mt-6 space-y-4 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold">1. Acceptation des conditions</h2>
            <p className="mt-2 text-muted-foreground">
              En utilisant l'application Parfait.design, vous acceptez les présentes conditions d'utilisation.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">2. Description du service</h2>
            <p className="mt-2 text-muted-foreground">
              Parfait.design est une application de réservation et de commande pour un salon de beauté.
              Nous proposons des services de coiffure, perruques, mèches, mariage, produits et équipements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">3. Comptes utilisateurs</h2>
            <p className="mt-2 text-muted-foreground">
              Vous êtes responsable de maintenir la confidentialité de votre compte et de votre mot de passe.
              Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">4. Commandes et paiements</h2>
            <p className="mt-2 text-muted-foreground">
              Les commandes passées via l'application sont confirmées par WhatsApp.
              Les prix sont indiqués en FCFA et peuvent être sujets à modification sans préavis.
              Le paiement s'effectue directement auprès du salon.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">5. Annulations</h2>
            <p className="mt-2 text-muted-foreground">
              Les annulations doivent être effectuées au moins 24 heures avant le rendez-vous.
              Toute annulation tardive peut entraîner des frais.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">6. Limitation de responsabilité</h2>
            <p className="mt-2 text-muted-foreground">
              Parfait.design ne peut être tenu responsable des dommages indirects résultant de l'utilisation
              de l'application ou de l'impossibilité d'y accéder.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">7. Modifications des conditions</h2>
            <p className="mt-2 text-muted-foreground">
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les modifications entrent en vigueur dès leur publication dans l'application.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">8. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              Pour toute question concernant ces conditions, veuillez nous contacter via la section Contact.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
