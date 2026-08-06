---
titre: 'WWDC : Résumé du Platform State of the Union 2023'
date: 2023-06-14T09:39:57.523Z
couverture: /uploads/articles/wp/wwdc-2023-cover.png
extrait: |
  Comme chaque année au mois de juin, Apple organise la WWDC et annonce les nouveautés des prochains OS ainsi que les nouvelles possibilités offertes aux développeurs. Cette année fut riche en annonces que nous allons passer en revue dans cet article.
auteur: Jonathan D.
avatar: /uploads/articles/avatar-11.png
tempsLecture: 5 min de lecture
tags:
  - Évènement
  - Mobile App
  - iOS
  - WWDC
statut: Publié
---

## Swift Macro

Avec l’arrivée de Swift 5.9, Apple offre aux développeurs une nouvelle syntaxe puissante permettant d’étendre avec de nouvelles expressions pour produire et transformer du code. Son usage sera illustré dans cet article par l’utilisation qu’Apple en fait en introduisant de nouveaux outils pour Swift et SwiftUI.

Les macros peuvent s’exprimer en tant qu’attribut de type avec l’annotation `@[macroName]` ou autoportant sur une ligne de code avec l’annotation `#[macroName]`.

Xcode 15 ajoute la possibilité d’explorer le code contenu dans une macro ([plus d’info dans la vidéo « Write Swift Macro »](https://developer.apple.com/videos/play/wwdc2023/10166/)) directement depuis la ligne de code qui l’utilise pour visualiser l’algorithme qui sera interprété lors de la compilation. Xcode 15 est également capable de nous fournir des messages d’erreur précis remontés des macros décrivant spécifiquement les lignes de code qui l’ont provoqué .

Avec son Protocole [ExpressionMacro](https://github.com/apple/swift-evolution/blob/main/proposals/0382-expression-macros.md) Apple offre la possibilité de personnaliser des messages d’erreur pour plus de confort lors du développement.

Doug Gregor, un des membres du *Language Workgroup*, a mis à disposition un repo git contenant des exemples de macros avec leur code source : [https://github.com/DougGregor/swift-macro-examples](https://github.com/DougGregor/swift-macro-examples).

## SwiftUI 5.0

Avec l’introduction de [SwiftUI 5.0](https://developer.apple.com/documentation/swiftui), Apple apporte des nouvelles fonctionnalités du point de vue de la gestion des états, de la persistance, des animations ou encore des API permettant une meilleure intégration au système iOS (WidgetKit, AppIntents, TipKit, ShareKit).

## Evolution de *@State* et *@Environment*

L’apport des macros décrites plus haut a permis de simplifier drastiquement l’écriture des classes ‘ObservableObject’ qui n’implémentent plus le protocole mais sont simplement annotées  [@Observable](https://developer.apple.com/documentation/observation/observable-swift.macro/). Cette macro va transformer le code et rendre l’ensemble des propriétés `@Published`. Lors de la déclaration d’une variable Observable, il n’est plus nécessaire de l’annoter `@StateObject`, elle sera écoutée par défaut par la vue et son état sera conservé entre chaque mise à jour.

D’un point de vue de l’optimisation, la vue est uniquement redessinée par la mutation des propriétés qu’elle utilise, tout autre changement ne sera pas pris en compte par la vue dans le cycle de mise à jour. Les écrans sont donc automatiquement optimisés.

## SwiftData

[SwiftData](https://developer.apple.com/xcode/swiftdata/) est la nouvelle API de persistance. Fondée sur [CoreData](https://developer.apple.com/documentation/coredata/adopting_swiftdata_for_a_core_data_app), elle simplifie grandement son usage en plus d’être prévue pour une intégration dans des vues SwiftUI. Elle s’appuie également sur la nouvelle écriture en macro, avec l’annotation `@Model.`

Cette *macro* ajoute la persistance, la synchronisation iCloud et une nouvelle fonctionnalité ‘annuler/rétablir’.

Coté intégration SwiftUI, en remplaçant `@Observable` par @`Model`, on bénéficie à la fois d’un objet observable mais aussi persistant qui se mettra à jour en fonction de l’évolution en base.

## Intégration Système outils SwiftUI

### ![](/uploads/articles/wp/wwdc-Image2-1024x501.png)

### WidgetKit

Les [Widgets](https://developer.apple.com/documentation/widgetkit) s’intègrent désormais à l’écran d’accueil des différents appareils Apple et deviennent interactifs avec la possibilité d’y intégrer des boutons permettant d’exécuter des instructions en marge du cycle de mise à jour traditionnel.

Tirant profit de Continuity, les widgets seront mis à jour en temps réel sur tous les appareils selon les actions de l’utilisateur. Apple a également offert la possibilité d’utiliser les transitions SwiftUI pour animer les transitions d’état. Les widgets sont maintenant visualisables et interactifs dans les Preview sur Xcode 15.

### AppIntents

Cette année, les [Raccourcis](https://developer.apple.com/documentation/appintents) sont améliorés offrant davantage de possibilités de personnalisation, couplé à Siri les développeurs auront plus de contrôle sur les informations à afficher dans les suggestions de l’utilisateur grâce à l’ajout du [RelevantIntentManager](https://developer.apple.com/documentation/appintents/relevantintentmanager).

### TipKit

Avec [TipKit](https://sedona.fr/2023/06/14/wwdc-resume-du-platform-state-of-the-union-2023/#:~:text=Avec-,TipKit,-Apple%20nous%20apporte) Apple nous apporte un nouvel outil UI ayant pour objectif d’aider les développeurs à guider les utilisateurs dans leur application en affichant des bulles d’aide. Ces aides contextuelles permettent de présenter les différentes fonctionnalités au sein même des écrans.

Apple apporte ici de nouvelles guidelines sur la présentation d’une application aux utilisateurs, comme souvent avec les composants graphiques « clef en main » fourni par Apple, les options de personnalisation graphiques offertes aux développeurs sont assez limitées, ce qui pourrait en freiner l’adoption au sein d’applications avec un design sortant des canons de l’OS.

### Xcode 15

[Xcode 15](https://developer.apple.com/xcode/) apporte des améliorations sur l’auto-complétion, des temps de compilation et de l’expérience de développement de manière globale.

### Preview

Les *Preview SwiftUI* ont été totalement refondues grâce à la nouvelle Macro #Preview permettant de simplifier l’écriture et d’encapsuler des vues UIKit.

### Git

Xcode rattrape son retard dans l’intégration Git avec la possibilité de Stage à la volée dans le code des parties spécifiques et de commit/push/créer une branche et voir l’historique.

### Tests

Avec Xcode 15, de nouveaux outils sont à la disposition des développeurs, grâce à l’ajout d’une nouvelle vue de compte rendu, le processus de test UI est entièrement enregistré en vidéo et il est possible de sélectionner dans une timeline une partie spécifique du processus.

Une erreur mettra en évidence dans la séquence de tests l’instant où cela s’est produit, les animations sont également testables.

Coté accessibilité, les tests permettent également de mettre en avant les frames de chaque vue ainsi que leur description.

![](/uploads/articles/wp/wwdc-Image3-1024x525.png)

### Documentation

L’ajout de documentation dans le code est facilité avec le raccourci \[clic droit] + \[Add documentation], un snippet prérempli apparait nous invitant à compléter les descriptions au niveau global et pour chaque paramètre de la fonction.

### Vie Privée

Une grande partie de la conférence était consacrée à la vie privée et aux outils que met Apple à disposition des développeurs pour garantir une application transparente et sécurisée :

* le calendrier dispose d’une nouvelle permission plus restrictive permettant uniquement d’ajouter des évènements sans donner accès à l’ensemble du calendrier ;
* pour les photos, un nouvel écran de sélection est accessible permettant à l’utilisateur de restreindre les photos accessibles pour une application au sein de sa Photothèque.

### PrivacyManifest

Dans le but d’améliorer la compréhension des SDKs qu’utilise le développeur, Apple a introduit le « [privacy manifest](https://developer.apple.com/videos/play/wwdc2023/10060/) », un fichier regroupant toutes les utilisations de données utilisateur issues des SDKs tiers implémentés dans l’application.

Un résumé sera disponible facilitant la complétion de la section « Confidentialité de l’app » dans AppStore Connect.

Toutefois, de nombreux SDKs offrent déjà la possibilité d’opt-out dans la remontée de données utilisateurs et il faudra encore attendre quelques années avant que l’ensemble des acteurs aient adopté ce nouveau format.

### Signature des SDK

Xcode valide désormais que les [SDKs tiers ont été signés](https://developer.apple.com/videos/play/wwdc2023/10061/) par le même développeur et ce à chaque nouvelle mise à jour pour garantir l’intégrité du SDK dans le temps et se prémunir de l’injection de code malveillant dans les apps.

### Contenu sensible

Apple ajoute une [nouvelle API de control parental](https://developer.apple.com/documentation/sensitivecontentanalysis) et de classification de contenu utilisant les réseaux neuronaux on device permettant de filtrer ou flouter un contenu automatiquement. L’API est capable d’analyser une image ou une vidéo et indiquer si oui ou non ce contenu est sensible offrant au développeur la possibilité de masquer ou supprimer ce contenu avant de l’exposer à l’utilisateur.

## Conclusion

Une fois de plus les nouveautés sont nombreuses, les macros Swift offrent des perspectives inédites dans l’extension du langage et auront très certainement autant d’impact que l’arrivée de *Swift Concurrency* ou de *SwiftUI* ces dernières années.

On sent bien qu’Apple a pour objectif d’améliorer la productivité des développeurs afin de pouvoir résister face à la concurrence des technologies hybrides et *crossplatform* qui offrent bien souvent des temps de développement plus court.

Apple conclu sa conférence avec les outils proposés pour VisionOS, le nouvel OS dédié au Vision Pro et nous reviendrons dans un prochain article vous présenter les innovations apportées par ce nouvel appareil ainsi que ses opportunités créatives.

###### ©Crédit Photo : Apple
