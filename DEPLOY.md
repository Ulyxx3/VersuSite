# Guide de Déploiement GitHub Pages

## Prérequis

Assurez-vous que Node.js et npm sont installés et accessibles dans votre terminal.

## Étapes de Déploiement

### 1. Installer gh-pages (Première fois seulement)

```bash
npm install --save-dev gh-pages
```

### 2. Déployer le site

```bash
npm run deploy
```

Cette commande va :
1. Build le projet avec Vite (`vite build`)
2. Déployer le dossier `dist` vers la branche `gh-pages`

### 3. Configuration GitHub (si ce n'est pas déjà fait)

1. Allez sur votre repository GitHub
2. Settings > Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages` > `/ (root)`
5. Save

## URL du Site

Votre site sera accessible à :
**https://ulyxx3.github.io/VersuSite/**

## Commandes Utiles

```bash
# Développement local
npm run dev

# Build seulement (sans deploy)
npm run build

# Preview du build
npm run preview

# Deploy vers GitHub Pages
npm run deploy
```

## Notes

- Le `base: '/VersuSite/'` est déjà configuré dans `vite.config.js`
- Chaque fois que vous voulez mettre à jour le site en ligne, lancez simplement `npm run deploy`
- Le déploiement prend généralement 1-2 minutes pour être visible
