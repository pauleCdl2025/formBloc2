# Guide de Démarrage Rapide

## Installation et Lancement (5 minutes)

### Étape 1 : Installer les dépendances
```bash
npm install
```

### Étape 2 : Lancer l'application
```bash
npm run dev
```

### Étape 3 : Ouvrir dans le navigateur
Ouvrez votre navigateur à l'adresse : **http://localhost:5173**

C'est tout ! L'application est prête à l'emploi.

---

## Utilisation Rapide

### 💾 Sauvegarde
- **Automatique** : Sauvegarde toutes les secondes
- **Manuelle** : Bouton "Sauvegarder" en bas du formulaire

### 📤 Export de données
1. Remplissez le formulaire
2. Cliquez sur "Exporter" en haut à droite
3. Un fichier JSON sera téléchargé

### 📥 Import de données
1. Cliquez sur "Importer" en haut à droite
2. Sélectionnez un fichier JSON précédemment exporté
3. Les données seront chargées automatiquement

### 🖨️ Impression
1. Remplissez le formulaire complètement
2. Cliquez sur "Imprimer"
3. Utilisez la boîte de dialogue d'impression de votre navigateur

### 🗑️ Réinitialiser
Cliquez sur "Réinitialiser" pour vider complètement le formulaire.

---

## Raccourcis Clavier

- **Ctrl + P** : Imprimer (raccourci navigateur)
- **Ctrl + S** : Sauvegarder (si implémenté)

---

## Scores Automatiques

L'application calcule automatiquement :

### 📊 IMC (Indice de Masse Corporelle)
Calculé dès que poids et taille sont renseignés

### 🛌 Score STOP-BANG
- **0-2** : Risque faible
- **≥3** : Risque élevé → Examens complémentaires recommandés

### 🤢 Score d'Apfel (NVPO)
- **0** : ~10% de risque
- **1** : ~20% de risque  
- **2** : ~40% de risque
- **3** : ~60% de risque
- **4** : ~80% de risque

### ❤️ Score de Lee (Risque cardio)
- **0** : 0.4% de risque
- **1** : 1% de risque
- **2** : 2.4% de risque
- **≥3** : ≥5.4% de risque

---

## Conseils d'Utilisation

### ✅ Bonnes Pratiques
- Remplissez tous les champs pertinents
- Vérifiez les scores automatiques
- Exportez régulièrement pour archivage
- Imprimez après validation complète

### ⚠️ À Éviter
- Ne fermez pas le navigateur sans exporter si vous voulez garder une copie externe
- Ne videz pas le cache du navigateur sans avoir exporté vos données
- N'utilisez pas plusieurs onglets simultanément (risque de conflit)

---

## Dépannage

### Le formulaire ne s'affiche pas
1. Vérifiez que `npm install` s'est bien déroulé
2. Relancez `npm run dev`
3. Vérifiez qu'aucun autre processus n'utilise le port 5173

### Les données ne se sauvegardent pas
1. Vérifiez que le stockage local est activé dans votre navigateur
2. Vérifiez que vous n'êtes pas en mode navigation privée
3. Exportez manuellement vos données en JSON

### L'impression ne fonctionne pas correctement
1. Utilisez Chrome ou Edge (meilleure compatibilité)
2. Vérifiez les paramètres d'impression (orientation portrait recommandée)
3. Activez "Imprimer les arrière-plans" dans les options d'impression

---

## Contact Support

Pour toute question technique, contactez l'équipe de développement.

**Version** : 1.0.0  
**Centre Diagnostic de Libreville**





