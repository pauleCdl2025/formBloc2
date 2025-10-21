-- Script de vérification complète de toutes les tables
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier l'existence de toutes les tables
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'consultation_preanesthesique',
            'surveillance_sspi', 
            'compte_rendu_preanesthesique',
            'consentement_anesthesique'
        ) THEN 'EXISTE'
        ELSE 'MANQUANTE'
    END as statut
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'consultation_preanesthesique',
    'surveillance_sspi', 
    'compte_rendu_preanesthesique',
    'consentement_anesthesique'
)
ORDER BY table_name;

-- 2. Vérifier la structure des tables existantes
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN (
    'consultation_preanesthesique',
    'surveillance_sspi', 
    'compte_rendu_preanesthesique',
    'consentement_anesthesique'
)
ORDER BY table_name, ordinal_position;

-- 3. Vérifier les index
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN (
    'consultation_preanesthesique',
    'surveillance_sspi', 
    'compte_rendu_preanesthesique',
    'consentement_anesthesique'
)
ORDER BY tablename, indexname;

-- 4. Vérifier les politiques RLS
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
WHERE schemaname = 'public' 
AND tablename IN (
    'consultation_preanesthesique',
    'surveillance_sspi', 
    'compte_rendu_preanesthesique',
    'consentement_anesthesique'
)
ORDER BY tablename, policyname;

-- 5. Vérifier le statut RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'consultation_preanesthesique',
    'surveillance_sspi', 
    'compte_rendu_preanesthesique',
    'consentement_anesthesique'
)
ORDER BY tablename;

-- 6. Compter les enregistrements dans chaque table
SELECT 'consultation_preanesthesique' as table_name, COUNT(*) as count FROM consultation_preanesthesique
UNION ALL
SELECT 'surveillance_sspi' as table_name, COUNT(*) as count FROM surveillance_sspi
UNION ALL
SELECT 'compte_rendu_preanesthesique' as table_name, COUNT(*) as count FROM compte_rendu_preanesthesique
UNION ALL
SELECT 'consentement_anesthesique' as table_name, COUNT(*) as count FROM consentement_anesthesique
ORDER BY table_name;
