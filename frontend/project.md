# Documentation technique du projet Kamana's Bar Management

Date d'analyse : 01/07/2026  
Objectif de ce document : décrire précisément la logique frontend actuelle afin de remplacer le `localStorage` par une API backend et une base de données sans casser les comportements existants.

## 1. Vue d'ensemble du projet

### But du projet

Le projet est une application React de gestion locale d'un bistro/bar appelé **Kamana's Bar**. Elle permet de gérer :

- l'authentification simple d'un administrateur mocké ;
- un tableau de bord ;
- les produits et les stocks ;
- les ventes ;
- les factures ;
- l'historique des ventes ;
- les utilisateurs du personnel.

L'application ne communique avec aucun backend. Les données persistantes sont stockées dans le navigateur via `localStorage`. Quand une clé `localStorage` n'existe pas encore, les pages utilisent des données initiales importées depuis `src/data/mockData.js`. Ces données initiales ne sont pas écrites automatiquement dans `localStorage` : elles servent de fallback jusqu'à la première mutation.

### Stack technique

Informations trouvées dans `package.json`, `package-lock.json`, `vite.config.js` et `eslint.config.js` :

| Élément | Version déclarée | Version verrouillée | Usage |
|---|---:|---:|---|
| React | `^19.2.6` | `19.2.6` | UI, composants, `useState`, `useMemo`, `StrictMode` |
| React DOM | `^19.2.6` | `19.2.6` | rendu racine via `createRoot` |
| React Router DOM | `^7.15.1` | `7.15.1` | routing, redirections, paramètres d'URL |
| Lucide React | `^1.16.0` | `1.16.0` | icônes |
| Vite | `^8.0.12` | `8.0.14` | serveur dev et build |
| @vitejs/plugin-react | `^6.0.1` | `6.0.2` | plugin React pour Vite |
| ESLint | `^10.3.0` | non détaillé ici | lint JS/JSX |

### Architecture générale

- `src/main.jsx` monte l'application dans `#root`, enveloppée par `StrictMode` et `BrowserRouter`.
- `src/App.jsx` contient l'état global d'utilisateur connecté et toutes les routes.
- Chaque page métier lit directement `localStorage` ou `mockData.js`.
- Il n'existe pas de couche `services`, `api`, `hooks` personnalisés, `context`, Redux, Zustand ou autre gestionnaire global.
- Les mutations sont faites en réécrivant le tableau JSON complet dans une clé `localStorage`.

## 2. Structure des dossiers et fichiers

```text
.
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── project.md
├── README.md
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/
    │   ├── hero.png
    │   ├── logo.png
    │   ├── react.svg
    │   └── vite.svg
    ├── components/
    │   ├── ConfirmModal.jsx
    │   ├── Header.jsx
    │   ├── Sidebar.jsx
    │   └── StatusBadge.jsx
    ├── data/
    │   └── mockData.js
    ├── layouts/
    │   └── DashboardLayout.jsx
    ├── pages/
    │   ├── AddInvoice.jsx
    │   ├── AddProduct.jsx
    │   ├── AddSale.jsx
    │   ├── AddUser.jsx
    │   ├── Dashboard.jsx
    │   ├── EditProduct.jsx
    │   ├── EditSale.jsx
    │   ├── EditUser.jsx
    │   ├── InvoiceDetails.jsx
    │   ├── Invoices.jsx
    │   ├── Login.jsx
    │   ├── Products.jsx
    │   ├── Sales.jsx
    │   ├── SalesHistory.jsx
    │   └── Users.jsx
    └── styles/
        ├── dashboard.css
        ├── history.css
        ├── invoices.css
        ├── login.css
        ├── products.css
        ├── sales.css
        └── users.css
```

### Fichiers racine

- `package.json` : scripts Vite (`dev`, `build`, `lint`, `preview`) et dépendances.
- `package-lock.json` : versions exactes installées.
- `vite.config.js` : configuration Vite minimale avec `react()`.
- `eslint.config.js` : configuration ESLint pour `**/*.{js,jsx}` avec règles JS recommandées, React Hooks et React Refresh.
- `README.md` : README standard du template React + Vite, pas de documentation métier.
- `index.html` : point HTML Vite.
- `project.md` : présent fichier.

### `src/App.jsx`

Rôle :

- initialise l'état `user` depuis `localStorage.getItem("kamana_user")` ;
- supprime `kamana_user` si le JSON est invalide ;
- expose `handleLogin(connectedUser)` et `handleLogout()` ;
- définit `ProtectedRoute({ children })` ;
- déclare toutes les routes.

Routes :

| Route | Page | Protection |
|---|---|---|
| `/` | redirection vers `/login` | non |
| `/login` | `Login` ou redirection `/dashboard` si connecté | non |
| `/dashboard` | `Dashboard` | oui |
| `/products` | `Products` | oui |
| `/products/add` | `AddProduct` | oui |
| `/products/edit/:id` | `EditProduct` | oui |
| `/sales` | `Sales` | oui |
| `/sales/add` | `AddSale` | oui |
| `/sales/edit/:id` | `EditSale` | oui |
| `/invoices` | `Invoices` | oui |
| `/invoices/add` | `AddInvoice` | oui |
| `/invoices/:id` | `InvoiceDetails` | oui |
| `/history` | `SalesHistory` | oui |
| `/users` | `Users` | oui |
| `/users/add` | `AddUser` | oui |
| `/users/edit/:id` | `EditUser` | oui |
| `*` | redirection `/dashboard` si connecté, sinon `/login` | selon état |

### `src/data/mockData.js`

Contient toutes les données initiales :

- `authUser` : utilisateur d'authentification mocké.
- `dashboardStats` : cartes statistiques du tableau de bord.
- `dashboardSalesEvolution` : valeurs du graphique.
- `dashboardRecentSales` : ventes récentes du tableau de bord.
- `dashboardRecentInvoices` : factures récentes du tableau de bord.
- `dashboardTopProducts` : top produits du tableau de bord.
- `products` : fallback produits.
- `sales` : fallback ventes.
- `invoiceProducts` : lignes de produits statiques affichées dans les factures.
- `invoices` : fallback factures.
- `salesHistory` : fallback historique des ventes.
- `users` : fallback utilisateurs.

### `src/components`

- `ConfirmModal.jsx` : modale générique de confirmation de suppression. Utilisée par `Invoices.jsx` et `Users.jsx`.
- `Header.jsx` : affiche le nom et le rôle de l'utilisateur connecté, avec fallback `"Kamana urbain"` et `"Admin"`.
- `Sidebar.jsx` : navigation principale et bouton `Se Deconnecter` qui appelle `onLogout`.
- `StatusBadge.jsx` : affiche un badge de statut. Classe verte si statut dans `["Terminée", "Payée", "Disponible", "Actif", "Validée", "En cours"]`. Classe rouge si statut dans `["Annulée", "Supprimée", "Désactivé", "Terminé", "Rupture"]`.

### `src/layouts`

- `DashboardLayout.jsx` : compose `Sidebar`, `Header` optionnel et contenu de page. Props : `children`, `activePage`, `user`, `onLogout`, `showHeader`.

### `src/pages`

- `Login.jsx` : authentification contre `authUser`.
- `Dashboard.jsx` : tableau de bord statique basé sur `mockData.js`.
- `Products.jsx` : liste, recherche, filtres, consultation et suppression de produits.
- `AddProduct.jsx` : ajout de produit dans `kamana_products`.
- `EditProduct.jsx` : formulaire visuel d'édition produit, mais ne persiste rien et lit seulement `mockData.js`.
- `Sales.jsx` : liste, recherche, filtres, consultation et suppression de ventes.
- `AddSale.jsx` : ajout de vente dans `kamana_sales`, avec panier local.
- `EditSale.jsx` : modification partielle d'une vente dans `kamana_sales`.
- `Invoices.jsx` : liste, recherche, filtres, consultation rapide et suppression de factures.
- `AddInvoice.jsx` : ajout manuel de facture dans `kamana_invoices`.
- `InvoiceDetails.jsx` : détail d'une facture.
- `SalesHistory.jsx` : historique dérivé de `kamana_sales` ou fallback `salesHistory`.
- `Users.jsx` : liste, recherche, filtres, consultation et suppression d'utilisateurs.
- `AddUser.jsx` : ajout d'utilisateur dans `kamana_users`.
- `EditUser.jsx` : modification d'utilisateur dans `kamana_users`.

### `src/styles`

Chaque fichier CSS correspond principalement à une zone fonctionnelle :

- `dashboard.css` : tableau de bord.
- `history.css` : historique.
- `invoices.css` : factures, détails, modales de suppression partagées.
- `login.css` : écran de connexion.
- `products.css` : produits.
- `sales.css` : ventes.
- `users.css` : utilisateurs.

## 3. Modèles de données

### Clés `localStorage` persistantes

Les seules clés `localStorage` trouvées dans le code sont :

| Clé | Type stocké | Domaine |
|---|---|---|
| `kamana_user` | objet JSON ou absent | session utilisateur |
| `kamana_products` | tableau JSON | produits |
| `kamana_sales` | tableau JSON | ventes |
| `kamana_invoices` | tableau JSON | factures |
| `kamana_users` | tableau JSON | utilisateurs |

Aucune utilisation de `sessionStorage` n'a été trouvée.

### Modèle `AuthUser` / session `kamana_user`

Source :

- `src/data/mockData.js` pour `authUser`.
- `src/pages/Login.jsx` pour la construction de l'utilisateur connecté.
- `src/App.jsx` pour la persistance.

