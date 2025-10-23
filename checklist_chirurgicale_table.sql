-- Table pour la checklist chirurgicale
CREATE TABLE IF NOT EXISTS checklist_chirurgicale (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    intervention_type VARCHAR(255) NOT NULL,
    surgeon VARCHAR(255) NOT NULL,
    operating_room VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS (Row Level Security)
ALTER TABLE checklist_chirurgicale ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture et l'écriture à tous les utilisateurs authentifiés
CREATE POLICY "Enable all operations for authenticated users" ON checklist_chirurgicale
    FOR ALL USING (auth.role() = 'authenticated');

-- Politique pour permettre la lecture et l'écriture à tous les utilisateurs anonymes (pour le développement)
CREATE POLICY "Enable all operations for anonymous users" ON checklist_chirurgicale
    FOR ALL USING (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_checklist_chirurgicale_patient_name ON checklist_chirurgicale(patient_name);
CREATE INDEX IF NOT EXISTS idx_checklist_chirurgicale_intervention_type ON checklist_chirurgicale(intervention_type);
CREATE INDEX IF NOT EXISTS idx_checklist_chirurgicale_created_at ON checklist_chirurgicale(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_checklist_chirurgicale_updated_at 
    BEFORE UPDATE ON checklist_chirurgicale 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
