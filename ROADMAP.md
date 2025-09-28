### **Feuille de Route : Site de Recettes de Cuisine**

#### **Phase 0 : Initialisation et Configuration du Projet**

*   [ ] **1. Nettoyage du projet existant :** Supprimer les fichiers de démo (`+page.svelte`, `demo.spec.ts`, etc.) pour partir d'une base propre.
*   [ ] **2. Installation de Tailwind CSS :** Suivre la documentation officielle pour SvelteKit 5.
    *   [ ] Installer les dépendances : `tailwindcss`, `postcss`, `autoprefixer`.
    *   [ ] Créer les fichiers de configuration `tailwind.config.js` et `postcss.config.js`.
    *   [ ] Configurer le `tailwind.config.js` pour scanner les fichiers Svelte et TS.
    *   [ ] Importer les directives Tailwind dans `src/app.css`.
*   [ ] **3. Définition du Thème :**
    *   [ ] Dans `src/app.css`, définir les variables CSS pour le thème (couleurs, polices, espacements) afin de faciliter les ajustements.
        *   `--color-primary`: Vert forêt profond
        *   `--color-secondary`: Lila
        *   `--color-text`: Couleur de texte principal (très contrastée pour la lisibilité)
        *   `--color-background`: Couleur de fond
        *   `--font-family-headings`: Police pour les titres (élégante, lisible)
        *   `--font-family-body`: Police pour le corps du texte (très lisible)
*   [ ] **4. Configuration de Supabase :**
    *   [ ] Créer un nouveau projet sur Supabase.
    *   [ ] Récupérer les clés d'API (URL du projet et `anon key`).
    *   [ ] Les stocker de manière sécurisée dans les variables d'environnement SvelteKit (`.env` et `.env.example`). On utilisera les variables privées (`PRIVATE_SUPABASE_...`) pour le serveur.
*   [ ] **5. Création du client Supabase côté serveur :**
    *   [ ] Créer un helper dans `src/lib/server/supabase.ts` qui initialise le client Supabase en utilisant les variables d'environnement privées. Ce client ne sera jamais exposé au front-end.
*   [ ] **6. Sauvegarde de cette feuille de route :** Enregistrer ce plan dans `ROADMAP.md`.

#### **Phase 1 : Modélisation des Données et Schéma Supabase**

*   [ ] **1. Définition des types TypeScript :** Créer un fichier `src/lib/types.ts` pour centraliser toutes les interfaces de données.
    *   `Profile` (pour les admins/auteurs)
    *   `Recipe`
    *   `Ingredient`
    *   `Step`
    *   `Rating`
    *   `Category` (entrée, plat, dessert, etc.)
    *   `Tag` (végan, sans gluten, etc.)
*   [ ] **2. Création du schéma SQL pour Supabase :**
    *   [ ] Écrire les scripts SQL pour créer les tables, relations, et policies (Row Level Security).
        *   `profiles`: `id` (référence `auth.users`), `username`.
        *   `recipes`: `id`, `title`, `slug`, `author_id` (FK vers `profiles`), `preamble`, `prep_time`, `cook_time`, `difficulty`, `cost`, `servings`, etc.
        *   `ingredients`: `id`, `name`, `unit`.
        *   `recipe_ingredients`: table de liaison (`recipe_id`, `ingredient_id`, `quantity`).
        *   `steps`: `id`, `recipe_id`, `step_number`, `description`.
        *   `ratings`: `id`, `recipe_id`, `value` (1-5), `created_at`.
        *   `categories`, `tags`, et leurs tables de liaison avec `recipes`.
    *   [ ] Appliquer ce schéma dans l'éditeur SQL de Supabase.
    *   [ ] Configurer les RLS (Row Level Security) pour que la lecture soit publique mais l'écriture réservée aux admins authentifiés.

#### **Phase 2 : Développement du Backend (Logique Côté Serveur)**

*   [ ] **1. Authentification (Supabase Auth via le serveur) :**
    *   [ ] Créer des `+server.ts` pour gérer l'authentification. J'opte pour une connexion par **lien magique** (Magic Link), c'est plus simple et sécurisé pour un panel admin, et évite la gestion de mots de passe.
    *   [ ] `/api/auth/login` (POST) : Prend un email, utilise le client Supabase serveur pour envoyer le lien magique.
    *   [ ] `/api/auth/callback` (GET) : Gère le retour de l'utilisateur depuis le lien magique pour créer une session (cookie).
    *   [ ] `/api/auth/logout` (POST) : Déconnecte l'utilisateur et supprime le cookie de session.
    *   [ ] Créer un `src/hooks.server.ts` pour lire le cookie de session à chaque requête et injecter l'utilisateur dans `event.locals`.
*   [ ] **2. API des Recettes (Endpoints Serveur) :**
    *   [ ] `/api/recipes` (GET) : Endpoint pour la recherche, le tri et le filtrage. Il prendra des paramètres d'URL (`?q=...&sort=...`).
    *   [ ] `/api/recipes/[slug]` (GET) : Récupère une recette unique pour la page de détail.
    *   [ ] `/api/ratings/[recipe_id]` (POST) : Permet à un utilisateur (anonyme ou non) de soumettre une note.
