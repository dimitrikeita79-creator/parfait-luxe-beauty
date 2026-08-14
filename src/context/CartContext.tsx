import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cartService } from "@/backend/services";
import { localNotificationService } from "@/backend/services/local-notification.service";
import type { CartItem } from "@/backend/models";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  refresh: () => Promise<void>;
  addItem: (item: Omit<CartItem, "id" | "user_id" | "created_at" | "updated_at">) => Promise<CartItem>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  clearCart: () => Promise<void>;
  error: string | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ userId, children }: { userId: string | undefined; children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const totalItems = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0);

  const refresh = useCallback(async () => {
    if (!userId) {
      setItems([]);
      return;
    }
    try {
      const data = await cartService.getAllForUser(userId);
      setItems(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de connexion au panier";
      console.error("[CartContext] refresh error:", message);
      setError(message);
      setItems([]);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = async (item: Omit<CartItem, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!userId) {
      const msg = "Connexion requise pour ajouter au panier";
      setError(msg);
      return Promise.reject(new Error(msg));
    }
    try {
      setError(null);
      const created = await cartService.addItem(userId, item);
      const currentTotal = items.reduce((sum, i) => sum + (i.quantity ?? 1), 0);
      const newTotal = currentTotal + (created.quantity ?? 1);
      await refresh();
      await localNotificationService.cartAdded(item.title, created.quantity ?? 1, newTotal);
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible d'ajouter l'article";
      console.error("[CartContext] addItem error:", message);
      setError(message);
      throw err;
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!userId) return;
    try {
      setError(null);
      const updated = await cartService.updateQuantity(id, quantity);
      setItems((prev) => {
        const next = prev.map((item) => (item.id === id ? updated : item));
        const total = next.reduce((sum, i) => sum + (i.quantity ?? 1), 0);
        void localNotificationService.cartUpdated(total);
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de mettre à jour";
      console.error("[CartContext] updateQuantity error:", message);
      setError(message);
      await refresh();
    }
  };

  const removeItem = async (id: string) => {
    if (!userId) return;
    try {
      setError(null);
      const target = items.find((i) => i.id === id);
      await cartService.removeItem(id);
      setItems((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (target) {
          void localNotificationService.itemRemoved(target.title);
        }
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de supprimer";
      console.error("[CartContext] removeItem error:", message);
      setError(message);
      await refresh();
    }
  };

  const clear = async () => {
    if (!userId) return;
    try {
      setError(null);
      await cartService.clearForUser(userId);
      setItems([]);
      await localNotificationService.cartCleared();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de vider le panier";
      console.error("[CartContext] clear error:", message);
      setError(message);
      await refresh();
    }
  };

  const clearCart = clear;

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, refresh, addItem, updateQuantity, removeItem, clear, clearCart, error }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
