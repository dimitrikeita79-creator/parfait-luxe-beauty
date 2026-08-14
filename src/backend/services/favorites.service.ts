import { supabase, TABLES } from '../client';
import { ApiException } from '../exceptions';
import type { FavoriteItem, FavoriteKind } from '../models';

export class FavoritesService {
  async getUserFavorites(): Promise<FavoriteItem[]> {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from(TABLES.FAVORITES)
        .select('item_id, item_type, item_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;

      return (data as Array<{ item_id: string; item_type: FavoriteKind; item_data: Record<string, unknown> }>)
        .map((favorite) => ({
          id: favorite.item_id,
          kind: favorite.item_type,
          title: String(favorite.item_data.title ?? ''),
          description: (favorite.item_data.description as string | null) ?? null,
          price:
            favorite.item_data.price === null || favorite.item_data.price === undefined
              ? null
              : Number(favorite.item_data.price),
          imageUrl: (favorite.item_data.imageUrl as string | null) ?? null,
          category: (favorite.item_data.category as string | null) ?? null,
        }));
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async addFavorite(favorite: FavoriteItem): Promise<void> {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user?.id) {
        throw new ApiException('Utilisateur non connecté');
      }

      const payload = {
        user_id: user.id,
        item_id: favorite.id,
        item_type: favorite.kind,
        item_data: {
          title: favorite.title,
          description: favorite.description,
          price: favorite.price,
          imageUrl: favorite.imageUrl,
          category: favorite.category,
        },
      };

      const { error } = await supabase.from(TABLES.FAVORITES).upsert(payload, {
        onConflict: '(user_id, item_id, item_type)',
      });
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async removeFavorite(kind: FavoriteKind, itemId: string): Promise<void> {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user?.id) {
        throw new ApiException('Utilisateur non connecté');
      }

      const { error } = await supabase
        .from(TABLES.FAVORITES)
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', kind);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }
}

export const favoritesService = new FavoritesService();
