---
titre: Nouvelle version de Keycloak v25.0
date: 2025-02-17T01:00:00.000Z
extrait: |-
  Tout ce qu'il faut savoir Faisons le point sur les nouveautés de Keycloak après avoir pris le temps de digérer les diverses galettes et autres crêpes de ce début d’année 2025. Nous ne dresserons pas une liste exhaustive de tous les changements, le blog officiel s’en charge très bien, mais voici les points que nous avons trouvé intéressants de mettre en avant.
   naviguer la montée de version en toute sérénité.
auteur: Sébastien C.
avatar: /uploads/articles/collab/sebastien-c.png
tempsLecture: 7 min de lecture
categorie: ''
tags:
  - Technos
  - Keycloak
statut: Publié
---

## Provider Terraform

Bonne nouvelle pour ceux d’entre nous qui utilisons Terraform / OpenTofu, le provider permettant de piloter la configuration de Keycloak reprend du service grâce à l’équipe de développement.

En effet, le provider mrparkers/keycloak qui était le plus abouti du registry Terraform pour configurer notre IdP favori était malheureusement inactif.

Voyant le manque d’alternative disponible, l’un des utilisateurs de ce provider a pris l’initiative de mettre en relation le créateur de ce provider et l’équipe du projet Keycloak afin de permettre le transfert du provider vers l’organisation GitHub Keycloak.

