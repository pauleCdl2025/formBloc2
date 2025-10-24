# 🔧 Guide de Dépannage

## ❌ Problème : "localhost refused to connect"

### Solutions Rapides

#### Solution 1 : Vérifier que le serveur est lancé

1. **Ouvrez un nouveau terminal** (PowerShell ou CMD)
2. **Naviguez vers le dossier** :
   ```bash
   cd C:\Users\surface\Documents\masque
   ```
3. **Lancez le serveur** :
   ```bash
   npm run dev
   ```
4. **Attendez le message** qui affichera l'URL (généralement `http://localhost:5173`)
5. **Copiez l'URL exacte** et ouvrez-la dans votre navigateur

#### Solution 2 : Utiliser le script Windows

1. **Double-cliquez** sur `START.bat` dans le dossier du projet
2. **Attendez** que la fenêtre affiche "Local: http://localhost:5173"
3. **Ouvrez votre navigateur** et allez à cette adresse

#### Solution 3 : Vérifier les ports

Si le port 5173 est occupé :

```bash
# Arrêter tous les processus Node.js
taskkill /F /IM node.exe

# Relancer le serveur
npm run dev
```

#### Solution 4 : Réinstaller les dépendances

```bash
# Supprimer node_modules
rmdir /s /q node_modules

# Réinstaller
npm install

# Relancer
npm run dev
```

#### Solution 5 : Utiliser un port différent

Si le port 5173 ne fonctionne pas, essayez :

```bash
npm run dev -- --port 3000
```

Puis ouvrez : `http://localhost:3000`

### Vérifications à Faire

✅ **Node.js est installé ?**
```bash
node --version
# Devrait afficher : v16.x.x ou supérieur
```

✅ **npm est installé ?**
```bash
npm --version
# Devrait afficher : 8.x.x ou supérieur
```

✅ **Les dépendances sont installées ?**
```bash
# Vérifier si node_modules existe
dir node_modules
```

✅ **Aucun antivirus ne bloque ?**
- Vérifiez que votre antivirus n'bloque pas Node.js
- Ajoutez une exception si nécessaire

✅ **Le firewall ne bloque pas ?**
- Autorisez Node.js dans le pare-feu Windows

### Messages d'Erreur Courants

#### "Cannot find module"
```bash
npm install
```

#### "EADDRINUSE" (port déjà utilisé)
```bash
# Tuer le processus sur le port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Ou utiliser un autre port
npm run dev -- --port 3001
```

#### "npm command not found"
- Node.js n'est pas installé
- Téléchargez depuis : https://nodejs.org

### Test Complet

Exécutez ces commandes dans l'ordre :

```bash
# 1. Vérifier Node.js
node --version

# 2. Vérifier npm
npm --version

# 3. Se placer dans le bon dossier
cd C:\Users\surface\Documents\masque

# 4. Installer les dépendances (si nécessaire)
npm install

# 5. Lancer le serveur
npm run dev
```

### Résultat Attendu

Vous devriez voir quelque chose comme :

```
  VITE v5.0.8  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Accès à l'Application

Une fois le serveur lancé :

1. **Copiez l'URL** affichée (ex: `http://localhost:5173`)
2. **Ouvrez votre navigateur** (Chrome, Edge, Firefox)
3. **Collez l'URL** dans la barre d'adresse
4. **Appuyez sur Entrée**

L'application devrait s'afficher ! 🎉

### Toujours des Problèmes ?

#### Essayez la version build

Au lieu du serveur de développement, créez une version statique :

```bash
# Compiler l'application
npm run build

# Lancer la preview
npm run preview
```

Puis ouvrez l'URL affichée.

### Support Navigateur

Navigateurs supportés :
- ✅ Chrome / Edge (Chromium) - **Recommandé**
- ✅ Firefox
- ✅ Safari
- ❌ Internet Explorer (non supporté)

### Logs de Débogage

Pour voir plus de détails :

```bash
# Mode verbose
npm run dev --verbose

# Ou avec debug
set DEBUG=vite:*
npm run dev
```

### Alternative : Mode Production

Si le mode développement ne fonctionne pas :

```bash
# 1. Compiler
npm run build

# 2. Aller dans le dossier dist
cd dist

# 3. Utiliser un serveur HTTP simple
# Option A: Si vous avez Python
python -m http.server 8000

# Option B: Installer serve
npm install -g serve
serve -s . -p 8000
```

Puis ouvrez : `http://localhost:8000`

### Checklist Finale

- [ ] Node.js version 16+ installé
- [ ] npm install exécuté avec succès
- [ ] Aucun message d'erreur dans le terminal
- [ ] Le serveur affiche une URL
- [ ] Le navigateur peut accéder à cette URL
- [ ] Aucun pare-feu/antivirus ne bloque

### Contact

Si le problème persiste après avoir essayé toutes ces solutions :
1. Notez le message d'erreur exact
2. Prenez une capture d'écran du terminal
3. Contactez le support technique

---

**Astuce** : Dans 99% des cas, le problème vient de :
1. Le serveur n'est pas lancé (`npm run dev` pas exécuté)
2. Mauvaise URL (vérifiez l'URL exacte affichée par Vite)
3. Port différent (Vite utilise parfois 5174 si 5173 est occupé)








