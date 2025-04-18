# 📊 Générateur de Bilans de Compétences via IA

## 🎯 Objectif du projet

Ce projet permet aux **administrateurs et enseignants** de créer, gérer et attribuer des **bilans de compétences générés par IA**, sous forme de QCM, afin d’évaluer les **étudiants** sur des langages de programmation spécifiques.

Les étudiants peuvent ensuite **répondre aux bilans** affectés à leur promotion, dans un temps imparti, et **visualiser leur score et leurs erreurs** après soumission.

---

## ✅ Fonctionnalités principales

### 🛠️ Panel Administrateur / Enseignant

- Création de questionnaires basés sur l’**IA** :
  - Choix du **nombre de questions** (entre 1 et 30)
  - Sélection de **plusieurs langages** à évaluer
  - Choix de la **difficulté** (30% simple, 40% moyenne, 30% difficile)
  - Ajout d’un **chronomètre** pour limiter le temps de réalisation
  - Ajout d'une **Date de fin**
- Possibilité de **réutiliser un questionnaire déjà existant**
- Attribution d’un questionnaire à une **promotion**
- Les enseignants **voient uniquement les questionnaires qu’ils ont créés**
- Visualisation :
  - Des **questions** du questionnaire
  - Des **notes des étudiants**
- Modification et suppression des questionnaires
- **Téléchargement des résultats en PDF et Excel**
- **Suivi visuel de l’avancement des requêtes via SweetAlert**

---

### 👨‍🎓 Panel Étudiant

- Accès uniquement aux **bilans affectés à leur promotion**
- Réalisation du QCM dans le **temps imparti**
- **Une seule tentative possible** par questionnaire
- Après soumission :
  - Affichage du **score final**
  - Visualisation des **erreurs** avec **explication** pour chaque mauvaise réponse
- **SweetAlert** affiche l'état d'envoi et la réception du résultat

---

## 📚 User Stories Réalisées

### 🧩 Story 4 – Création de bilans via IA

> **EN TANT QU’admin**, JE VEUX pouvoir créer des bilans de compétence via IA  
> AFIN D’évaluer les étudiants sur des langages de programmation spécifiques.

**Critères d’acceptation :**

- [x] Sélection des langages et du nombre de questions
- [x] Choix du nombre de réponses par question
- [x] Répartition des niveaux de difficulté : 30% simple, 40% moyen, 30% difficile
- [x] Génération IA de QCM avec réponses correctes
- [x] Sauvegarde des questions dans la base de données
- [x] Attribution d’un bilan à une promotion via table `knowledge_student`
- [x] Ajout d’une colonne de note dans la base de données

---

### 🧩 Story 5 – Réponse aux bilans par les étudiants

> **EN TANT QU’étudiant**, JE VEUX pouvoir répondre aux bilans de compétence disponibles  
> AFIN DE mesurer mes compétences sur les langages choisis.

**Critères d’acceptation :**

- [x] Accès aux bilans assignés
- [x] Réponse unique par étudiant
- [x] Possibilité de répondre dans le temps imparti
- [x] Calcul et affichage du score
- [x] Sauvegarde du résultat en base de données
- [x] Accès aux **erreurs** et **explications** après soumission

---

## 🧱 Base de données

- `knowledge_student` : stocke les bilans affectés
- `knowledge` : contient les questions générées par l’IA

---

## ⚙️ Technologies utilisées

- Laravel 12
- MySQL
- IA : Gemini
- **SweetAlert** : feedback visuel pour les requêtes

---

# 📋 Rétrospective Kanban Collaborative en Temps Réel

## 🎯 Objectif du module

Ce module permet aux **enseignants** et **administrateurs** de créer des **rétrospectives sous forme de Kanban** pour une promotion donnée.  
Les **étudiants** peuvent ensuite interagir en **temps réel** avec ces rétrospectives afin de proposer des idées, faire des retours, et améliorer les processus d'apprentissage en collaboration.

---

## ✅ Fonctionnalités principales

