---
titre: À la découverte de Compose Multiplatform
date: 2023-08-23T09:23:52.769Z
extrait: 'Ces dernières années, le développement mobile hybride a beaucoup mûri : on peut désormais créer des applications iOS et Android à partir d''un code source partagé, là où le natif impose un code spécifique à chaque plateforme. Flutter, Ionic, React Native… les options sont nombreuses. Aujourd''hui, on s''intéresse à Compose Multiplatform, qui marie la puissance de Kotlin et du framework graphique Jetpack Compose.'
auteur: Clément G.
avatar: /uploads/articles/collab/clement-g.png
tags:
  - Mobile App
  - Kotlin
  - Compose Multiplatform
statut: Publié
---

## L’essor de Kotlin Multiplaform Mobile (KMM)

KMM est apparu comme une solution aux défis posés par la création d’applications fonctionnant sur plusieurs plateformes. Développé par JetBrains, les créateurs du langage Kotlin, KMM permet aux développeurs de partager la logique métier entre différentes plateformes, telles qu’Android, iOS ou encore le web. Cela permet non seulement de gagner du temps et d’économiser des ressources, mais aussi de garantir la cohérence et la maintenabilité entre les différentes plateformes.

KMM y parvient en fournissant un ensemble d’outils et de bibliothèques permettant aux développeurs d’écrire du code partagé en Kotlin, tout en fournissant des implémentations spécifiques à la plateforme si nécessaire. Cette approche établit un équilibre entre la réutilisation du code et l’optimisation spécifique à la plateforme, offrant aux développeurs la flexibilité dont ils ont besoin.

## Compose Multiplatform

Développé par Google, Jetpack Compose fournit un ensemble de composants graphiques réutilisables afin de concevoir des écrans d’application mobile sur Android. De manière similaire à React (Native) ou encore SwiftUI, il s’appuie sur un modèle de programmation déclaratif permettant aux développeurs de décrire une interface utilisateur à l’aide d’une syntaxe concise et intuitive, réduisant notamment les incohérences liées à une mauvaise gestion de l’affichage des données.

Alors que Kotlin Multiplatform permet aux développeurs de mutualiser les règles métiers, Compose Multiplatfom pousse le concept un peu plus loin en mutualisant la partie graphique. Cela permet non seulement d’accélérer le développement, mais surtout de réduire les différences entre les interfaces utilisateurs iOS et Android.

## Synergie

![](/uploads/articles/wp/Synergie_KMM-768x614.png)

Le mariage de KMM et Compose permet aux développeurs de partager du code simplement tout en créant des interfaces dynamiques et cohérentes entre les différentes plateformes. Avec Kotlin Multiplatform, la majorité de la logique métier, des modèles de données et des opérations réseaux peuvent être partagés ce qui garantit un comportement identique et réduit la probabilité de bugs causés par des implémentations différentes. Compose Multiplatform quant à lui étend la puissance de Jetpack Compose à plusieurs plateformes, permettant aux développeurs de créer des interfaces utilisateurs visuellement riches et responsives.

Le gain de temps durant la phase de développement se poursuit durant la phase de recette car il suffira de tester la partie spécifique sur chaque OS (gestion du Bluetooth, de la géolocalisation, du Player audio ou vidéo, etc.) et la partie mutualisée sur un seul.

## Conclusion

Kotlin Multiplatform et Compose Multiplatform représentent un changement de paradigme dans le monde du développement d’applications mobiles, car il s’appuie sur des technologies déjà utilisées par les développeurs natifs.

Chez Sedona nous avons décidé de capitaliser sur notre expertise en développement d’applications mobiles natives en alliant nos savoir-faire sur Android et iOS. Notre expérience en développement Kotlin et Compose nous permet de recourir aux développements spécifiques iOS lorsque cela s’avère nécessaire.

Cependant ces technologies restent encore assez jeunes à ce jour (de nombreuses fonctionnalités sont encore en Alpha ou Bêta) et ne sont pas encore viables pour tous les usages. Si l’application requiert de nombreuses fonctionnalités spécifiques à une plateforme, KMM et Compose Multiplatform ne sont peut-être pas le meilleur choix et le développement natif serait sûrement plus efficient.

Kotlin Multiplatform et Compose Multiplatform restent néanmoins très prometteuses. Il pourrait s’agir d’une alternative viable à Flutter et au développement natif, mais l’avenir nous le dira. En attendant, nous continuerons à étudier l’ensemble des technologies afin de toujours proposer la solution adaptée aux besoins et au budget de nos clients.

### Bibliographie

* Doc officielle KMM : [https://kotlinlang.org/docs/multiplatform.html#multiplatform-libraries](https://kotlinlang.org/docs/multiplatform.html#multiplatform-libraries)
* Librairies utiles sur KMM : [https://github.com/terrakok/kmm-awesome ](https://github.com/terrakok/kmm-awesome)
* Bien démarrer avec Compose Multiplatform: [https://github.com/JetBrains/compose-multiplatform](https://github.com/JetBrains/compose-multiplatform)
