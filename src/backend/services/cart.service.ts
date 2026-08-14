import { supabase, TABLES } from '../client';
import { ApiException } from '../exceptions';
import type { CartItem } from '../models';

export class CartService {
  async getAllForUser(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CART)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('[CartService] getAllForUser error:', error);
        throw new Error(`Erreur récupération panier: ${error.message}`);
      }
      return (data ?? []) as CartItem[];
    } catch (error) {
      console.error('[CartService] getAllForUser unexpected error:', error);
      throw error;
    }
  }

  async addItem(userId: string, item: Omit<CartItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<CartItem> {
    try {
      const payload: Record<string, unknown> = {
        ...item,
        user_id: userId,
        quantity: item.quantity ?? 1,
      };
      if (payload.price === null || payload.price === undefined) {
        payload.price = 0;
      }
      const { data, error } = await supabase
        .from(TABLES.CART)
        .insert(payload)
        .select()
        .single();
      if (error) {
        console.error('[CartService] addItem error:', error);
        throw new Error(`Erreur ajout panier: ${error.message}`);
      }
      return data as CartItem;
    } catch (error) {
      console.error('[CartService] addItem unexpected error:', error);
      throw error;
    }
  }

  async updateQuantity(id: string, quantity: number): Promise<CartItem> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CART)
        .update({ quantity })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('[CartService] updateQuantity error:', error);
        throw new Error(`Erreur mise à jour panier: ${error.message}`);
      }
      return data as CartItem;
    } catch (error) {
      console.error('[CartService] updateQuantity unexpected error:', error);
      throw error;
    }
  }

  async removeItem(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(TABLES.CART).delete().eq('id', id);
      if (error) {
        console.error('[CartService] removeItem error:', error);
        throw new Error(`Erreur suppression panier: ${error.message}`);
      }
    } catch (error) {
      console.error('[CartService] removeItem unexpected error:', error);
      throw error;
    }
  }

  async clearForUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase.from(TABLES.CART).delete().eq('user_id', userId);
      if (error) {
        console.error('[CartService] clearForUser error:', error);
        throw new Error(`Erreur vidage panier: ${error.message}`);
      }
    } catch (error) {
      console.error('[CartService] clearForUser unexpected error:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();
