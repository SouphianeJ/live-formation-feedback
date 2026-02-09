# Live Formation Feedback

Plateforme de questionnaires diagnostiques avec scoring par domaines et recommandations envoyées par email.

## Stack
- Next.js (App Router) + TypeScript
- MongoDB Atlas via Prisma (MongoDB)
- Auth admin par code magique + JWT httpOnly
- Emails via Nodemailer (SMTP Google)

## Setup local
1. Installer les dépendances
```bash
cd app
npm install
```

2. Configurer `.env`
```ini
DATABASE_URL="mongodb+srv://USER:PASS@cluster.mongodb.net/db"
JWT_SECRET="super-secret"
ADMIN_ALLOWED_EMAILS="admin@domaine.com,admin2@domaine.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="email@gmail.com"
SMTP_PASS="app-password"
SMTP_FROM="Live Formation <email@gmail.com>"
APP_BASE_URL="http://localhost:3000"
```

3. Générer Prisma
```bash
npx prisma generate
```

4. Lancer le serveur
```bash
npm run dev
```

## MongoDB Atlas
- Créez un cluster MongoDB Atlas
- Ajoutez un utilisateur avec accès lecture/écriture
- Renseignez la chaîne de connexion dans `DATABASE_URL`

## SMTP Google
- Activez les mots de passe d'application Google (compte Gmail)
- Utilisez le mot de passe d'application dans `SMTP_PASS`

## Déploiement Vercel
1. Pousser le repo vers GitHub
2. Connecter le repo à Vercel
3. Ajouter les variables d'environnement dans Vercel
4. Déployer

## Notes
- Les tentatives sont verrouillées après soumission (`lockedAt`)
- Les recommandations sont basées sur les 2 domaines au score le plus faible
- Les snapshots sont stockés pour éviter tout recalcul
