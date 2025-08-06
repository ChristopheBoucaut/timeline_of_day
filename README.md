# Timeline of a day

## Organisez votre journée en toute sérénité

Que vous prépariez un mariage, un salon ou tout autre événement riche en intervenants et en étapes, ce petit outil a été pensé pour vous aider à y voir clair.

💡 Vision chronologique, rôles attribués, participants identifiés, tâches détaillées : tout est centralisé pour faciliter la coordination et éviter les oublis.

## Technique

Initialement développé en HTML/CSS/JavaScript pour organiser ma propre journée de mariage, ce projet met l’accent sur la simplicité d’utilisation, une interface agréable, et une compatibilité mobile pour que chaque participant puisse suivre le déroulé de l’événement, où qu’il soit.

### Utiliser le projet

Ce projet est "livré" avec un exemple de journée type pour un mariage. Pas besoin de commande ou d'outil pour le lancer, il suffit d'ouvrir le fichier `index.html` dans un navigateur web.

Pour l'adapter à vos besoins :
* modifiez le fichier `data/events.js` pour configurer les events, les lignes, les icones, etc
* ajouter vos icones dans le dossier `images/icons`

### Structure du projet

* index.html : Point d'entrée de l'application
* src/
    * components.js : en charge de générer les éléments HTML dynamiques
    * config.js : quelques éléments clés permettant de configurer techniquement l'application
    * model.js : classes représentant les différentes notions de l'application
    * script.js : orchestrateur pour utiliser tous les autres éléments
    * style.css : toutes les règles CSS
* images/icons/ : toutes les images pour les icônes
* images/people/ : toutes les images pour les personnes
* data/events.js : toutes les informations qui seront affichées dans l'application
