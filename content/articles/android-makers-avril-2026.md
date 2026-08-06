---
titre: 'Android Makers 2024 : ce que nos consultants en ont retenu'
date: 2024-06-18T00:00:00.000Z
couverture: /uploads/articles/wp/IMG_0173-768x576.jpeg
extrait: 'Les 25 et 26 avril dernier a eu lieu la 6ème édition de la conférence Android Makers. Cette conférence organisée par le PAUG (Paris Android User Group) et Droidcon rassemble chaque année près de 700 développeurs. Cette année encore la conférence avait lieu au Beffroi de Montrouge, notre équipe de développeurs Android était sur place et vous propose un retour sur ces 2 jours riches de près de 60 présentations.'
auteur: Virginie M.
avatar: /uploads/articles/avatar-2.png
tempsLecture: 5 min de lecture
categorie: ''
tags:
  - Évènement
  - App Mobile
  - Android Makers
statut: Publié
---

La conférence s’est ouverte avec la présentation de ==Fanny Demey== et ==Emmanuel Demey==r sur l’impact environnemental de l’écosystème mobile au sens large (datacenter, réseau et équipement).

L’objectif de cette présentation était de décliner les critères Green IT applicables aux sites web sur les apps mobiles afin d’offrir un ensemble de bonnes pratiques. L’emphase a été mise sur le fait de combattre l’obsolescence des appareils des utilisateurs finaux en évitant de les encourager à les remplacer. En effet, près de 66% des gaz à effet de serre produit par l’écosystème mobile le sont pendant la production des appareils, il est donc important de les préserver.

