import { supabase, TABLES } from "../client";
import { ApiException } from "../exceptions";
import type { AppUser } from "../models";

const ADMIN_EMAIL = "essadjikeita794@gmail.com";
const isAdminEmail = (email?: string | null) =>
  email?.trim().toLowerCase() === ADMIN_EMAIL;

export class AuthService {
  async signIn(email: string, password: string): Promise<AppUser> {
    if (!email || !password) {
      throw new ApiException("Veuillez saisir votre email et mot de passe");
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user) throw new ApiException("Connexion échouée");

      const profile = await this.getUserProfile(data.user.id);
      const role = (
        isAdminEmail(data.user.email)
          ? "admin"
          : data.user.user_metadata?.role ??
            data.user.app_metadata?.role ??
            profile.role ??
            "user"
      ) as AppUser["role"];

      try {
        await supabase.from(TABLES.PROFILES).upsert(
          {
            id: data.user.id,
            email: data.user.email ?? email,
            full_name:
              data.user.user_metadata?.full_name ??
              profile.full_name ??
              email.split("@")[0],
            role,
          },
          { onConflict: "id" },
        );
      } catch (syncError) {
        console.warn("Impossible de synchroniser le profil admin:", syncError);
      }

      return {
        ...profile,
        role,
        email: profile.email || data.user.email || email,
        full_name:
          profile.full_name ?? data.user.user_metadata?.full_name ?? null,
      };
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async signUp(
    email: string,
    password: string,
    fullName?: string,
    isAdmin = false,
  ): Promise<AppUser> {
    if (!email || !password) {
      throw new ApiException("Veuillez saisir votre email et mot de passe");
    }
    if (password.length < 6) {
      throw new ApiException(
        "Le mot de passe doit contenir au moins 6 caractères",
      );
    }
    const resolvedIsAdmin = isAdmin || isAdminEmail(email);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName ?? email.split("@")[0],
            role: resolvedIsAdmin ? "admin" : "user",
          },
        },
      });
      if (error) {
        console.error("🔴 Auth signUp error:", error);
        throw error;
      }
      if (!data.user) throw new ApiException("Inscription échouée");

      const profilePayload = {
        id: data.user.id,
        full_name:
          fullName ?? data.user.user_metadata?.full_name ?? email.split("@")[0],
        role: resolvedIsAdmin ? "admin" : "user",
      };

      try {
        await supabase
          .from(TABLES.PROFILES)
          .upsert(profilePayload, { onConflict: "id" });
      } catch {
        // Ignorer les erreurs de profil - ce n'est pas critique
        console.warn(
          "Impossible de sauvegarder le profil, mais l'inscription a réussi",
        );
      }

      // Retourner le profil (fallback si la table n'existe pas)
      try {
        return await this.getUserProfile(data.user.id);
      } catch {
        return {
          id: data.user.id,
          email: data.user.email || email,
          full_name:
            fullName ?? data.user.user_metadata?.full_name ?? email.split("@")[0],
          role: resolvedIsAdmin ? "admin" : "user",
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as AppUser; // ← ajout du cast explicite
      }
    } catch (error) {
      console.error("🔴 signUp final error:", error);
      throw ApiException.fromError(error);
    }
  }

  async updateProfile(updates: Partial<AppUser>): Promise<AppUser> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        throw new ApiException("Utilisateur non connecté");
      }

      const payload = {
        id: userId,
        ...(updates.full_name !== undefined
          ? { full_name: updates.full_name }
          : {}),
        ...(updates.email !== undefined ? { email: updates.email } : {}),
        ...(updates.avatar_url !== undefined
          ? { avatar_url: updates.avatar_url }
          : {}),
        ...(updates.role !== undefined ? { role: updates.role } : {}),
      };

      const { error } = await supabase
        .from(TABLES.PROFILES)
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;

      return this.getUserProfile(userId);
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    if (!email) throw new ApiException("Veuillez saisir votre email");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getUserProfile(userId: string): Promise<AppUser> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData?.user;
      const fallbackEmail = authUser?.email ?? "";
      const authRole = (
        authUser?.user_metadata?.role ??
        authUser?.app_metadata?.role ??
        null
      ) as AppUser["role"] | null;
      const fallbackRole = (
        isAdminEmail(fallbackEmail) || authRole === "admin"
          ? "admin"
          : (authRole ?? "user")
      ) as AppUser["role"];
      const fallbackName =
        authUser?.user_metadata?.full_name ??
        authUser?.user_metadata?.name ??
        null;

      const { data, error } = await supabase
        .from(TABLES.PROFILES)
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST204" || error.message?.includes("column")) {
          const fallback: Partial<AppUser> = {
            id: userId,
            email: fallbackEmail,
            full_name: fallbackName ?? "Utilisateur",
            role: fallbackRole,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return fallback as AppUser;
        }
        throw error;
      }

      if (!data) {
        const fallback: Partial<AppUser> = {
          id: userId,
          email: fallbackEmail,
          full_name: fallbackName ?? "Utilisateur",
          role: fallbackRole,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return fallback as AppUser;
      }

      const profileRole =
        (data?.role as AppUser["role"] | undefined) ?? fallbackRole;
      const resolvedRole = (
        isAdminEmail(fallbackEmail) ||
        authRole === "admin" ||
        profileRole === "admin"
          ? "admin"
          : profileRole
      ) as AppUser["role"];

      if (resolvedRole === "admin" && fallbackEmail) {
        try {
          await supabase.from(TABLES.PROFILES).upsert(
            {
              id: userId,
              email: fallbackEmail,
              full_name: fallbackName ?? "Utilisateur",
              role: "admin",
            },
            { onConflict: "id" },
          );
        } catch (syncError) {
          console.warn("Impossible de synchroniser le rôle admin:", syncError);
        }
      }

      return {
        id: data?.id ?? userId,
        email: data?.email ?? data?.mail ?? fallbackEmail,
        full_name: data?.full_name ?? data?.nom ?? fallbackName ?? null,
        role: resolvedRole,
        avatar_url: data?.avatar_url ?? null,
        created_at: data?.created_at ?? new Date().toISOString(),
        updated_at: data?.updated_at ?? new Date().toISOString(),
      } as AppUser;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async getCurrentUser(): Promise<AppUser | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) return null;
    return this.getUserProfile(sessionData.session.user.id);
  }

  onAuthStateChange(callback: (user: AppUser | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          callback(null);
          return;
        }
        const profile = await this.getUserProfile(session.user.id);
        callback(profile);
      },
    );
    return data.subscription.unsubscribe;
  }
}

export const authService = new AuthService();
