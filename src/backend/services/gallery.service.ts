import { supabase, TABLES } from '../client';
import { ApiException } from '../exceptions';
import type { GalleryItem } from '../models';

export class GalleryService {
  async getAll(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as GalleryItem[];
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getFeatured(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .select('*')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as GalleryItem[];
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getByCategory(category: string): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .select('*')
        .eq('category', category)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as GalleryItem[];
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async create(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data as GalleryItem;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async update(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as GalleryItem;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(TABLES.GALLERY).delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }
}

export const galleryService = new GalleryService();
