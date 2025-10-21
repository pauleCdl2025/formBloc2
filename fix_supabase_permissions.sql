-- Script pour corriger les permissions et RLS sur la table preanesthesia_forms
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier les permissions actuelles
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename = 'preanesthesia_forms';

-- 2. Vérifier les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'preanesthesia_forms';

-- 3. Désactiver temporairement RLS pour tester
ALTER TABLE preanesthesia_forms DISABLE ROW LEVEL SECURITY;

-- 4. Supprimer les anciennes politiques s'il y en a
DROP POLICY IF EXISTS "Enable all operations for all users" ON preanesthesia_forms;
DROP POLICY IF EXISTS "Enable read access for all users" ON preanesthesia_forms;
DROP POLICY IF EXISTS "Enable insert for all users" ON preanesthesia_forms;
DROP POLICY IF EXISTS "Enable update for all users" ON preanesthesia_forms;
DROP POLICY IF EXISTS "Enable delete for all users" ON preanesthesia_forms;

-- 5. Créer des politiques permissives pour tous les utilisateurs
CREATE POLICY "Enable all operations for all users" ON preanesthesia_forms
    FOR ALL USING (true) WITH CHECK (true);

-- 6. Activer RLS avec la nouvelle politique
ALTER TABLE preanesthesia_forms ENABLE ROW LEVEL SECURITY;

-- 7. Vérifier que RLS est activé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'preanesthesia_forms';

-- 8. Vérifier les nouvelles politiques
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'preanesthesia_forms';

-- 9. Test d'insertion simple
INSERT INTO preanesthesia_forms (patient_number, form_type, data) 
VALUES ('TEST_406', 'test', '{"test": true}')
ON CONFLICT (patient_number) DO NOTHING;

-- 10. Vérifier l'insertion
SELECT patient_number, form_type, created_at 
FROM preanesthesia_forms 
WHERE patient_number = 'TEST_406';

-- 11. Nettoyer le test
DELETE FROM preanesthesia_forms WHERE patient_number = 'TEST_406';