`authUser` contient :

| Champ | Type | Obligatoire | Exemple | Remarque |
|---|---|---:|---|---|
| `id` | number | oui | `1` | utilisateur mocké |
| `name` | string | oui | `"Kamana urbain"` | affiché dans header/dashboard |
| `email` | string | oui | `"kamanaurbain12@gmail.com"` | utilisé au login |
| `password` | string | oui dans mock | `"@Kamana123"` | jamais stocké dans `kamana_user` |
| `role` | string | oui | `"Admin"` | utilisé comme rôle court |
| `fullRole` | string | oui | `"Administrateur"` | stocké en session, peu affiché |

Objet réellement stocké dans `kamana_user` après connexion :

```json
{
  "id": 1,
  "name": "Kamana urbain",
  "email": "kamanaurbain12@gmail.com",
  "role": "Admin",
  "fullRole": "Administrateur"
}
```

Important :

- Le mot de passe n'est pas stocké dans `kamana_user`.
- Aucun token JWT, refresh token ou cookie n'existe actuellement.
- L'authentification n'utilise pas les utilisateurs stockés dans `kamana_users`.

### Modèle `Product` / clé `kamana_products`

Sources :

- Fallback : `products` dans `src/data/mockData.js`.
- Lecture/liste/suppression : `src/pages/Products.jsx`.
- Création : `src/pages/AddProduct.jsx`.
- Édition affichée mais non persistée : `src/pages/EditProduct.jsx`.
- Sélection dans les ventes : `src/pages/AddSale.jsx`.

Structure :

| Champ | Type actuel | Obligatoire à la création | Valeur par défaut / exemple | Remarque |
|---|---|---:|---|---|
| `id` | string | généré | `"PRO-001"` | format `PRO-` + 3 chiffres |
| `name` | string | oui | `"Fanta Orange 33cl"` | recherché et affiché |
| `category` | string | oui | `"Boissons"` | options UI : `Boissons`, `Plats`, `Snacks` |
| `price` | string | oui | `"1 000"` | stocké sans `FBu`; affiché avec `FBu` |
| `stock` | string | oui | `"128"` | comparé via `Number(stock)` |
| `unit` | string | oui | `"Bouteille"` | options UI : `Bouteille`, `Pièce`, `Plat`, `Verre` |
| `status` | string | non, initialisé | `"Disponible"` | options : `Disponible`, `Rupture`, `Terminé` |
| `dateAdded` | string | non | `"25/05/2025"` à l'ajout | aucune validation de format |
| `description` | string | non | `"Aucune description."` si vide | fallback en création |
| `minStock` | string | non | `"0"` si vide | utilisé pour stock faible |
| `reference` | string | oui | `"FAN-ORG-033"` | recherché et affiché |

Exemple fallback dans `mockData.js` :

```json
{
  "id": "PRO-001",
  "name": "Fanta Orange 33cl",
  "category": "Boissons",
  "price": "1 000",
  "stock": "128",
  "unit": "Bouteille",
  "status": "Disponible",
  "dateAdded": "15/05/2025",
  "description": "Boisson gazeuse Fanta Orange 33cl, servie fraîche au bar.",
  "minStock": "10",
  "reference": "FAN-ORG-033"
}
```

Exemple de produit créé par `AddProduct.jsx` :

```json
{
  "id": "PRO-005",
  "name": "Jus d'ananas",
  "category": "Boissons",
  "price": "2000",
  "stock": "30",
  "unit": "Verre",
  "status": "Disponible",
  "dateAdded": "25/05/2025",
  "description": "Aucune description.",
  "minStock": "0",
  "reference": "JUS-ANA-001"
}
```

Relations :

- Une vente (`Sale`) peut référencer plusieurs produits via `sale.products[].id`.
- Le produit copié dans une vente est un snapshot partiel : `id`, `name`, `price`, `quantity`.
- Aucun décrément de stock n'est fait lors d'une vente.

### Modèle `Sale` / clé `kamana_sales`

Sources :

- Fallback : `sales` dans `src/data/mockData.js`.
- Liste/suppression : `src/pages/Sales.jsx`.
- Création : `src/pages/AddSale.jsx`.
- Modification : `src/pages/EditSale.jsx`.
- Historique dérivé : `src/pages/SalesHistory.jsx`.

Structure minimale des ventes mockées :

| Champ | Type actuel | Obligatoire | Exemple | Remarque |
|---|---|---:|---|---|
| `id` | string | oui | `"VTE-000145"` | format `VTE-` + 6 chiffres |
| `client` | string | oui | `"Kamana Urbain"` | recherché et affiché |
| `cashier` | string | oui | `"Admin"` | filtre caissier |
| `total` | string | oui | `"125 000 FBu"` | calculs via suppression des non-chiffres |
| `date` | string | oui | `"25/05/2025 22:45"` | aucune validation de format |
| `status` | string | oui | `"Terminée"` | options UI : `Terminée`, `Annulée` |

Champs ajoutés uniquement par `AddSale.jsx` :

| Champ | Type actuel | Obligatoire | Exemple | Remarque |
|---|---|---:|---|---|
| `products` | array | oui pour nouvelle vente | voir `SaleItem` | panier sauvegardé |
| `receivedAmount` | string | non | `"25 000 FBu"` | si vide, devient `"0 FBu"` |
| `change` | string | calculé | `"5 000 FBu"` | `Math.max(received - total, 0)` |

Structure `SaleItem` dans `sale.products` :

| Champ | Type actuel | Exemple | Remarque |
|---|---|---|---|
| `id` | string | `"PRO-001"` | id produit |
| `name` | string | `"Fanta Orange 33cl"` | snapshot du nom |
| `price` | string | `"1 000"` | snapshot du prix produit |
| `quantity` | number | `2` | converti avec `Number(quantity)` |

Exemple fallback dans `mockData.js` :

```json
{
  "id": "VTE-000145",
  "client": "Kamana Urbain",
  "cashier": "Admin",
  "total": "125 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Terminée"
}
```

Exemple de vente créée par `AddSale.jsx` :

```json
{
  "id": "VTE-000007",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Terminée",
  "products": [
    {
      "id": "PRO-001",
      "name": "Fanta Orange 33cl",
      "price": "1 000",
      "quantity": 2
    },
    {
      "id": "PRO-002",
      "name": "Brochette de boeuf",
      "price": "4 000",
      "quantity": 3
    }
  ],
  "receivedAmount": "25 000 FBu",
  "change": "5 000 FBu"
}
```

Relations :

- Une vente contient zéro ou plusieurs produits selon son origine :
  - ventes mockées : pas de champ `products` ;
  - ventes créées : champ `products` présent.
- Une facture peut référencer une vente via `invoice.saleId`, mais aucune contrainte n'est vérifiée.
- L'historique n'est pas une table séparée dans `localStorage` : il est dérivé de `kamana_sales` quand cette clé existe.

### Modèle `Invoice` / clé `kamana_invoices`

Sources :

- Fallback : `invoices` dans `src/data/mockData.js`.
- Liste/suppression : `src/pages/Invoices.jsx`.
- Création : `src/pages/AddInvoice.jsx`.
- Détail : `src/pages/InvoiceDetails.jsx`.

Structure :

| Champ | Type actuel | Obligatoire à la création | Exemple | Remarque |
|---|---|---:|---|---|
| `id` | string | généré | `"FAC-000145"` | format `FAC-` + 6 chiffres |
| `saleId` | string | non | `"VTE-000145"` | généré si vide |
| `client` | string | oui | `"Client de passage"` | recherché et affiché |
| `cashier` | string | oui | `"Admin"` | filtre caissier |
| `total` | string | oui | `"20 000 FBu"` | stocké avec `FBu` |
| `date` | string | non | `"25/05/2025 22:45"` | aucune validation de format |
| `status` | string | non | `"Payée"` | options : `Payée`, `Supprimée` |

Exemple fallback :

```json
{
  "id": "FAC-000145",
  "saleId": "VTE-000145",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Payée"
}
```

Exemple créé par `AddInvoice.jsx` :

```json
{
  "id": "FAC-000007",
  "saleId": "VTE-000007",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Payée"
}
```

Relations :

- `saleId` est une référence textuelle vers `Sale.id`.
- Aucune vérification n'assure que `saleId` existe dans `kamana_sales`.
- Les lignes de facture affichées ne viennent pas de l'objet facture. Toutes les factures affichent le tableau statique `invoiceProducts` de `mockData.js`.

### Modèle statique `InvoiceProduct`

Source : `invoiceProducts` dans `src/data/mockData.js`.

Ce modèle n'est pas stocké dans `localStorage`. Il est utilisé dans :

- `src/pages/Invoices.jsx` pour la modale rapide ;
- `src/pages/InvoiceDetails.jsx` pour le tableau et le ticket.

Structure :

| Champ | Type | Exemple |
|---|---|---|
| `product` | string | `"Fanta Orange 33cl"` |
| `quantity` | number | `2` |
| `unitPrice` | string | `"1 000 FBu"` |
| `amount` | string | `"2 000 FBu"` |

Exemple :

```json
{
  "product": "Fanta Orange 33cl",
  "quantity": 2,
  "unitPrice": "1 000 FBu",
  "amount": "2 000 FBu"
}
```

### Modèle `SalesHistory`

Source :

- `src/pages/SalesHistory.jsx`.
- Fallback `salesHistory` dans `src/data/mockData.js`.

