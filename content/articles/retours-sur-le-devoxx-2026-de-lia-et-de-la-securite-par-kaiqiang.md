---
titre: "Retours sur le Devoxx 2026 : de L'IA et de la sécurité par Kaiqiang"
date: 2026-05-12T16:43:29.000Z
extrait: "Continuons notre périple sur les conférences avec l'intervention de Kaiqiang qui nous parle de ces deux journées où il a assisté à des conférences sur la…"
auteur: Rémy Poulachon
tempsLecture: 3 min de lecture
categorie: Évènement
---
Continuons notre périple sur les conférences avec l'intervention de Kaiqiang qui nous parle de ces deux journées où il a assisté à des conférences sur la sécurité mais également sur l'IA avec de belles rencontres. Il y a quelques semaines j'ai assisté à Devoxx France 2026. J'ai surtout été attiré par des _talks_ autour de retours d'expérience sur des outils ou des pratiques que j'avais à l'œil depuis un moment voici ce que j'en retiens :

## L'IA est partout. Mais son périmètre reste à définir.

L'IA était omniprésente dans les discussions cette année mais pas sous forme de démos gadget. Ce qu'on entend de plus en plus, ce sont des retours concrets sur ce que ça change vraiment au quotidien. Le talk "2 ans après, les devs n'ont pas disparu" posait la question frontalement : est-ce que l'IA sert vraiment à quelque chose ? La réponse est nuancée, et c'est ça qui est intéressant. Oui, elle transforme les pratiques mais on est encore en train de définir son rayon d'action réel. Ce qui commence à se dessiner :

-   on passe moins de temps à produire, plus de temps à structurer, valider et comprendre
-   le développeur devient en partie un orchestrateur
-   la compétence clé n'est plus d'écrire du code — c'est de savoir poser les bonnes questions
-   La question n'est plus "est-ce que l'IA va nous remplacer ?" c'est "comment on l'intègre de façon cohérente dans notre façon de travailler ?"
-   Un outil, ses forces, ses limites, les cas d’usages pertinent etc …

J’ai ensuite assisté à une conférence sur **Supabase** comme alternative open source à Firebase. La démo s'articulait autour d'un _use case_ concret, base de données, auth, stockage, fonctions serverless avec une prise en main qui semblait accessible. Ce qui était appréciable : le speaker n'a pas esquivé les limites. Supabase brille sur des projets ciblés, mais montre ses contraintes dès qu'il s'agit de s'intégrer à des backends plus conséquents ou à des écosystèmes d'outils existants.

## Sécurité API : les classiques ont la vie dure

Le talk "API Security 2026" nous rappellent l’importance de la sécurité avant tout, dans cette édition rempli d’IA il fallait aussi aborder ce sujet qui va être critique et c'est exactement ce dont ce type de sujet a besoin. Une remise à niveau rigoureuse sur les menaces actuelles : tokens volés, clés exposées, attaques par rejeu. Les "5 balles perdues d'OAuth" résument bien les erreurs encore trop fréquentes en production :

-   l'Implicit Flow : à bannir, même en POC
-   ne pas vérifier la signature du JWT
-   des refresh tokens qui n'expirent jamais
-   confondre authentification et autorisation
-   stocker les tokens dans le localStorage

Le tout emballé dans un format Far West qui rendait la matière digeste. OAuth 2.1, DPoP, mTLS, Zero Trust ,le panorama était complet. Un bon rappel que les bonnes pratiques ne s'appliquent pas d'elles-mêmes.

## La session qui change du rythme

\[caption id="attachment\_27741" align="alignleft" width="169"\]![](https://sedona.fr/wp-content/uploads/2026/05/Image-3-169x300.jpg) Rencontre avec jose et jean michel\[/caption\] Le quiz Java de José et Jean-Michel était la session **la plus interactive de ces deux jours** — et de loin. Smartphones comme buzzers, pièges classiques du langage (nulls, immutabilité, égalité, collections, compilation), salle entièrement impliquée. Un format qui rappelle qu'on peut apprendre des choses sérieuses sans rester passif. Et que même avec des années de Java derrière soi, il reste des surprises, des nuances.               ![Quiz](https://sedona.fr/wp-content/uploads/2026/05/Image-4-300x169.jpg)Pour le fun ils ont posé les questions du quiz à Chatgpt et Claude **et ils ont eu respectivement la note de 12/20 et 17/20** comme quoi il reste toujours des subtilités dans le langage Java que même l’IA n’a pu déceler !       Ce que je retiens de cette édition : on est dans une **phase de consolidation**. L'IA est là, les outils sont là, mais le vrai travail commence maintenant. Définir concrètement ce qu'on lui confie, ce qu'on garde, et comment on fait évoluer nos pratiques en conséquence. Les retours d'expérience de cette année montrent que tout le monde a conscience que le métier de développeur est en pleine mutation et qu’il ne faut pas rester inactif et continuer d’évoluer avec celui-ci _Article rédigé par Kaiqiang_