# API Kamana's Bar

Base URL locale :

```text
http://127.0.0.1:3050/api
```

Sauf `POST /auth/login` et `GET /health`, les routes utilisent :

```http
Authorization: Bearer <accessToken>
```

## Auth

### POST `/auth/login`

Payload :

```json
{
  "email": "kamanaurbain12@gmail.com",
  "password": "@Kamana123"
}
```

Reponse :

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

### GET `/auth/me`

Reponse :

```json
{
  "id": 1,
  "name": "Kamana urbain",
  "email": "kamanaurbain12@gmail.com",
  "role": "Admin",
  "fullRole": "Administrateur"
}
```

### POST `/auth/logout`

Reponse :

```json
{
  "success": true
}
```

## Products

### GET `/products`

Query optionnels : `search`, `category`, `status`.

Reponse :

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

### GET `/products/:id`

Reponse : un objet produit au meme format.

### POST `/products`

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

Reponse :

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

### PUT `/products/:id`

Payload : memes champs que `POST /products`.

Reponse : produit mis a jour.

### DELETE `/products/:id`

Reponse :

```json
{
  "success": true,
  "deletedId": "PRO-001"
}
```

## Sales

### GET `/sales`

Query optionnels : `search`, `status`, `cashier`.

Reponse :

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

### GET `/sales/:id`

Reponse :

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

### POST `/sales`

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

Reponse :

```json
{
  "id": "VTE-000146",
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

Note : le stock produit n'est pas decremente, comme dans le comportement frontend actuel.

### PUT `/sales/:id`

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

Reponse : vente mise a jour, avec les champs optionnels existants conserves.

### DELETE `/sales/:id`

```json
{
  "success": true,
  "deletedId": "VTE-000007"
}
```

### GET `/sales/history`

Reponse :

```json
[
  {
    "id": "VTE-000146",
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

## Invoices

### GET `/invoices`

Query optionnels : `search`, `status`, `cashier`.

Reponse :

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

### GET `/invoices/:id`

Reponse :

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

Les lignes `products` sont derivees de la vente liee quand elle contient un panier, sinon le fallback statique frontend est renvoye.

### POST `/invoices`

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

Reponse :

```json
{
  "id": "FAC-000146",
  "saleId": "VTE-000146",
  "client": "Client de passage",
  "cashier": "Admin",
  "total": "20 000 FBu",
  "date": "25/05/2025 22:45",
  "status": "Payée"
}
```

### PUT `/invoices/:id`

Payload : `saleId`, `client`, `cashier`, `total`, `date`, `status`.

Reponse : facture mise a jour.

### DELETE `/invoices/:id`

```json
{
  "success": true,
  "deletedId": "FAC-000007"
}
```

## Users

### GET `/users`

Query optionnels : `search`, `role`, `status`.

Reponse :

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

### GET `/users/:id`

Reponse :

```json
{
  "id": "UTI-00019",
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

### POST `/users`

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

Reponse : utilisateur cree sans champ `password`.

### PUT `/users/:id`

Payload : `name`, `email`, `phone`, `role`, `status`, `dateCreated`, `photo`, `permissions`.

Reponse : utilisateur mis a jour sans champ `password`.

### DELETE `/users/:id`

```json
{
  "success": true,
  "deletedId": "UTI-00019"
}
```

## Dashboard

### GET `/dashboard`

Reponse :

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
