import React, { useEffect } from 'react';
import FormManager from './FormManager';
import { testSupabaseConnection } from './lib/supabaseClient';
import './index.css';

function App() {
  useEffect(() => {
    // Tester la connexion Supabase au démarrage
    testSupabaseConnection();
  }, []);

  return (
    <div className="App">
      <FormManager />
    </div>
  );
}

export default App;



