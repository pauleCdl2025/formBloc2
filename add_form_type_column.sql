-- Script pour ajouter la colonne form_type à la table preanesthesia_forms
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier si la table existe
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'preanesthesia_forms';

-- 2. Vérifier la structure actuelle de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'preanesthesia_forms' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Ajouter la colonne form_type si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'preanesthesia_forms' 
        AND column_name = 'form_type'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE preanesthesia_forms 
        ADD COLUMN form_type VARCHAR(50) DEFAULT 'preanesthesia';
        
        -- Mettre à jour les enregistrements existants
        UPDATE preanesthesia_forms 
        SET form_type = 'preanesthesia' 
        WHERE form_type IS NULL;
        
        RAISE NOTICE 'Colonne form_type ajoutée avec succès';
    ELSE
        RAISE NOTICE 'Colonne form_type existe déjà';
    END IF;
END $$;

-- 4. Vérifier la nouvelle structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'preanesthesia_forms' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Créer un index sur form_type pour les performances
CREATE INDEX IF NOT EXISTS idx_preanesthesia_forms_form_type 
ON preanesthesia_forms(form_type);

-- 6. Vérifier les données existantes
SELECT form_type, COUNT(*) as count
FROM preanesthesia_forms 
GROUP BY form_type
ORDER BY form_type;