Important : il n'existe pas de clé `kamana_sales_history`. L'historique est :

1. dérivé de `kamana_sales` si la clé existe ;
2. sinon lu depuis `initialSalesHistory` ;
3. sinon lu depuis `initialSales`.

Structure fallback `salesHistory` :

| Champ | Type | Exemple |
|---|---|---|
| `id` | string | `"VTE-000145"` |
| `client` | string | `"Client de passage"` |
| `cashier` | string | `"Admin"` |
| `products` | string | `"3 articles"` |
| `total` | string | `"20 000 FBu"` |
| `date` | string | `"25/05/2025 22:45"` |
| `status` | string | `"Terminée"` |

Structure dérivée depuis `kamana_sales` :

| Champ | Type | Règle |
|---|---|---|
| `id` | string | `sale.id` |
| `client` | string | `sale.client` |
| `cashier` | string | `sale.cashier` |
| `products` | string | si `sale.products` existe : `${sale.products.length} article(s)`, sinon `sale.productsCount || "3 articles"` |
| `total` | string | `sale.total` |
| `date` | string | `sale.date` |
| `status` | string | `sale.status` |
| `productsList` | array | `sale.products || []` |
| `receivedAmount` | string | `sale.receivedAmount || "25 000 FBu"` |
| `change` | string | `sale.change || "5 000 FBu"` |

`productsCount` est référencé par `SalesHistory.jsx`, mais aucun code actuel ne crée ce champ.

### Modèle `User` / clé `kamana_users`

Sources :

- Fallback : `users` dans `src/data/mockData.js`.
- Liste/suppression : `src/pages/Users.jsx`.
- Création : `src/pages/AddUser.jsx`.
- Modification : `src/pages/EditUser.jsx`.

Structure minimale des utilisateurs mockés :

| Champ | Type actuel | Obligatoire | Exemple |
|---|---|---:|---|
| `id` | string | oui | `"UTI-00018"` |
| `name` | string | oui | `"Kamana urbain"` |
| `email` | string | oui | `"kamanaurbain12@gmail.com"` |
| `phone` | string | oui | `"+257 79 12 34 56"` |
| `role` | string | oui | `"Administrateur"` |
| `status` | string | oui | `"Actif"` |
| `dateCreated` | string | oui | `"25/05/2025"` |

Champs ajoutés par `AddUser.jsx` et `EditUser.jsx` :

| Champ | Type actuel | Obligatoire | Exemple | Remarque |
|---|---|---:|---|---|
| `photo` | string | non | `""` | lien ou nom de fichier |
| `permissions` | object | non pour fallback, oui après ajout/édition | voir ci-dessous | non utilisé pour protéger les routes |

Structure `permissions` :

| Champ | Type | Défaut création |
|---|---|---:|
| `sales` | boolean | `true` |
| `products` | boolean | `true` |
| `invoices` | boolean | `true` |
| `admin` | boolean | `false` |
| `users` | boolean | `false` |
| `history` | boolean | `true` |

Exemple fallback :

```json
{
  "id": "UTI-00018",
  "name": "Kamana urbain",
  "email": "kamanaurbain12@gmail.com",
  "phone": "+257 79 12 34 56",
  "role": "Administrateur",
  "status": "Actif",
  "dateCreated": "25/05/2025"
}
```

Exemple créé par `AddUser.jsx` :

```json
{
  "id": "UTI-00007",
  "name": "Jean K.",
  "email": "jean@example.com",
  "phone": "+257 79 00 00 00",
  "role": "Caissier",
  "status": "Actif",
  "dateCreated": "25/05/2025",
  "photo": "",
  "permissions": {
    "sales": true,
    "products": true,
    "invoices": true,
    "admin": false,
    "users": false,
    "history": true
  }
}
```

Important :

- `password` et `confirmPassword` existent seulement dans le formulaire `AddUser.jsx`.
- Le mot de passe n'est jamais stocké dans `kamana_users`.
- `kamana_users` ne sert pas à la connexion.
- Les permissions sont affichées/éditées, mais ne sont pas utilisées pour autoriser ou interdire une route.

## 4. Logique du `localStorage` actuel

### Vue globale des clés

| Clé | Créée par | Lue par | Modifiée par | Supprimée par |
|---|---|---|---|---|
| `kamana_user` | `App.jsx` via `handleLogin` | `App.jsx` initialiseur `useState` | `App.jsx` via `handleLogin` | `App.jsx` via `handleLogout` et en cas de JSON invalide |
| `kamana_products` | `AddProduct.jsx` | `Products.jsx`, `AddProduct.jsx`, `AddSale.jsx` | `Products.jsx` suppression, `AddProduct.jsx` ajout | jamais via `removeItem` |
| `kamana_sales` | `AddSale.jsx` | `Sales.jsx`, `AddSale.jsx`, `EditSale.jsx`, `SalesHistory.jsx` | `Sales.jsx` suppression, `AddSale.jsx` ajout, `EditSale.jsx` édition | jamais via `removeItem` |
| `kamana_invoices` | `AddInvoice.jsx` | `Invoices.jsx`, `AddInvoice.jsx`, `InvoiceDetails.jsx` | `Invoices.jsx` suppression, `AddInvoice.jsx` ajout | jamais via `removeItem` |
| `kamana_users` | `AddUser.jsx` | `Users.jsx`, `AddUser.jsx`, `EditUser.jsx` | `Users.jsx` suppression, `AddUser.jsx` ajout, `EditUser.jsx` édition | jamais via `removeItem` |

### Fonctions liées à `kamana_user`

Fichier : `src/App.jsx`

```js
const [user, setUser] = useState(() => { ... });
```

- Lit `localStorage.getItem("kamana_user")`.
- Parse avec `JSON.parse`.
- Retourne `null` si absent.
- Si le JSON est invalide, exécute `localStorage.removeItem("kamana_user")` puis retourne `null`.

```js
const handleLogin = (connectedUser) => { ... };
```

- Écrit `localStorage.setItem("kamana_user", JSON.stringify(connectedUser))`.
- Met à jour l'état React `user`.

```js
const handleLogout = () => { ... };
```

- Supprime `kamana_user`.
- Met `user` à `null`.

### Fonctions liées à `kamana_products`

Fichier : `src/pages/Products.jsx`

```js
function getStoredProducts()
```

- Lit `localStorage.getItem("kamana_products")`.
- Retourne `JSON.parse(savedProducts)` si présent.
- Sinon retourne `initialProducts`.
- Pas de `try/catch` : JSON invalide = erreur runtime.

```js
const saveProducts = (updatedProducts) => { ... };
```

- Met à jour l'état local `products`.
- Écrit tout le tableau avec `localStorage.setItem("kamana_products", JSON.stringify(updatedProducts))`.

```js
const handleDelete = () => { ... };
```

- Si `productToDelete` est absent, ne fait rien.
- Filtre `products` pour retirer l'id sélectionné.
- Appelle `saveProducts(updatedProducts)`.

Fichier : `src/pages/AddProduct.jsx`

```js
function getStoredProducts()
```

- Même logique que `Products.jsx`.

```js
function generateProductId(products)
```

- `const nextNumber = products.length + 1`.
- Retourne ``PRO-${String(nextNumber).padStart(3, "0")}``.
- Ne cherche pas le plus grand id existant.

```js
const handleSubmit = (event) => { ... };
```

- Valide les champs requis.
- Lit `storedProducts`.
- Construit `newProduct`.
- Préfixe la liste : `[newProduct, ...storedProducts]`.
- Écrit `kamana_products`.
- Redirige vers `/products`.

Fichier : `src/pages/AddSale.jsx`

```js
function getStoredProducts()
```

- Lit `kamana_products` pour remplir la liste de produits sélectionnables dans une vente.
- Fallback : `initialProducts`.

Fichier : `src/pages/EditProduct.jsx`

- Ne lit pas `kamana_products`.
- Ne sauvegarde pas dans `localStorage`.
- Lit uniquement `products` depuis `mockData.js`.
- Le bouton "Mettre à jour le produit" est `type="button"` sans handler.

### Fonctions liées à `kamana_sales`

Fichier : `src/pages/Sales.jsx`

```js
function getStoredSales()
```

- Lit `kamana_sales`.
- Fallback : `initialSales`.

```js
const saveSales = (updatedSales) => { ... };
```

- Met à jour l'état local.
- Réécrit tout le tableau `kamana_sales`.

```js
const handleDelete = () => { ... };
```

- Filtre la vente sélectionnée.
- Appelle `saveSales`.

Fichier : `src/pages/AddSale.jsx`

```js
function getStoredSales()
function getStoredProducts()
function generateSaleId(sales)
function cleanNumber(value)
```

- `generateSaleId(sales)` utilise `sales.length + 1`, retourne `VTE-` + 6 chiffres.
- `cleanNumber(value)` retourne `Number(String(value).replace(/\D/g, ""))`.
- `cleanNumber` transforme par exemple `"1 000 FBu"` en `1000` et `""` en `0`.

```js
const handleAddToCart = () => { ... };
```

- Trouve le produit sélectionné.
- Si le produit existe déjà dans le panier, additionne `Number(quantity)`.
- Sinon ajoute `{ id, name, price, quantity: Number(quantity) }`.
- Réinitialise `quantity` à `1`.
- Ne vérifie pas le stock.

```js
const removeFromCart = (id) => { ... };
```

- Retire un item du panier local.
- Ne touche pas `localStorage`.

```js
const handleSubmit = (event) => { ... };
```

