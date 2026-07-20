import { supabase, TABLES } from '../client';
import { ApiException } from '../exceptions';
import type { TeamMember } from '../models';

export class TeamService {
  async getAll(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEAM)
        .select('*')
        .order('full_name', { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    } catch (error) {
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
      if (error) throw error;
      return data as TeamMember;
    } catch (error) {
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
      if (error) throw error;
      return data as TeamMember;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(TABLES.TEAM).delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }
}

export const teamService = new TeamService();
