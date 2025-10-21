-- Script pour créer des tables séparées pour chaque type de formulaire
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Créer la table pour les formulaires de consultation pré-anesthésique
CREATE TABLE IF NOT EXISTS consultation_preanesthesique (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_number VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table pour les formulaires de surveillance SSPI
CREATE TABLE IF NOT EXISTS surveillance_sspi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_number VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table pour les comptes-rendus pré-anesthésiques
CREATE TABLE IF NOT EXISTS compte_rendu_preanesthesique (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_number VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table pour les consentements anesthésiques
CREATE TABLE IF NOT EXISTS consentement_anesthesique (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_number VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Migrer les données existantes de preanesthesia_forms vers consultation_preanesthesique
INSERT INTO consultation_preanesthesique (patient_number, data, created_at, updated_at)
SELECT patient_number, data, created_at, updated_at
FROM preanesthesia_forms
WHERE form_type = 'preanesthesia' OR form_type IS NULL
ON CONFLICT (patient_number) DO NOTHING;

-- 6. Migrer les données SSPI si elles existent
INSERT INTO surveillance_sspi (patient_number, data, created_at, updated_at)
SELECT patient_number, data, created_at, updated_at
FROM preanesthesia_forms
WHERE form_type = 'surveillance_sspi'
ON CONFLICT (patient_number) DO NOTHING;

-- 7. Migrer les données compte-rendu si elles existent
INSERT INTO compte_rendu_preanesthesique (patient_number, data, created_at, updated_at)
SELECT patient_number, data, created_at, updated_at
FROM preanesthesia_forms
WHERE form_type = 'compte_rendu_preanesthesique'
ON CONFLICT (patient_number) DO NOTHING;

-- 8. Migrer les données consentement si elles existent
INSERT INTO consentement_anesthesique (patient_number, data, created_at, updated_at)
SELECT patient_number, data, created_at, updated_at
FROM preanesthesia_forms
WHERE form_type = 'consentement_anesthesique'
ON CONFLICT (patient_number) DO NOTHING;

-- 9. Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_consultation_preanesthesique_patient_number 
ON consultation_preanesthesique(patient_number);

CREATE INDEX IF NOT EXISTS idx_surveillance_sspi_patient_number 
ON surveillance_sspi(patient_number);

CREATE INDEX IF NOT EXISTS idx_compte_rendu_preanesthesique_patient_number 
ON compte_rendu_preanesthesique(patient_number);

CREATE INDEX IF NOT EXISTS idx_consentement_anesthesique_patient_number 
ON consentement_anesthesique(patient_number);

-- 10. Désactiver RLS temporairement pour toutes les tables
ALTER TABLE consultation_preanesthesique DISABLE ROW LEVEL SECURITY;
ALTER TABLE surveillance_sspi DISABLE ROW LEVEL SECURITY;
ALTER TABLE compte_rendu_preanesthesique DISABLE ROW LEVEL SECURITY;
ALTER TABLE consentement_anesthesique DISABLE ROW LEVEL SECURITY;

-- 11. Créer des politiques permissives pour toutes les tables
CREATE POLICY "Enable all operations for all users" ON consultation_preanesthesique
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON surveillance_sspi
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON compte_rendu_preanesthesique
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON consentement_anesthesique
    FOR ALL USING (true) WITH CHECK (true);

-- 12. Activer RLS avec les nouvelles politiques
ALTER TABLE consultation_preanesthesique ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveillance_sspi ENABLE ROW LEVEL SECURITY;
ALTER TABLE compte_rendu_preanesthesique ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentement_anesthesique ENABLE ROW LEVEL SECURITY;

-- 13. Vérifier les données migrées
SELECT 'consultation_preanesthesique' as table_name, COUNT(*) as count FROM consultation_preanesthesique
UNION ALL
SELECT 'surveillance_sspi' as table_name, COUNT(*) as count FROM surveillance_sspi
UNION ALL
SELECT 'compte_rendu_preanesthesique' as table_name, COUNT(*) as count FROM compte_rendu_preanesthesique
UNION ALL
SELECT 'consentement_anesthesique' as table_name, COUNT(*) as count FROM consentement_anesthesique;
