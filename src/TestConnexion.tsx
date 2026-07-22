import { useState } from 'react';
import { supabase } from '../backend/client';

export default function TestConnexion() {
  const [resultat, setResultat] = useState("Cliquez sur le bouton pour tester Supabase...");

  const tester = async () => {
    setResultat("⏳ Test en cours...");
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .limit(1);

      if (error) {
        setResultat("❌ Erreur Supabase : " + JSON.stringify(error));
      } else {
        setResultat("✅ Succès ! Connexion OK. Données : " + JSON.stringify(data));
      }
    } catch (e: any) {
      setResultat("💥 Crash réseau : " + e.message);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Test Connexion Supabase</h1>
      <button onClick={tester} style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px' }}>
        Lancer le test
      </button>
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        {resultat}
      </div>
    </div>
  );
}
