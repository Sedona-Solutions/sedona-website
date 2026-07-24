---
titre: 'Mixit 2026 : Entre JS, navigateurs et feature flags'
date: 2026-05-20T10:05:04.000Z
couverture: ''
extrait: 'Continuons les pérégrinations de nos collaborateurs sur les différents évènements de cette année, avec aujourd''hui Mathias qui nous parle du Mixit 2026. Retour sur les deux jours avec des conférences qui m''ont marqué...'
auteur: Mathias Branger
avatar: /uploads/articles/collab/mathias-b.png
tempsLecture: 4 min de lecture
categorie: Autres
tags:
  - Évènement
  - MiXiT
statut: Publié
---

**Au cœur d'une pipeline : démystifions Vite et ses plugins**
\- *par Estéban Soubiran*
-------------------------

On utilise **Vite** au quotidien sans forcément savoir ce qui se passe sous le capot. Ce talk démonte la mécanique : tout dans Vite est plugin, y compris les fonctionnalités internes de Vite lui-même. Les plugins s'articulent autour de hooks qui s'enchaînent différemment selon qu'on est en mode dev (serveur ESM natif) ou build (Rollup en coulisses). Ce que je retiens : l'outil vite-plugin-inspect ([https://www.npmjs.com/package/vite-plugin-inspect](https://www.npmjs.com/package/vite-plugin-inspect)) qui permet de visualiser exactement ce que chaque plugin fait à chaque étape de la pipeline et ce que chaque module devient après transformation. Un outil de debug/compréhension précieux quand on commence à écrire ses propres plugins ou qu'on veut comprendre pourquoi un comportement diffère entre dev et prod.

[https://www.youtube.com/watch?v=LiA9zksePho](https://www.youtube.com/watch?v=LiA9zksePho)

**Déconstruisons les *frameworks* JS pour mieux réinventer le web !**
\- *par Nirina Rabeson*
-----------------------

Savez-vous vraiment comment fonctionne votre framework frontend ? Nirina Rabeson a pris le parti de construire un mini-framework from scratch en live, pour démystifier les concepts qu'on cite sans les comprendre : virtual DOM, diffing algorithm, tree-shaking, signals, fine-grained reactivity… Une session illustrée en live-coding par un bingo autour des Core Web Vitals, ces métriques Google (LCP, INP, CLS) qui quantifient chargement, interactivité et stabilité visuelle. Un prétexte ludique pour ancrer la théorie dans des problèmes concrets de performance réelle. Le message de fond : ces concepts ne sont pas réservés aux auteurs de frameworks. Les comprendre change la façon dont on écrit et optimise son propre code.

[https://www.youtube.com/watch?v=amawrzqe5c8](https://www.youtube.com/watch?v=amawrzqe5c8)

**Pixel Perfect : Ma Première Contribution dans Chrome**
\- *par Ane Diaz* *Ane Diaz*
----------------------------

Elle nous expose le bug qu'elle a découvert dans Chrome : certaines dimensions sont renvoyées en pixels physiques au lieu de CSS pixels, faussant silencieusement les calculs de performance pour des milliards d'utilisateurs. Le correctif paraît simple. Sauf que corriger Chrome, c'est plonger dans Chromium : des millions de lignes de C++, un projet open source avec ses propres règles, ses propres outils, ses propres standards de revue. Rien de tout ça n'était son terrain, ni le langage (C++), ni les outils, ni la connaissance du projet. Ce qui marque dans son récit c'est l'ampleur de l'engagement nécessaire. Il ne suffit pas d'ouvrir une PR. Il faut présenter, justifier, passer des comités de validation, convaincre que le changement vaut le risque. La *feature* a d'ailleurs dû être mise derrière un feature flag, parce qu'elle pouvait impacter des systèmes anciens et des millions d'utilisateurs. Ce qui ressort aussi, c'est l'investissement de l'équipe Chromium pour former et accompagner les nouveaux contributeurs : une vraie culture de transmission, malgré la rigueur du processus. Un talk qui donne envie de contribuer !

[https://www.youtube.com/watch?v=zFjse5guC1s](https://www.youtube.com/watch?v=zFjse5guC1s)

**L'idempotence, ou l'histoire d'un message envoyé trop de fois…**
\- *par Johann Pardanaud*
-------------------------

En cas d'erreur réseau, un client retente sa requête. Sans garantie d'idempotence côté serveur, la même opération peut s'exécuter deux fois - qui veut payer 2 fois un même article ? C'est donc un contrat fondamental d'une API robuste, et pourtant encore trop souvent ignoré. La définition posée d'emblée : deux exécutions successives d'une requête idempotente n'altèrent pas l'état deux fois. C'est le contrat qu'on attend de GET, PUT, DELETE, mais pas de POST, le seul verbe HTTP intrinsèquement non-idempotent. La solution présentée en live coding : générer côté client un UUID propre à (l'utilisateur + la route actuelle), le passer dans un header \_Idempotency-Key. C\_ôté serveur mettre un lock pour stocker la clé dans un cache Redis afin détecter les doublons et rejouer la réponse sans ré-exécuter l'opération.

[https://www.youtube.com/watch?v=On8UR\_y8ZkA](https://www.youtube.com/watch?v=On8UR_y8ZkA)

**Déployer souvent, stresser moins : feature flags en prod critique**
\- *par Marion Chineaud & Elise Souvannavong*
---------------------------------------------

Le talk part d'un constat simple : la stratégie "on merge quand tout est prêt" engendre un empilement de PRs approuvées et testées qui traînent des semaines. Elle accumule le risque avec des branches longues, des conflits, des rebases douloureux et un release day stressant.

Leur solution consiste à séparer le merge de la release. Merger tôt, déployer souvent, et contrôler l'activation via des feature flags. Le talk passe en revue plusieurs approches selon les contraintes :

* Gestion simple via application.yaml - quand la feature est à la main des techs uniquement
* Flag en base de données, activable à chaud via une page d'administration pour donner la main au produit
* @RefreshScope côté Spring pour recréer un bean sans redémarrage via un POST /actuator/refresh, couplé à Spring Cloud Config pour propager le changement depuis un fichier de config centralisé

Quand la configuration doit se faire sur un repository, on passe par GitOps : les flags définis comme du code (YAML, ConfigMap Kubernetes…) versionné dans Git, où chaque activation ou désactivation passe par une PR, avec revue, historique et rollback automatique, exactement comme n'importe quel autre changement d'infrastructure. "Un if (featureEnabled) qui reste dans le code 6 mois après le *rollout*, c'est du code mort qui pourrit silencieusement"

[https://www.youtube.com/watch?v=mYQeYhKBbVg](https://www.youtube.com/watch?v=mYQeYhKBbVg)

###### Credit photo MiXiT2026
