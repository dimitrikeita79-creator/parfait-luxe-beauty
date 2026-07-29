import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { GlassButton } from "@/components/GlassButton";
import type { CatalogItem, ServiceItem } from "@/backend/models";

interface NewItemsNotificationProps {
  catalogItems: CatalogItem[];
  serviceItems: ServiceItem[];
  onClose: () => void;
}

interface NewItem {
  id: string;
  title: string;
  type: "catalog" | "service";
  category: string;
  image?: string;
  date: string;
}

export function NewItemsNotification({
  catalogItems,
  serviceItems,
  onClose,
}: NewItemsNotificationProps) {
  const [newItems, setNewItems] = useState<NewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadNewItems = () => {
      try {
        // Get last visit date from localStorage
        if (typeof window !== "undefined" && window.localStorage) {
          const lastVisit = window.localStorage.getItem("last-visit-date");
          const lastVisitDate = lastVisit ? new Date(lastVisit) : new Date(0);
          
          // Check for new catalog items
          const newCatalogItems: NewItem[] = catalogItems
            .filter(item => {
              const itemDate = new Date(item.created_at || "");
              return itemDate > lastVisitDate;
            })
            .map(item => ({
              id: item.id,
              title: item.title,
              type: "catalog" as const,
              category: item.category,
              image: item.image_url || undefined,
              date: item.created_at || "",
            }));

          // Check for new service items
          const newServiceItems: NewItem[] = serviceItems
            .filter(item => {
              const itemDate = new Date(item.created_at || "");
              return itemDate > lastVisitDate;
            })
            .map(item => ({
              id: item.id,
              title: item.title,
              type: "service" as const,
              category: item.category,
              image: item.image_url || undefined,
              date: item.created_at || "",
            }));

          const allNewItems = [...newCatalogItems, ...newServiceItems]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          if (allNewItems.length > 0) {
            setNewItems(allNewItems);
            setIsVisible(true);
            
            // Update last visit date
            window.localStorage.setItem("last-visit-date", new Date().toISOString());
          }
        }
      } catch (error) {
        console.error("Error loading new items:", error);
      }
    };

    loadNewItems();
  }, [catalogItems, serviceItems, mounted]);

  const handleNext = () => {
    if (currentIndex < newItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible || newItems.length === 0) return null;

  const currentItem = newItems[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="rounded-3xl border border-[var(--gold-soft)]/40 bg-gradient-to-br from-[var(--gold-light)] via-white to-[var(--gold-soft)]/30 p-5 shadow-xl shadow-[var(--gold)]/10 backdrop-blur-xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[var(--gold)]/20 p-2">
                  <Sparkles className="h-4 w-4 text-[var(--gold-deep)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Nouveau !</p>
                  <p className="text-xs text-muted-foreground">
                    {currentIndex + 1} / {newItems.length}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1 hover:bg-stone-100 transition"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {currentItem.image && (
              <div className="mb-3 rounded-2xl overflow-hidden ring-1 ring-black/5">
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="aspect-video w-full object-cover"
                />
              </div>
            )}

            <div className="mb-3">
              <p className="text-xs font-medium text-[var(--gold-deep)] uppercase tracking-wider">
                {currentItem.category}
              </p>
              <p className="text-sm font-semibold text-foreground">{currentItem.title}</p>
            </div>

            <div className="flex gap-2">
              <GlassButton
                type="button"
                onClick={handleNext}
                variant="gold"
                size="sm"
                full
                className="flex items-center justify-center gap-2"
              >
                {currentIndex < newItems.length - 1 ? (
                  <>
                    Suivant <ArrowRight className="h-3 w-3" />
                  </>
                ) : (
                  "Fermer"
                )}
              </GlassButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}