*   [ ] **3. API d'Administration (Protégée) :**
    *   [ ] Créer un layout serveur `/src/routes/admin/+layout.server.ts` qui vérifiera si l'utilisateur est connecté. Si non, redirection vers `/connexion`.
    *   [ ] `/api/admin/recipes` (POST) : Crée une nouvelle recette.
    *   [ ] `/api/admin/recipes/[id]` (PUT) : Met à jour une recette existante.
    *   [ ] `/api/admin/recipes/[id]` (DELETE) : Supprime une recette.
*   [ ] **4. SEO & Pages Statiques :**
    *   [ ] `/sitemap.xml/+server.ts` : Génère dynamiquement le sitemap à partir des recettes en base de données.
    *   [ ] `/robots.txt/+server.ts` : Génère le fichier `robots.txt`.

#### **Phase 3 : Développement du Frontend (UI & Composants)**

*   [ ] **1. Composants de base :**
    *   [ ] Créer un dossier `src/lib/components` pour les composants réutilisables.
    *   [ ] `Button.svelte`, `Input.svelte`, `Header.svelte`, `Footer.svelte`, `SearchBar.svelte`, `RecipeCard.svelte`.
*   [ ] **2. Layout Principal :**
    *   [ ] `src/routes/+layout.svelte` : Définir la structure globale de la page (header, slot pour le contenu, footer).
    *   [ ] `src/routes/+layout.ts` : Charger les données globales (ex: session utilisateur) pour les rendre accessibles à toute l'application.
*   [ ] **3. Page d'Accueil (`/`) :**
    *   [ ] `+page.svelte` & `+page.server.ts`.
    *   [ ] Présenter une sélection de recettes (les dernières, les mieux notées).
    *   [ ] Design engageant et moderne, avec de grandes images et des titres clairs.
*   [ ] **4. Page de Connexion (`/connexion`) :**
    *   [ ] `+page.svelte` : Formulaire simple pour entrer l'email et recevoir le lien magique.
    *   [ ] Gérer l'état "email envoyé".
*   [ ] **5. Page de Résultat de Recherche (`/recherche`) :**
    *   [ ] `+page.svelte` & `+page.server.ts`.
    *   [ ] Afficher les filtres, les options de tri et la grille de `RecipeCard`.
    *   [ ] Utiliser les `URLSearchParams` pour que l'état de la recherche soit partageable.
*   [ ] **6. Page de Recette (`/recettes/[slug]`) :**
    *   [ ] `+page.svelte` & `+page.server.ts`.
    *   [ ] C'est la page la plus complexe. Utiliser Svelte 5 Runes (`$state`, `$derived`) pour la réactivité.
    *   [ ] `$state` pour le nombre de convives.
    *   [ ] `$derived` pour recalculer les quantités d'ingrédients.
    *   [ ] Mettre à jour l'URL avec le nombre de convives.
    *   [ ] `$state` pour l'état des étapes cochées (enregistré dans le `localStorage`).
    *   [ ] Penser à une UI innovante (ex: bottom-sheet pour les ingrédients, qui reste visible en scrollant les étapes).
*   [ ] **7. Pages d'Administration (`/admin/...`) :**
    *   [ ] `/admin/recettes/+page.svelte` : Tableau de bord des recettes avec recherche, filtres, et liens pour modifier/supprimer.
    *   [ ] `/admin/recettes/creer/+page.svelte` : Formulaire de création de recette.
    *   [ ] `/admin/recettes/[id]/modifier/+page.svelte` : Formulaire pré-rempli pour la modification.

#### **Phase 4 : Finitions et Optimisations**

*   [ ] **1. Animations et Micro-interactions :**
    *   [ ] Utiliser `svelte/transition` et `svelte/animate` pour des transitions de page fluides.
    *   [ ] Ajouter des micro-interactions sur les boutons, les survols, et les actions utilisateur (ex: cocher une étape).
*   [ ] **2. Accessibilité (A11y) :**
    *   [ ] Vérifier la sémantique HTML.
    *   [ ] Assurer un contraste de couleurs suffisant.
    *   [ ] Rendre le site entièrement navigable au clavier.
    *   [ ] Ajouter des attributs ARIA si nécessaire.
*   [ ] **3. Performance :**
    *   [ ] Utiliser le pré-chargement de SvelteKit (`data-sveltekit-preload-data`) pour anticiper la navigation.
    *   [ ] Optimiser les images (format, compression).
    *   [ ] Analyser les bundles pour s'assurer que rien d'inutile n'est envoyé au client.
*   [ ] **4. Sécurité :**
    *   [ ] Activer la protection CSRF intégrée de SvelteKit.
    *   [ ] Valider et nettoyer toutes les données entrantes sur le serveur.
    *   [ ] Mettre en place des Content Security Policy (CSP) si nécessaire.
*   [ ] **5. Déploiement :**
    *   [ ] Configurer le projet pour un déploiement sur Vercel (l'adapter est déjà présent).
    *   [ ] Mettre en place les variables d'environnement sur Vercel.
