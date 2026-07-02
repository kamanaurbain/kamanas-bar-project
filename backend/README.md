# Kamana's Bar Backend

Backend Node.js + Express + MongoDB pour remplacer les donnees `localStorage` du frontend React sans changer les formats exposes a l'interface.

## Installation

```bash
cd backend
npm install
```

Copier les variables d'environnement depuis `.env.example` vers `.env` ou utiliser `Config/conf.env` deja pris en charge par le serveur.

Variables principales :

```env
MONGODB_URI=mongodb://127.0.0.1:27017/kamanas_bar
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
PORT=3050
```

## Lancement

```bash
npm run dev
```

L'API demarre par defaut sur :

```text
http://127.0.0.1:3050
```

## Authentification initiale

Au demarrage, le serveur seed automatiquement l'administrateur compatible avec le frontend :

```text
email: kamanaurbain12@gmail.com
password: @Kamana123
```

Le mot de passe est stocke hashe avec bcrypt. Les routes metier attendent un token JWT :

```http
Authorization: Bearer <accessToken>
```

## Seed et IDs

Si les collections sont vides, le backend insere les donnees fallback documentees cote frontend. Les IDs visibles sont generes par compteur MongoDB atomique :

- `PRO-001`
- `VTE-000001`
- `FAC-000001`
- `UTI-00001`

Les compteurs sont synchronises au demarrage sur le plus grand ID deja present pour eviter les doublons apres suppression.

## Documentation API

Voir `API.md`.
