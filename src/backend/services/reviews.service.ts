import { supabase, TABLES, withRetry } from "../client";
import { ApiException } from "../exceptions";
import type { Review } from "../models";

export interface ReviewPayload {
  user_id: string | null;
  author_name: string;
  title?: string;
  comment: string;
  rating: number;
}

export class ReviewsService {
  async submitReview(payload: ReviewPayload): Promise<void> {
    const insertPayload: Record<string, unknown> = {
      user_id: payload.user_id,
      author_name: payload.author_name,
      comment: payload.comment,
      rating: payload.rating,
    };
    if (payload.title) insertPayload.title = payload.title;

    const tryInsert = async () => {
      const { error } = await supabase.from(TABLES.REVIEWS).insert(insertPayload);
      if (error) throw error;
    };

    try {
      await tryInsert();
      
      // Notify admin of new review
      await this.notifyAdminNewReview(payload);
    } catch (error) {
      const message = String((error as any)?.message ?? "").toLowerCase();
      const isForeignKeyError =
        message.includes("foreign key") ||
        message.includes("23503") ||
        message.includes("violates foreign key");

      if (payload.user_id && isForeignKeyError) {
        try {
          await supabase.from(TABLES.PROFILES).upsert(
            {
              id: payload.user_id,
              full_name: payload.author_name,
              role: "user",
            },
            { onConflict: "id" },
          );
          await tryInsert();
          
          // Notify admin of new review
          await this.notifyAdminNewReview(payload);
          return;
        } catch (retryError) {
          throw ApiException.fromError(retryError);
        }
      }

      throw ApiException.fromError(error);
    }
  }

  private async notifyAdminNewReview(payload: ReviewPayload): Promise<void> {
    try {
      // Store notification in localStorage for admin to see
      if (typeof window !== "undefined" && window.localStorage) {
        const notifications = JSON.parse(window.localStorage.getItem("admin-notifications") || "[]");
        const newNotification = {
          id: `review-${Date.now()}`,
          type: "new_review",
          message: `Nouvel avis de ${payload.author_name} : ${payload.comment.substring(0, 50)}...`,
          author: payload.author_name,
          rating: payload.rating,
          timestamp: new Date().toISOString(),
          read: false,
        };
        notifications.unshift(newNotification);
        window.localStorage.setItem("admin-notifications", JSON.stringify(notifications.slice(0, 50))); // Keep last 50 notifications
      }
    } catch (error) {
      // Silently fail - notification shouldn't block review submission
      console.error("Failed to notify admin:", error);
    }
  }

  private parseApprovedReviews(data: unknown[] | null): Review[] {
    const raw = data ?? [];
    const approved = raw.filter((item) => {
      if (item == null || typeof item !== "object") return false;
      if ("is_approved" in item) return (item as { is_approved: boolean }).is_approved === true;
      if ("isapproved" in item) return (item as { isapproved: boolean }).isapproved === true;
      if ("approved" in item) return (item as { approved: boolean }).approved === true;
      return false;
    });
    return (approved.length > 0 ? approved : raw) as Review[];
  }

  async getApprovedReviews(): Promise<Review[]> {
    const tryFetch = async (columnName?: string) => {
      return await withRetry(async () => {
        let query = supabase.from(TABLES.REVIEWS).select('id, user_id, author_name, title, comment, rating, is_approved, created_at');
        if (columnName) query = query.eq(columnName, true);
        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      });
    };

    try {
      const data = await tryFetch("is_approved");
      return this.parseApprovedReviews(data);
    } catch (error) {
      const message = String((error as unknown as { message?: string })?.message ?? "").toLowerCase();
      const isMissingColumn =
        message.includes("column reviews.is_approved does not exist") ||
        message.includes('column "reviews"."is_approved" does not exist') ||
        message.includes("column reviews.isapproved does not exist") ||
        message.includes('column "reviews"."isapproved" does not exist');

      if (isMissingColumn) {
        try {
          const data = await tryFetch();
          return this.parseApprovedReviews(data);
        } catch (fallbackError) {
          throw ApiException.fromError(fallbackError);
        }
      }

      throw ApiException.fromError(error);
    }
  }

  async getAllReviews(): Promise<Review[]> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.REVIEWS)
          .select('id, user_id, author_name, title, comment, rating, is_approved, created_at')
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data ?? []) as Review[];
      });
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.REVIEWS)
      .delete()
      .eq("id", id);
    if (error) throw error;
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<void> {
    const { error } = await supabase
      .from(TABLES.REVIEWS)
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  }
}

export const reviewsService = new ReviewsService();