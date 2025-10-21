-- Création de la table principale pour tous les formulaires
CREATE TABLE IF NOT EXISTS preanesthesia_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_number VARCHAR(50) NOT NULL,
  form_type VARCHAR(50) NOT NULL DEFAULT 'preanesthesia',
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un index sur patient_number pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_preanesthesia_forms_patient_number ON preanesthesia_forms(patient_number);

-- Création d'un index sur form_type pour filtrer par type de formulaire
CREATE INDEX IF NOT EXISTS idx_preanesthesia_forms_form_type ON preanesthesia_forms(form_type);

-- Création d'un index sur created_at pour le tri chronologique
CREATE INDEX IF NOT EXISTS idx_preanesthesia_forms_created_at ON preanesthesia_forms(created_at);

-- Création d'un index sur updated_at pour le tri par modification
CREATE INDEX IF NOT EXISTS idx_preanesthesia_forms_updated_at ON preanesthesia_forms(updated_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_preanesthesia_forms_updated_at ON preanesthesia_forms;
CREATE TRIGGER update_preanesthesia_forms_updated_at
    BEFORE UPDATE ON preanesthesia_forms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS (Row Level Security) - Permettre l'accès public pour le développement
-- ATTENTION: En production, vous devriez configurer des politiques plus restrictives
ALTER TABLE preanesthesia_forms ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY IF NOT EXISTS "Allow public read access" ON preanesthesia_forms
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion publique
CREATE POLICY IF NOT EXISTS "Allow public insert access" ON preanesthesia_forms
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la mise à jour publique
CREATE POLICY IF NOT EXISTS "Allow public update access" ON preanesthesia_forms
    FOR UPDATE USING (true);

-- Politique pour permettre la suppression publique
CREATE POLICY IF NOT EXISTS "Allow public delete access" ON preanesthesia_forms
    FOR DELETE USING (true);

-- Vérification des types de formulaires utilisés dans l'application
-- Types attendus:
-- - 'preanesthesia' (Consultation Pré-Anesthésique)
-- - 'surveillance_sspi' (Surveillance SSPI)
-- - 'compte_rendu_preanesthesique' (Compte-rendu Pré-anesthésique)
-- - 'consentement_anesthesique' (Consentement Anesthésique)

-- Insertion d'un exemple de données pour tester (optionnel)
-- INSERT INTO preanesthesia_forms (patient_number, form_type, data) VALUES 
-- ('12345', 'preanesthesia', '{"test": "data"}'::jsonb)
-- ON CONFLICT DO NOTHING;
