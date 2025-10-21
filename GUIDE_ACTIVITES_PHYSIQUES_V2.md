# Guide - Section Activités Physiques et Conditions Cardiaques (Version 2)

## Vue d'ensemble

Les sections **Activités physiques** et **Conditions cardiaques** ont été entièrement repensées pour offrir une interface plus professionnelle et simplifiée, correspondant aux standards médicaux modernes avec une approche plus pratique et intuitive.

## Améliorations apportées

### 🏃‍♂️ Section Activités Physiques (Version 2)

#### Interface utilisateur simplifiée
- **Titre professionnel** : "Activités physiques" avec soulignement
- **Tableau MET simplifié** : Version condensée avec 3 catégories principales
- **Question directe** : "Quel est le niveau d'activité physique du patient ?"
- **Boutons radio** : Sélection simple entre 3 niveaux MET
- **Champ commentaires** : Pour détails supplémentaires

#### Tableau des MET simplifié

**Structure du tableau :**
- **Colonnes** : MET | Activité
- **3 catégories principales** :

| MET | Activité |
|-----|----------|
| < 4 MET | Se laver, s'habiller, marcher sur terrain plat, faire la cuisine, passer l'aspirateur |
| 4-7 MET | Monter un étage, marcher en pente, jardinage, golf, danse, natation |
| > 7 MET | Courir, tennis, football, ski, sports de combat |

#### Question sur le niveau d'activité
- **3 options de boutons radio** :
  - < 4 MET
  - 4-7 MET
  - > 7 MET
- **Sélection unique** : Un seul niveau peut être sélectionné
- **Interface claire** : Boutons radio avec labels explicites

#### Fonctionnalités
- **Champ commentaires** : Textarea pour détails supplémentaires
- **Sauvegarde automatique** : Intégration avec localStorage
- **Export/Import** : Compatible avec le système JSON

### ❤️ Section Conditions Cardiaques (Version 2)

#### Interface utilisateur détaillée
- **Titre professionnel** : "Conditions cardiaques" avec soulignement
- **7 critères spécifiques** : Chaque critère avec options "Non" et "Oui"
- **Champ "Autres"** : Avec saisie conditionnelle pour spécifier

#### Critères cardiaques inclus

1. **Angor instable**
2. **Infarctus du myocarde récent (< 3 mois)**
3. **Insuffisance cardiaque décompensée**
4. **Arythmie grave**
5. **Valvulopathie sévère**
6. **HTA non contrôlée**
7. **Autres** (avec champ de spécification)

#### Fonctionnalités
- **Sélection binaire** : Non/Oui pour chaque critère
- **Champ conditionnel** : "Préciser" apparaît si "Autres" = Oui
- **Layout professionnel** : Labels à gauche, boutons à droite
- **Sauvegarde automatique** : Intégration complète

## Structure des données

### Activités Physiques
```typescript
activitesPhysiques: {
  niveauActivite: string;    // '< 4 MET' | '4-7 MET' | '> 7 MET'
  commentaires: string;      // Détails supplémentaires
};
```

### Conditions Cardiaques
```typescript
cardiaques: {
  angorInstable: boolean;
  infarctusRecent: boolean;
  insuffisanceCardiaqueDecompensee: boolean;
  arythmieGrave: boolean;
  valvulopathieSevere: boolean;
  htaNonControlee: boolean;
  autres: boolean;
  autresDetails: string;     // Spécification si autres = true
};
```

## Utilisation

### Pour les Activités Physiques
1. **Consulter le tableau** : Référencer les exemples d'activités par niveau MET
2. **Sélectionner le niveau** : Choisir le niveau approprié avec les boutons radio
3. **Ajouter des commentaires** : Utiliser le champ commentaires pour des détails

### Pour les Conditions Cardiaques
1. **Évaluer chaque critère** : Répondre Non/Oui pour chaque condition
2. **Spécifier si nécessaire** : Utiliser le champ "Préciser" si "Autres" = Oui
3. **Validation complète** : S'assurer que tous les critères sont évalués

## Avantages de la Version 2

### Simplicité
- **Interface épurée** : Moins d'informations visuelles, plus de clarté
- **Tableau condensé** : 3 catégories au lieu de 15+ activités individuelles
- **Sélection directe** : Boutons radio pour choix rapide

### Praticité
- **Évaluation rapide** : Question directe sur le niveau d'activité
- **Critères spécifiques** : Conditions cardiaques précises et médicalement pertinentes
- **Flexibilité** : Champ "Autres" pour cas particuliers

### Conformité médicale
- **Standards MET** : Classification reconnue internationalement
- **Critères cardiaques** : Basés sur les guidelines d'évaluation pré-opératoire
- **Documentation complète** : Facilite le suivi et l'analyse

## Intégration

Ces sections s'intègrent parfaitement dans le flux de travail de la consultation pré-anesthésique, situées après les sections RGO, Tabac, Hépatite et Alcool, et avant la section Stimulateur cardiaque.

---

*Cette version 2 améliore significativement l'ergonomie et l'efficacité de l'évaluation des capacités fonctionnelles et des risques cardiaques des patients.*





