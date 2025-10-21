-- Script de vérification et correction des tables manquantes
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier quelles tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'consultation_preanesthesique',
    'surveillance_sspi', 
    'compte_rendu_preanesthesique',
    'consentement_anesthesique'
)
ORDER BY table_name;

-- 2. Créer la table consentement_anesthesique si elle n'existe pas
CREATE TABLE IF NOT EXISTS consentement_anesthesique (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_number VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer l'index pour consentement_anesthesique
CREATE INDEX IF NOT EXISTS idx_consentement_anesthesique_patient_number 
ON consentement_anesthesique(patient_number);

-- 4. Désactiver RLS pour consentement_anesthesique
ALTER TABLE consentement_anesthesique DISABLE ROW LEVEL SECURITY;

-- 5. Créer la politique pour consentement_anesthesique
DROP POLICY IF EXISTS "Enable all operations for all users" ON consentement_anesthesique;
CREATE POLICY "Enable all operations for all users" ON consentement_anesthesique
    FOR ALL USING (true) WITH CHECK (true);

-- 6. Activer RLS pour consentement_anesthesique
ALTER TABLE consentement_anesthesique ENABLE ROW LEVEL SECURITY;

-- 7. Migrer les données de consentement si elles existent dans preanesthesia_forms
INSERT INTO consentement_anesthesique (patient_number, data, created_at, updated_at)
SELECT patient_number, data, created_at, updated_at
FROM preanesthesia_forms
WHERE form_type = 'consentement_anesthesique'
ON CONFLICT (patient_number) DO NOTHING;

-- 8. Vérifier toutes les tables et leurs comptes
SELECT 'consultation_preanesthesique' as table_name, COUNT(*) as count FROM consultation_preanesthesique
UNION ALL
SELECT 'surveillance_sspi' as table_name, COUNT(*) as count FROM surveillance_sspi
UNION ALL
SELECT 'compte_rendu_preanesthesique' as table_name, COUNT(*) as count FROM compte_rendu_preanesthesique
UNION ALL
SELECT 'consentement_anesthesique' as table_name, COUNT(*) as count FROM consentement_anesthesique
ORDER BY table_name;

-- 9. Test d'insertion pour vérifier que tout fonctionne
INSERT INTO consentement_anesthesique (patient_number, data) 
VALUES ('TEST_CONSENTEMENT', '{"test": true}')
ON CONFLICT (patient_number) DO NOTHING;

-- 10. Vérifier l'insertion
SELECT patient_number, created_at 
FROM consentement_anesthesique 
WHERE patient_number = 'TEST_CONSENTEMENT';

-- 11. Nettoyer le test
DELETE FROM consentement_anesthesique WHERE patient_number = 'TEST_CONSENTEMENT';
