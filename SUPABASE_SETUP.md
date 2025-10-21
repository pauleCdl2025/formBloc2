# Configuration Supabase pour l'application de formulaires médicaux

## 📋 Tables nécessaires

L'application utilise une seule table principale `preanesthesia_forms` qui stocke tous les types de formulaires :

### Types de formulaires supportés :
- `preanesthesia` - Consultation Pré-Anesthésique
- `surveillance_sspi` - Surveillance SSPI  
- `compte_rendu_preanesthesique` - Compte-rendu Pré-anesthésique
- `consentement_anesthesique` - Consentement Anesthésique

## 🚀 Installation rapide

### 1. Créer les tables
Exécutez le contenu du fichier `supabase_tables.sql` dans l'éditeur SQL de Supabase.

### 2. Vérifier l'installation
Exécutez le contenu du fichier `supabase_check.sql` pour vérifier que tout est correctement configuré.

## 📊 Structure de la table

```sql
preanesthesia_forms (
  id UUID PRIMARY KEY,
  patient_number VARCHAR(50) NOT NULL,
  form_type VARCHAR(50) NOT NULL DEFAULT 'preanesthesia',
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## 🔧 Configuration des variables d'environnement

### Variables nécessaires :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

### Dans Netlify :
1. Allez dans Site settings > Environment variables
2. Ajoutez les variables ci-dessus
3. Redéployez le site

## 🔍 Vérification du fonctionnement

### 1. Test de connexion
L'application affiche dans la console :
```
Configuration Supabase:
URL: https://votre-projet.supabase.co
Key: Présente
```

### 2. Test de sauvegarde
Créez un formulaire et cliquez sur "Sauvegarder". Vérifiez dans Supabase que l'enregistrement apparaît.

### 3. Test de consultation
Cliquez sur "Consulter" pour voir la liste des formulaires sauvegardés.

## 🛠️ Dépannage

### Problème : "Failed to fetch"
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que les politiques RLS permettent l'accès public
- Vérifiez que la table `preanesthesia_forms` existe

### Problème : "400 Bad Request" sur les consultations
- Vérifiez que la colonne `form_type` existe dans la table
- L'application utilise un fallback côté client si nécessaire

### Problème : Signatures non visibles
- Vérifiez que le canvas fonctionne (carré rouge visible)
- Testez sur différents navigateurs
- Vérifiez que JavaScript est activé

## 📈 Statistiques

L'application affiche des statistiques basées sur les données de la table :
- Total des patients
- Formulaires créés ce mois
- Résultats de recherche

## 🔒 Sécurité (Production)

⚠️ **ATTENTION** : Les politiques RLS actuelles permettent l'accès public pour le développement.

Pour la production, configurez des politiques plus restrictives :
```sql
-- Exemple de politique restrictive
CREATE POLICY "Restrict access to authenticated users" ON preanesthesia_forms
    FOR ALL USING (auth.role() = 'authenticated');
```
