import { supabase, TABLES } from "../client";
import { ApiException } from "../exceptions";
import type { CatalogItem } from "../models";

export class CatalogService {
  async getAll(): Promise<CatalogItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATALOG)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CatalogItem[];
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getAvailable(): Promise<CatalogItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATALOG)
        .select("*")
        .eq("is_available", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CatalogItem[];
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getByCategory(category: string): Promise<CatalogItem[]> {
    try {
      const normalizedCategory = category.trim().toLowerCase();
      // Comprehensive category mapping — covers all aliases and casings
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
      const { data, error } = await supabase
        .from(TABLES.CATALOG)
        .select("*")
        .ilike("category", queryValue)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CatalogItem[];
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async create(item: Omit<CatalogItem, "id" | "created_at" | "updated_at">): Promise<CatalogItem> {
    try {
      const { data, error } = await supabase.from(TABLES.CATALOG).insert(item).select().single();
      if (error) throw error;
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
      return data as CatalogItem;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(TABLES.CATALOG).delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }
}

export const catalogService = new CatalogService();
