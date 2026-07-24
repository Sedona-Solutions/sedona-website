---
titre: 'RivieraDEV 2026 : ce qu’il faut retenir'
date: 2026-07-16T17:22:50.429Z
couverture: /uploads/articles/wp/riviera-dev-2026.png
extrait: |-
  Quelques jours à RivieraDEV, et une conviction qui se confirme : notre écosystème avance sur deux jambes en ce moment. D’un côté, une ingénierie qui pousse toujours plus loin l’efficience (Quarkus en tête).
  De l’autre, une IA générative qui s’invite partout, jusqu’à nous forcer à repenser ce que veut dire « faire du logiciel ».
  Voici notre retour sur les sessions qui nous ont marqués.
auteur: Édouard L.
avatar: /uploads/articles/collab/edouard-l.png
vedette: true
categorie: BTP
tags:
  - Évènement
  - RivieraDev
statut: Publié
---

#

## L’IA présente, mais sans monopoliser

Impossible d’échapper à l’IA en 2026 et RivieraDEV ne fait pas exception : agents, frameworks, retours d’expérience… Mais on sentait une volonté claire de la programmation de ne pas proposer que ça.

Du Java pur, de l’architecture, du fun : l’équilibre était bien dosé mais surtout, le traitement du sujet était loin d’être béat.

## Une keynote lucide sur la dette cognitive

La keynote du mercredi d’**==Antoine Sabot-Durand==** et **==Laurence Dupré==r** a donné le ton : plutôt que de célébrer le dernier LLM à la mode, elle a examiné les impacts de l’IA « cercle » après « cercle » (des développeurs à l’équipe puis l’organisation et enfin la société) avec un concept central : la « dette cognitive ».

En quelques mots, l’apprentissage passe par **quatre étapes** (collecte d’information, pratique, correction, métacognition) et quand l’IA supprime l’effort, elle court-circuite ce mécanisme.

L’exemple du développeur junior est parlant : avant, il lisait le code, se trompait, était corrigé par un senior et progressait. L’arrivée de l’IA gomme potentiellement ces efforts et arrête la progression du développeur junior.

Mais le phénomène touche aussi les seniors car plus on fait confiance à l’IA, plus l’esprit critique baisse.

La keynote a aussi pointé les coûts cachés côté organisation : knowledge management fragilisé, opacité pour les décideurs, épuisement cognitif des équipes. La conclusion se voulait lucide plutôt que catastrophiste : il faut continuer d’investir dans l’humain, et utiliser l’IA comme \*sparring partner\* plutôt que comme pilote automatique.

La vraie question n’est pas « que peut faire l’IA à ma place ? » mais « que dois-je continuer à faire moi-même pour ne pas m’atrophier ? »

## ADK : Google industrialise la construction d’agents

Côté outillage, **==Guillaume Laforge==o** a présenté l’Agent Development Kit (ADK), le framework open source de Google pour construire et faire tourner des agents IA.

La formule d’ouverture résume bien le sujet : « AI agent = LLM + memory + planning + tool use ».

