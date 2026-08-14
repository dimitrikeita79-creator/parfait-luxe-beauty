import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { SALONS, waLinkFor, type SalonId } from "@/lib/salon-data";
import { GlassButton } from "@/components/GlassButton";

interface WhatsAppSalonModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemImage?: string;
  itemPrice?: string;
  itemLink?: string;
  itemCategory?: string;
  message?: string;
  userName?: string;
  initialSalonId?: SalonId;
}

export function WhatsAppSalonModal({
  isOpen,
  onClose,
  itemName,
  itemImage,
  itemPrice,
  itemLink,
  itemCategory,
  userName,
  message = "",
  initialSalonId,
}: WhatsAppSalonModalProps) {
  const [selectedSalon, setSelectedSalon] = useState<SalonId>(initialSalonId ?? "parfait");
  
  // Determine if salon selection should be shown based on category
  // Hide salon selection for équipement and produits (Beauté Essentielle)
  // Also hide for coiffure, mèches, promo (use Parfait Design)
  const showSalonSelection = itemCategory ? 
    !(itemCategory.toLowerCase().includes("équipement") || 
      itemCategory.toLowerCase().includes("produit") ||
      itemCategory.toLowerCase().includes("coiffure") ||
      itemCategory.toLowerCase().includes("mèche") ||
      itemCategory.toLowerCase().includes("promo")) : 
    true;

  const handleWhatsAppClick = () => {
    const salon = SALONS.find(s => s.id === selectedSalon);
    if (!salon) return;

    let enhancedMessage = message || `Bonjour ${salon.name}, je souhaite commander : ${itemName}`;
    
    if (userName) {
      enhancedMessage = `Bonjour ${salon.name}, je suis ${userName} et je souhaite commander : ${itemName}`;
    }
    
    if (itemPrice) {
      enhancedMessage += ` — ${itemPrice}`;
    }
    
    if (itemLink) {
      enhancedMessage += `\n\n🔗 Voir l'article : ${itemLink}`;
    } else if (itemImage) {
      enhancedMessage += `\n\n📷 Image: ${itemImage}`;
    }

    const link = waLinkFor(selectedSalon, enhancedMessage);
    window.open(link, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Choisir l'établissement
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-stone-100 transition"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {itemImage && (
                <div className="mb-4 rounded-2xl overflow-hidden ring-1 ring-black/5">
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="aspect-video w-full object-cover"
                  />
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-4">
                Vous allez commander : <span className="font-semibold text-foreground">{itemName}</span>
                {itemPrice && <span className="font-semibold text-foreground"> — {itemPrice}</span>}
              </p>

              {showSalonSelection && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sélectionnez un salon
                  </p>
                  {SALONS.map((salon) => (
                    <button
                      key={salon.id}
                      type="button"
                      onClick={() => setSelectedSalon(salon.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-stone-50 ${
                        selectedSalon === salon.id ? "bg-blue-50 border-2 border-blue-200" : "border-2 border-transparent"
                      }`}
                    >
                      <img src={salon.logo} alt={salon.name} className="h-10 w-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{salon.name}</p>
                        <p className="text-xs text-muted-foreground">{salon.area}</p>
                      </div>
                      {selectedSalon === salon.id && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <GlassButton
                type="button"
                onClick={handleWhatsAppClick}
                variant="whatsapp"
                size="md"
                full
                className="flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Continuer sur WhatsApp
              </GlassButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}