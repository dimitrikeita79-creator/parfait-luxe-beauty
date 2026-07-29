import { i as supabase, r as TABLES, t as ApiException } from "./exceptions-CejCju6t.js";
//#region src/backend/services/auth.service.ts
var ADMIN_EMAIL = "essadjikeita794@gmail.com";
var isAdminEmail = (email) => email?.trim().toLowerCase() === ADMIN_EMAIL;
var AuthService = class {
	async signIn(email, password) {
		if (!email || !password) throw new ApiException("Veuillez saisir votre email et mot de passe");
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			if (!data.user) throw new ApiException("Connexion échouée");
			const profile = await this.getUserProfile(data.user.id);
			const role = isAdminEmail(data.user.email) ? "admin" : data.user.user_metadata?.role ?? data.user.app_metadata?.role ?? profile.role ?? "user";
			try {
				await supabase.from(TABLES.PROFILES).upsert({
					id: data.user.id,
					email: data.user.email ?? email,
					full_name: data.user.user_metadata?.full_name ?? profile.full_name ?? email.split("@")[0],
					role
				}, { onConflict: "id" });
			} catch (syncError) {
				console.warn("Impossible de synchroniser le profil admin:", syncError);
			}
			return {
				...profile,
				role,
				email: profile.email || data.user.email || email,
				full_name: profile.full_name ?? data.user.user_metadata?.full_name ?? null,
				theme: profile.theme ?? "gold"
			};
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async signUp(email, password, fullName, isAdmin = false) {
		if (!email || !password) throw new ApiException("Veuillez saisir votre email et mot de passe");
		if (password.length < 6) throw new ApiException("Le mot de passe doit contenir au moins 6 caractères");
		const resolvedIsAdmin = isAdmin || isAdminEmail(email);
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: { data: {
					full_name: fullName ?? email.split("@")[0],
					role: resolvedIsAdmin ? "admin" : "user"
				} }
			});
			if (error) {
				console.error("🔴 Auth signUp error:", error);
				throw error;
			}
			if (!data.user) throw new ApiException("Inscription échouée");
			const profilePayload = {
				id: data.user.id,
				email: data.user.email ?? email,
				full_name: fullName ?? data.user.user_metadata?.full_name ?? email.split("@")[0],
				role: resolvedIsAdmin ? "admin" : "user",
				avatar_url: null,
				theme: "gold"
			};
			try {
				await supabase.from(TABLES.PROFILES).upsert(profilePayload, { onConflict: "id" });
			} catch {
				console.warn("Impossible de sauvegarder le profil, mais l'inscription a réussi");
			}
			try {
				return await this.getUserProfile(data.user.id);
			} catch {
				return {
					id: data.user.id,
					email: data.user.email || email,
					full_name: fullName ?? data.user.user_metadata?.full_name ?? email.split("@")[0],
					role: resolvedIsAdmin ? "admin" : "user",
					avatar_url: null,
					theme: "gold",
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				};
			}
		} catch (error) {
			console.error("🔴 signUp final error:", error);
			throw ApiException.fromError(error);
		}
	}
	async updateProfile(updates) {
		try {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) throw sessionError;
			const user = sessionData.session?.user;
			if (!user?.id) throw new ApiException("Utilisateur non connecté");
			const resolvedEmail = updates.email ?? user.email;
			if (!resolvedEmail) throw new ApiException("Impossible de récupérer l'email de l'utilisateur.");
			const payload = {
				id: user.id,
				email: resolvedEmail
			};
			if (updates.full_name !== void 0) payload.full_name = updates.full_name;
			if (updates.avatar_url !== void 0) payload.avatar_url = updates.avatar_url;
			if (updates.role !== void 0) payload.role = updates.role;
			if (updates.theme !== void 0) payload.theme = updates.theme;
			const { error } = await supabase.from(TABLES.PROFILES).upsert(payload, { onConflict: "id" });
			if (error) throw error;
			return this.getUserProfile(user.id);
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async signOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async resetPassword(email) {
		if (!email) throw new ApiException("Veuillez saisir votre email");
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email);
			if (error) throw error;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async getUserProfile(userId) {
		try {
			const { data: authData } = await supabase.auth.getUser();
			const authUser = authData?.user;
			const fallbackEmail = authUser?.email ?? "";
			const authRole = authUser?.user_metadata?.role ?? authUser?.app_metadata?.role ?? null;
			const fallbackRole = isAdminEmail(fallbackEmail) || authRole === "admin" ? "admin" : authRole ?? "user";
			const fallbackName = authUser?.user_metadata?.full_name ?? authUser?.user_metadata?.name ?? null;
			const { data, error } = await supabase.from(TABLES.PROFILES).select("*").eq("id", userId).maybeSingle();
			if (error) {
				if (error.code === "PGRST204" || error.message?.includes("column")) return {
					id: userId,
					email: fallbackEmail,
					full_name: fallbackName ?? "Utilisateur",
					role: fallbackRole,
					avatar_url: null,
					theme: "gold",
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				};
				throw error;
			}
			if (!data) return {
				id: userId,
				email: fallbackEmail,
				full_name: fallbackName ?? "Utilisateur",
				role: fallbackRole,
				avatar_url: null,
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const profileRole = data?.role ?? fallbackRole;
			const resolvedRole = isAdminEmail(fallbackEmail) || authRole === "admin" || profileRole === "admin" ? "admin" : profileRole;
			if (resolvedRole === "admin" && fallbackEmail) try {
				await supabase.from(TABLES.PROFILES).upsert({
					id: userId,
					email: fallbackEmail,
					full_name: fallbackName ?? "Utilisateur",
					role: "admin"
				}, { onConflict: "id" });
			} catch (syncError) {
				console.warn("Impossible de synchroniser le rôle admin:", syncError);
			}
			return {
				id: data?.id ?? userId,
				email: data?.email ?? data?.mail ?? fallbackEmail,
				full_name: data?.full_name ?? data?.nom ?? fallbackName ?? null,
				role: resolvedRole,
				avatar_url: data?.avatar_url ?? null,
				theme: data?.theme ?? "gold",
				created_at: data?.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: data?.updated_at ?? (/* @__PURE__ */ new Date()).toISOString()
			};
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async getCurrentUser() {
		const { data: sessionData } = await supabase.auth.getSession();
		if (!sessionData.session?.user) return null;
		return this.getUserProfile(sessionData.session.user.id);
	}
	onAuthStateChange(callback) {
		const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (!session?.user) {
				callback(null);
				return;
			}
			try {
				callback(await this.getUserProfile(session.user.id));
			} catch (error) {
				console.error("Failed to load user profile on auth state change:", error);
				callback({
					id: session.user.id,
					email: session.user.email ?? "",
					full_name: session.user.user_metadata?.full_name ?? null,
					role: isAdminEmail(session.user.email) ? "admin" : "user",
					avatar_url: null,
					theme: "gold",
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				});
			}
		});
		return data.subscription.unsubscribe;
	}
};
var authService = new AuthService();
//#endregion
export { authService as t };
