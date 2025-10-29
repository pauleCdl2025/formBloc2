# Guide - Section Hémostase

## Vue d'ensemble

La section **Hémostase** a été entièrement repensée pour offrir une interface plus professionnelle et détaillée, correspondant aux standards médicaux modernes.

## Améliorations apportées

### Interface utilisateur

- **Titre souligné** : "Hémostase" avec style professionnel
- **11 critères spécifiques** : Chaque critère dispose d'options "Non" et "Oui" avec des boutons radio
- **Layout optimisé** : Alignement professionnel avec labels à gauche et options à droite
- **Couleurs cohérentes** : Utilisation de la palette de couleurs du logo (bleu cyan #0ea5e9)

### Critères d'hémostase inclus

1. **Saignement post-opératoire ou post-traumatique**
2. **Hémorragie après extraction dentaire**
3. **Antécédents d'hématurie inexpliquée**
4. **Ecchymoses anormales, pétéchies**
5. **Maladie hépatique ou hématologique**
6. **Epistaxis**
7. **Ménorragies**
8. **Gingivorragies**
9. **Antécédents familiaux hémorragiques**
10. **Anémie, carence de fer**
11. **Transfusions**

### Structure des données

```typescript
hemostase: {
  saignementPostOp: boolean;
  hemorragieExtractionDentaire: boolean;
  hematurieInexpliquee: boolean;
  ecchymosesAnormales: boolean;
  maladieHepatiqueHematologique: boolean;
  epistaxis: boolean;
  menorragies: boolean;
  gingivorragies: boolean;
  antecedentsFamiliauxHemorrhagiques: boolean;
  anemieCarenceFer: boolean;
  transfusions: boolean;
}
```

### Fonctionnalités

- **Sélection binaire** : Chaque critère permet une sélection claire Non/Oui
- **Sauvegarde automatique** : Les données sont automatiquement sauvegardées dans le localStorage
- **Export/Import** : Compatible avec l'export JSON et l'import de données
- **Impression** : Optimisée pour l'impression avec styles adaptés

## Utilisation

1. **Sélection des critères** : Cliquer sur "Non" ou "Oui" pour chaque critère d'hémostase
2. **Sauvegarde** : Les données sont automatiquement sauvegardées
3. **Export** : Utiliser le bouton "Exporter JSON" pour sauvegarder le formulaire
4. **Impression** : Utiliser le bouton "Imprimer" pour générer une version imprimable

## Avantages

- **Évaluation complète** : Couvre tous les aspects importants de l'hémostase
- **Interface intuitive** : Facile à utiliser pour les professionnels de santé
- **Données structurées** : Facilite l'analyse et le suivi
- **Conformité médicale** : Respecte les standards d'évaluation pré-anesthésique

## Intégration

Cette section s'intègre parfaitement dans le flux de travail de la consultation pré-anesthésique, située après les sections HTA, Diabète et Reins, et avant le questionnaire STOP-BANG.

---

*Cette amélioration contribue à rendre l'application plus professionnelle et conforme aux exigences médicales modernes.*