Nous disposons donc désormais d’un [provider Terraform officiel pour Keycloak](https://github.com/keycloak/terraform-provider-keycloak).

## Nouveau cycle de publication de versions

Retour en octobre 2024 pour la sortie de la version 26 de Keycloak qui arrive avec son lot de changements, et pas seulement d’un point de vue fonctionnalités.

En effet, celles et ceux d’entre vous qui ont suivi l’activité du projet auront noté que le rythme des mises à jour peut être parfois difficile à suivre.

C’est pour cela qu’un nouveau cycle de release a été mis en place et il prend effet à partir de cette version 26.0.0 :

* 4 Releases mineures par an
* 1 Release majeure tous les 2 ou 3 ans
* Des releases « patch » selon les besoins, par exemple : résolution de bugs ou correctifs de sécurité. Ce qui fait que nous devrions donc terminer 2025 avec une version Keycloak 26.4.x (la version 26.1 datant de janvier).

Ce nouveau rythme de publication n’empêchera pas l’évolution de Keycloak et de ses fonctionnalités :

En effet, lors de l’introduction de nouveautés qui casseraient la compatibilité avec la version précédente, ces changements seront alors proposés en mode « opt-in » à l’aide du versioning des modules correspondants, comme c’est déjà le cas avec la console utilisateur (account-v2, account-v3) ou le nouveau module de configuration de nom d’hôte ajouté en version 25.0 (hostname-v2).

## Séparation des bibliothèques clientes

À partir de la version 26, certaines bibliothèques clientes auront un cycle de publication qui pourra être différent de celui du composant serveur de Keycloak. En version 26.0, les bibliothèques concernées sont les suivantes :

* Java admin client – [org.keycloak:keycloak-admin-client](https://search.maven.org/search?q=g:org.keycloak%20AND%20a:keycloak-admin-client)
* Java authorization client – [org.keycloak:keycloak-authz-client](https://search.maven.org/search?q=g:org.keycloak%20AND%20a:keycloak-authz-client)
* Java policy enforcer – [org.keycloak:keycloak-policy-enforcer](https://search.maven.org/search?q=g:org.keycloak%20AND%20a:keycloak-policy-enforcer)

Ces bibliothèques sont encore maintenues avec le support de Java 8 afin de permettre leur utilisation par des applicatifs legacy. D’autres bibliothèques pourront venir compléter cette liste ultérieurement.

En version 26.1, c’est au tour des librairies côté Javascript de se détacher du cycle de publication du composant serveur de Keycloak

* Node.js Adapter – [https://www.npmjs.com/package/keycloak-connect](https://www.npmjs.com/package/keycloak-connect)
* Javascript Adapter – [https://www.npmjs.com/package/keycloak-js](https://www.npmjs.com/package/keycloak-js)

## Changements introduits par Keycloak 26.x

## Support des Organisations (v26.0)

La fonctionnalité ajoutée en Keycloak 25 (voir notre article sur la version 25.0), introduisant la notion d’Organisation est désormais considérée stable et officiellement supportée. [La documentation officielle](https://www.keycloak.org/docs/latest/server_admin/index.html#_managing_organizations) a été mise à jour avec les possibilités de configuration offertes par cette fonctionnalité.

### Sessions utilisateurs persistantes (v26.0)

Également évoqué dans notre article précédent, la fonctionnalité permettant de sauvegarder les sessions utilisateurs en base de données est désormais activée par défaut. Si vous souhaitez rétablir le fonctionnement précédent, consultez la section « Volatile user sessions » du [guide de configuration du cache](https://www.keycloak.org/server/caching).

### Nouvelle URL pour le workflow d’inscription (v26.1)

Jusqu’ici Keycloak proposait une URL au format `/realms/<realm>/protocol/openid-connect/registrations` pour permettre l’inscription des utilisateurs. Cependant, depuis fin 2022 la [spécification OpenID Connect 1.0](https://openid.net/specs/openid-connect-prompt-create-1_0.html) intègre une méthode spécifique pour qu’une application puisse rediriger un utilisateur non connecté vers la procédure de création de compte. Cette méthode introduit une nouvelle valeur create pour le paramètre prompt disponible sur le Authorization Endpoint. Coté Keycloak, cela se traduit par un appel à ce endpoint au format `/realms/<realm>/protocol/openid-connect/auth?client_id=[…]&prompt=create`.

À noter que cette nouvelle méthode est désormais celle recommandée et que l’URL `[…]/registrations` évoquée précédemment est maintenant considérée comme obsolète car spécifique à Keycloak.

### Compte administrateur temporaire (v26.0)

Lors de l’installation de Keycloak, il est possible de fournir l’identifiant et le mot de passe du premier administrateur créé pendant le bootstrapping de la base de données (à l’aide des variables d’environnement `KEYCLOAK_ADMIN & KEYCLOAK_ADMIN_PASSWORD`). Bien que très pratique pour faciliter l’installation de Keycloak, cette possibilité n’encourageait pas les administrateurs à créer des comptes dédiés nominatifs ou spécifiques à l’administration de Keycloak.

Au fil de nos interventions, nous avons souvent retrouvé ce compte admin du realm master utilisé pour la gestion courante de l’instance, et si les accès à celui-ci sont perdus, il devient difficile de récupérer l’accès à l’administration Keycloak.

Afin d’inciter les utilisateurs de Keycloak à configurer convenablement des comptes administrateurs différents de ce compte initial, Keycloak 26.0 introduit la notion de compte administrateur temporaire et configurable entre autres par les nouvelles variables d’environnement `KC_BOOTSTRAP_ADMIN_USERNAME` et `KC_BOOTSTRAP_ADMIN_PASSWORD`. Ce compte administrateur ne peut être créé que lors du bootstrapping, c’est-à-dire l’initialisation de la base de données Keycloak, quand le realm master n’existe pas.

L’ajout de cette nouvelle notion d’administrateur temporaire s’accompagne également d’une procédure permettant de reprendre la main sur un compte administrateur pour lequel le fournisseur OTP serait inaccessible. Pour plus de détails, consultez la documentation dédiée : [Admin Bootstrap and Recovery](https://www.keycloak.org/server/bootstrap-admin-recovery)

### Configuration avec un proxy (v26.0)

Avec l’arrivée de l’option proxy-headers en Keycloak 24, l’option proxy devenu obsolète a été supprimée et la nouvelle directive de configuration se retrouve complétée par les options proxy-trusted-addresses permettant de restreindre l’interprétation des headers selon leur provenance, et proxy-protocol-enabled permettant de prendre en compte les configurations utilisant le protocole HAPROXY.

## Pour finir

Bien que certaines fonctionnalités nécessitent d’être encore approfondies pour être pleinement exploitables dès leur activation (par exemple la gestion des organisations et les permissions associées), ces dernières évolutions confirment et renforcent la position de Keycloak en tant que solution IAM incontournable.

De plus, entre l’officialisation du provider Terraform, le nouveau rythme de publication des différents composants prenant en compte la rétrocompatibilité et les initiatives en cours pour améliorer l’exploitation et l’administration de la solution, il devient de plus en plus simple de mettre en place et de maintenir Keycloak dans son S.I.

Évidemment, bien que déjà bien fournie, cette liste n’est pas exhaustive. [Rendez-vous sur le blog du projet](https://www.keycloak.org/blog-archive.html) pour retrouver tous les changements de ces dernières versions. 

**Et si vous souhaitez échanger sur ces nouveautés ou partager votre expérience avec Keycloak, n’hésitez pas à nous contacter !**
