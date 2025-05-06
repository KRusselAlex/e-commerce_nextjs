![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)


# 🛍️ E-Commerce Platform with Next.js, MongoDB, Momo & Orange Money

## 📖 Description

Ce projet est une plateforme e-commerce moderne développée avec **Next.js**.  
Elle offre une expérience d’achat fluide, avec intégration des paiements via **Momo** et **Orange Money**, et une interface responsive grâce à **Tailwind CSS**.

---

## 🚀 Fonctionnalités

- 🏬 Catalogue de produits avec détails
- 🔍 Recherche et filtrage de produits
- 🛒 Panier d’achat avec gestion des quantités
- 👤 Authentification utilisateur (inscription, connexion, déconnexion)
- 💳 Paiements intégrés via Momo / Orange Money
- 📦 Suivi et historique des commandes
- 💬 Design responsive (mobile, tablette, desktop)
- ⚡ Performances optimales avec Next.js (SSR & SSG)
- 🔐 Routes protégées pour les utilisateurs connectés

---

## 🛠️ Technologies utilisées

- **Next.js** (React framework)
- **Tailwind CSS** pour le design
- **MongoDB** comme base de données
- **Momo / Orange Money APIs** pour les paiements
- **Zustand / Context API** pour la gestion d’état
- **NextAuth.js** (ou autre) pour l’authentification
- **Next.js API routes** pour les endpoints backend

---

## 📦 Installation

1. Cloner le projet :
   ```bash
   git clone https://github.com/KRusselAlex/e-commerce_nextjs.git
    ````

2. Installer les dépendances :

   ```bash
   cd e-commerce_nextjs
   npm install
   ```

3. Configurer les variables d’environnement (`.env.local`) :

   ```
   MONGODB_URI=ta_uri_mongodb
   NEXTAUTH_SECRET=ton_secret
   MOMO_API_KEY=ta_cle_momo
   ORANGE_MONEY_API_KEY=ta_cle_orange_money
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

5. Accéder à [http://localhost:3000](http://localhost:3000).

---

## 📂 Structure du projet

```
/components         → Composants réutilisables
/pages             → Pages Next.js
/styles           → Styles globaux et config Tailwind
/store            → Gestion d’état (Zustand / Redux)
/utils            → Fonctions utilitaires
/public           → Assets statiques (images, icônes)
```

---

## 📜 Scripts disponibles

* `npm run dev` → Lancer en mode développement
* `npm run build` → Générer la version production
* `npm run start` → Démarrer en production

---

## 💡 Améliorations futures

* Ajout d’avis et de notes produits
* Tableau de bord admin
* Notifications par email
* Optimisation SEO et accessibilité

---

## 🤝 Contribuer

Les contributions sont les bienvenues !
Pour les changements majeurs, ouvre une issue pour en discuter.

---

## 📄 Licence

Projet sous licence [MIT](LICENSE).


### .ENV
```
# Base de données MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# Authentification (par exemple avec NextAuth.js)
NEXTAUTH_SECRET=ton_secret_ultra_complexe

# Clés API Momo
MOMO_API_KEY=ta_cle_api_momo
MOMO_API_SECRET=ton_secret_momo
MOMO_API_URL=https://sandbox.momodeveloper.mtn.com

# Clés API Orange Money
ORANGE_MONEY_API_KEY=ta_cle_api_orange_money
ORANGE_MONEY_SECRET=ton_secret_orange_money
ORANGE_MONEY_URL=https://api-sandbox.orange.com

# URL publique de ton site
NEXT_PUBLIC_API_URL=http://localhost:3000


```
