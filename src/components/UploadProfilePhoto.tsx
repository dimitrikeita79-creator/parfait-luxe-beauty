import { useState, type ChangeEvent } from "react";
import { authService, uploadService } from "../backend/services";

export default function UploadProfilePhoto({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return JSON.stringify(error);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const file = event.target.files?.[0];
    if (!file) {
      setErrorMessage("Veuillez sélectionner un fichier.");
      return;
    }

    setUploading(true);
    setErrorMessage(null);

    try {
      const avatarUrl = await uploadService.uploadGalleryImage(file);
      await authService.updateProfile({ avatar_url: avatarUrl });
      setAvatarUrl(avatarUrl);
      alert("✅ Photo de profil mise à jour avec succès !");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setErrorMessage("❌ Erreur : " + errorMessage);
      console.error("Erreur complète d'upload:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "400px" }}
    >
      <h3>Photo de profil</h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        style={{ display: "block", marginBottom: "15px" }}
      />

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {avatarUrl && (
        <div>
          <p>Aperçu :</p>
          <img
            src={avatarUrl}
            alt="Profil"
            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}
