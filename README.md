# Task Flow

> Un outil personnel de gestion de projets et de tâches, conçu pour organiser mes projets personnels et mes collaborations.

## 🎯 Le problème que je voulais résoudre

En tant que développeur, je jongle constamment entre plusieurs projets : des projets personnels d'apprentissage, des collaborations avec d'autres développeurs, et parfois des tâches professionnelles. 

Je n'avais pas d'outil simple et adapté pour :
- **Suivre l'avancement** de mes projets personnels sans me perdre dans des tableurs ou des notes éparpillées.
- **Collaborer** avec d'autres personnes sur des projets communs, en leur donnant accès uniquement aux projets concernés.
- **Garder une trace** des solutions apportées à chaque tâche (un problème résolu, une fonctionnalité implémentée), pour ne pas répéter les mêmes erreurs.

J'ai donc développé **Task Flow**, une application web sur mesure qui répond exactement à ces besoins. Ce n'est pas un outil SaaS générique, mais une solution que j'ai pensée pour mon propre flux de travail.

## ✨ Fonctionnalités principales

- **Authentification sécurisée** : Connexion via email ou Google (avec Clerk).
- **Gestion de projets** : Création, suppression et suivi de l'avancement des projets.
- **Collaboration simplifiée** : Chaque projet génère un code d'invitation unique pour permettre à d'autres personnes de rejoindre en tant que collaborateurs.
- **Gestion des tâches** : 
  - Création de tâches avec un éditeur de texte riche (React Quill) pour les descriptions (support du code, des images, des liens).
  - Assignation obligatoire à un collaborateur.
  - Filtres avancés (Tous, À faire, En cours, Finis, Vos tâches).
- **Workflow de clôture** : Lorsqu'une tâche est terminée, l'assigné doit fournir une solution (texte riche). Le statut est ensuite verrouillé et la solution est archivée.
- **Interface responsive** : Optimisée pour mobile, tablette et desktop.
- **Notifications** : Feedback utilisateur en temps réel via des toasts.

## 🛠️ Stack technique

Ce projet m'a permis d'explorer et de maîtriser une stack moderne et complète :

### Frontend
- **Next.js 16** (App Router, Turbopack) - Framework React fullstack.
- **TypeScript** - Typage statique pour un code robuste.
- **Tailwind CSS v4** - Framework CSS utilitaire.
- **DaisyUI v5** - Composants UI (thème personnalisé bleu).
- **Lucide React** - Icônes.

### Backend & Base de données
- **Prisma 6** (ORM) - Modélisation et interactions avec la base de données.
- **PostgreSQL** (via Neon) - Base de données relationnelle pour la production (SQLite en développement).
- **Server Actions** - Mutations de données côté serveur de manière sécurisée.

### Authentification & Sécurité
- **Clerk** - Authentification complète (email + Google OAuth), protection des routes via middleware (`proxy.ts`).

### Éditeur & Notifications
- **React Quill New** - Éditeur de texte riche avec toolbar personnalisée (code, image, lien, etc.).
- **React Toastify** - Notifications élégantes.

## 🚀 Lancer le projet en local

### Prérequis
- Node.js (v20+)
- npm ou pnpm

### Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/ton-compte/task-flow.git
   cd task-flow
Installer les dépendances :

bash
npm install
Configurer les variables d'environnement :
Crée un fichier .env à la racine et remplis les variables suivantes :

env
# Clerk (clés de développement)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Base de données (SQLite pour le développement local)
DATABASE_URL="file:./dev.db"
Initialiser la base de données :

bash
npx prisma migrate dev
Lancer le serveur de développement :

bash
npm run dev
Ouvrir http://localhost:3000 dans le navigateur.

📁 Structure du projet
text
taskflow/
├── prisma/               # Schéma et migrations de la base de données
├── public/               # Assets statiques (images, illustrations)
├── src/
│   ├── actions/          # Server Actions (Prisma)
│   ├── app/              # Pages et layouts (App Router)
│   │   ├── (protected)/  # Routes protégées (avec NavBar)
│   │   ├── sign-in/      # Page de connexion
│   │   └── sign-up/      # Page d'inscription
│   ├── components/       # Composants React réutilisables
│   ├── lib/              # Utilitaires (Prisma client, config Clerk)
│   └── proxy.ts          # Middleware Next.js 16
├── .env                  # Variables d'environnement (non versionné)
├── next.config.ts        # Configuration Next.js
└── package.json
🎓 Ce que j'ai appris
Ce projet m'a permis de consolider mes compétences sur :

L'architecture Next.js App Router (Server/Client Components, layouts imbriqués).

Les Server Actions pour interagir avec une base de données sans API Routes.

La modélisation de données avec Prisma (relations Many-to-Many, Cascade).

L'intégration de Clerk pour une authentification robuste.

La création d'un éditeur de texte riche (React Quill) et sa personnalisation.

Le déploiement sur Vercel avec une base PostgreSQL.


🤝 Contact
Développeur : LOGA BENJAMIN EMMANUEL

GitHub : https://github.com/loga17

LinkedIn : https://www.linkedin.com/in/loga-benjamin-58850b444/