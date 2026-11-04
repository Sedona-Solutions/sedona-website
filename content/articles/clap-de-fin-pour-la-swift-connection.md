---
titre: Clap de fin pour la Swift Connection ?
date: 2026-11-04T09:00:00.000Z
couverture: /uploads/articles/swift-connection-2026.jpg
extrait: 'Développement agentique, harness, Swift Concurrency et réflexions sur le métier : retour sur les deux jours de la 10e Swift Connection à Paris… et sur une question qui reste ouverte pour la suite.'
auteur: Antoine
avatar: /uploads/articles/collab/antoine-m.png
tempsLecture: 5 min de lecture
vedette: true
tags:
  - Évènement
  - App Mobile
  - iOS
  - Swift Connection
  - IA
statut: Publié
---

**Cette 10e édition de la Swift Connection (anciennement FrenchKit) se termine et il est l'heure de dresser un bilan. À l'heure où l'IA redessine les contours de toute l'industrie tech, les organisateurs ont constaté une forte baisse de la participation. Selon eux, les développeurs deviennent plus agnostiques vis-à-vis des technologies et descendent moins dans le détail d'implémentation, qui fait justement la matière de nombreux talks. Une page est-elle en train de se tourner ?**

Durant les deux jours de conférence, une quinzaine de conférenciers étaient présents avec des visages connus et reconnus de la scène iOS/Swift depuis de nombreuses années, tels que [Chris Eidhof](http://www.eidhof.nl/), [Daniel Steinberg](https://www.dimsumthinking.com/), [Laura Savino](https://www.linkedin.com/in/laurasavino), [Zach Brass](https://sessionize.com/zach-brass/), [Matt Massicotte](https://www.massicotte.org/), [Soroush Khanlou](https://khanlou.com/) ou encore [Antoine Van der Lee](https://www.avanderlee.com/).

Les talks couvraient une grande variété de sujets, alternant technique et réflexion de fond sur l'évolution des métiers du développement iOS. Et il y avait un éléphant dans la pièce : le développement agentique.

De nombreux talks abordaient ce changement de paradigme. Doit-on remettre en cause nos habitudes ? Faut-il encore lire la documentation ? Est-ce que les commentaires servent encore à quelque chose ? Doit-on encore penser à l'architecture de son application ? Les speakers ont défendu la même idée : ces pratiques comptent davantage avec un agent.

## Construire le *harness* de ses agents

Petit point de vocabulaire pour commencer, le *harness* désigne l'ensemble des règles, tests et documentations qui encadrent le travail d'un agent (fichier `AGENTS.md`, skills, serveurs MCP, hooks). Sa construction est devenue un enjeu central pour gagner en productivité et en fiabilité.

[Alaina Kafkes](https://github.com/alainakafkes) a donné un talk sur l'utilisation des commentaires et a fourni des recommandations simples et efficaces pour s'assurer que ceux-ci restent pertinents : se concentrer sur le « quoi » et le « pourquoi » plutôt que sur le « comment ». Les agents ont la fâcheuse tendance à s'étendre un peu trop dans les commentaires ou à documenter les changements de direction, ce qui alourdit la lecture du code et augmente la consommation de tokens. Avec son équipe, Alaina centralise les choix techniques grâce à des ADR (*Architecture Decision Records*) et conserve uniquement la référence localement dans le code.

[Stelios Frantzekakis](https://www.steliosf.com/) a présenté [Harmonize](https://github.com/perrystreetsoftware/Harmonize), une bibliothèque inspirée d'[ArchUnit](https://www.archunit.org/) qui a pour objectif de tester unitairement l'architecture de votre application. Elle s'intègre parfaitement dans l'outillage iOS et contribue à configurer le *harness* de votre agent en apportant un ensemble de contraintes d'architecture définies en amont. La prochaine version, actuellement en bêta, ajoute des options de configurations des messages d'erreur et permet de générer des skills avec des références à partir de vos règles pour guider vos agents. Stelios a conclu sa présentation comme ceci : « *Because it the AI era... Agents generate the code. Human define the architecture. And lint rules enforce it.* »

Enfin, Matt Massicotte et Lucy Galik ont partagé leurs retours d'expérience et bonnes pratiques sur Swift Concurrency et sur le choix entre `enum` et `struct`, de quoi alimenter les skills de vos agents.

## Catalyseur de créativité

Plusieurs talks ont aussi montré que le développement agentique permet de se lancer dans des projets qu'on n'aurait pas entrepris seul.
- [Hervé Bérenger](https://fr.linkedin.com/in/herve-berenger) a exploré avec l'aide d'un LLM les [500 000 lignes de code du dépôt officiel](https://github.com/apple/security-pcc) du *Private Cloud Compute* d'Apple pour en présenter les mécanismes de sécurité.
- Antoine Van der Lee a développé [RocketTrace](https://rockettrace.app/), un outil qui améliore la productivité de ses agents et audite les problèmes de performance relevés avec *Instruments*.
- Soroush Khanlou a fait développer une app macOS par un agent pour remplacer ses slides par de nombreuses démos interactives.

## *Learn, Breathe and Reflect*

Parmi les talks qui s'éloignaient un peu de la tech pour une approche plus réflexive sur le métier de développeur, j'ai particulièrement apprécié ceux de Laura Savino et Daniel Steinberg, qui ont abordé avec humour et intelligence les changements auxquels nous sommes confrontés. Tous deux invitent à accepter que chacun avance à son rythme. Laura Savino estime que cette transition se fait en trois étapes : « *it's awful, it's awesome, it's useful* ».

De son côté, Daniel Steinberg a encouragé une approche empathique envers soi-même et les autres. Prendre le temps de respirer. Des études montrent que le développement agentique augmente la productivité mais ne réduit pas l'effort cognitif nécessaire, alors, plus que jamais, pour éviter la surcharge mentale : respirez.

Mention particulière pour Chris Eidhof, qui a conclu la première journée avec un talk chargé d'émotions et de réflexions sur les trajectoires personnelles et professionnelles. Il suffit parfois de rencontrer la bonne personne.

## À l'année prochaine ?

Cette dixième édition se referme sans certitude sur la suivante : les organisateurs ont diffusé un questionnaire afin d'identifier ce que le public attend désormais de leur conférence. La question me semble légitime.

Une bonne partie des talks portaient sur la construction du *harness* de nos agents, et les outils évoluent si vite que ces pratiques auront peut-être perdu leur sens dans un an. Une conférence annuelle peut-elle encore suivre ce rythme ?

Les projets présentés cette année montrent au moins que les agents permettent d'explorer plus facilement une multitude de sujets ou prototyper des outils. Tant que les développeurs s'en serviront pour expérimenter de nouvelles choses, les conférences resteront une occasion de partager, d'apprendre et de faire des rencontres.
