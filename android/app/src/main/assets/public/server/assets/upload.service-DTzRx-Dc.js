import { i as supabase, n as BUCKETS, t as ApiException } from "./exceptions-CejCju6t.js";
import "clsx";
//#region src/lib/utils.ts
function sanitizeFileName(fileName) {
	return fileName.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").replace(/\.\.+/g, ".").toLowerCase();
}
//#endregion
//#region src/backend/services/upload.service.ts
var MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
var ALLOWED_MIME_TYPES = new Set([
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/webp"
]);
var ALLOWED_EXTENSIONS = new Set([
	"png",
	"jpg",
	"jpeg",
	"webp"
]);
function getExtension(fileName) {
	return fileName.split(".").pop()?.toLowerCase() ?? "";
}
function buildUserFilePath(userId, fileName) {
	const cleanedName = sanitizeFileName(fileName);
	return `${userId}/${Date.now()}-${cleanedName}`;
}
var UploadService = class {
	async uploadImage(file, bucket, fileName) {
		if (!file) throw new ApiException("Fichier invalide : aucun fichier fourni.");
		if (!Object.values(BUCKETS).includes(bucket)) throw new ApiException(`Bucket introuvable : ${bucket}`);
		const mimeType = file.type?.toLowerCase() ?? "";
		if (!ALLOWED_MIME_TYPES.has(mimeType)) throw new ApiException(`Type MIME invalide : ${mimeType || "inconnu"}`);
		const extension = getExtension(file.name);
		if (!ALLOWED_EXTENSIONS.has(extension)) throw new ApiException(`Extension de fichier invalide : .${extension}`);
		if (file.size > MAX_IMAGE_SIZE_BYTES) throw new ApiException(`Fichier trop lourd : ${Math.round(file.size / 1024)} KB. Taille max ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB.`);
		const { data: authData, error: authError } = await supabase.auth.getUser();
		if (authError) throw ApiException.fromError(authError);
		const userId = authData.user?.id;
		if (!userId) throw new ApiException("Utilisateur non authentifié.");
		const safeFileName = sanitizeFileName(fileName || file.name);
		const filePath = buildUserFilePath(userId, /\.([a-z0-9]+)$/i.test(safeFileName) ? safeFileName : `${safeFileName}.${extension}`);
		const { error: uploadError, data: uploadData } = await supabase.storage.from(bucket).upload(filePath, file, {
			cacheControl: "3600",
			upsert: false
		});
		if (uploadError) {
			console.error(uploadError);
			throw new ApiException(`Upload refusé : ${uploadError.message || JSON.stringify(uploadError)}`);
		}
		const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
		const publicUrl = publicUrlData?.publicUrl;
		if (!publicUrl) throw new ApiException("Impossible de récupérer l'URL publique après upload.");
		return publicUrl;
	}
	async deleteImage(bucket, path) {
		try {
			const { error } = await supabase.storage.from(bucket).remove([path]);
			if (error) throw error;
		} catch (error) {
			throw ApiException.fromError(error);
		}
	}
	uploadGalleryImage(file, fileName) {
		return this.uploadImage(file, BUCKETS.GALLERY, fileName);
	}
	uploadLogo(file, fileName) {
		return this.uploadImage(file, BUCKETS.LOGO, fileName);
	}
	uploadBanner(file, fileName) {
		return this.uploadImage(file, BUCKETS.BANNER, fileName);
	}
	uploadAvatar(file, fileName) {
		return this.uploadImage(file, BUCKETS.AVATAR, fileName);
	}
};
var uploadService = new UploadService();
//#endregion
export { uploadService as t };
