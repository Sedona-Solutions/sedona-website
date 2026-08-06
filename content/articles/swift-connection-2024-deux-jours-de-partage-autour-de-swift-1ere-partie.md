---
titre: 'Swift Connection 2024 : Deux jours de partage autour de Swift [1ère partie]'
date: 2024-10-11T10:18:50.613Z
auteur: Jonathan D.
avatar: /uploads/articles/avatar-11.png
tags:
  - Évènement
  - App Mobile
  - Swift Connection
statut: Publié
---

Les 23 et 24 septembre 2024 s’est tenue au Théâtre de Paris la [Swift Connection 2024](https://swiftconnection.io/). Un évènement visant à regrouper la communauté Swift autour de conférenciers qui partagent leurs anecdotes et leurs expériences. De nombreux sujets d’actualité ont été abordés dans des présentations allant de 15 à 35 minutes. Notamment les avancées du langage, des benchmarks de performance ou encore des focus sur des outils de l’écosystème. 

Des acteurs bien connus de la communauté Swift nous ont partagé leurs expériences au cours d’une quinzaine de conférences. 

![](/uploads/articles/wp/IMG_0913-768x432.jpeg)

## Swift OpenAPI Generator 

La Swift Connection s’est ouverte avec la présentation de ==Timirah James==, évangéliste tech chez Apple qui nous propose une démonstration d’un de leurs SDKs open source [Swift OpenAPI generator](https://github.com/apple/swift-openapi-generator). Celui-ci permettant de générer le code requis pour effectuer des appels API à partir d’un fichier [OpenAPI](https://github.com/OAI/OpenAPI-Specification) au format yaml ou json. Cela permet de gagner un temps significatif et de réduire le risque d’erreurs humaines lors de la création manuelle des modèles de données. De plus, ceux-ci sont toujours synchronisés avec les spécifications API décrites dans le fichier [OpenAPI](https://github.com/OAI/OpenAPI-Specification) car le code est généré au moment de la compilation. Les développeurs peuvent ainsi se concentrer sur la logique métier plutôt que s’attarder sur des détails d’implémentation API. Ce package SPM avait été dévoilé à la WWDC 23 dans la session « [Meet Swift OpenAPI Generator ](https://developer.apple.com/videos/play/wwdc2023/10171)». 

 

![](/uploads/articles/wp/swiftc-IMG_0915.jpeg)

## Un guide pratique pour optimiser les performances 

\==John Sundell==r a animé une session sur l’importance de l’optimisation algorithmique, illustrée par des exemples concrets de boucles à optimiser. 

Cette session permet de revenir sur des fondamentaux en algorithmie et d’aborder les optimisations et la gestion de la concurrence de thread en Swift. Je suis resté un peu sur ma faim mais cela reste une bonne introduction pour les développeurs débutants. 

 

 

![](/uploads/articles/wp/swiftc-IMG_0938.jpeg)

## Les animations en SwiftUI 

Dans ses premières versions, SwiftUI limitait fortement la capacité des développeurs à créer des animations complexes. À travers plusieurs exemples d’animations ==Chris Eidhof==c a démontré les avancées du *framework* et les nouvelles APIs mises à disposition par Apple. Pour le premier il utilise une simple animation basée sur un Boolean state isOn/isOff puis par étapes complexifie ses animations en utilisant à la fois [PhaseAnimator](https://developer.apple.com/documentation/swiftui/phaseanimator) et [KeyframeAnimator](https://developer.apple.com/documentation/swiftui/keyframeanimator). Il a illustré comment décomposer une animation en plusieurs phases pour réaliser des animations parallèles complexes ajoutant un délai entre celles-ci. Lors de sa session, Chris a défini les différentes phases de rendu UI et expliqué comment les transactions sont interprétées d’une frame à l’autre lors du déclenchement d’une animation. 

J’ai trouvé cette session très intéressante car elle nous donne une bonne compréhension de l’apport du keyframe animator, permettant avec un peu de patience d’atteindre les mêmes résultats (ou presque) qu’avec [Lottie](https://github.com/airbnb/lottie-ios). 
