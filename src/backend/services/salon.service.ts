import { supabase, TABLES, withRetry } from '../client';
import { ApiException } from '../exceptions';
import type { SalonInfo } from '../models';

export class SalonService {
  async getInfo(): Promise<SalonInfo> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.SALON_INFO)
          .select('id, logo_url, banner_url, salon_name, slogan, about_text, address, phone_number, email, instagram_url, facebook_url, tiktok_url, whatsapp_url, opening_hours, updated_at')
          .limit(1)
          .maybeSingle();
        if (error) throw error;

        if (!data) {
          return await this._createDefault();
        }
        return data as SalonInfo;
      });
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async updateInfo(updates: Partial<SalonInfo>): Promise<SalonInfo> {
    try {
      const existing = await supabase
        .from(TABLES.SALON_INFO)
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing.error) throw existing.error;

      let result;
      if (!existing.data) {
        const { data, error } = await supabase
          .from(TABLES.SALON_INFO)
          .insert(updates)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from(TABLES.SALON_INFO)
          .update(updates)
          .eq('id', existing.data.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      }
      return result as SalonInfo;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  private async _createDefault(): Promise<SalonInfo> {
    const defaultData = {
      salon_name: 'Parfait Design',
      slogan: 'Votre beauté, notre passion',
      about_text: 'Bienvenue chez Parfait Design',
    };
    const { data, error } = await supabase
      .from(TABLES.SALON_INFO)
      .insert(defaultData)
      .select()
      .single();
    if (error) throw error;
    return data as SalonInfo;
  }
}

export const salonService = new SalonService();
