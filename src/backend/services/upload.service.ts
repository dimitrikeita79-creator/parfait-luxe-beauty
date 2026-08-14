import { supabase, BUCKETS } from "../client";
import { ApiException } from "../exceptions";
import { sanitizeFileName } from "../../lib/utils";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);

function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function buildUserFilePath(userId: string, fileName: string): string {
  const cleanedName = sanitizeFileName(fileName);
  return `${userId}/${Date.now()}-${cleanedName}`;
}

export class UploadService {
  async uploadImage(file: File, bucket: string, fileName?: string): Promise<string> {
    if (!file) {
      throw new ApiException("Fichier invalide : aucun fichier fourni.");
    }

    if (!Object.values(BUCKETS).includes(bucket as (typeof BUCKETS)[keyof typeof BUCKETS])) {
      throw new ApiException(`Bucket introuvable : ${bucket}`);
    }

    const mimeType = file.type?.toLowerCase() ?? "";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new ApiException(`Type MIME invalide : ${mimeType || "inconnu"}`);
    }

    const extension = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      throw new ApiException(`Extension de fichier invalide : .${extension}`);
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new ApiException(
        `Fichier trop lourd : ${Math.round(file.size / 1024)} KB. Taille max ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB.`,
      );
    }

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      throw ApiException.fromError(authError);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new ApiException("Utilisateur non authentifié.");
    }

    const rawFileName = fileName || file.name;
    const safeFileName = sanitizeFileName(rawFileName);
    const finalFileName = /\.([a-z0-9]+)$/i.test(safeFileName)
      ? safeFileName
      : `${safeFileName}.${extension}`;
    const filePath = buildUserFilePath(userId, finalFileName);

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error('[UploadService] upload error:', uploadError);
      throw new ApiException("Upload refusé : impossible d'enregistrer l'image. Vérifiez le bucket et vos droits.");
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      throw new ApiException("Impossible de récupérer l'URL publique après upload.");
    }

    return publicUrl as string;
  }

  async deleteImage(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  uploadGalleryImage(file: File, fileName?: string): Promise<string> {
    return this.uploadImage(file, BUCKETS.GALLERY, fileName);
  }

  uploadLogo(file: File, fileName?: string): Promise<string> {
    return this.uploadImage(file, BUCKETS.LOGO, fileName);
  }

  uploadBanner(file: File, fileName?: string): Promise<string> {
    return this.uploadImage(file, BUCKETS.BANNER, fileName);
  }

  uploadAvatar(file: File, fileName?: string): Promise<string> {
    return this.uploadImage(file, BUCKETS.AVATAR, fileName);
  }
}

export const uploadService = new UploadService();