- Exige `client`, `cashier` et `cart.length > 0`.
- Lit `storedSales`.
- Calcule `total` depuis le panier.
- Calcule `receivedAmount` et `change`.
- Préfixe la liste : `[newSale, ...storedSales]`.
- Écrit `kamana_sales`.
- Redirige vers `/sales`.

Fichier : `src/pages/EditSale.jsx`

```js
function getStoredSales()
const handleSubmit = (event) => { ... };
```

- Lit `storedSales`.
- Trouve `selectedSale` par `id`, sinon prend `storedSales[0]`.
- Valide `client`, `cashier`, `total`.
- Mappe le tableau et remplace la vente sélectionnée.
- Met à jour seulement `client`, `cashier`, `date`, `status`, `total`.
- Conserve les autres champs grâce à `...sale` (`products`, `receivedAmount`, `change` si présents).
- Écrit `kamana_sales`.

Fichier : `src/pages/SalesHistory.jsx`

```js
function getStoredHistory()
```

- Lit `kamana_sales`.
- Si présent, transforme chaque vente en entrée d'historique.
- Sinon retourne `initialSalesHistory` si disponible.
- Sinon retourne `initialSales`.
- Ne sauvegarde rien.

### Fonctions liées à `kamana_invoices`

Fichier : `src/pages/Invoices.jsx`

```js
function getStoredInvoices()
function cleanNumber(value)
const saveInvoices = (updatedInvoices) => { ... };
const handleDelete = () => { ... };
```

- Lit `kamana_invoices`, fallback `initialInvoices`.
- `cleanNumber` est utilisé pour calculer le total facturé.
- `saveInvoices` met à jour l'état local et réécrit tout le tableau.
- `handleDelete` supprime réellement l'objet du tableau, il ne met pas le statut à `"Supprimée"`.

Fichier : `src/pages/AddInvoice.jsx`

```js
function getStoredInvoices()
function generateInvoiceId(invoices)
function generateSaleId(invoices)
const handleSubmit = (event) => { ... };
```

- `generateInvoiceId(invoices)` utilise `invoices.length + 1`, retourne `FAC-` + 6 chiffres.
- `generateSaleId(invoices)` utilise aussi `invoices.length + 1`, retourne `VTE-` + 6 chiffres.
- `handleSubmit` exige `client`, `cashier`, `total`.
- `saleId` est facultatif ; si vide, il est généré.
- Préfixe la liste et écrit `kamana_invoices`.

Fichier : `src/pages/InvoiceDetails.jsx`

```js
function getStoredInvoices()
```

- Lit `kamana_invoices`, fallback `initialInvoices`.
- Trouve la facture par `id`, sinon prend `invoices[0]`.
- Ne modifie rien.

### Fonctions liées à `kamana_users`

Fichier : `src/pages/Users.jsx`

```js
function getStoredUsers()
const saveUsers = (updatedUsers) => { ... };
const handleDelete = () => { ... };
```

- Lit `kamana_users`, fallback `initialUsers`.
- `saveUsers` met à jour l'état local et réécrit tout le tableau.
- `handleDelete` supprime réellement l'utilisateur du tableau.

Fichier : `src/pages/AddUser.jsx`

```js
function getStoredUsers()
function generateUserId(users)
const handlePermissionChange = (permission) => { ... };
const handleSubmit = (event) => { ... };
```

- `generateUserId(users)` utilise `users.length + 1`, retourne `UTI-` + 5 chiffres.
- `handlePermissionChange` inverse un booléen dans `formData.permissions`.
- `handleSubmit` valide les champs et mots de passe.
- Le nouveau `User` ne contient pas `password` ni `confirmPassword`.
- Préfixe la liste et écrit `kamana_users`.

Fichier : `src/pages/EditUser.jsx`

```js
function getStoredUsers()
const handlePermissionChange = (permission) => { ... };
const handleSubmit = (event) => { ... };
```

- Lit `storedUsers`.
- Trouve `selectedUser` par `id`, sinon prend `storedUsers[0]`.
- Initialise `permissions` depuis l'utilisateur ou depuis des valeurs dérivées du rôle.
- Valide `name`, `email`, `phone`.
- Mappe et remplace l'utilisateur sélectionné.
- Écrit `kamana_users`.

### Logique de génération d'IDs

Toutes les générations d'IDs sont locales et basées sur la longueur du tableau courant.

| Entité | Fichier | Fonction | Format | Logique exacte |
|---|---|---|---|---|
| Produit | `src/pages/AddProduct.jsx` | `generateProductId(products)` | `PRO-001` | `products.length + 1`, `padStart(3, "0")` |
| Vente | `src/pages/AddSale.jsx` | `generateSaleId(sales)` | `VTE-000001` | `sales.length + 1`, `padStart(6, "0")` |
| Facture | `src/pages/AddInvoice.jsx` | `generateInvoiceId(invoices)` | `FAC-000001` | `invoices.length + 1`, `padStart(6, "0")` |
| Vente liée à facture | `src/pages/AddInvoice.jsx` | `generateSaleId(invoices)` | `VTE-000001` | `invoices.length + 1`, `padStart(6, "0")` |
| Utilisateur | `src/pages/AddUser.jsx` | `generateUserId(users)` | `UTI-00001` | `users.length + 1`, `padStart(5, "0")` |

Conséquences importantes pour le backend :

- Le code ne calcule pas `max(id) + 1`.
- Après suppression, un ID peut être régénéré et provoquer un doublon.
- Les données mockées ont déjà des IDs élevés. Exemple : `users` contient `UTI-00018`, mais avec 6 utilisateurs, `generateUserId` produit `UTI-00007`.
- `sales` contient `VTE-000145`, mais avec 6 ventes, une nouvelle vente devient `VTE-000007`.
- Pour une compatibilité stricte, le backend doit soit reproduire ce comportement, soit le frontend doit être ajusté pour accepter une génération backend plus fiable.

## 5. Flux fonctionnels

### Flux : démarrage de l'application

1. `src/main.jsx` rend `<App />` dans `<BrowserRouter>`.
2. `App.jsx` initialise `user` en lisant `kamana_user`.
3. Si `kamana_user` est absent, `user = null`.
4. Si `kamana_user` contient un JSON valide, l'utilisateur est connecté.
5. Si `kamana_user` contient un JSON invalide, la clé est supprimée et l'utilisateur est déconnecté.
6. Les routes protégées redirigent vers `/login` si `user` est `null`.

Données lues/écrites :

- Lit `kamana_user`.
- Supprime `kamana_user` uniquement si JSON invalide.

### Flux : connexion

Fichier : `src/pages/Login.jsx`

1. Les champs sont préremplis :
   - email : `"kamanaurbain12@gmail.com"` ;
   - mot de passe : `"@Kamana123"`.
2. L'utilisateur soumet le formulaire.
3. `handleSubmit(event)` empêche le comportement par défaut.
4. Compare `email.trim()` à `authUser.email`.
5. Compare `password` à `authUser.password`.
6. Si correct :
   - construit `connectedUser` sans `password` ;
   - appelle `onLogin(connectedUser)`.
7. `App.jsx` écrit `kamana_user`.
8. La route `/login` redirige vers `/dashboard`.
9. Si incorrect :
   - affiche `"Email ou mot de passe incorrect."`.

Données lues/écrites :

- Lit `authUser` depuis `mockData.js`.
- Écrit `kamana_user`.

### Flux : déconnexion

Fichier : `src/components/Sidebar.jsx` + `src/App.jsx`

1. L'utilisateur clique sur le bouton `Se Deconnecter`.
2. `Sidebar` appelle `onLogout`.
3. `App.jsx` exécute `handleLogout`.
4. `kamana_user` est supprimé.
5. `user` devient `null`.
6. Les routes protégées redirigent vers `/login`.

Données modifiées :

- Supprime `kamana_user`.

### Flux : consultation du tableau de bord

Fichier : `src/pages/Dashboard.jsx`

1. Route protégée `/dashboard`.
2. Les cartes, graphiques et tableaux utilisent exclusivement `mockData.js`.
3. Le nom/rôle affichés viennent de `user`, avec fallback.

Données lues :

- `dashboardStats`, `dashboardSalesEvolution`, `dashboardRecentSales`, `dashboardRecentInvoices`, `dashboardTopProducts`.
- Ne lit pas `kamana_products`, `kamana_sales` ni `kamana_invoices`.

Important :

- Les statistiques du dashboard ne reflètent pas les données modifiées dans `localStorage`.

### Flux : liste des produits

Fichier : `src/pages/Products.jsx`

1. À l'initialisation, `getStoredProducts()` lit `kamana_products`.
2. Si absent, utilise `initialProducts`.
3. L'utilisateur peut rechercher par :
   - `product.name`,
   - `product.id`,
   - `product.reference`,
   - `product.category`.
4. L'utilisateur peut filtrer par catégorie.
5. L'utilisateur peut filtrer par statut : `Disponible`, `Rupture`, `Terminé`.
6. Les statistiques sont calculées côté client :
   - total produits : `products.length` ;
   - total catégories : nombre de catégories uniques ;
   - stock faible : `Number(stock) <= Number(minStock)` ;
   - rupture : `status === "Rupture" || Number(stock) === 0`.
7. La vue détail est une modale locale.

Données lues :

- `kamana_products` ou `initialProducts`.

### Flux : ajout d'un produit

Fichier : `src/pages/AddProduct.jsx`

