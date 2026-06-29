---
titre: "Retours sur l'évènement elastic{on} 2026"
date: 2026-03-16T09:19:12.000Z
extrait: "Sedona était présent en force (3 personnes) à Elastic{On} Paris, la conférence annuelle de l'éditeur d'Elasticsearch qui s'est tenue le 27 janvier 2026 au cœur…"
auteur: Rémy Poulachon
tempsLecture: 5 min de lecture
categorie: Évènement
---
Sedona était présent en force (3 personnes) à Elastic{On} Paris, la conférence annuelle de l'éditeur d'Elasticsearch qui s'est tenue **le 27 janvier 2026 au cœur de Paris**. Une journée dense, multi-tracks (Search, Observabilité, Sécurité), et un constat immédiat : **l'intelligence artificielle est partout !.** Pas un talk ou presque n'y échappe. Ce n'est pas une surprise évidemment au vu du _Zeitgeist_ actuel, et Elastic l'assume pleinement. Voici notre retour (non exhaustif) sur la journée centré forcément sur l'omniprésence de l'IA, mais aussi sur les progrès notables d'ES|QL.

# L'IA est partout

## Une stratégie assumée

Dès la keynote d'ouverture, Ash Kulkarni (CEO d'Elastic) a posé le cadre : l'IA générative n'est plus un axe parmi d'autres, c'est le moteur de l'évolution du produit : Recherche sémantique, agents intelligents, aide à l'investigation en sécurité, ingestion assistée de logs… chaque _track_ de la journée déclinait le sujet sous un angle différent. **Le message est clair** : Elastic veut être la couche de données et de recherche sur laquelle s'appuient les applications d'IA, pas juste un moteur de recherche qui a ajouté des vecteurs et c'est bien normal au vu de l’importance stratégique du sujet.

## Agent Builder

L'Agent Builder est le nouvel outil intégré à Kibana pour créer des agents conversationnels complets. L'outil permet de combiner des sources de données, des requêtes ES|QL, des outils _custom_ et des _workflows_ dans une interface graphique Kibana. L'ensemble est exposable via un serveur MCP (Model Context Protocol), le standard de facto pour connecter des agents IA à des outils externes. La démonstration s'appuyait sur un jeu de données financières pour en sortir des _insights_ intéressants. Elle montrait la différence entre l'utilisation d'un agent générique et l'utilisation de profil plus spécialisé, les chiffres parlent d'eux-mêmes : • L'agent générique consommait 200-250 000 _tokens_ pour répondre à une requête. • Le même agent, spécialisé via l'Agent Builder (profil plus précis, outils ciblés, requêtes ES|QL dédiées), descendait à environ 70 000 tokens pour une réponse plus rapide et plus pertinente. **À noter tout de même** : la consommation de _tokens_ reste significative. En quelques requêtes, on atteint facilement le million de _tokens_ consommés. La question du coût opérationnel des agents en production reste entière, mais ce n'est pas une problématique spécifique à Elasticsearch.

## ADK Google : l'orchestrateur d'agents

Dans la foulée, le talk Google Cloud / Vertex AI a mis en avant l'Agent _Development_ Kit (ADK), un _framework_ open source d'orchestration d'agents IA. L'analogie proposée est parlante : la cible est clairement que l'ADK soit aux agents IA ce que Kubernetes est aux conteneurs, à savoir **LA** couche d'orchestration qui gère le cycle de vie, le routage et la montée en charge de multiples agents spécialisés.

## Les évolutions de Streams (ingestion de logs)

Côté observabilité, la fonctionnalité _Streams_ propose une nouvelle approche radicalement différente de l'ingestion de logs : on envoie tout en vrac dans Elastic, puis un LLM se charge de les partitionner par type (Apache, MySQL, applicatif…) et de générer automatiquement le pipeline d'ingestion qui va les _parser_. La promesse : en finir avec l'écriture manuelle de patterns Grok. Une nouveauté intéressante : les documents envoyés aux _Streams_ qui ne correspondent à aucune règle de partitionnement sont stockés dans un index intermédiaire (sorte de zone de _staging_). Depuis l'interface Kibana, on peut ensuite explorer ces documents « orphelins » et décider comment les traiter : les router vers un _stream_ existant, en créer un nouveau, ou leur appliquer un pipeline de _parsing_. Une nouveauté bien pratique ! Souveraineté et cloud de confiance Elastic a consacré du temps à ses partenariats cloud européens : S3NS (Google Cloud de Confiance) et Microsoft Azure avec l'offre _Serverless_ d'Elastic. Le message aux entreprises françaises et européennes soumises à des contraintes réglementaires : vous pouvez bénéficier de l'IA d'Elastic dans un cadre souverain. Au vu de l'actualité internationale, on peut dire que ça tombait à pic.

## ES|QL : la bonne surprise

Si l'IA était le fil rouge, ES|QL est la bonne surprise de cette édition. Le langage de requêtes pipé d'Elastic a bien progressé, et après cette journée, on commence à vraiment percevoir son intérêt par rapport au QueryDSL classique.

### Les _Joins_ changent la donne

Les _Lookup_ Joins permettent enfin de croiser des données issues de différents index directement dans une requête. C'est un changement fondamental : là où le QueryDSL imposait de dénormaliser ses données ou de faire plusieurs appels, ES|QL permet de joindre à la volée. Combiné au cross-cluster search, on peut interroger des données réparties sur plusieurs clusters en une seule requête. Et cerise sur le gâteau : il est désormais possible d'uploader un fichier CSV directement depuis Discover (jusqu'à 500 Mo) et de l'utiliser immédiatement comme lookup index dans un LOOKUP JOIN. Lors de la démonstration sécurité, « l'analyste » a ainsi importé un fichier de référence et l'a joint à la volée avec ses données SIEM, le tout sans quitter l'éditeur ES|QL.

### Recherche hybride avec FORK

La syntaxe FORK permet d'exécuter plusieurs branches de recherche en parallèle — typiquement une recherche lexicale et une recherche sémantique — puis de fusionner les résultats via FUSE RRF. Le tout dans une syntaxe lisible et pipée, bien plus accessible que les retrievers imbriqués du QueryDSL.

### Augmentation LLM intégrée

Avec l'instruction COMPLETION, on peut désormais passer le résultat d'une requête ES|QL directement à un LLM pour obtenir un résumé, une analyse ou une reformulation. La requête, la recherche et l'augmentation IA tiennent dans un seul pipeline.

### Démonstration sécurité : analyse d'attaque en ES|QL

La démonstration associée, convaincante, voyait « l'analyste » construire en ES|QL la timeline complète d'une attaque : identification du compte compromis, repérage de l'intervention d'un utilisateur externe, et traçage de l'exfiltration de données depuis un hôte critique. Le tout avec des requêtes lisibles et itératives, là où le QueryDSL aurait nécessité une série de requêtes complexes enchaînées manuellement. Chez Sedona, QueryDSL reste pour l'instant notre standard, mais ces changements vont probablement nous pousser à investiguer ES|QL plus en profondeur.

# Conclusion

Cette édition d'Elastic{On} confirme qu'Elastic a basculé dans l'ère de l'IA : les outils sont là, les intégrations Cloud "souveraines" avancent, et les gains de performances sur les vecteurs (DiskBBQ, float16) rendent les cas d'usage IA de plus en plus viables en production. Pour nous chez Sedona, **c'est un signal fort** : les projets Elasticsearch de nos clients vont de plus en plus intégrer des composants IA (agents, recherche sémantique, ingestion intelligente) et la plateforme est de mieux en mieux équipée pour les porter. Thomas C. Expert et référent Elastic