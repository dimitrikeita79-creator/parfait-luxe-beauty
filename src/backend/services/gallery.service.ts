import { supabase, TABLES, withRetry } from '../client';
import { ApiException } from '../exceptions';
import type { GalleryItem } from '../models';
import { notificationService } from './notification.service';

export class GalleryService {
  async getAll(): Promise<GalleryItem[]> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.GALLERY)
          .select('id, title, description, image_url, category, is_featured, sort_order, salon_name, created_at, updated_at')
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data as GalleryItem[];
      });
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getFeatured(): Promise<GalleryItem[]> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.GALLERY)
          .select('id, title, description, image_url, category, is_featured, sort_order, salon_name, created_at, updated_at')
          .eq('is_featured', true)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data as GalleryItem[];
      });
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getByCategory(category: string): Promise<GalleryItem[]> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.GALLERY)
          .select('id, title, description, image_url, category, is_featured, sort_order, salon_name, created_at, updated_at')
          .eq('category', category)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data as GalleryItem[];
      });
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
      void notificationService.createForItem('gallery', item.title, 'created');
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
      void notificationService.createForItem('gallery', data.title, 'updated');
      return data as GalleryItem;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { data } = await supabase.from(TABLES.GALLERY).select('title').eq('id', id).single();
      const { error } = await supabase.from(TABLES.GALLERY).delete().eq('id', id);
      if (error) throw error;
      if (data) {
        void notificationService.createForItem('gallery', data.title, 'deleted');
      }
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }
}

export const galleryService = new GalleryService();
