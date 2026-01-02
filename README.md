# ✖️ Révise Tables

Application interactive et ludique pour aider les enfants à apprendre et réviser leurs tables de multiplication.

## 🚀 Fonctionnalités

- ✅ **Entraînement personnalisé** : Choix libre des tables à réviser
- 🎤 **Reconnaissance vocale** : Répondez en dictant le résultat en français
- 🏆 **Système de score** : Suivi des progrès avec célébrations
- 📱 **PWA** : Installation sur mobile/tablette, fonctionne hors ligne
- 🎨 **Interface colorée** : Design attractif pour les enfants
- ⚙️ **Mode debug** : Diagnostic de la reconnaissance vocale

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Générer les icônes PWA
npm run generate-icons

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build
```

## 🛠️ Technologies

- **React 18** : Framework UI
- **Vite** : Build tool rapide
- **PWA** : Application web progressive
- **Web Speech API** : Reconnaissance vocale

## 📱 PWA - Application Web Progressive

L'application peut être installée comme une app native sur :
- 📱 iOS (Safari)
- 🤖 Android (Chrome)
- 💻 Windows/Mac/Linux (Chrome, Edge, etc.)

### Installation sur mobile :
1. Ouvrir l'application dans le navigateur
2. Cliquer sur "Installer l'application"
3. L'app apparaît sur l'écran d'accueil
4. Fonctionne même sans connexion internet !

## 🎯 Utilisation

1. **Configuration** : Cliquez sur ⚙️ pour choisir les tables à réviser
2. **Répondre** :
   - Tapez la réponse au clavier
   - OU cliquez sur 🎤 pour dicter
3. **Validation** : Cliquez sur "Valider ✅" ou appuyez sur Entrée
4. **Score** : Obtenez 10/10 pour une célébration spéciale !

## 🔧 Configuration GitHub Actions

Le déploiement automatique est configuré pour pousser sur la branche `main` à chaque push sur `claude/react-github-actions-deploy-VkPkE`.

## 📄 Licence

MIT
