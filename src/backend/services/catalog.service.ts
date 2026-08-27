import { supabase, TABLES, withRetry } from '../client';
import { ApiException } from '../exceptions';
import type { CatalogItem } from '../models';
import { notificationService } from './notification.service';
import { normalizeGalleryImages } from '@/lib/normalize';

function normalizeCatalogItems(items: CatalogItem[]): CatalogItem[] {
  return items.map((item) => ({
    ...item,
    gallery_images: normalizeGalleryImages(item.gallery_images),
  }));
}

export class CatalogService {
  async getAll(): Promise<CatalogItem[]> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.CATALOG)
          .select('id, code, title, description, price, original_price, image_url, gallery_images, category, is_available, sort_order, salon_name, created_at, updated_at')
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return normalizeCatalogItems(data as CatalogItem[]);
      });
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getAvailable(): Promise<CatalogItem[]> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.CATALOG)
          .select('id, code, title, description, price, original_price, image_url, gallery_images, category, is_available, sort_order, salon_name, created_at, updated_at')
          .eq("is_available", true)
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return normalizeCatalogItems(data as CatalogItem[]);
      });
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getByCategory(category: string): Promise<CatalogItem[]> {
    try {
      const normalizedCategory = category.trim().toLowerCase();
      const categoryMap: Record<string, string> = {
        coiffure: "Coiffure",
        meches: "Mèches",
        mèches: "Mèches",
        equipement: "Équipement",
        équipement: "Équipement",
        produits: "Produits",
        produit: "Produits",
        autre: "Autre",
        autres: "Autre",
        perruques: "Perruques",
        perruque: "Perruques",
        mariage: "Mariage",
        promo: "Promo",
        promotion: "Promo",
      };
      const queryValue = categoryMap[normalizedCategory] ?? category.trim();
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.CATALOG)
          .select('id, code, title, description, price, original_price, image_url, gallery_images, category, is_available, sort_order, salon_name, created_at, updated_at')
          .ilike("category", queryValue)
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return normalizeCatalogItems(data as CatalogItem[]);
      });
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async create(item: Omit<CatalogItem, "id" | "created_at" | "updated_at">): Promise<CatalogItem> {
    try {
      const { data, error } = await supabase.from(TABLES.CATALOG).insert(item).select().single();
      if (error) throw error;
      void notificationService.createForItem('catalog', item.title, 'created');
      return data as CatalogItem;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async update(id: string, updates: Partial<CatalogItem>): Promise<CatalogItem> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATALOG)
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      void notificationService.createForItem('catalog', data.title, 'updated');
      return data as CatalogItem;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getAllCodes(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATALOG)
        .select('code')
        .not('code', 'is', null)
        .neq('code', '');
      if (error) throw error;
      const codes = [...new Set((data ?? []).map((row) => row.code).filter((code): code is string => typeof code === 'string' && code.trim().length > 0))];
      return codes.sort();
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { data } = await supabase.from(TABLES.CATALOG).select('title').eq('id', id).single();
      const { error } = await supabase.from(TABLES.CATALOG).delete().eq("id", id);
      if (error) throw error;
      if (data) {
        void notificationService.createForItem('catalog', data.title, 'deleted');
      }
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }
}

export const catalogService = new CatalogService();
