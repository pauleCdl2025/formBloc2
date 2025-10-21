// Script de diagnostic Supabase
// À exécuter dans la console du navigateur pour diagnostiquer l'erreur 406

console.log('=== DIAGNOSTIC SUPABASE ===');

// 1. Vérifier la configuration Supabase
console.log('URL Supabase:', 'https://wwmjpfehruuwxwmgaxrl.supabase.co');
console.log('Clé anonyme:', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bWpwZmVocnV1d3h3bWdheHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjIwODksImV4cCI6MjA3NjQ5ODA4OX0.HW95sUheCzRPc_hmop3UOvo85jD3MsfRPTBduqtyf40');

// 2. Test de connexion basique
async function testSupabaseConnection() {
  try {
    console.log('=== TEST DE CONNEXION ===');
    
    // Test simple avec fetch
    const response = await fetch('https://wwmjpfehruuwxwmgaxrl.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bWpwZmVocnV1d3h3bWdheHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjIwODksImV4cCI6MjA3NjQ5ODA4OX0.HW95sUheCzRPc_hmop3UOvo85jD3MsfRPTBduqtyf40',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bWpwZmVocnV1d3h3bWdheHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjIwODksImV4cCI6MjA3NjQ5ODA4OX0.HW95sUheCzRPc_hmop3UOvo85jD3MsfRPTBduqtyf40',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.text();
      console.log('Réponse:', data);
    } else {
      const errorText = await response.text();
      console.log('Erreur:', errorText);
    }
    
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
}

// 3. Test de la table preanesthesia_forms
async function testTableAccess() {
  try {
    console.log('=== TEST D\'ACCÈS À LA TABLE ===');
    
    const response = await fetch('https://wwmjpfehruuwxwmgaxrl.supabase.co/rest/v1/preanesthesia_forms?select=count', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bWpwZmVocnV1d3h3bWdheHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjIwODksImV4cCI6MjA3NjQ5ODA4OX0.HW95sUheCzRPc_hmop3UOvo85jD3MsfRPTBduqtyf40',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bWpwZmVocnV1d3h3bWdheHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjIwODksImV4cCI6MjA3NjQ5ODA4OX0.HW95sUheCzRPc_hmop3UOvo85jD3MsfRPTBduqtyf40',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Données:', data);
    } else {
      const errorText = await response.text();
      console.log('Erreur:', errorText);
    }
    
  } catch (error) {
    console.error('Erreur d\'accès à la table:', error);
  }
}

// Exécuter les tests
testSupabaseConnection();
setTimeout(() => testTableAccess(), 1000);
