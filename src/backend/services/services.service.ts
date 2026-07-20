import { supabase, TABLES } from '../client';
import { ApiException } from '../exceptions';
import type { ServiceItem } from '../models';

export class ServicesService {
  async getAll(): Promise<ServiceItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .select('*')
        .order('title', { ascending: true });
      if (error) throw error;
      return data as ServiceItem[];
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getActive(): Promise<ServiceItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .select('*')
        .eq('active', true)
        .order('title', { ascending: true });
      if (error) throw error;
      return data as ServiceItem[];
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async create(item: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceItem> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data as ServiceItem;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async update(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ServiceItem;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(TABLES.SERVICES).delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }
}

export const servicesService = new ServicesService();
