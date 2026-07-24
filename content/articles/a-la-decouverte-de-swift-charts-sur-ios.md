---
titre: À la découverte de Swift Charts sur iOS
date: 2024-01-15T10:29:23.172Z
auteur: Nathalie L.
avatar: /uploads/articles/avatar-3.png
tags:
  - Mobile App
  - iOS
  - Swift Charts
statut: Publié
---

## Introduction 

Apple a introduit dans iOS 16 une nouvelle bibliothèque pour créer des graphiques : [Swift Charts](https://developer.apple.com/documentation/charts). Celle-ci s’appuie sur SwiftUI la bibliothèque de développement d’interface utilisateur sortie en 2019 avec iOS 13. 

Au sein d’iOS on retrouve dans les applications natives Santé, Météo ou encore dans les Réglages de nombreux exemples d’utilisation des graphiques :

![](/uploads/articles/wp/graph-swift-charts.png)

###### Type de graphique utilisable sous Swift Charts

En condition de mobilité, consulter des données sous forme de graphique permet d’**accéder rapidement à une information synthétique sur un petit écran**. Cette capacité permet de répondre à de nombreux cas d’applications auxquels nos clients sont confrontés : gestion financière, analytique d’entreprise, éducation et e-learning, suivi de projet, reporting d’activité commerciale, suivi de voyage, surveillance et contrôle… 

C’est dans cette optique nous avons étudié Swift Charts ainsi que des solutions alternatives que nous présentons dans cet article. 

## Présentation 

Swift Charts offre des **composants graphiques élémentaires** tels que les barres, les lignes, les points et les secteurs qu’il est possible de **personnaliser de diverses manières** (taille, couleur, position ou encore légende). Il est possible de superposer plusieurs composants graphiques afin de proposer des présentations plus complètes. Enfin des options de **scroll, zoom, clicks et animations** peuvent être ajoutées pour rendre les graphiques plus interactifs. 

![](/uploads/articles/wp/graph-swift-charts-2.png)

###### Crédits : Apple « Swift Charts : Raise the bar » WWDC22) https\://developer.apple.com/videos/play/wwdc2022/10137

**Les différents types de graphiques disponibles sont :** 

* **[Barres ](https://developer.apple.com/documentation/charts/barmark):** pour représenter des données catégorielles ou numériques ; 
* **[Aires](https://developer.apple.com/documentation/charts/areamark) et [lignes](https://developer.apple.com/documentation/charts/linemark) :** pour représenter des données continues ; 
* **[Points](https://developer.apple.com/documentation/charts/pointmark) :** pour représenter des données discrètes ; 
* **[Secteurs ](https://developer.apple.com/documentation/charts/sectormark):** pour représenter des données proportionnelles ; 
* **[Règles ](https://developer.apple.com/documentation/charts/rulemark):** pour représenter une donnée particulière associée à une annotation ; 
* **[Rectangles](https://developer.apple.com/documentation/charts/rectanglemark) :** pour représenter des valeurs moyennes. 

## Accessibilité 

**Apple accorde toujours un intérêt important à l’accessibilité** pour rendre les applications conviviales pour le plus grand nombre d’utilisateur quelque soit leur handicap. 

Swift Charts prend en charge l’accessibilité de plusieurs manières. Le modèle fournit un moyen aux développeurs de **décrire les données du graphique de manière textuelle**, ce qui permet aux utilisateurs malvoyants de « lire » le contenu du graphique à l’aide de la synthèse vocale de VoiceOver. 

En outre, Swift Charts permet également d’enrichir VoiceOver via le « Graphique Audio » qui peut être activé à l’aide du [rotor d’accessibilité](https://support.apple.com/fr-fr/HT204783). Le graphique audio fonctionne en **traduisant les données du graphique sous forme de « bip »**. La hauteur du son est utilisée pour représenter la valeur des données. Par exemple, un graphique de températures pourrait être représenté par un son montant lorsque la température augmente et un son descendant lorsque la température diminue. 

## Limitations 

La majorité des graphiques communs peuvent être réalisés avec Swift Charts en agissant sur les options de configuration et en combinant plusieurs types de graphiques ensemble. 

Toutefois certains types spécifiques de graphiques ne sont p**as encore disponibles ou disposent d’une représentation limitée** :  

* Les **entonnoirs** ou *« funnel »* et les pyramides ne peuvent être représentés autrement que sous forme de rectangle empilés ; 
* Les **anneaux** ou *« radial chart »* même si Apple en fait l’usage dans l’application Santé ne sont pas disponibles et nécessitent un développement sur-mesure ; 
* Les **radars** ne sont pas disponibles pour le moment et nécessitent également un développement sur-mesure ; 
* Les **secteurs** ou *« pie chart »* affichent les légendes de valeurs sous le graphique ou en surimpression mais il n’est pas possible de placer les étiquettes à l’extérieur de chaque secteur de façon que toutes soient lisibles quand il y a un grand nombre de valeurs ; 
* **Les graphiques en 3D** car Swift Charts n’offre qu’une représentation 2D pour le moment.

## Alternatives 

Des alternatives existent dans le cas où Swift Charts ne couvre pas les besoins spécifiques de représentation : 

* Un développement sur-mesure qui peut s’avérer couteux selon la complexité des besoins fonctionnels ; 
* L’utilisation de solutions open source disposant d’une communauté active : **DGCharts** qui est un portage de MPAndroidChart sur iOS : https\://github.com/danielgindi/Charts 
* L’utilisation de solutions payantes sous licences telles que : 
  * **Highcharts** qui offre également un support Android et Web permettant de proposer les mêmes graphiques sur plusieurs plateformes : [https://www.highcharts.com/](https://www.highcharts.com/) 
  * **Syncfusion** qui permet un développement hybride avec Flutter pour couvrir par la même occasion la plateforme Android : [https://www.syncfusion.com/](https://www.syncfusion.com/) 

## Données cartographiques 

Dans le cas particulier des **données cartographiques ou topologiques**, il faudrait basculer sur [MapKit](https://developer.apple.com/documentation/mapkit) qui permet de « dessiner » sur des fonds cartographiques des [polygones](https://developer.apple.com/documentation/mapkit/mappolygon), des [polylines](https://developer.apple.com/documentation/mapkit/mappolyline), des [cercles](https://developer.apple.com/documentation/mapkit/mapcircle), des [marqueurs](https://developer.apple.com/documentation/mapkit/marker) ou des [annotations](https://developer.apple.com/documentation/mapkit/annotation). 

Cet article n’a pas vocation à rentrer dans le détail des capacités offertes par MapKit, mais si celui-ci ne couvre pas vos besoins fonctionnels MapBox pourrait être une alternative intéressante : [https://www.mapbox.com/](https://www.mapbox.com/). 

## Conclusion 

La restitution de données synthétiques au sein d’une application mobile présente des enjeux UX et UI que nos experts peuvent vous aider à résoudre. La satisfaction de vos utilisateurs étant notre objectif, nous apporterons une attention toute particulière au respect des usages et bonnes pratiques du développement d’application mobile. Sedona espère que cet article vous donnera envie de faire appel à nous afin de répondre à vos besoins. 

### Bibliographie 

* Guidelines graphiques officielles d’Apple : [https://developer.apple.com/design/human-interface-guidelines/charts](https://developer.apple.com/design/human-interface-guidelines/charts) 
* Projet GitHub présentant de nombreux exemples d’utilisation de Swift Charts : [https://github.com/jordibruin/Swift-Charts-Examples](https://github.com/jordibruin/Swift-Charts-Examples) 
* Vidéo “Swift Charts: Raise the bar » : [https://developer.apple.com/videos/play/wwdc2022/10137](https://developer.apple.com/videos/play/wwdc2022/10137) 
* Vidéo “Design app experiences with charts” : [https://developer.apple.com/videos/play/wwdc2022/110342 ](https://developer.apple.com/videos/play/wwdc2022/110342)
* Vidéo “Design an effective chart” : [https://developer.apple.com/videos/play/wwdc2022/110340](https://developer.apple.com/videos/play/wwdc2022/110340) 
* Vidéo “Bring accessibility to charts in your app” : [https://developer.apple.com/videos/play/wwdc2021/10122 ](https://developer.apple.com/videos/play/wwdc2021/10122)