1. L'utilisateur ouvre `/products/add`.
2. Le formulaire démarre avec :
   - `status: "Disponible"`,
   - `dateAdded: "25/05/2025"`,
   - autres champs vides.
3. À la soumission, champs requis :
   - `name`,
   - `category`,
   - `price`,
   - `stock`,
   - `unit`,
   - `reference`.
4. Si invalide, affiche `"Veuillez remplir les champs obligatoires."`.
5. Lit la liste actuelle avec `getStoredProducts()`.
6. Génère l'id avec `generateProductId(storedProducts)`.
7. Applique les defaults :
   - `description || "Aucune description."`,
   - `minStock || "0"`.
8. Ajoute le produit au début du tableau.
9. Écrit `kamana_products`.
10. Redirige vers `/products`.

Données lues/écrites :

- Lit `kamana_products`.
- Écrit `kamana_products`.

### Flux : suppression d'un produit

Fichier : `src/pages/Products.jsx`

1. L'utilisateur clique sur l'icône suppression.
2. `productToDelete` reçoit l'objet produit.
3. La modale demande confirmation.
4. `handleDelete` filtre le tableau par id.
5. `saveProducts` met à jour l'état et `kamana_products`.

Données modifiées :

- Réécrit `kamana_products` sans le produit supprimé.

### Flux : modification d'un produit

Fichier : `src/pages/EditProduct.jsx`

Comportement actuel :

1. L'utilisateur ouvre `/products/edit/:id`.
2. La page cherche le produit dans `products` importé depuis `mockData.js`, pas dans `kamana_products`.
3. Si non trouvé, elle prend `products[0]`.
4. Le formulaire utilise `defaultValue`.
5. Le bouton `Mettre à jour le produit` n'a pas de handler de sauvegarde.

Données lues/écrites :

- Lit uniquement `mockData.js`.
- N'écrit rien.

Conclusion :

- L'édition produit n'est pas fonctionnelle côté persistance actuellement.

### Flux : liste des ventes

Fichier : `src/pages/Sales.jsx`

1. À l'initialisation, lit `kamana_sales`, fallback `initialSales`.
2. Recherche par :
   - `sale.id`,
   - `sale.client`,
   - `sale.cashier`,
   - `sale.total`.
3. Filtre par statut : `Terminée`, `Annulée`.
4. Filtre par caissier, valeurs déduites des ventes.
5. Statistiques :
   - ventes du jour : nombre de ventes `status === "Terminée"` ;
   - ventes annulées : `status === "Annulée"` ;
   - factures générées : nombre de ventes terminées ;
   - chiffre d'affaires : somme des `total` des ventes terminées après `replace(/\D/g, "")`.
6. La vue détail est une modale locale.

Données lues :

- `kamana_sales` ou `initialSales`.

Important :

- "Ventes du jour" ne filtre pas réellement par date.
- "Factures générées" ne vérifie pas `kamana_invoices`.

### Flux : création d'une vente

Fichier : `src/pages/AddSale.jsx`

1. Ouvre `/sales/add`.
2. Lit les produits depuis `kamana_products`, fallback `initialProducts`.
3. États initiaux :
   - `client: "Client de passage"`,
   - `cashier: user?.role || "Admin"`,
   - `date: "25/05/2025 22:45"`,
   - `status: "Terminée"`,
   - `selectedProductId: products[0]?.id || ""`,
   - `quantity: 1`,
   - `cart: []`,
   - `receivedAmount: ""`.
4. L'utilisateur ajoute des produits au panier.
5. Si un produit est déjà dans le panier, sa quantité est augmentée.
6. Le total est recalculé avec `useMemo`.
7. La monnaie est calculée : `Math.max(cleanNumber(receivedAmount) - total, 0)`.
8. À la soumission, validation :
   - `client` doit être présent ;
   - `cashier` doit être présent ;
   - `cart.length` doit être supérieur à 0.
9. Lit `kamana_sales`, fallback `initialSales`.
10. Génère un id avec `generateSaleId`.
11. Construit la vente.
12. Ajoute au début du tableau.
13. Écrit `kamana_sales`.
14. Redirige vers `/sales`.

Données lues/écrites :

- Lit `kamana_products`.
- Lit `kamana_sales`.
- Écrit `kamana_sales`.

Ce que le flux ne fait pas :

- ne décrémente pas le stock ;
- ne vérifie pas si la quantité demandée dépasse le stock ;
- ne crée pas de facture dans `kamana_invoices` ;
- ne lie pas l'utilisateur connecté par id ;
- ne force pas `receivedAmount >= total`.

### Flux : suppression d'une vente

Fichier : `src/pages/Sales.jsx`

1. L'utilisateur sélectionne une vente à supprimer.
2. Confirme dans la modale.
3. `handleDelete` filtre par id.
4. `saveSales` écrit le nouveau tableau.

Données modifiées :

- Réécrit `kamana_sales` sans la vente.

### Flux : modification d'une vente

Fichier : `src/pages/EditSale.jsx`

1. Ouvre `/sales/edit/:id`.
2. Lit `kamana_sales`, fallback `initialSales`.
3. Cherche la vente par `id`, sinon prend la première.
4. Initialise les champs :
   - `client`,
   - `cashier`,
   - `date`,
   - `status`,
   - `total` nettoyé en chiffres.
5. À la soumission :
   - valide `client`, `cashier`, `total` ;
   - remplace la vente correspondante ;
   - formate `total` en `"x FBu"` ;
   - conserve les autres champs.
6. Écrit `kamana_sales`.
7. Redirige vers `/sales`.

Données lues/écrites :

- Lit `kamana_sales`.
- Écrit `kamana_sales`.

### Flux : historique des ventes

Fichier : `src/pages/SalesHistory.jsx`

1. Ouvre `/history`.
2. `getStoredHistory` lit `kamana_sales`.
3. Si `kamana_sales` existe, chaque vente est transformée en entrée historique.
4. Sinon, utilise `initialSalesHistory`.
5. Recherche par :
   - `id`,
   - `client`,
   - `cashier`,
   - `total`,
   - `products`.
6. Filtre par statut et caissier.
7. Statistiques :
   - ventes totales : `history.length` ;
   - ventes annulées : statut `"Annulée"` ;
   - montant total : somme des ventes `"Terminée"` ;
   - meilleur jour : valeur fixe `"Samedi"`.
8. La vue détail affiche les produits :
   - si `productsList` existe et non vide, affiche les produits de la vente ;
   - sinon affiche trois lignes statiques.
9. Le bouton `Exporter` déclenche un `alert`.

Données lues/écrites :

- Lit `kamana_sales`.
- N'écrit rien.

### Flux : liste des factures

Fichier : `src/pages/Invoices.jsx`

1. Lit `kamana_invoices`, fallback `initialInvoices`.
2. Recherche par :
   - `invoice.id`,
   - `invoice.saleId`,
   - `invoice.client`,
   - `invoice.cashier`,
   - `invoice.total`.
3. Filtre par statut : `Payée`, `Supprimée`.
4. Filtre par caissier.
5. Statistiques :
   - factures du jour : `invoices.length`, sans filtre date ;
   - total facturé : somme des factures `Payée` ;
   - factures payées : statut `Payée` ;
   - factures supprimées : statut `Supprimée`.
6. La modale rapide affiche les données facture plus `invoiceProducts` statiques.
7. Le détail `/invoices/:id` ouvre `InvoiceDetails`.
8. Le bouton ajouter facture est commenté dans le header, mais la route `/invoices/add` existe.

Données lues :

- `kamana_invoices` ou `initialInvoices`.
- `invoiceProducts` statique.

### Flux : ajout d'une facture

Fichier : `src/pages/AddInvoice.jsx`

1. Ouvre `/invoices/add`.
2. Formulaire initial :
   - `saleId: ""`,
   - `client: "Client de passage"`,
   - `cashier: user?.role || "Admin"`,
   - `total: ""`,
   - `date: "25/05/2025 22:45"`,
   - `status: "Payée"`.
3. Validation :
   - `client`,
   - `cashier`,
   - `total`.
4. Lit `kamana_invoices`, fallback `initialInvoices`.
5. Génère `id`.
6. Utilise `formData.saleId` si fourni, sinon génère un `saleId`.
7. Formate `total` avec `Number(formData.total).toLocaleString("fr-FR") + " FBu"`.
8. Ajoute au début du tableau.
9. Écrit `kamana_invoices`.
10. Redirige vers `/invoices`.

Données lues/écrites :

- Lit `kamana_invoices`.
- Écrit `kamana_invoices`.

### Flux : suppression d'une facture

Fichier : `src/pages/Invoices.jsx`

1. L'utilisateur sélectionne une facture.
2. `ConfirmModal` demande confirmation.
3. `handleDelete` filtre par `invoice.id`.
4. `saveInvoices` réécrit `kamana_invoices`.

Données modifiées :

- Réécrit `kamana_invoices` sans la facture.

Important :

- La suppression ne change pas le statut en `"Supprimée"`, elle retire l'objet du tableau.

### Flux : détail d'une facture

Fichier : `src/pages/InvoiceDetails.jsx`

1. Ouvre `/invoices/:id`.
2. Lit `kamana_invoices`, fallback `initialInvoices`.
3. Cherche la facture par `id`, sinon prend la première.
4. Affiche les informations facture.
5. Affiche les lignes `invoiceProducts` statiques.
6. Les boutons `Télécharger` et `Imprimer` n'ont pas de handler métier.

Données lues :

- `kamana_invoices`.
- `invoiceProducts`.

