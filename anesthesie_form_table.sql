-- Table pour le formulaire d'anesthésie
CREATE TABLE IF NOT EXISTS anesthesie_form (
    id SERIAL PRIMARY KEY,
    salle VARCHAR(255),
    heure TIME,
    date_intervention DATE,
    chirurgien VARCHAR(255),
    anesthesistes VARCHAR(255),
    tsar VARCHAR(255),
    checklist VARCHAR(255),
    position_patient VARCHAR(255),
    
    -- Modes anesthésiques
    mode_sedation BOOLEAN DEFAULT FALSE,
    mode_ag BOOLEAN DEFAULT FALSE,
    mode_crush BOOLEAN DEFAULT FALSE,
    mode_ra BOOLEAN DEFAULT FALSE,
    mode_apd BOOLEAN DEFAULT FALSE,
    mode_bloc BOOLEAN DEFAULT FALSE,
    
    -- Détails ALR
    site_ponction VARCHAR(255),
    aiguille VARCHAR(255),
    profondeur VARCHAR(255),
    intensite_ma VARCHAR(255),
    kt VARCHAR(255),
    dose_test VARCHAR(255),
    melange VARCHAR(255),
    incident_alr TEXT,
    bloc_obtenu VARCHAR(255),
    alr_complement VARCHAR(255),
    alr_autre1 VARCHAR(255),
    alr_autre2 VARCHAR(255),
    alr_autre3 VARCHAR(255),
    alr_autre4 VARCHAR(255),
    alr_autre5 VARCHAR(255),
    alr_autre6 VARCHAR(255),
    
    -- Appareillage (stocké en JSONB)
    appareillage_data JSONB DEFAULT '{}',
    
    -- Valeurs de monitoring
    sao2_value VARCHAR(255),
    eto2_value VARCHAR(255),
    vs_checked BOOLEAN DEFAULT FALSE,
    vs_vi_value VARCHAR(255),
    vc_checked BOOLEAN DEFAULT FALSE,
    vc_fr_value VARCHAR(255),
    pi_value VARCHAR(255),
    fio2_n2o_air VARCHAR(255),
    halogene VARCHAR(255),
    fi_value VARCHAR(255),
    fe_value VARCHAR(255),
    tof_alr VARCHAR(255),
    hematocrite_dextro VARCHAR(255),
    
    -- Drogues
    drogue1 VARCHAR(255),
    drogue2 VARCHAR(255),
    drogue3 VARCHAR(255),
    drogue4 VARCHAR(255),
    drogue5 VARCHAR(255),
    
    -- Perfusions
    perfusion1 VARCHAR(255),
    perfusion2 VARCHAR(255),
    perfusion3 VARCHAR(255),
    perfusion4 VARCHAR(255),
    perfusion5 VARCHAR(255),
    
    -- Autres
    autres_bilans VARCHAR(255),
    commentaires TEXT,
    
    -- Données de dessin (stockées en JSONB)
    grilles_data JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS (Row Level Security)
ALTER TABLE anesthesie_form ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Enable all operations for authenticated users" ON anesthesie_form
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for anonymous users" ON anesthesie_form
    FOR ALL USING (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_anesthesie_form_salle ON anesthesie_form(salle);
CREATE INDEX IF NOT EXISTS idx_anesthesie_form_chirurgien ON anesthesie_form(chirurgien);
CREATE INDEX IF NOT EXISTS idx_anesthesie_form_date_intervention ON anesthesie_form(date_intervention);
CREATE INDEX IF NOT EXISTS idx_anesthesie_form_created_at ON anesthesie_form(created_at);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_anesthesie_form_updated_at
    BEFORE UPDATE ON anesthesie_form
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insérer quelques données de test (optionnel)
INSERT INTO anesthesie_form (
    salle, 
    chirurgien, 
    date_intervention, 
    mode_ag, 
    appareillage_data,
    grilles_data
) VALUES (
    'Bloc 1',
    'Dr. Test',
    CURRENT_DATE,
    true,
    '{"app_masque": true, "app_mlf": false}',
    '{"main": {"temperature": [{"x": 10, "y": 20}], "spo2": []}}'
) ON CONFLICT DO NOTHING;