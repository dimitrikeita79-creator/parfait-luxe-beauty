import { useState } from 'react';
import { supabase, BUCKETS } from '../backend/client'; // Ajustez le chemin si besoin

export default function UploadProfilePhoto({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const file = event.target.files?.[0];
    if (!file) {
      setErrorMessage("Veuillez sélectionner un fichier.");
      return;
    }

    // Limiter la taille (ex: 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("L'image est trop lourde (max 2 Mo).");
      return;
    }

    setUploading(true);
    setErrorMessage(null);

        try {
      // 1. Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Uploader le fichier dans le bucket "gallery"
      const { error: uploadError } = await supabase.storage
        .from(BUCKETS.GALLERY) 
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 3. Récupérer l'URL publique
      const { data } = supabase.storage
        .from(BUCKETS.GALLERY)
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);

      // 4. Mettre à jour UNIQUEMENT l'avatar_url (pas d'upsert complet)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl }) // <-- ON FAIT JUSTE UN UPDATE ICI
        .eq('id', userId);

      if (updateError) throw updateError;

      alert('✅ Photo de profil mise à jour avec succès !');

    } catch (error: any) {
      // ... la gestion d'erreur
    }

      if (uploadError) throw uploadError;

      // 3. Récupérer l'URL publique
      const { data } = supabase.storage
        .from(BUCKETS.GALLERY)
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);

      // 4. Mettre à jour la table profiles avec cette URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      alert('✅ Photo de profil mise à jour avec succès !');

    } catch (error: any) {
      setErrorMessage('❌ Erreur : ' + (error.message || JSON.stringify(error)));
      console.error('Erreur complète d\'upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
      <h3>Photo de profil</h3>
      
      <input 
        type="file" 
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        style={{ display: 'block', marginBottom: '15px' }}
      />

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {avatarUrl && (
        <div>
          <p>Aperçu :</p>
          <img src={avatarUrl} alt="Profil" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
      )}
    </div>
  );
}
