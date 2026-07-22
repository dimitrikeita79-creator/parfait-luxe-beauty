import { useState } from 'react';
import { galleryService } from '../backend/services';
import type { GalleryItem } from '../backend/models';

export default function AddGalleryByUrl({ onAdded }: { onAdded?: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valeurs par défaut (peuvent être des menus déroulants)
  const [category, setCategory] = useState<GalleryItem['category']>('coiffure');
  const [isFeatured, setIsFeatured] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validations simples
    if (!title || !imageUrl) {
      setError('Le titre et l\'URL de l\'image sont obligatoires.');
      return;
    }

    // 2. Vérifier que l'URL commence bien par http
    try {
      new URL(imageUrl);
    } catch {
      setError('L\'URL de l\'image n\'est pas valide (ex: https://...)');
      return;
    }

    try {
      setSaving(true);
      
      // 3. Sauvegarder directement l'URL dans la base de données
      await galleryService.create({
        title,
        description: description || null,
        image_url: imageUrl, // <-- L'URL est stockée ici
        category,
        is_featured: isFeatured,
        sort_order: 0,
      });

      alert('Photo ajoutée avec succès !');
      
      // 4. Réinitialiser le formulaire
      setTitle('');
      setDescription('');
      setImageUrl('');
      setIsFeatured(false);

      // 5. Notifier le parent pour rafraîchir la liste
      if (onAdded) onAdded();

    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3>Ajouter une image via URL</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input 
        type="text" 
        placeholder="Titre de la photo" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />

      <input 
        type="text" 
        placeholder="https://lien-vers-l-image.jpg" 
        value={imageUrl} 
        onChange={(e) => setImageUrl(e.target.value)} 
      />

      <input 
        type="text" 
        placeholder="Description (optionnel)" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />

      {/* Exemple de sélection de catégorie */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="coiffure">Coiffure</option>
        <option value="maquillage">Maquillage</option>
        <option value="ongles">Ongles</option>
        <option value="soin">Soin</option>
        <option value="autre">Autre</option>
      </select>

      <label>
        <input 
          type="checkbox" 
          checked={isFeatured} 
          onChange={(e) => setIsFeatured(e.target.checked)} 
        />
        Mettre en vedette
      </label>

      {/* Aperçu de l'image en direct */}
      {imageUrl && (
        <div>
          <p>Aperçu :</p>
          <img 
            src={imageUrl} 
            alt="Aperçu" 
            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} 
            onError={() => setError('Aperçu impossible. L\'URL est-elle valide ?')}
          />
        </div>
      )}

      <button type="submit" disabled={saving}>
        {saving ? 'Sauvegarde...' : 'Ajouter la photo'}
      </button>
    </form>
  );
}
