-- Script de vérification des tables Supabase
-- Exécutez ces requêtes dans l'éditeur SQL de Supabase pour vérifier l'état

-- 1. Vérifier si la table existe
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'preanesthesia_forms';

-- 2. Vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'preanesthesia_forms' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Vérifier les index
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'preanesthesia_forms';

-- 4. Vérifier les politiques RLS
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'preanesthesia_forms';

-- 5. Vérifier les triggers
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'preanesthesia_forms';

-- 6. Compter les enregistrements par type de formulaire
SELECT form_type, COUNT(*) as count
FROM preanesthesia_forms 
GROUP BY form_type
ORDER BY form_type;

-- 7. Vérifier les données récentes
SELECT patient_number, form_type, created_at, updated_at
FROM preanesthesia_forms 
ORDER BY updated_at DESC 
LIMIT 10;
