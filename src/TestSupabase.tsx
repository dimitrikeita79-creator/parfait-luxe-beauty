import { useState, useEffect } from 'react';
import { supabase } from './backend/client';

export default function TestSupabase() {
  const [status, setStatus] = useState('En attente...');

  const testConnection = async () => {
    setStatus('Test en cours...');
    try {
      const { data, error } = await supabase.from('gallery').select('*').limit(1);
      
      if (error) {
        setStatus('❌ Erreur : ' + JSON.stringify(error));
      } else {
        setStatus('✅ Succès ! Données : ' + JSON.stringify(data));
      }
    } catch (err: any) {
      setStatus('💥 Crash : ' + err.message);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', fontSize: '16px' }}>
      <h1>Test de connexion Supabase</h1>
      <p style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        {status}
      </p>
    </div>
  );
}
