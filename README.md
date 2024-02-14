# Mon Vieux Grimoire - Backend

Ce projet a pour but de créer le backend d'un site d'une librairie en utilisant la technologie Node.js et Express.

## Fonctionnalités

- Gestion des utilisateurs (inscription, connexion, profil)
- Gestion des livres (ajout, modification, suppression)
- Recherche de livres par titre, auteur, catégorie, etc.
- Création et gestion d'utilisateur dans la base de données

## Technologies utilisées

- Node.js
- Express
- MongoDB (base de données)
- JWT (JSON Web Tokens) pour l'authentification
- Bcrypt pour le hashage des mot de passe

## Challenges rencontrés 
- Apprentissage de l'application Atlas MongoDB, utilisation des cours OpenClassroom sur ExpressJS et MongoDB.
- Problème de connexion entre la bdd MongoDB (internet) et le backend en ExpressJs: Problème de résolution de DNS en partage de connexion mobile. Solution trouvée en utilisant la console et en analysant le chemin parcourue par la requete de l'API.

## Installation

1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir Node.js et MongoDB installés.
3. Exécutez `npm install` pour installer les dépendances.
4. Configurez les variables d'environnement dans le fichier `.env`.
5. Exécutez `npm start` pour lancer le serveur.