### Flux : liste des utilisateurs

Fichier : `src/pages/Users.jsx`

1. Lit `kamana_users`, fallback `initialUsers`.
2. Recherche par :
   - `id`,
   - `name`,
   - `email`,
   - `role`,
   - `phone`.
3. Filtre par rôle, valeurs déduites des utilisateurs.
4. Filtre par statut : `Actif`, `Désactivé`.
5. Statistiques :
   - actifs,
   - désactivés,
   - administrateurs,
   - caissiers.
6. La vue détail affiche des permissions statiques `"Oui"` pour tous les modules, pas les vraies permissions de l'objet.

Données lues :

- `kamana_users` ou `initialUsers`.

### Flux : ajout d'un utilisateur

Fichier : `src/pages/AddUser.jsx`

1. Ouvre `/users/add`.
2. Formulaire initial :
   - `role: "Caissier"`,
   - `status: "Actif"`,
   - `dateCreated: "25/05/2025"`,
   - `photo: ""`,
   - permissions par défaut.
3. Validation :
   - `name`, `email`, `phone`, `password` requis ;
   - `password.length >= 8` ;
   - `password === confirmPassword`.
4. Lit `kamana_users`, fallback `initialUsers`.
5. Génère `id`.
6. Construit `newUser` sans mot de passe.
7. Ajoute au début.
8. Écrit `kamana_users`.
9. Redirige vers `/users`.

Données lues/écrites :

- Lit `kamana_users`.
- Écrit `kamana_users`.

### Flux : suppression d'un utilisateur

Fichier : `src/pages/Users.jsx`

1. L'utilisateur clique sur suppression.
2. `ConfirmModal` demande confirmation.
3. `handleDelete` filtre par `userToDelete.id`.
4. `saveUsers` réécrit `kamana_users`.

Données modifiées :

- Réécrit `kamana_users` sans l'utilisateur.

### Flux : modification d'un utilisateur

Fichier : `src/pages/EditUser.jsx`

1. Ouvre `/users/edit/:id`.
2. Lit `kamana_users`, fallback `initialUsers`.
3. Cherche l'utilisateur par `id`, sinon prend le premier.
4. Initialise `permissions` :
   - depuis `selectedUser.permissions` si présent ;
   - sinon depuis un objet par défaut où `admin` et `users` valent `true` si rôle `"Administrateur"`.
5. Validation :
   - `name`,
   - `email`,
   - `phone`.
6. Mappe le tableau et remplace l'utilisateur sélectionné.
7. Écrit `kamana_users`.
8. Redirige vers `/users`.

Données lues/écrites :

- Lit `kamana_users`.
- Écrit `kamana_users`.

## 6. Authentification / autorisation

### Authentification actuelle

Fichiers :

- `src/pages/Login.jsx`
- `src/App.jsx`
- `src/data/mockData.js`

Fonctionnement :

- Identifiants codés en dur dans `authUser` :
  - email : `kamanaurbain12@gmail.com`
  - password : `@Kamana123`
- `Login.jsx` compare directement les valeurs du formulaire.
- En cas de succès, l'objet connecté est stocké dans `kamana_user`.
- En cas d'échec, un message d'erreur est affiché.

### Session

- La présence de `user` dans l'état `App` définit si l'utilisateur est connecté.
- `user` est restauré depuis `kamana_user` au chargement.
- `handleLogout` supprime `kamana_user`.
- Aucun délai d'expiration n'existe.
- Aucun token n'existe.

### Autorisation

Il n'existe pas de contrôle de rôle ou permission sur les routes.

- `ProtectedRoute` vérifie seulement si `user` existe.
- Les rôles (`Admin`, `Administrateur`, `Caissier`, etc.) sont affichés et filtrés, mais ne protègent aucune action.
- Les permissions stockées dans `kamana_users.permissions` ne sont pas consultées par `App.jsx`, `Sidebar.jsx` ni les pages.
- Les utilisateurs de `kamana_users` ne peuvent pas se connecter.

Pour un backend compatible, il faut au minimum reproduire la session actuelle. Pour une version plus sécurisée, il faudra ajouter une vraie authentification et décider comment migrer `kamana_users`.

## 7. State management

### Gestion d'état utilisée

Le projet utilise uniquement :

- `useState` ;
- `useMemo` ;
- props (`user`, `onLogout`) ;
- `react-router-dom` pour la navigation.

Il n'existe pas de :

- Context API personnalisé ;
- Redux ;
- Zustand ;
- React Query ;
- service API ;
- hook métier partagé.

### États synchronisés avec `localStorage`

| Page | État React | Clé synchronisée | Synchronisation |
|---|---|---|---|
| `App.jsx` | `user` | `kamana_user` | lecture initiale, écriture login, suppression logout |
| `Products.jsx` | `products` | `kamana_products` | lecture initiale, écriture suppression |
| `Sales.jsx` | `sales` | `kamana_sales` | lecture initiale, écriture suppression |
| `Invoices.jsx` | `invoices` | `kamana_invoices` | lecture initiale, écriture suppression |
| `Users.jsx` | `users` | `kamana_users` | lecture initiale, écriture suppression |

### États de formulaire non persistés directement

Les pages `Add*` et `Edit*` gardent les valeurs de formulaire dans `useState`, puis écrivent dans `localStorage` seulement au submit.

### États purement UI

Les filtres, recherches, modales et sélections ne sont pas persistés :

- `searchTerm`
- `categoryFilter`
- `statusFilter`
- `cashierFilter`
- `roleFilter`
- `productToDelete`, `productToView`
- `saleToDelete`, `saleToView`
- `invoiceToDelete`, `invoiceToView`
- `userToDelete`, `userToView`
- `selectedSale` dans l'historique

## 8. Validation et règles métier

### Validation login

Fichier : `src/pages/Login.jsx`

- `email.trim()` doit être strictement égal à `authUser.email`.
- `password` doit être strictement égal à `authUser.password`.
- Message d'échec : `"Email ou mot de passe incorrect."`.

### Validation produit

Fichier : `src/pages/AddProduct.jsx`

Champs obligatoires :

- `name`
- `category`
- `price`
- `stock`
- `unit`
- `reference`

Defaults :

- `status: "Disponible"`
- `dateAdded: "25/05/2025"`
- `description: "Aucune description."` si vide
- `minStock: "0"` si vide

Règles côté liste :

- Stock faible si `Number(product.stock) <= Number(product.minStock)`.
- Rupture si `product.status === "Rupture" || Number(product.stock) === 0`.

Limites :

- Pas de validation du prix numérique hors type input.
- Pas de validation de référence unique.
- Pas de validation de catégorie hors options UI.
- Pas de mise à jour persistante dans `EditProduct.jsx`.

### Validation vente

Fichier : `src/pages/AddSale.jsx`

Champs requis à la soumission :

- `client`
- `cashier`
- au moins un produit dans `cart`

Calculs :

- Prix numérique : `cleanNumber(item.price)`.
- Total : somme `item.quantity * cleanNumber(item.price)`.
- Montant reçu : `cleanNumber(receivedAmount)`.
- Monnaie : `Math.max(received - total, 0)`.

Règles panier :

- Ajouter le même produit augmente la quantité.
- Supprimer un produit du panier retire la ligne.

Limites :

- Pas de décrément de stock.
- Pas de validation de stock disponible.
- Pas de validation `receivedAmount >= total`.
- Pas de création automatique de facture.
- `cashier` par défaut utilise `user?.role`, pas `user?.name`.

Fichier : `src/pages/EditSale.jsx`

- Champs requis : `client`, `cashier`, `total`.
- `total` est stocké en format `"x FBu"`.
- Les produits et paiements existants sont conservés si présents.

### Validation facture

Fichier : `src/pages/AddInvoice.jsx`

Champs requis :

- `client`
- `cashier`
- `total`

Defaults :

- `client: "Client de passage"`
- `cashier: user?.role || "Admin"`
- `date: "25/05/2025 22:45"`
- `status: "Payée"`
- `saleId` généré si absent.

Limites :

- Pas de vérification que `saleId` existe.
- Pas de lignes de facture persistées par facture.
- Pas de modification de facture.

### Validation utilisateur

Fichier : `src/pages/AddUser.jsx`

Champs requis :

- `name`
- `email`
- `phone`
- `password`

Règles :

- `password.length >= 8`.
- `password === confirmPassword`.

Defaults :

- `role: "Caissier"`
- `status: "Actif"`
- `dateCreated: "25/05/2025"`
- permissions par défaut.

Limites :

- Mot de passe non persisté.
- Pas de vérification email unique.
- Pas d'authentification via ces utilisateurs.
- Pas de validation serveur.

Fichier : `src/pages/EditUser.jsx`

- Champs requis : `name`, `email`, `phone`.
- Pas de modification de mot de passe.
- Permissions sauvegardées mais non utilisées pour l'autorisation.

### Règles de format monétaire

Plusieurs modules stockent les montants sous forme de chaînes :

- Produit : `price` sans `FBu`, exemple `"1 000"`.
- Vente : `total`, `receivedAmount`, `change` avec `FBu`.
- Facture : `total` avec `FBu`.

Les calculs utilisent souvent :

```js
Number(String(value).replace(/\D/g, ""))
```

Conséquence :

- `"1 000 FBu"` devient `1000`.
- `"1.000.000"` devient `1000000`.
- `""` devient `0`.

### Statuts reconnus

`StatusBadge.jsx` reconnaît :

Statuts verts :

