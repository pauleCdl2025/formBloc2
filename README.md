## Supabase configuration

Create a project on Supabase, then create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Table schema suggestion (SQL):

```sql
create table preanesthesia_forms (
  id uuid primary key default gen_random_uuid(),
  patient_number text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create unique index on preanesthesia_forms(patient_number);
```

Grant access via Row Level Security as needed.

# Masque de Consultation Pré-Anesthésique

Application web pour la gestion des consultations pré-anesthésiques au Centre Diagnostic de Libreville.

## 🎨 Identité Visuelle

L'application intègre le **logo officiel du Centre Diagnostic de Libreville** et respecte sa charte graphique avec une palette de couleurs professionnelle en bleu cyan (#0ea5e9) et bleu foncé (#1e3a8a).

## 🚀 Fonctionnalités

- **Identité visuelle** : Logo officiel et couleurs du Centre Diagnostic de Libreville
- **Formulaire complet** : Collecte exhaustive des informations patient, antécédents médicaux, chirurgicaux et examens
- **Scores cliniques automatiques** :
  - Score STOP-BANG (apnée du sommeil)
  - Score d'Apfel (nausées/vomissements post-opératoires)
  - Score de Lee (risque cardiovasculaire péri-opératoire)
  - Calcul automatique de l'IMC
  - Calcul automatique de l'âge
- **Sauvegarde automatique** : Les données sont automatiquement sauvegardées dans le navigateur
- **Import/Export** : Exportation et importation des données au format JSON
- **Impression optimisée** : Mise en page adaptée pour l'impression professionnelle
- **Interface moderne** : Design responsive avec Tailwind CSS

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. Clonez le dépôt ou téléchargez les fichiers du projet

2. Installez les dépendances :
```bash
npm install
```

## 🚦 Démarrage

### Mode développement

Lancez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Construction pour la production

Créez une version optimisée pour la production :
```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

### Prévisualisation de la production

Pour prévisualiser la version de production :
```bash
npm run preview
```

## 📖 Utilisation

### Remplir le formulaire

1. **Informations Patient** : Saisissez les données démographiques du patient
2. **Intervention** : Renseignez les détails de l'intervention chirurgicale
3. **Antécédents** : Cochez et documentez tous les antécédents médicaux pertinents
4. **Scores automatiques** : Les scores cliniques sont calculés automatiquement
5. **Examens** : Indiquez les examens paracliniques réalisés

### Sauvegarder les données

- **Sauvegarde automatique** : Le formulaire sauvegarde automatiquement après 1 seconde d'inactivité
- **Sauvegarde manuelle** : Cliquez sur le bouton "Sauvegarder"
- **Export JSON** : Exportez les données dans un fichier JSON pour archivage

### Importer des données

1. Cliquez sur "Importer"
2. Sélectionnez un fichier JSON précédemment exporté
3. Les données seront automatiquement chargées dans le formulaire

### Imprimer le formulaire

1. Remplissez le formulaire complètement
2. Cliquez sur "Imprimer"
3. Le document sera formaté pour une impression professionnelle

### Réinitialiser le formulaire

Cliquez sur "Réinitialiser" pour effacer toutes les données et recommencer (confirmation requise).

## 🏗️ Structure du projet

```
masque/
├── src/
│   ├── App.tsx                    # Composant principal
│   ├── PreAnesthesiaForm.tsx      # Formulaire de consultation
│   ├── main.tsx                   # Point d'entrée de l'application
│   └── index.css                  # Styles globaux et Tailwind
├── index.html                     # Template HTML
├── package.json                   # Dépendances du projet
├── tsconfig.json                  # Configuration TypeScript
├── vite.config.ts                 # Configuration Vite
├── tailwind.config.js             # Configuration Tailwind CSS
├── postcss.config.js              # Configuration PostCSS
└── README.md                      # Ce fichier
```

## 🎨 Technologies utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **LocalStorage** - Persistance des données côté client

## 📊 Scores cliniques inclus

### Score STOP-BANG
Évalue le risque d'apnée obstructive du sommeil :
- Score ≥ 3 : Risque élevé nécessitant oxymétrie nocturne/polysomnographie

### Score d'Apfel
Prédit le risque de nausées et vomissements post-opératoires :
- 0 facteur : ~10% de risque
- 1 facteur : ~20% de risque
- 2 facteurs : ~40% de risque
- 3 facteurs : ~60% de risque
- 4 facteurs : ~80% de risque

### Score de Lee
Évalue le risque cardiovasculaire péri-opératoire :
- 0 facteur : 0.4% de risque
- 1 facteur : 1% de risque
- 2 facteurs : 2.4% de risque
- ≥3 facteurs : ≥5.4% de risque

## 🔒 Sécurité et confidentialité

- **Stockage local uniquement** : Les données sont stockées dans le navigateur du poste de travail
- **Aucun serveur distant** : Aucune donnée n'est transmise à des serveurs externes
- **Export sécurisé** : Les données exportées restent sous contrôle de l'utilisateur

## 📝 Licence

Ce projet est destiné au Centre Diagnostic de Libreville.

## 👥 Support

Pour toute question ou problème, veuillez contacter l'équipe de développement.

## 🔄 Mises à jour futures possibles

- [ ] Connexion à une base de données
- [ ] Génération de PDF directement depuis l'application
- [ ] Système de gestion multi-utilisateurs
- [ ] Historique des consultations
- [ ] Statistiques et rapports
- [ ] Intégration avec systèmes hospitaliers existants

---

**Version**: 1.0.0  
**Date**: Octobre 2025  
**Centre Diagnostic de Libreville**