Pour cela, Fanny et Emmanuel recommandent de faire** preuve de sobriété fonctionnelle**, de réduire le poids de nos applications et du stockage nécessaire à leur fonctionnement, mais également de minimiser la consommation mémoire, processeur et réseau. Enfin, il est recommandé de maximiser la compatibilité avec le plus d’appareils en ciblant des versions minimales d’Android les plus anciennes possible. Vous pourrez retrouver cette présentation en entier sur la chaine YouTube d’Android Makers : [The environmental impact of mobile apps : Truth or Dare?](https://youtu.be/CaDgIxq5q2A)

![](/uploads/articles/wp/AndroidMakers2024_Day2_171258_STA4902-768x511.jpg)

# Compose

Plusieurs présentations portaient sur Compose, parmi lesquelles nous retenons les suivantes, dont chacune traite des points particuliers.

# Optimisations

[Compose](https://developer.android.com/develop/ui/compose?hl=fr) est une librairie très puissante pour développer des interfaces utilisateurs mais des portions de code en apparence anodines peuvent considérablement ralentir les applications. Au travers d’une présentation très bien rodée, les deux speakers de Tinder ==Tasha Ramesh==c et ==Akshay Chordiya==k ont livré de nombreuses astuces permettant de repérer les goulets d’étranglement et comment les corriger.

[https://youtu.be/yzQ9n7SGnWU](https://youtu.be/yzQ9n7SGnWU)

Bien que l’on puisse faire un certain nombre de choses pour optimiser l’utilisation de Compose, la première action restera de mettre à jour la librairie. ==Romain Guy==n a présenté les optimisations faites « sous le capot » par la librairie elle-même.

[https://youtu.be/5cxw\_fdpnoA](https://youtu.be/5cxw_fdpnoA)

# Interopérabilité

Compose c’est l’avenir, mais que faire lorsque vous souhaitez l’intégrer dans une application existante ? Pierre-Emmanuel Altieri et Mohammed Boukadir présentent une approche possible et exposent les problèmes d’interopérabilité rencontrés entre Android View et Compose.

[https://youtu.be/wGcEUqq6SoE](https://youtu.be/wGcEUqq6SoE)

# Animations

\==Eliza Camber==o explique dans sa présentation comment rendre vos applications plus vivantes en ajoutant des animations via Compose.

[https://youtu.be/2EHcaxtL1sM](https://youtu.be/2EHcaxtL1sM)

\==Jolanda Verhoef== nous livre une présentation simple et efficace montrant comment développer une application de prise de photo et vidéo en Compose.

[https://youtu.be/ClVqrGr-dco](https://youtu.be/ClVqrGr-dco)

# Kotlin Multiplatform & Compose Multiplatform

Cette année Kotlin Multiplatform (KMP) et Compose Multiplatform (CMP) étaient mis à l’honneur durant l’Android Makers avec pas moins de 7 présentations, ateliers ou discussions sur le sujet.

La présentation **« Kotlin Multiplatform at Stable and Beyond »** de ==Márton Braun==k est un bon point de départ puisqu’il reprend les bases de KMM et l’importance de partager le plus de code possible en termes de logique métier et d’interface utilisateur (CMP) tout en insistant sur la possibilité de garder des spécificités propres à chaque OS. KMM est une technologie assez jeune dans le paysage des technos hybrides mais dispose de sa première version stable depuis novembre 2023. Concernant CMP, la technologie est en version Stable pour Android et Desktop mais encore en version Alpha pour iOS.

[https://www.youtube.com/watch?v=il32V2MNdPc](https://www.youtube.com/watch?v=il32V2MNdPc)

Il existe d’ailleurs de plus en plus de librairies Open Source. John O’Reilly en liste un grand nombre dans sa **présentation pour KMM et CMP** avec des exemples associés ce permet à tout développeur de pouvoir expérimenter ces technos.

[https://youtu.be/znrE7j9L0yE](https://youtu.be/znrE7j9L0yE)

Lors de la conférence de Márton Braun, **plusieurs outils optimisés pour le développement multiplateforme ont été présentés :**

* [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/) : une plateforme qui permet de créer un projet KMM facilement avec la possibilité de choisir l’utilisation ou non de CMP ;
* [Fleet](https://www.jetbrains.com/fr-fr/fleet/) : un nouvel IDE de JetBrains orienté sur le développement multiplateforme ;
* [Amper](https://plugins.jetbrains.com/plugin/23076-amper) : un plugin permettant d’unifier la suite d’outils dans les projets multiplateformes avec une emphase sur la compilation.

Márton met également en évidence les parallèles existants entre le développement natif Android et le développement basé sur Kotlin Multiplatform ce qui facilite la compréhension de cette technologie et la transition vers cette dernière.

Enfin, la présentation de ==Antoine Robiez==r et ==Baptiste Carlier==c permet de voir la parfaite mise en pratique de ce qu’on sait de KMP en proposant la migration d’une app Android vers une app KMP en 7 étapes avec les difficultés que l’on pourrait rencontrer. Petite anecdote que l’on apprend également dans ce talk, l’application Android Makers qui était avant en Android et iOS est maintenant en KMP.

[https://youtu.be/AckQ3zAl954](https://youtu.be/AckQ3zAl954)

Au chapitre des outils multiplateforme, Koin qui existe depuis 7 ans maintenant continue de s’imposer comme une librairie incontournable d’injection de dépendances en supportant iOS via KMP. ==Arnaud Giuliani==o nous proposent un tour très complet des possibilités offertes par la librairie sur l’écosystème Android et en dehors.

[https://youtu.be/m\_Y6499bmMw](https://youtu.be/m_Y6499bmMw)

# Conclusion

La diversité des présentations portant sur KMP et CMP est le signe d’un niveau de maturité atteint pour ces technologies démontrant également une adoption de plus en plus large. Google et JetBrains travaillent « main dans la main » sur l’amélioration des outils et l’expérience de développement.

Chez Sedona Solutions, nous suivons de près l’évolution de CMP et partagerons à nouveau nos expérimentations ici comme nous l’avions déjà fait dans notre introduction à [Compose Multiplatform](https://sedona.fr/2023/08/23/a-la-decouverte-de-compose-multiplatform/).

Cet évènement « Android Makers » était très dense, nous poursuivrons notre retour dans une seconde partie, à retrouver prochainement sur notre blog.
