import { i as supabase, r as TABLES, t as ApiException } from "./exceptions-CejCju6t.js";
//#region src/backend/services/reviews.service.ts
var ReviewsService = class {
	async submitReview(payload) {
		const insertPayload = {
			user_id: payload.user_id,
			author_name: payload.author_name,
			comment: payload.comment,
			rating: payload.rating
		};
		if (payload.title) insertPayload.title = payload.title;
		const tryInsert = async () => {
			const { error } = await supabase.from(TABLES.REVIEWS).insert(insertPayload);
			if (error) throw error;
		};
		try {
			await tryInsert();
			await this.notifyAdminNewReview(payload);
		} catch (error) {
			const message = String(error?.message ?? "").toLowerCase();
			const isForeignKeyError = message.includes("foreign key") || message.includes("23503") || message.includes("violates foreign key");
			if (payload.user_id && isForeignKeyError) try {
				await supabase.from(TABLES.PROFILES).upsert({
					id: payload.user_id,
					full_name: payload.author_name,
					role: "user"
				}, { onConflict: "id" });
				await tryInsert();
				await this.notifyAdminNewReview(payload);
				return;
			} catch (retryError) {
				throw ApiException.fromError(retryError);
			}
			throw ApiException.fromError(error);
		}
	}
	async notifyAdminNewReview(payload) {
		try {
			if (typeof window !== "undefined" && window.localStorage) {
				const notifications = JSON.parse(window.localStorage.getItem("admin-notifications") || "[]");
				const newNotification = {
					id: `review-${Date.now()}`,
					type: "new_review",
					message: `Nouvel avis de ${payload.author_name} : ${payload.comment.substring(0, 50)}...`,
					author: payload.author_name,
					rating: payload.rating,
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					read: false
				};
				notifications.unshift(newNotification);
				window.localStorage.setItem("admin-notifications", JSON.stringify(notifications.slice(0, 50)));
			}
		} catch (error) {
			console.error("Failed to notify admin:", error);
		}
	}
	parseApprovedReviews(data) {
		const raw = data ?? [];
		const approved = raw.filter((item) => {
			if (item == null || typeof item !== "object") return false;
			if ("is_approved" in item) return item.is_approved === true;
			if ("isapproved" in item) return item.isapproved === true;
			if ("approved" in item) return item.approved === true;
			return false;
		});
		return approved.length > 0 ? approved : raw;
	}
	async getApprovedReviews() {
		const tryFetch = async (columnName) => {
			let query = supabase.from(TABLES.REVIEWS).select("*");
			if (columnName) query = query.eq(columnName, true);
			const { data, error } = await query.order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		};
		try {
			const data = await tryFetch("is_approved");
			return this.parseApprovedReviews(data);
		} catch (error) {
			const message = String(error?.message ?? "").toLowerCase();
			if (message.includes("column reviews.is_approved does not exist") || message.includes("column \"reviews\".\"is_approved\" does not exist") || message.includes("column reviews.isapproved does not exist") || message.includes("column \"reviews\".\"isapproved\" does not exist")) try {
				const data = await tryFetch();
				return this.parseApprovedReviews(data);
			} catch (fallbackError) {
				throw ApiException.fromError(fallbackError);
			}
			throw ApiException.fromError(error);
		}
	}
	async getAllReviews() {
		const { data, error } = await supabase.from(TABLES.REVIEWS).select("*").order("created_at", { ascending: false });
		if (error) throw error;
		return data ?? [];
	}
	async deleteReview(id) {
		const { error } = await supabase.from(TABLES.REVIEWS).delete().eq("id", id);
		if (error) throw error;
	}
	async updateReview(id, updates) {
		const { error } = await supabase.from(TABLES.REVIEWS).update(updates).eq("id", id);
		if (error) throw error;
	}
};
var reviewsService = new ReviewsService();
//#endregion
export { reviewsService as t };