- `Terminée`
- `Payée`
- `Disponible`
- `Actif`
- `Validée`
- `En cours`

Statuts rouges :

- `Annulée`
- `Supprimée`
- `Désactivé`
- `Terminé`
- `Rupture`

## 9. Composants et dépendances aux données

| Composant/Page | Données consommées | Données modifiées | Remarques |
|---|---|---|---|
| `App.jsx` | `kamana_user` | `kamana_user` | état global de session |
| `Login.jsx` | `authUser` | via `onLogin`, donc `kamana_user` | login mocké |
| `Dashboard.jsx` | exports dashboard de `mockData.js`, `user` | aucune | ne reflète pas `localStorage` |
| `Products.jsx` | `kamana_products` ou `initialProducts` | `kamana_products` lors suppression | recherche, filtres, stats |
| `AddProduct.jsx` | `kamana_products` ou `initialProducts` | `kamana_products` lors ajout | génère `PRO-*` |
| `EditProduct.jsx` | `products` de `mockData.js` | aucune | édition non persistante |
| `Sales.jsx` | `kamana_sales` ou `initialSales` | `kamana_sales` lors suppression | stats calculées côté client |
| `AddSale.jsx` | `kamana_products`, `kamana_sales`, `user` | `kamana_sales` lors ajout | panier local |
| `EditSale.jsx` | `kamana_sales` ou `initialSales` | `kamana_sales` lors édition | édition partielle |
| `SalesHistory.jsx` | `kamana_sales` ou `salesHistory` | aucune | historique dérivé |
| `Invoices.jsx` | `kamana_invoices`, `invoiceProducts` | `kamana_invoices` lors suppression | lignes de facture statiques |
| `AddInvoice.jsx` | `kamana_invoices`, `user` | `kamana_invoices` lors ajout | route existe mais lien d'ajout commenté |
| `InvoiceDetails.jsx` | `kamana_invoices`, `invoiceProducts` | aucune | fallback sur première facture |
| `Users.jsx` | `kamana_users` ou `initialUsers` | `kamana_users` lors suppression | permissions affichées statiquement |
| `AddUser.jsx` | `kamana_users` | `kamana_users` lors ajout | mot de passe non stocké |
| `EditUser.jsx` | `kamana_users` | `kamana_users` lors édition | permissions sauvegardées |
| `DashboardLayout.jsx` | `user`, `onLogout`, `activePage` | aucune | layout partagé |
| `Header.jsx` | `user` | aucune | fallback nom/rôle |
| `Sidebar.jsx` | `activePage`, `onLogout` | déclenche logout | navigation |
| `StatusBadge.jsx` | `status` | aucune | classes CSS selon statut |
| `ConfirmModal.jsx` | props de confirmation | appelle `onConfirm` | utilisé utilisateurs/factures |

## 10. Endpoints virtuels nécessaires pour un backend compatible

Cette section propose une API REST équivalente aux opérations `localStorage` actuelles. Les routes sont proposées ; elles n'existent pas dans le code actuel.

Principes de compatibilité :

- Les réponses doivent conserver les champs et formats actuels tant que le frontend n'est pas refactoré.
- Les listes doivent pouvoir être renvoyées dans l'ordre attendu par l'UI : les nouveaux éléments apparaissent en premier.
- Pour compatibilité stricte, les ids peuvent reprendre les formats `PRO-*`, `VTE-*`, `FAC-*`, `UTI-*`.
- À terme, il est préférable que le backend génère des ids de manière fiable et que le frontend accepte la réponse backend.

### Authentification

#### `POST /api/auth/login`

Équivaut à `Login.jsx` + `handleLogin`.

Payload :

```json
{
  "email": "kamanaurbain12@gmail.com",
  "password": "@Kamana123"
}
```

Réponse compatible minimale :

```json
{
  "user": {
    "id": 1,
    "name": "Kamana urbain",
    "email": "kamanaurbain12@gmail.com",
    "role": "Admin",
    "fullRole": "Administrateur"
  }
}
```

Réponse recommandée si vraie session :

```json
{
  "user": {
    "id": 1,
    "name": "Kamana urbain",
    "email": "kamanaurbain12@gmail.com",
    "role": "Admin",
    "fullRole": "Administrateur"
  },
  "accessToken": "..."
}
```

#### `GET /api/auth/me`

Restaure la session côté backend au lieu de lire `kamana_user`.

Réponse :

```json
{
  "id": 1,
  "name": "Kamana urbain",
  "email": "kamanaurbain12@gmail.com",
  "role": "Admin",
  "fullRole": "Administrateur"
}
```

#### `POST /api/auth/logout`

Équivaut à `handleLogout`.

Réponse :

```json
{
  "success": true
}
```

### Produits

#### `GET /api/products`

Équivaut à `getStoredProducts`.

Query params optionnels pour déplacer les filtres côté backend :

- `search`
- `category`
- `status`

Réponse :

```json
[
  {
    "id": "PRO-001",
    "name": "Fanta Orange 33cl",
    "category": "Boissons",
    "price": "1 000",
    "stock": "128",
    "unit": "Bouteille",
    "status": "Disponible",
    "dateAdded": "15/05/2025",
    "description": "Boisson gazeuse Fanta Orange 33cl, servie fraîche au bar.",
    "minStock": "10",
    "reference": "FAN-ORG-033"
  }
]
```

#### `GET /api/products/:id`

Équivaut aux vues détail et au futur vrai `EditProduct`.

Réponse :

```json
{
  "id": "PRO-001",
  "name": "Fanta Orange 33cl",
  "category": "Boissons",
  "price": "1 000",
  "stock": "128",
  "unit": "Bouteille",
  "status": "Disponible",
  "dateAdded": "15/05/2025",
  "description": "Boisson gazeuse Fanta Orange 33cl, servie fraîche au bar.",
  "minStock": "10",
  "reference": "FAN-ORG-033"
}
```

#### `POST /api/products`

Équivaut à `AddProduct.jsx`.

Payload :

```json
{
  "name": "Jus d'ananas",
  "category": "Boissons",
  "price": "2000",
  "stock": "30",
  "unit": "Verre",
  "status": "Disponible",
  "dateAdded": "25/05/2025",
  "description": "",
  "minStock": "",
  "reference": "JUS-ANA-001"
}
```

Réponse :

```json
{
  "id": "PRO-005",
  "name": "Jus d'ananas",
  "category": "Boissons",
  "price": "2000",
  "stock": "30",
  "unit": "Verre",
  "status": "Disponible",
  "dateAdded": "25/05/2025",
  "description": "Aucune description.",
  "minStock": "0",
  "reference": "JUS-ANA-001"
}
```

#### `PUT /api/products/:id`

Nécessaire pour rendre `EditProduct.jsx` réellement compatible backend, même si le code actuel ne sauvegarde pas.

Payload :

```json
{
  "name": "Fanta Orange 33cl",
  "category": "Boissons",
  "price": "1 000",
  "stock": "128",
  "unit": "Bouteille",
  "status": "Disponible",
  "dateAdded": "15/05/2025",
  "description": "Boisson gazeuse Fanta Orange 33cl, servie fraîche au bar.",
  "minStock": "10",
  "reference": "FAN-ORG-033"
}
```

Réponse : objet produit mis à jour.

#### `DELETE /api/products/:id`

Équivaut à `Products.jsx` `handleDelete`.

Réponse :

```json
{
  "success": true,
  "deletedId": "PRO-001"
}
```

### Ventes

#### `GET /api/sales`

Équivaut à `getStoredSales`.

Query params optionnels :

- `search`
- `status`
- `cashier`

Réponse :

```json
[
  {
    "id": "VTE-000145",
    "client": "Kamana Urbain",
    "cashier": "Admin",
    "total": "125 000 FBu",
    "date": "25/05/2025 22:45",
    "status": "Terminée"
  }
]
```

#### `GET /api/sales/:id`

Réponse :

```json
{
  "id": "VTE-000007",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Terminée",
  "products": [
    {
      "id": "PRO-001",
      "name": "Fanta Orange 33cl",
      "price": "1 000",
      "quantity": 2
    }
  ],
  "receivedAmount": "25 000 FBu",
  "change": "5 000 FBu"
}
```

#### `POST /api/sales`

Équivaut à `AddSale.jsx`.

Payload :

```json
{
  "client": "Client de passage",
  "cashier": "Admin",
  "date": "25/05/2025 22:45",
  "status": "Terminée",
  "products": [
    {
      "id": "PRO-001",
      "name": "Fanta Orange 33cl",
      "price": "1 000",
      "quantity": 2
    }
  ],
  "receivedAmount": "25000"
}
```

Réponse :

```json
{
  "id": "VTE-000007",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "2 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Terminée",
  "products": [
    {
      "id": "PRO-001",
      "name": "Fanta Orange 33cl",
      "price": "1 000",
      "quantity": 2
    }
  ],
  "receivedAmount": "25 000 FBu",
  "change": "23 000 FBu"
}
```

#### `PUT /api/sales/:id`

Équivaut à `EditSale.jsx`.

Payload :

```json
{
  "client": "Client de passage",
  "cashier": "Admin",
  "date": "25/05/2025 22:45",
  "status": "Terminée",
  "total": "20000"
}
```

Réponse :

```json
{
  "id": "VTE-000007",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Terminée",
  "products": [],
  "receivedAmount": "0 FBu",
  "change": "0 FBu"
}
```

Note : si les champs optionnels existaient avant, le comportement actuel les conserve.

#### `DELETE /api/sales/:id`

