import { supabase, TABLES, withRetry, isTableNotFoundError } from '../client';
import { ApiException } from '../exceptions';
import type { TeamMember } from '../models';

export class TeamService {
  async getAll(): Promise<TeamMember[]> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.TEAM)
          .select('id, full_name, role, description, photo_url, specialties, created_at, updated_at')
          .order('full_name', { ascending: true });
        if (error) {
          if (isTableNotFoundError(error)) return [];
          throw error;
        }
        return data as TeamMember[];
      });
    } catch (error) {
      if (isTableNotFoundError(error)) return [];
      throw ApiException.fromError(error);
    }
  }

  async create(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEAM)
        .insert(member)
        .select()
        .single();
      if (error) {
        if (isTableNotFoundError(error)) return { id: '', ...member } as TeamMember;
        throw error;
      }
      return data as TeamMember;
    } catch (error) {
      if (isTableNotFoundError(error)) return { id: '', ...member } as TeamMember;
      throw ApiException.fromError(error);
    }
  }

  async update(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEAM)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        if (isTableNotFoundError(error)) return { id, ...updates } as TeamMember;
        throw error;
      }
      return data as TeamMember;
    } catch (error) {
      if (isTableNotFoundError(error)) return { id, ...updates } as TeamMember;
      throw ApiException.fromError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(TABLES.TEAM).delete().eq('id', id);
      if (error) {
        if (isTableNotFoundError(error)) return;
        throw error;
      }
    } catch (error) {
      if (!isTableNotFoundError(error)) {
        throw ApiException.fromError(error);
      }
    }
  }
}

export const teamService = new TeamService();
