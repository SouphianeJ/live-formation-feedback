# Seed DB (Mongo) – Structure + Procédure

Ce fichier décrit la structure des collections et la méthode que j’utiliserai pour “seeder” la base **directement via requêtes MongoDB**, à partir d’un brief que tu me donnes (questions, réponses, scores, etc.).

## Structure attendue (MongoDB / Prisma)

Collections (principales) :
- `Questionnaire`
- `Domain`
- `Question`
- `AnswerOption`
- `Training`
- `DomainTraining`
- `Resource`

### Questionnaire
Champs :
- `title` (string)
- `description` (string, optionnel)
- `slug` (string, unique)
- `status` (string)
- `createdAt` (date)
- `updatedAt` (date)

### Domain
Champs :
- `questionnaireId` (ObjectId → Questionnaire)
- `name` (string)
- `description` (string, optionnel)
- `order` (int)
- `createdAt`, `updatedAt` (date)

### Question
Champs :
- `domainId` (ObjectId → Domain)
- `type` (string)
- `prompt` (string)
- `helpText` (string, optionnel)
- `order` (int)
- `isRequired` (bool)
- `createdAt`, `updatedAt` (date)

### AnswerOption
Champs :
- `questionId` (ObjectId → Question)
- `value` (string)
- `label` (string)
- `score` (int)
- `order` (int)

### Training
Champs :
- `title` (string)
- `description` (string, optionnel)
- `duration` (string, optionnel)
- `format` (string, optionnel)
- `url` (string, optionnel)
- `createdAt`, `updatedAt` (date)

### DomainTraining
Champs :
- `domainId` (ObjectId → Domain)
- `trainingId` (ObjectId → Training)
- Unique (domainId, trainingId)

### Resource
Champs :
- `domainId` (ObjectId → Domain)
- `title` (string)
- `type` (string)
- `url` (string)
- `order` (int)

## Ce que j’ai besoin de toi (brief minimal)

Donne-moi :
1. **Questionnaire**
   - `title`, `description` (optionnel), `slug`, `status`
2. **Domaines** (ordre + description si besoin)
3. **Questions par domaine**
   - `prompt`, `helpText` (optionnel), `type`, `order`, `isRequired`
4. **Réponses par question**
   - `value`, `label`, `score`, `order`
5. (Optionnel) **Formations** et **ressources** par domaine

## Format de brief recommandé

```
Questionnaire:
  title: "..."
  description: "..."
  slug: "..."
  status: "active"

Domaines:
  - name: "Domaine A"
    description: "..."
    order: 1
    questions:
      - prompt: "..."
        helpText: "..."
        type: "single-choice"
        order: 1
        isRequired: true
        answers:
          - value: "A"
            label: "..."
            score: 1
            order: 1
          - value: "B"
            label: "..."
            score: 2
            order: 2
```

## Méthode de seed (ce que je ferai)

Je générerai et exécuterai des **requêtes MongoDB** dans l’ordre :
1. Insert `Questionnaire`
2. Insert `Domain` (avec `questionnaireId`)
3. Insert `Question` (avec `domainId`)
4. Insert `AnswerOption` (avec `questionId`)
5. (Optionnel) Insert `Training`, `DomainTraining`, `Resource`

Chaque insertion utilisera les `_id` créés pour chaîner les documents.

## Exemple de requêtes (schéma)

```js
db.Questionnaire.insertOne({
  title: "...",
  description: "...",
  slug: "...",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
})
```

Puis, avec l’`_id` retourné :

```js
db.Domain.insertOne({
  questionnaireId: ObjectId("..."),
  name: "...",
  description: "...",
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
})
```

Et ainsi de suite pour les `Question` et `AnswerOption`.

## Notes importantes

- Les dates sont stockées en UTC (comportement Mongo standard).
- Les ordres (`order`) doivent être cohérents pour l’affichage.
- Les champs `type` sont libres mais on utilise généralement :
  - `single-choice`
  - `multi-choice`
  - `scale`
  - `text`

---

Quand tu veux seed, envoie-moi le brief (format ci-dessus), et je génère les requêtes Mongo prêtes à exécuter.