Équivaut à `Sales.jsx` `handleDelete`.

Réponse :

```json
{
  "success": true,
  "deletedId": "VTE-000007"
}
```

#### `GET /api/sales/history`

Équivaut à `SalesHistory.jsx`.

Réponse :

```json
[
  {
    "id": "VTE-000007",
    "client": "Client de passage",
    "cashier": "Admin",
    "products": "1 article(s)",
    "total": "2 000 FBu",
    "date": "25/05/2025 22:45",
    "status": "Terminée",
    "productsList": [
      {
        "id": "PRO-001",
        "name": "Fanta Orange 33cl",
        "price": "1 000",
        "quantity": 2
      }
    ],
    "receivedAmount": "25 000 FBu",
    "change": "23 000 FBu"
  }
]
```

### Factures

#### `GET /api/invoices`

Équivaut à `getStoredInvoices`.

Query params optionnels :

- `search`
- `status`
- `cashier`

Réponse :

```json
[
  {
    "id": "FAC-000145",
    "saleId": "VTE-000145",
    "client": "Client de passage",
    "cashier": "Admin",
    "total": "20 000 FBu",
    "date": "25/05/2025 22:45",
    "status": "Payée"
  }
]
```

#### `GET /api/invoices/:id`

Équivaut à `InvoiceDetails.jsx`.

Réponse :

```json
{
  "id": "FAC-000145",
  "saleId": "VTE-000145",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Payée",
  "products": [
    {
      "product": "Fanta Orange 33cl",
      "quantity": 2,
      "unitPrice": "1 000 FBu",
      "amount": "2 000 FBu"
    }
  ]
}
```

Note : `products` n'existe pas dans le modèle `Invoice` actuel ; il vient de `invoiceProducts`. Cet ajout dans la réponse est recommandé pour remplacer proprement les lignes statiques.

#### `POST /api/invoices`

Équivaut à `AddInvoice.jsx`.

Payload :

```json
{
  "saleId": "",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20000",
  "date": "25/05/2025 22:45",
  "status": "Payée"
}
```

Réponse :

```json
{
  "id": "FAC-000007",
  "saleId": "VTE-000007",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Payée"
}
```

#### `DELETE /api/invoices/:id`

Équivaut à `Invoices.jsx` `handleDelete`.

Réponse :

```json
{
  "success": true,
  "deletedId": "FAC-000007"
}
```

#### `PUT /api/invoices/:id`

Le code actuel n'a pas d'écran d'édition facture. Endpoint optionnel si le backend veut être complet.

Payload :

```json
{
  "saleId": "VTE-000145",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Payée"
}
```

Réponse : facture mise à jour.

### Utilisateurs

#### `GET /api/users`

Équivaut à `getStoredUsers`.

Query params optionnels :

- `search`
- `role`
- `status`

Réponse :

```json
[
  {
    "id": "UTI-00018",
    "name": "Kamana urbain",
    "email": "kamanaurbain12@gmail.com",
    "phone": "+257 79 12 34 56",
    "role": "Administrateur",
    "status": "Actif",
    "dateCreated": "25/05/2025"
  }
]
```

#### `GET /api/users/:id`

Réponse :

```json
{
  "id": "UTI-00018",
  "name": "Kamana urbain",
  "email": "kamanaurbain12@gmail.com",
  "phone": "+257 79 12 34 56",
  "role": "Administrateur",
  "status": "Actif",
  "dateCreated": "25/05/2025",
  "photo": "",
  "permissions": {
    "sales": true,
    "products": true,
    "invoices": true,
    "admin": true,
    "users": true,
    "history": true
  }
}
```

#### `POST /api/users`

Équivaut à `AddUser.jsx`.

Payload :

```json
{
  "name": "Jean K.",
  "email": "jean@example.com",
  "phone": "+257 79 00 00 00",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "Caissier",
  "status": "Actif",
  "dateCreated": "25/05/2025",
  "photo": "",
  "permissions": {
    "sales": true,
    "products": true,
    "invoices": true,
    "admin": false,
    "users": false,
    "history": true
  }
}
```

Réponse :

```json
{
  "id": "UTI-00007",
  "name": "Jean K.",
  "email": "jean@example.com",
  "phone": "+257 79 00 00 00",
  "role": "Caissier",
  "status": "Actif",
  "dateCreated": "25/05/2025",
  "photo": "",
  "permissions": {
    "sales": true,
    "products": true,
    "invoices": true,
    "admin": false,
    "users": false,
    "history": true
  }
}
```

Important :

- Le backend doit hasher le mot de passe s'il décide de le persister.
- Pour compatibilité frontend actuelle, ne jamais renvoyer `password`.

#### `PUT /api/users/:id`

Équivaut à `EditUser.jsx`.

Payload :

```json
{
  "name": "Jean K.",
  "email": "jean@example.com",
  "phone": "+257 79 00 00 00",
  "role": "Caissier",
  "status": "Actif",
  "dateCreated": "25/05/2025",
  "photo": "",
  "permissions": {
    "sales": true,
    "products": true,
    "invoices": true,
    "admin": false,
    "users": false,
    "history": true
  }
}
```

Réponse : utilisateur mis à jour.

#### `DELETE /api/users/:id`

Équivaut à `Users.jsx` `handleDelete`.

Réponse :

```json
{
  "success": true,
  "deletedId": "UTI-00007"
}
```

### Tableau de bord

Le dashboard actuel est statique. Pour remplacer complètement `mockData.js`, prévoir :

#### `GET /api/dashboard`

Réponse compatible :

```json
{
  "stats": [
    {
      "id": 1,
      "title": "Produits",
      "value": "125",
      "subtitle": "Produits Disponibles",
      "percent": "5%",
      "color": "green"
    }
  ],
  "salesEvolution": [
    {
      "day": "Lun",
      "value": 0.8
    }
  ],
  "recentSales": [
    {
      "id": "VTE-001",
      "client": "kamana",
      "amount": "50.000",
      "date": "25/05/2025",
      "status": "Terminée"
    }
  ],
  "recentInvoices": [
    {
      "id": "FAC-001",
      "client": "kamana",
      "amount": "50.000",
      "date": "25/05/2025",
      "status": "Payée"
    }
  ],
  "topProducts": [
    {
      "name": "Fanta",
      "category": "Boisson",
      "price": "5.000",
      "stock": "150",
      "status": "Disponible"
    }
  ]
}
```

Une version backend plus cohérente pourrait calculer ces valeurs depuis `products`, `sales`, `invoices` et `users`, mais ce n'est pas ce que fait le frontend actuel.

## 11. Points de vigilance pour la migration backend

### Écarts et comportements incomplets trouvés

- `EditProduct.jsx` ne modifie pas `kamana_products`.
- Le dashboard ne reflète pas les données persistées.
- Les factures ne sont pas générées automatiquement lors d'une vente.
- Les lignes de facture sont statiques pour toutes les factures.
- Les utilisateurs créés ne peuvent pas se connecter.
- Les mots de passe utilisateurs ne sont pas stockés.
- Les permissions utilisateurs ne protègent aucune route.
- Les suppressions retirent les objets des tableaux, sauf les statuts mockés `"Supprimée"` et `"Annulée"` déjà présents.
- Les IDs sont générés par longueur de tableau, pas par séquence fiable.
- Les dates sont codées en dur dans les formulaires, pas générées à la date réelle.
- Les erreurs JSON ne sont gérées que pour `kamana_user`, pas pour les autres clés.
- Aucune validation d'unicité n'existe pour email, référence produit ou ids.
- Aucune validation serveur n'existe.
- Aucun test automatisé n'a été trouvé dans le projet.

### Recommandation de migration progressive

1. Créer une couche API côté frontend qui garde les mêmes noms de modèles.
2. Remplacer chaque `getStored*` par un `GET /api/...`.
3. Remplacer chaque `localStorage.setItem` par `POST`, `PUT` ou `DELETE`.
4. Garder temporairement les formats string existants (`"20 000 FBu"`, dates `DD/MM/YYYY HH:mm`) pour éviter de casser l'UI.
5. Ajouter ensuite une normalisation backend interne :
   - montants numériques en base ;
   - dates en type date/datetime ;
   - relations `sale_items` et `invoice_items` ;
   - ids techniques séparés des codes visibles.
6. Corriger explicitement les comportements non persistants comme `EditProduct.jsx`.

### Schéma relationnel recommandé

Pour remplacer proprement le `localStorage`, un backend relationnel pourrait utiliser :

- `users`
  - id technique
  - code visible `UTI-*`
  - name, email, phone, password_hash, role, status, date_created, photo
- `user_permissions`
  - user_id
  - sales, products, invoices, admin, users, history
- `products`
  - id technique
  - code visible `PRO-*`
  - name, category, price_amount, stock_quantity, unit, status, date_added, description, min_stock, reference
- `sales`
  - id technique
  - code visible `VTE-*`
  - client, cashier/user_id optionnel, total_amount, date, status, received_amount, change_amount
- `sale_items`
  - sale_id
  - product_id
  - product_name_snapshot
  - unit_price_snapshot
  - quantity
- `invoices`
  - id technique
  - code visible `FAC-*`
  - sale_id nullable
  - client, cashier/user_id optionnel, total_amount, date, status
- `invoice_items`
  - invoice_id
  - product_name
  - quantity
  - unit_price
  - amount

Pour compatibilité frontend, l'API peut transformer ces champs normalisés vers les chaînes actuelles au moment de répondre.
