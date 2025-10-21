# Guide - Section Activités Physiques et Conditions Cardiaques

## Vue d'ensemble

Les sections **Activités physiques** et **Cardiaques** ont été entièrement repensées pour offrir une interface plus professionnelle et détaillée, correspondant aux standards médicaux modernes.

## Améliorations apportées

### 🏃‍♂️ Section Activités Physiques

#### Interface utilisateur
- **Titre professionnel** : "Activités physiques :" avec style cohérent
- **Champ de saisie principal** : Textarea avec bordure verte et fond vert clair
- **Instructions claires** : Deux points d'information sur l'utilisation des MET
- **Tableau complet** : Classification détaillée des activités par intensité

#### Tableau des MET (Metabolic Equivalent of Task)

**Activités d'intensité légère (< 3 MET)**
- Dormir : 0.9 MET
- Regarder la télévision : 1.0 MET
- Écrire à la main ou à l'ordinateur : 1.8 MET
- Marche à 2,7 km/h, sans pente : 2.3 MET
- Marche à 4 km/h : 2.9 MET

**Activités d'intensité modérée (3 à 6 MET)**
- Vélo stationnaire, 50 W, effort très léger : 3.0 MET
- Marche à 4,8 km/h : 3.3 MET
- Exercices à la maison (général), effort léger ou modéré : 3.5 MET
- Marche à 5,4 km/h : 3.6 MET
- Vélo de plaisance, <16 km/h : 4.0 MET
- Vélo stationnaire, 100 W, effort léger : 5.5 MET

**Activités intenses (> 6 MET)**
- Course à pied, général : 7 MET
- Pompes, redressements assis, effort élevé : 8 MET
- Course à pied, sur place : 8 MET
- Saut à la corde : 10 MET
- Course à pied, >17,5 km/h : 18 MET

#### Fonctionnalités
- **Champ MET séparé** : Pour saisie directe de la valeur calculée
- **Code couleur** : Lignes alternées pour améliorer la lisibilité
- **Catégories colorées** : Bleu pour léger, jaune pour modéré, rouge pour intense

### ❤️ Section Cardiaques

#### Interface utilisateur
- **Titre formaté** : "- Cardiaques :" avec style cohérent
- **Champ de saisie principal** : Textarea avec bordure verte et fond vert clair
- **Liste des conditions** : Affichage visuel des conditions courantes
- **Checkbox de confirmation** : Pour valider la présence d'antécédents

#### Conditions cardiaques courantes
- **angor** (angine de poitrine)
- **troubles du rythme**
- **dyspnée** (difficultés respiratoires)
- **syncope** (perte de connaissance)
- **présence d'un stimulateur cardiaque**

#### Fonctionnalités
- **Indicateurs visuels** : Points rouges pour marquer chaque condition
- **Layout en grille** : Organisation claire des conditions
- **Sauvegarde automatique** : Intégration avec le système de persistance

## Structure des données

```typescript
activitesPhysiques: {
  met: string;      // Valeur MET calculée
  details: string;  // Description des activités
};

cardiaques: {
  presente: boolean; // Présence d'antécédents
  details: string;   // Détails des conditions
};
```

## Utilisation

### Pour les Activités Physiques
1. **Décrire les activités** : Utiliser le champ principal pour décrire les activités du patient
2. **Consulter le tableau** : Référencer les valeurs MET selon l'activité
3. **Saisir le MET calculé** : Entrer la valeur finale dans le champ "MET calculé"

### Pour les Conditions Cardiaques
1. **Décrire les conditions** : Utiliser le champ principal pour détailler les conditions
2. **Consulter la liste** : Référencer les conditions courantes affichées
3. **Cocher si présent** : Utiliser la checkbox pour confirmer la présence d'antécédents

## Avantages

- **Évaluation précise** : Tableau MET complet pour une évaluation objective
- **Interface intuitive** : Design clair et organisé
- **Référence rapide** : Conditions courantes facilement accessibles
- **Données structurées** : Facilite l'analyse et le suivi
- **Conformité médicale** : Respecte les standards d'évaluation pré-anesthésique

## Intégration

Ces sections s'intègrent parfaitement dans le flux de travail de la consultation pré-anesthésique, situées après les sections RGO, Tabac, Hépatite et Alcool, et avant la section Stimulateur cardiaque.

---

*Ces améliorations contribuent à rendre l'application plus professionnelle et conforme aux exigences médicales modernes pour l'évaluation des capacités fonctionnelles des patients.*





