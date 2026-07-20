import { supabase, BUCKETS } from '../client';
import { ApiException } from '../exceptions';

export class UploadService {
  async uploadImage(
    file: File,
    bucket: string,
    fileName?: string
  ): Promise<string> {
    try {
      const finalName = fileName || `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(finalName, file, {
          cacheControl: '3600',
          upsert: false,
        });
      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(finalName);
      return data.publicUrl as string;
    } catch (error) {
      throw ApiException.fromError(error);
    }
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

  uploadTeamPhoto(file: File, fileName?: string): Promise<string> {
    return this.uploadImage(file, BUCKETS.TEAM, fileName);
  }
}

export const uploadService = new UploadService();
