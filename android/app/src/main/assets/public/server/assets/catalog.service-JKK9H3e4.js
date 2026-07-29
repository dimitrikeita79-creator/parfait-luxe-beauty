import { i as supabase, r as TABLES, t as ApiException } from "./exceptions-CejCju6t.js";
//#region src/backend/services/catalog.service.ts
var CatalogService = class {
	async getAll() {
		try {
			const { data, error } = await supabase.from(TABLES.CATALOG).select("*").order("sort_order", { ascending: true });
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async getAvailable() {
		try {
			const { data, error } = await supabase.from(TABLES.CATALOG).select("*").eq("is_available", true).order("sort_order", { ascending: true });
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async getByCategory(category) {
		try {
			const queryValue = {
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
				promotion: "Promo"
			}[category.trim().toLowerCase()] ?? category.trim();
			const { data, error } = await supabase.from(TABLES.CATALOG).select("*").ilike("category", queryValue).order("sort_order", { ascending: true });
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async create(item) {
		try {
			const { data, error } = await supabase.from(TABLES.CATALOG).insert(item).select().single();
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async update(id, updates) {
		try {
			const { data, error } = await supabase.from(TABLES.CATALOG).update(updates).eq("id", id).select().single();
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async delete(id) {
		try {
			const { error } = await supabase.from(TABLES.CATALOG).delete().eq("id", id);
			if (error) throw error;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
};
var catalogService = new CatalogService();
//#endregion
export { catalogService as t };