### 👨‍🏫 Panel Admin / Enseignant

- Création d’une **rétrospective** (nom + association à une **promotion**)
- Création de **colonnes personnalisées**
- Lancement ou suppression de la rétro
- **Seuls les enseignants peuvent créer des colonnes et des rétrospectives**
- Les enseignants peuvent :
  - Visualiser et modifier leurs propres rétrospectives
  - Supprimer les cartes (même celles des étudiants)
  - Modifier ou déplacer toutes les cartes
- Les administrateurs peuvent :
  - Visualiser **toutes** les rétrospectives, toutes promotions confondues
  - Supprimer ou lancer une rétro
  - Voir toutes les cartes

---

### 👨‍🎓 Panel Étudiant

- Accès uniquement aux **rétrospectives associées à leur promotion**
- Ajout de **cartes** dans une colonne existante
- Modification **seulement** des cartes qu’ils ont créées
- Déplacement **possible de toutes les cartes**, peu importe le créateur
- Collaboration **en temps réel** avec les autres participants

---

## 🔄 Mise à jour en temps réel

Le Kanban est totalement **synchronisé en temps réel via Pusher.js**.  
Toutes les actions suivantes sont visibles instantanément pour tous les utilisateurs connectés :

- Ajout de carte
- Modification de carte
- Déplacement de carte entre colonnes
- Création de colonnes (par l’enseignant)

---

## 📚 User Stories Réalisées

### 🧩 Story 2 – Création d’une rétro par un admin ou enseignant

> **EN TANT QU’admin et enseignant**, JE VEUX pouvoir créer une rétrospective sous forme de Kanban pour une promotion  
> AFIN DE collecter les retours et améliorer les processus.

**Critères d’acceptation :**

- [x] Création de rétro avec des colonnes
- [x] Association d’une rétro à une promotion
- [x] Utilisation d’une **librairie JS Open Source** pour le Kanban

---

### 🧩 Story 3 – Collaboration en temps réel (Pusher)

> **EN TANT QU’utilisateur**, JE VEUX voir la rétrospective mise à jour en temps réel avec les autres utilisateurs  
> AFIN DE collaborer et échanger des idées instantanément.

**Critères d’acceptation :**

- [x] Mouvements et créations de cartes synchronisés en **temps réel**
- [x] Utilisation de **Pusher.js**
- [x] Gestion des droits (seulement l’auteur peut modifier sa carte)
- [x] Tout utilisateur peut déplacer n’importe quelle carte

---

### 🧩 Story 4 – Gestion des rétrospectives par promotion

> **EN TANT QU’admin**, JE VEUX pouvoir lister toutes les rétrospectives par promotion  
> AFIN DE suivre et gérer les rétros en cours.

**Critères d’acceptation :**

- [x] L’admin voit toutes les rétrospectives
- [x] L’enseignant voit uniquement celles qu’il a créées

---

## 🧱 Base de données

- `retros` : (id, name, promotion_id)
- `retros_columns` : (id, retro_id, name)
- `retros_data` : (id, retro_column_id, name, description, user_id)

---

## ⚙️ Technologies utilisées

- Laravel 12
- MySQL
- JavaScript + Jkanban
- **Pusher.js** pour la synchronisation en temps réel
- **SweetAlert** pour les confirmations et feedback utilisateurs

---

## 🔐 Règles de gestion

| Rôle         | Actions autorisées                                                                 |
|--------------|-------------------------------------------------------------------------------------|
| **Admin**    | Voir toutes les rétros, lancer/supprimer une rétro                                 |
| **Teacher**  | Créer/voir/modifier ses rétros, créer des colonnes, gérer toutes les cartes        |
| **Étudiant** | Voir les rétros de sa promotion, créer/modifier ses cartes, déplacer toutes les cartes |

---

## 👨‍💻 Auteur

Projet réalisé par Matéis dans le cadre de la [Coding Factory by ESIEE-IT](https://codingfactory.fr), Bachelor Développeur Web & Sécurité.
