# Style Guide & UI Audit

## Audit rapide du repo (UI)
**Points positifs**
- Le responsive mobile fonctionne bien, y compris sur les pages publiques.
- Les composants sont simples, lisibles et faciles à faire évoluer.
- Les pages admin sont cohérentes (même structure, même espacement).

**Points a renforcer**
- La navigation manquait de presence visuelle et de hierarchie.
- Les boutons n'avaient pas de codage couleur clair par type d'action.
- Les labels et les champs n'etaient pas uniformes partout.
- La typographie et les couleurs pouvaient gagner en identite.

## Objectif visuel
Moderne, epure, efficace, avec une identite plus nette.
- Priorite a la lisibilite et a la hierarchie.
- Micro-densite raisonnable (confort en admin, lecture facile en public).
- Accent couleur controle (pas de surcharge).

## Tokens visuels (globals.css)
**Couleurs**
- Fond: `--background`
- Texte: `--foreground`
- Muted: `--muted`
- Marque (actions principales): `--accent`
- Succès (ajout/creation): `--success`
- Danger (suppression): `--danger`
- Avertissement (optionnel): `--warning`

**Typographies**
- Texte courant: `--font-sans` (Manrope)
- Titres: `--font-display` (Space Grotesk)
- Code: `--font-mono`

## Navigation
**Composant**
- `AdminNav` utilise `.nav`, `.nav__brand`, `.nav__links`, `.nav__actions`.

**Principes**
- La marque est a gauche avec un pill "Admin".
- Les liens de navigation sont en pastilles claires.
- L'action "Deconnexion" est un bouton discret (`btn ghost`).

## Boutons (actions codees par couleur)
**Classes**
- `btn` (primaire): action principale / confirmation.
- `btn success`: creation/ajout.
- `btn danger`: suppression/destruction.
- `btn secondary`: actions neutres, navigation, alternatives.
- `btn ghost`: actions secondaires dans les barres d'outils.

**Exemples**
- Ajouter -> `success`
- Sauver / Valider -> `primary`
- Supprimer -> `danger`
- Copier / Voir / Editer -> `secondary` ou `ghost`

## Labels et formulaires
**Regle**
- Tous les champs doivent avoir un label explicite.
- Utiliser `AdminField` en admin pour une presentation coherente.

## Cartes, sections et tableaux
- `Card` encadre les blocs principaux.
- `section` est une zone secondaire (cadre pointille).
- `table` conserve une apparence sobre, lisible.

## Etats et alertes
- `alert` pour erreurs ou blocage.
- `success` pour confirmation.

## Checklist rapide (quand on ajoute un ecran)
1. Ajouter un titre et un sous-titre clairs.
2. Utiliser des `Card` pour structurer.
3. Labels explicites pour chaque champ.
4. Boutons avec couleur d'action.
5. Verification mobile (stack des rows).
