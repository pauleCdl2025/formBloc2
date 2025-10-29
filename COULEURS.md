# 🎨 Charte Graphique - Centre Diagnostic de Libreville

## Logo Officiel

Le logo du Centre Diagnostic de Libreville est accessible à :
```
https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png
```

## Palette de Couleurs

### Couleurs Principales

#### Bleu Principal (Titres et Navigation)
- **Hex**: `#1e3a8a`
- **RGB**: rgb(30, 58, 138)
- **Utilisation**: Titres de sections, textes importants

#### Bleu Cyan (Boutons et Actions)
- **Hex**: `#0ea5e9`
- **RGB**: rgb(14, 165, 233)
- **Utilisation**: Boutons, liens, éléments interactifs
- **Hover**: `#0284c7` (rgb(2, 132, 199))

### Couleurs Secondaires

#### Vert (Succès et Impression)
- **Hex**: `#10b981`
- **RGB**: rgb(16, 185, 129)
- **Utilisation**: Bouton d'impression, messages de succès
- **Hover**: `#059669` (rgb(5, 150, 105))

#### Cyan Clair (Arrière-plans)
- **Nom Tailwind**: `cyan-50`
- **Utilisation**: Arrière-plans des sections importantes

### Couleurs de Scores

#### Violet (Score STOP-BANG)
- **Texte**: `purple-900`
- **Bordure**: `purple-200`
- **Fond**: `purple-50`

#### Vert (Score d'Apfel)
- **Texte**: `green-900`
- **Bordure**: `green-200`
- **Fond**: `green-50`

#### Rouge (Score de Lee)
- **Texte**: `red-900`
- **Bordure**: `red-200`
- **Fond**: `red-50`

#### Orange (Douleurs Postop)
- **Texte**: `orange-900`
- **Bordure**: `orange-200`
- **Fond**: `orange-50`

### Couleurs Neutres

#### Gris (Textes et Bordures)
- **Texte principal**: `gray-700`
- **Texte secondaire**: `gray-600`
- **Bordures**: `gray-300`
- **Fond**: `gray-50`

#### Blanc
- **Fond principal**: `white`

## Utilisation dans le Code

### Boutons Principaux
```tsx
className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
```

### Titres de Sections
```tsx
className="text-[#1e3a8a] border-b-2 border-[#0ea5e9]"
```

### Champs de Formulaire (Focus)
```tsx
className="focus:ring-[#0ea5e9]"
```

### Checkboxes
```tsx
className="text-[#0ea5e9] focus:ring-[#0ea5e9]"
```

## Accessibilité

- ✅ Contraste AA conforme WCAG 2.1
- ✅ Couleurs distinctes pour daltoniens
- ✅ Texte lisible sur tous les fonds

## Design System

### Espacement
- **Petit**: 4px (gap-1)
- **Moyen**: 8px (gap-2)
- **Grand**: 16px (gap-4)

### Bordures
- **Radius**: 6px (rounded-md)
- **Épaisseur titres**: 2px
- **Épaisseur champs**: 1px

### Ombres
- **Boutons**: `shadow-md`
- **Cartes**: `shadow-lg`

## Impression

### Couleurs d'Impression
Les couleurs sont optimisées pour l'impression avec :
```css
print-color-adjust: exact;
-webkit-print-color-adjust: exact;
```

Cela garantit que les couleurs du logo et des sections importantes sont bien imprimées.

---

**Dernière mise à jour**: Octobre 2025  
**Version**: 1.0.0










