import { i as supabase, r as TABLES, t as ApiException } from "./exceptions-CejCju6t.js";
//#region src/backend/services/gallery.service.ts
var GalleryService = class {
	async getAll() {
		try {
			const { data, error } = await supabase.from(TABLES.GALLERY).select("*").order("sort_order", { ascending: true });
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async getFeatured() {
		try {
			const { data, error } = await supabase.from(TABLES.GALLERY).select("*").eq("is_featured", true).order("sort_order", { ascending: true });
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async getByCategory(category) {
		try {
			const { data, error } = await supabase.from(TABLES.GALLERY).select("*").eq("category", category).order("sort_order", { ascending: true });
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async create(item) {
		try {
			const { data, error } = await supabase.from(TABLES.GALLERY).insert(item).select().single();
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async update(id, updates) {
		try {
			const { data, error } = await supabase.from(TABLES.GALLERY).update(updates).eq("id", id).select().single();
			if (error) throw error;
			return data;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	async delete(id) {
		try {
			const { error } = await supabase.from(TABLES.GALLERY).delete().eq("id", id);
			if (error) throw error;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
};
var galleryService = new GalleryService();
//#endregion
export { galleryService as t };
