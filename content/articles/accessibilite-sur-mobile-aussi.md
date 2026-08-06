---
titre: Mobile Accessibility
date: 2025-12-12T01:00:00.000Z
extrait: 'L''accessibilité ne s''arrête pas au web : panorama des bonnes pratiques sur mobile.'
auteur: Virginie M.
avatar: /uploads/articles/avatar-2.png
tempsLecture: 7 min de lecture
categorie: ''
tags:
  - Mobile App
  - Accessibilité
statut: Publié
---

# Qu’est que le *Switch Access* ?

*Switch Access* ( ou *Switch Control* sur iOS) permet aux utilisateurs d’interagir avec leurs téléphones/tablettes à l’aide d’un ou plusieurs appareils. Cette fonctionnalité peut être utile aux utilisateurs ayant une dextérité limitée et qui ont du mal à interagir directement avec un écran tactile.

## Avec quels périphériques peut-on utiliser cette option ?

Les commutateurs peuvent se présenter dans des formes diverses: ensemble de boutons, paille qui s’active au souffle, détection d’expression du visage, etc…

![](/uploads/articles/wp/switch-768x768.jpg)

## Comment activer l’option? (Android)

* lancer l’application Paramètres
* aller dans le menu Accessibilité
* aller dans le menu *Switch access*

Il suffit d’un seul commutateur de validation pour l’utiliser l’option (avec les options « Exploration automatique » et « Démarrer automatiquement l’exploration » activées). On peut aussi assigner des commutateurs supplémentaires à d’autres actions d’explorations (suivant, précédent, exploration automatique) ou à des actions générales (back, home, etc…).

## Comment rendre une application mobile (plus) accessible pour les utilisateurs de *Switch access* ?

* gérer le focus entre les composants pour que la navigation reste logique entre les composants
* regrouper le focus d’éléments pour limiter le nombre de « suivant » à faire lors de la navigation
* empêcher le focus d’éléments non pertinent
* éviter les pièges à focus
* toujours proposer des alternatives cliquables aux gestes d’action/navigation
* ajouter des actions accessibilités (*AccessibilityAction* sur Android)
* ajout de popup confirmation sur les actions qui pourraient faire perdre des données

[switch\_access\_use.mp4](/uploads/articles/wp/switch_access_use.mp4 "switch_access_use.mp4")

(Exemple d’utilisation avec les touches \*volUp/volDown \*pour la navigation)
