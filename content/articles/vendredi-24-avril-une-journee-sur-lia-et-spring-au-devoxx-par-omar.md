---
titre: "Vendredi 24 Avril : une journée sur l'IA et Spring au Devoxx - par Omar"
date: 2026-05-11T08:17:20.000Z
extrait: "Nous continuons le suivi de l'évènement Devoxx avec une présentation d'Omar qui nous parle de logiciel libre et les IAs, de Spring Security et de Backend…"
auteur: Rémy Poulachon
tempsLecture: 3 min de lecture
categorie: Évènement
---
Nous continuons le suivi de l'évènement Devoxx avec une présentation d'Omar qui nous parle de logiciel libre et les IAs, de Spring Security et de Backend Spring.

### Le futur du logiciel libre pour toi, moi et... les IAs – Alex Snaps

![Logiciel libre](https://sedona.fr/wp-content/uploads/2026/05/shared-image-300x225.jpg)Alex Snaps, contributeur chez Red Hat avec plus de 30 ans d'expérience dans l'open source, livre une réflexion de fond sur l'impact de l'IA générative sur les communautés du logiciel libre. Les outils IA sont désormais partout dans nos workflows — mais qu'est-ce que ça change vraiment, et qu'est-ce qui ne doit pas changer ? Il pointe un paradoxe de confiance : les plateformes sur lesquelles repose l'écosystème open source sont aujourd'hui les mêmes qui entraînent leurs modèles sur le code que les communautés leur ont confié. Il distingue également la **complexité accidentelle** (friction liée aux outils) de la **complexité essentielle** (inhérente au problème) : l'IA peut aider sur la première, mais elle ne remplace pas la compréhension réelle du problème.   Quelques points soulevés :

-   Des PRs générées par IA font passer les tests sans démontrer une vraie compréhension du problème.
-   Les contributions superficielles à grande échelle rendent le travail de revue de plus en plus difficile.
-   La question des licences pour le code généré par IA reste entièrement ouverte.

Alex conclut positivement : les valeurs fondamentales de l'open source — transparence, responsabilité partagée, confiance — n'ont pas changé. Ce qui change, c'est l'intentionnalité qu'il faut désormais mettre dans leur application.

### Autorisation avec Spring Security : permissions, rôles et plus encore – Daniel Garnier-Moiroux

\[caption id="attachment\_27730" align="alignleft" width="225"\]![Spring Security](https://sedona.fr/wp-content/uploads/2026/05/shared-image-1-225x300.jpg) Spring Security\[/caption\] Daniel Garnier-Moiroux, engineer chez Spring, propose un deep dive de 3h sur la gestion avancée de l'autorisation avec Spring Security. L'objectif : aller bien au-delà du simple contrôle par rôle et comprendre les mécanismes internes pour implémenter des règles d'accès robustes et maintenables. La session couvre trois niveaux d'autorisation : au niveau des requêtes HTTP, des méthodes, et des objets retournés. Le speaker insiste sur un principe clé : **séparer les règles d'autorisation du code métier**, pour les rendre testables indépendamment.           Quelques points abordés :

-   Gestion fine des permissions au-delà des rôles : vérification de domaine, contexte de la requête, données retournées.
-   Composition de règles d'autorisation pour couvrir des cas complexes sans alourdir le code métier.
-   Authentification multi-facteurs (MFA) intégrée nativement dans les dernières versions de Spring Security.
-   Test des règles d'autorisation de façon isolée, sans monter tout le contexte applicatif.

Une session dense et pratique, idéale pour les équipes qui souhaitent industrialiser leur gestion des accès sans sacrifier la lisibilité ni la testabilité.

### Performance de backend Spring : les techniques que tout dev devrait connaître – Florian Beaufumé

![Back end Spring](https://sedona.fr/wp-content/uploads/2026/05/shared-image-2-300x225.jpg)Florian Beaufumé, architecte logiciel freelance et expert Java/Spring depuis plus de 15 ans, présente un tour d'horizon des optimisations de performance backend. La session s'articule en trois axes : **identifier** les problèmes, **optimiser**, puis **mesurer**. Le speaker commence par les erreurs JPA les plus courantes : des relations chargées systématiquement alors qu'elles ne sont pas nécessaires, générant des requêtes SQL en cascade invisibles mais coûteuses. La règle d'or — _configurer en lazy, mais charger en eager au cas par cas_ — est simple mais rarement appliquée correctement.     Quelques optimisations concrètes présentées :

-   **Lectures** : éviter le problème N+1 en chargeant les relations en une seule requête lorsque c'est pertinent.
-   **Écritures** : regrouper les inserts et updates en batch pour limiter les allers-retours avec la base.
-   **Modifications en masse** : préférer une requête SQL directe plutôt qu'une boucle Java entité par entité.
-   **Logs Hibernate** : activer le log des requêtes lentes pour identifier les problèmes avant la production.
-   **Mesure** : utiliser Gatling pour simuler des montées en charge et valider les gains obtenus.

Une conférence immédiatement actionnable, qui rappelle que la plupart des problèmes de performance Spring viennent de configurations par défaut qu'on ne remet jamais en question. **_Article rédigé par Omar_**