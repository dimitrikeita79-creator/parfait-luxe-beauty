import { i as supabase, r as TABLES, t as ApiException } from "./exceptions-CejCju6t.js";
//#region src/backend/services/services.service.ts
var ServicesService = class {
	async getAll() {
		try {
			const { data, error } = await supabase.from(TABLES.SERVICES).select("*").order("title", { ascending: true });
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async getActive() {
		try {
			const { data, error } = await supabase.from(TABLES.SERVICES).select("*").eq("active", true).order("title", { ascending: true });
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async create(item) {
		try {
			const { data, error } = await supabase.from(TABLES.SERVICES).insert(item).select().single();
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async update(id, updates) {
		try {
			const { data, error } = await supabase.from(TABLES.SERVICES).update(updates).eq("id", id).select().single();
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async delete(id) {
		try {
			const { error } = await supabase.from(TABLES.SERVICES).delete().eq("id", id);
			if (error) throw error;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
};
var servicesService = new ServicesService();
//#endregion
export { servicesService as t };
