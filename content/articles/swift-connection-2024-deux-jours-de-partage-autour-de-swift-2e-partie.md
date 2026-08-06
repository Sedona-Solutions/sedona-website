---
titre: 'Swift Connection 2024 : Deux jours de partage autour de Swift [2e partie]'
date: 2024-10-11T10:18:50.613Z
auteur: Jonathan D.
avatar: /uploads/articles/avatar-11.png
tags:
  - Évènement
  - App Mobile
  - Swift Connection
statut: Publié
---

![](/uploads/articles/wp/swiftc-IMG_0939.jpeg)

## SwiftUI et composition de gestures 

Encore dans le domaine de SwiftUI ==Douglas Hill==r a effectué sa présentation sur la nouvelle transition de zoom introduite dans le SDK iOS 18. Il a exprimé son enthousiasme pour cet effet visuel ne nécessitant que 3 lignes de code. Douglas nous a présenté comment configurer ces transitions en SwiftUI, que ce soit pour les navigations push/pop ou les présentations/dismiss en plein écran. Il a également souligné l’importance de créer une expérience utilisateur optimale en choisissant les situations où la transition de zoom est la plus appropriée et en évitant les conflits avec les gestes de fermeture intégrés. Utilisant son application, il a illustré une nouvelle navigation zoom similaire à celle de la pellicule de l’iPhone sous iOS. 

\==Nathan Manceaux-Panot==c a quant à lui mis l’accent sur le fait que nos applications doivent être en mesure de déterminer l’intention de l’utilisateur au travers de son geste. Et nous a illustré avec des ScrollView et des GeometryReader comment ancrer le scroll à des endroit précis (effet de page) en se plaçant sur les callbacks de gestures (déplacement et vélocité). 

## IA et iOS 

Durant ces deux jours de conférence, de nombreux sujets captivants ont été abordés. ==Vincent Pradeilles==k a partagé ses expérimentations sur le développement assisté par l’IA générative dans l’univers Apple. Il a comparé les performances et la qualité du code généré par la complétion prédictive de [Xcode 16](https://developer.apple.com/videos/play/wwdc2024/10135/) à celles de [Github Copilot](https://github.com/features/copilot). En résumé, Xcode 16 n’égale pas encore les capacités de Copilot, notamment en raison de l’absence de contextualisation multi-fichiers, d’une complétion de qualité inférieure et d’une expérience plus lente, car les inférences sont réalisées localement sur la machine plutôt que dans le cloud. Une autre conférence IA, animée par ==Etienne Vautherin==n, portait sur les nouvelles capacités des [App Intents](https://developer.apple.com/documentation/appintents) introduite dans iOS 18 et en lien avec Apple Intelligence. Si vous souhaitez plus d’informations sur ce sujet, je vous recommande la vidéo « [Bring your app to Siri](https://developer.apple.com/videos/play/wwdc2024/10133/) » de la WWDC24. 

 

![](/uploads/articles/wp/swiftc-IIMG_0931.jpeg)

## Kotlin Multiplatform 

Lors d’une autre session ==Melisa De la Garza==o est revenu sur son expérience dans l’utilisation de [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform.html) afin de mutualiser la couche réseau entre la version iOS et la version Android de son application. Elle a partagé ses difficultés et les réticences de la part de son équipe, mais également ses succès. En effet, elle a réussi à créer un framework KMM intégrant la couche réseau, puis progressivement elle a mutualisé jusqu’aux ViewModel. Cette réussite montre qu’il est possible de repenser les développements mobiles pour qu’ils soient commun entre iOS et Android permettant ainsi de garantir un partage des règles métiers entre les 2 OS. Comme nous l’indiquions dans un [précédent article sur Kotlin Multiplatform](https://sedona.fr/2023/08/23/a-la-decouverte-de-compose-multiplatform/), nous surveillons de près cette technologie et bien d’autres car elle offre de belles perspectives pour réduire les coûts de développements et de maintenance. 

## Test unitaires 

Dans sa session Leah Vogel a mis en avant l’importance des tests unitaires, particulièrement pour ceux qui n’en ont jamais réalisé. Elle nous a guidé à travers les étapes, depuis la création de tests simples jusqu’à l’adoption du développement piloté par les tests (TDD). Elle a souligné qu’il est crucial de vérifier le bon fonctionnement de chaque composant, ce qui facilite les modifications ultérieures du code tout en minimisant les risques de régression. En outre, les tests unitaires servent également de documentation précieuse, décrivant le comportement de certains algorithmes complexes. 

## Pour conclure 

La Swift Connection 2024 a été un événement enrichissant pour la communauté. J’ai trouvé les sessions efficaces. Les présentations sur le Swift OpenAPI Generator et les optimisations algorithmiques ont fourni des outils et méthodes pour améliorer la qualité de nos projets. Les avancées en SwiftUI, notamment en matière d’animations et de gestuels, ouvrent de nouvelles possibilités pour nos applications. 

Les échanges sur l’IA générative et les App Intents montrent que l’avenir de l’IA sur iOS est prometteur, malgré un retard encore un peu trop marqué à mon goût. La piqure de rappel sur l’importance des tests unitaires ne fait jamais de mal, nous intégrons cette pratique dans nos développements depuis de nombreuses années et cela fait partie de notre culture, aussi je ne peux que valider cette approche. 

Cette conférence a été l’opportunité de rencontrer des développeurs passionnés et qui ont partagé des idées qui feront écho dans nos futurs projets. 