Disponible en Python, Java, TypeScript, Go et Kotlin, fortement intégré à Gemini mais ouvert aux autres modèles, ADK propose une API claire : on déclare un agent avec son nom, son modèle, ses instructions et ses outils (dont des serveurs MCP), on compose des sous-agents, et on orchestre le tout avec des workflow agents (\`SequentialAgent\`, \`ParallelAgent\`, \`LoopAgent\`…).

On retiendra aussi les schémas d’entrée/sortie pour structurer les échanges, les callbacks pour le tracing et les guardrails, et le support du protocole A2A (agent-to-agent) dans les deux sens : consommer un agent distant via sa carte d’agent, ou exposer son propre agent ADK, y compris en bean CDI dans une application Quarkus.

## LangChain4j et CDI : intégrer l’IA proprement en Jakarta EE

**==Emmanuel Hugonnet==r** et **==Yann Blazart==** ont montré comment rendre LangChain4j (puissant mais verbeux) injectable via CDI, pour retrouver l’ergonomie de Jakarta EE.

Au menu : la mémoire conversationnelle (\`ChatMemory\`) et le RAG, le function calling, les guardrails en entrée et en sortie, le support MCP, et une extension qui câble le tout sur OpenTelemetry.

C’est ce dernier point qu’on retient : rendre une application à base de LLM monitorable et auditable, c’est une étape cruciale pour séparer un POC de la prod.

## Orchestrer ses agents pour un dîner presque parfait

Enfin, une session multi-agents sur le thème de l’organisation d’un dîner a livré des enseignements très concrets : spécialiser chaque agent au maximum, adopter un pattern de routeur/superviseur (un agent « chef » qui délègue au « sommelier » et aux autres spécialistes), challenger deux agents entre eux pour améliorer la qualité des réponses.

La démo tournait sur CrewAI, mais le conseil final vaut pour tous les frameworks (ADK, Strands Agents…) : ne pas s’entêter sur un langage où l’on n’est pas à l’aise, et s’appuyer sur un framework qui fait le gros du travail car tout évolue très vite de toute façon.

## La track Quarkus

Comme chaque année, le Quarkus World Tour posait ses valises à Sophia Antipolis avec une track dédiée.

Oui, on peut faire des CLIs en Java

**==Fabrice Pipart==c** s’est attaqué à un préjugé tenace : Java ne serait pas fait pour l’outillage en ligne de commande. Après un tour d’horizon des alternatives (bash, Python, Go, Node…), démonstration par l’exemple : un CLI Quarkus qui interroge l’API Open-Meteo pour donner la température à une latitude/longitude, construit avec les annotations \`@Command\` et quelques options picocli, testé en JUnit, puis compilé en natif.

Résultat : un vrai exécutable qui se lance instantanément, sans JVM à réchauffer.

Détail qui n’en est pas un : toute la démo a été codée en live avec Claude, le speaker se contentant de piloter. Un live coding entièrement délégué à un agent IA, c’était une première pour nous en conférence et ça a fonctionné.

## Reactive ❤️ Loom : mesurer plutôt que croire

Un des talks les plus techniques de nos deux jours. Si les virtual threads tiennent leurs promesses, à quoi bon s’embêter encore avec la programmation réactive ?

La question est légitime et plutôt que d’y répondre au doigt mouillé, **==Francesco Nigro==n** (contributeur Quarkus/Vert.x/Netty) a sorti les benchmarks (« Measure, don’t guess »).

Ses mesures minutieuses (allant jusqu’à analyser les fréquences CPU effectives et les context switches) montrent que le vrai problème n’est pas l’opposition entre réactif et bloquant, mais la cohabitation de deux pools de threads qui se disputent les mêmes cœurs : les event loops du moteur réactif d’un côté, le scheduler de Loom de l’autre.

Pour le prouver, il a écrit un scheduler Loom custom (447 lignes de code, à peine) qui fait tourner les virtual threads directement sur les event loops Netty, pour des gains mesurés significatifs en débit comme en consommation CPU.

Rapporté à une grosse flotte d’instances cloud, ce genre d’optimisation se chiffre en millions de dollars par an mais il s’agit d’un scheduler experimental : rien d’officiel dans le JDK à venir.

## Quarkus Native, sous le capot

**==Foivos Zakkak==k** a ouvert le capot de la compilation native. Les bénéfices sont connus (démarrage instantané, empreinte mémoire réduite, binaire autonome), les contreparties aussi (cycle de dev plus lent, recompilation à chaque patch de sécurité, pic de perf légèrement inférieur au JIT).

Ce qu’on retient, c’est le rôle de Quarkus : GraalVM impose un travail ingrat de configuration (réflexion, ressources, features), et Quarkus le prend presque intégralement en charge grâce à sa connaissance des frameworks (génération des configurations JSON, substitutions de code, features générées en bytecode via Gizmo).

Le tout sur Mandrel, la distribution de GraalVM CE maintenue par Red Hat et taillée pour Quarkus. « Mostly hassle free » : c’est vrai.

## Quarkus 4 et le futur de Panache : cap sur Quarkus Data Hibernate

La session « Panache » de **==Luca Molteni==** a remis de l’ordre dans la jungle des extensions ORM (Hibernate classique ou Panache, réactif ou bloquant…), avec la philosophie d’Alan Kay en boussole : « simple things should be simple, complex things should be possible ».

À retenir pour la suite : les extensions vont converger vers Quarkus Data Hibernate, une référence unique plutôt qu’une multitude de choix, avec deux nouveaux venus (\`RecordEntity\`, \`ManagedEntity\`) et un effort particulier sur le paging et le sorting.

Un guide de migration depuis Panache est également annoncé.

### Des formats qui sortent du cadre

Cette année, plusieurs présentations sortaient vraiment du format habituel : bravo aux speakers pour leurs efforts!

## Let’s play Factorio

**==Julien Wittouck==** a déroulé toute une leçon d’architecture logicielle… en jouant à Factorio. Le jeu de construction d’usines se prête étonnamment bien à la métaphore : le code spaghetti devient une usine anarchique, puis on refactore vers l’architecture en couches, les microservices, l’hexagonale ; l’urbanisation du SI et l’ESB (« le Kafka des années 2000 ») s’illustrent avec des convoyeurs ; la scalabilité verticale puis horizontale, le load balancing, le monitoring (présence/absence, à la Prometheus) s’enchaînent naturellement. Et pour la sécurité, difficile de faire plus littéral : un firewall, c’est un mur… de feu, contre les extraterrestres. Ludique en apparence, mais tout y est : concevoir un système, c’est gérer des flux, des goulots d’étranglement et de la montée en charge.

## Another World, une leçon d’architecture de 1991

**==Olivier Poncet==r** a proposé un deep dive dans les entrailles d’Another World, le jeu culte d’Éric Chahi sorti en 1991 (on y a joué à l’époque, cela ne nous rajeunit pas…).

On y découvre une architecture simple mais efficace : le jeu tourne sur une machine virtuelle maison (microprocesseur virtuel, 64 threads, 256 registres, opcodes dédiés), développée sur Amiga 500 avec des outils faits main, les données compressées avec l’algorithme Bytekiller.

Le speaker a réimplémenté cette VM en C++ et conclu par une démo fonctionnelle réutilisant les assets de la version MS-DOS. Une belle façon de montrer que les bonnes idées d’architecture (abstraction, machine virtuelle, séparation des ressources) ne datent pas d’hier.

## Six choses et demie ridicules à faire avec Quarkus

**==Holly Cummins==c** (IBM) assume le format potache (générateur de memes en CLI, serveur Minecraft comme dashboard d’observabilité, extension pour coder en langage Rockstar) mais chaque démo comportait un message sérieux.

> Un exemple : pour alimenter un Quarkus sur l’instance EC2 la plus petite possible, il faudrait environ 17 000 citrons utilisés comme batterie… contre 40 000 pour l’équivalent Spring Boot.

Derrière la blague, une mesure réelle de consommation et ses implications : Quarkus coûte deux à trois fois moins cher à faire tourner que l’équivalent Spring.

## Un détour par la recherche sémantique

Impossible pour (notre référent Elasticsearch) de manquer le talk de **==Pietro Mele==n** et **==Giovanna Monti ==k**(Adelean) : « Beyond the hype: managing billion-scale embeddings in Elasticsearch and OpenSearch ».

> Que se passe-t-il quand on doit réellement gérer un milliard de vecteurs en production pour de la recherche sémantique?

Le talk s’appuyait sur des retours d’expérience chiffrés, sur de gros volumes et les ordres de grandeur font réfléchir : on parle de plusieurs téraoctets de disque et de RAM.

La bonne nouvelle, c’est que des optimisations existent et progressent vite des deux côtés (Elasticsearch comme OpenSearch) : quantization pour compresser les vecteurs, rescoring pour préserver la pertinence, stratégies de stockage sur disque, indexation accélérée par GPU…

Les speakers ont également partagé des conseils concrets : bien dimensionner ses nœuds (notamment la répartition heap/filesystem cache), surveiller où part réellement l’espace disque, et toujours arbitrer entre coût, latence et précision.

Nous pouvons reprendre la conclusion des speakers qui résumait bien le sujet : "semantic search is cool, but costly"

## Et aussi

Mention spéciale au talk de **==Clément de Tastes==o** sur les Value Types et le projet Valhalla, qui promet le meilleur des deux mondes : l’abstraction des classes avec les performances des primitives. La démonstration JavaFX (génération de fractales, profiling à l’appui) rendait le gain très visuel : là où les objets classiques déclenchent allocations et passages du GC, la version « value » les fait tout simplement disparaître.

Au-delà de la démo, le talk a bien montré ce que ces nouveaux objets changent dans la sémantique du langage et le chemin qui reste à parcourir : le projet, démarré en 2014, est toujours expérimental, avec une preview espérée… peut-être dans Java 28. Le screenshot final de la PR de la JEP 401 (plus de 200k lignes impactées) donne la mesure du chantier qui pourrait changer en profondeur la façon dont Java gère la mémoire.

## En repartant de la Riviera

Difficile de résumer deux jours aussi denses en un seul article : on a forcément simplifié et laissé des choses de côté. En tout cas, deux impressions dominent:

1\. **Quarkus continue de creuser son sillon** de l’efficience, du CLI au natif, avec une cohérence technique impressionnante.

2\. **l’IA générative est partout et l’écosystème Java** l’intègre avec sérieux (injection, guardrails, télémétrie). Mais la keynote nous laisse avec la vraie question de l’année qui n’est pas « que peut faire l’IA à ma place ? », mais « que dois-je continuer à faire moi-même pour ne pas m’atrophier ? »

***Merci encore à l’équipe de RivieraDEV pour cette édition 2026 !***

![](/uploads/articles/wp/riviera-dev-2026-longtail.png)
