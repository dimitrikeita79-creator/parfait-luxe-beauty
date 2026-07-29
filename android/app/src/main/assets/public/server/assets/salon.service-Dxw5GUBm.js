import { i as supabase, r as TABLES, t as ApiException } from "./exceptions-CejCju6t.js";
//#region src/backend/services/salon.service.ts
var SalonService = class {
	async getInfo() {
		try {
			const { data, error } = await supabase.from(TABLES.SALON_INFO).select("*").limit(1).maybeSingle();
			if (error) throw error;
			if (!data) return await this._createDefault();
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async updateInfo(updates) {
		try {
			const existing = await supabase.from(TABLES.SALON_INFO).select("id").limit(1).maybeSingle();
			if (existing.error) throw existing.error;
			let result;
			if (!existing.data) {
				const { data, error } = await supabase.from(TABLES.SALON_INFO).insert(updates).select().single();
				if (error) throw error;
				result = data;
			} else {
				const { data, error } = await supabase.from(TABLES.SALON_INFO).update(updates).eq("id", existing.data.id).select().single();
				if (error) throw error;
				result = data;
			}
			return result;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async _createDefault() {
		const { data, error } = await supabase.from(TABLES.SALON_INFO).insert({
			salon_name: "Parfait Design",
			slogan: "Votre beauté, notre passion",
			about_text: "Bienvenue chez Parfait Design"
		}).select().single();
		if (error) throw error;
		return data;
	}
};
var salonService = new SalonService();
//#endregion
export { salonService as t };
