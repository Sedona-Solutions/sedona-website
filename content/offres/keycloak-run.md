---
pillVariant: cactus
titre: Keycloak
eyebrow: Offres clé en main
accroche: Sécuriser vos applications avec Keycloak
accrocheAccent: Keycloak
enBref: "Nos offres RUN\_et\_RUN+\_maintiennent votre plateforme d’authentification à jour, supervisée et sous engagement de service\_— pour que la connexion de vos collaborateurs, clients et partenaires reste un non-événement."
illustration: /uploads/offre/keycloak-hero.svg
heroProof:
  texte: ''
moteurSpecification:
  eyebrow: Notre couverture de service
  titre: "Une semaine, 168 h. Combien voulez-vous en couvrir\_?"
  texte: |
    Chaque case représente une heure de la semaine. Les cases allumées sont celles pendant lesquelles nos équipes peuvent prendre en charge un incident sur votre Keycloak.
  illustration: ''
etapes:
  eyebrow: UNE OFFRE POUR CHAQUE cycle DE VIE
  titre: 'Installer Keycloak est un projet, le maintenir un métier'
  titreAccent: métier
  sousTitre: 'Depuis plusieurs années, nous assurons l’audit, l’installation et le paramétrage de Keycloak. Après la mise en production, nos offres RUN et RUN+ prennent le relais pour gérer correctifs, mises à jour et incidents, même hors heures ouvrées.'
  image: /uploads/offre/keycloak-signin.png
  avant:
    label: Avant la production
    items:
      - titre: Audit & cadrage
        texte: |
          Analyse de l’existant et cadrage de vos besoins IAM.
        icone: ''
      - titre: Installation
        texte: |
          Déploiement de la plateforme, on-premise ou cloud.
      - titre: Paramétrage & intégration
        texte: |
          Realms, clients, flows d’authentification, annuaires et applications.
  apres:
    label: Après la production
    items:
      - titre: Audit pre-RUN
        texte: |
          Vérification que la plateforme est saine, supportable et maintenable dans la durée.
        icone: audit-data
        tag: Prérequis
      - titre: Keycloak RUN
        texte: |
          Maintien en conditions opérationnelles : mises à jour, patchs, support et incidents en heures ouvrées.
        icone: rocket
        tag: Socle
      - titre: Keycloak RUN+/RUN PREMIUM
        texte: |
          Tout RUN, plus la supervision temps réel, l’alerting proactif et l’astreinte sous SLA renforcés.
        icone: bookmark-favorite
        tag: Premium
        highlight: true
incoherence:
  eyebrow: Un partage des responsabilités
  titre: Nous opérons Keycloak. Vous gardez la main sur l’infra.
  texte: "Le périmètre est clair : Keycloak est notre responsabilité (versions, configuration, sécurité, incidents). Serveurs, réseau et base restent chez vous ou votre hébergeur, y compris CleverCloud.\n\n**Les deux modèles de déploiement sont couverts :**\_Keycloak on-premise\_(VM, Kubernetes, bare-metal) et\_Keycloak managé ou SaaS.\n"
  illustration: /uploads/offre/keycloak-responsability.svg
perimetre:
  tabs:
    - label: Audit pre-RUN
      eyebrow: Audit pre-RUN
      titre: On ne s’engage pas sur une plateforme qu’on ne connaît pas
      titreAccent: s’engage pas
      intro: 'Avant de reprendre l’exploitation, nous réalisons un audit de reprise. Son objectif est simple : vérifier que votre environnement Keycloak permet d’appliquer en toute sécurité les mises à jour, la supervision et les interventions sous SLA que nous nous engageons à tenir.'
      items:
        - icone: ia-generative
          titre: Plateforme Keycloak
          points:
            - 'Versions, plugins, customisations (thèmes, extensions)'
            - 'Realms, clients, flows d’authentification, rôles, MFA'
            - Organisation des environnements DEV / INT / PREPROD / PROD
        - icone: cloud-migration
          titre: Architecture & hébergement
          points:
            - 'Mode de déploiement : VM, conteneurs, Kubernetes, cloud'
            - 'BDD, performances, redondance, sauvegardes et restauration'
            - Prérequis aux mises à jour et redémarrages contrôlés
        - icone: cyber
          titre: Sécurité & exploitation
          points:
            - 'Politiques de mots de passe, MFA, durcissement'
            - Comptes d’administration et gestion des droits
            - 'Journaux, traces et outils de monitoring déjà en place'
        - icone: network
          titre: Organisation & processus
          points:
            - Rôles et responsabilités actuels
            - 'Gestion des incidents, changements, mises en production'
            - Points de contact opérationnels et chaîne d’escalade
      banner:
        - texte: |
            **Un état des lieux factuel** des écarts par rapport aux bonnes pratiques de sécurité, de performance et d’architecture.
        - texte: |
            **Une feuille de route de mise à niveau,** si des actions sont nécessaires avant le démarrage du RUN.
        - texte: |
            \*\*Une validation formelle \*\*de l’éligibilité de votre plateforme à l’offre Keycloak RUN.
    - label: RUN
      eyebrow: Offre KEYCLOAK RUN
      titre: Maintien en conditions opérationnelles de votre plateforme Keycloak
      titreAccent: ''
      intro: 'Votre SI s’appuie de plus en plus sur Keycloak pour le SSO, l’authentification et la gestion des accès. Vous devez garantir la disponibilité de la connexion, la sécurité des accès et la maîtrise des versions — sans forcément disposer en interne d’une expertise Keycloak dédiée. RUN prend en charge l’exploitation applicative de votre instance, en heures ouvrées.'
      items:
        - icone: cloud-migration
          titre: Maintenance & mises à jour
          points:
            - Analyse des nouvelles versions et de leurs impacts
            - Planification et réalisation des upgrades mineurs et majeurs
            - Tests de non-régression sur les parcours d’authentification clés
        - icone: check-double
          titre: Patchs de sécurité
          points:
            - Veille continue sur les vulnérabilités Keycloak
            - Qualification de l’impact réel dans votre contexte
            - Application des correctifs et compte rendu après chaque intervention
        - icone: flag-heart
          titre: Support & gestion des incidents
          points:
            - Point de contact unique pour vos équipes IT — support de niveau 3
            - 'Diagnostic des dysfonctionnements : erreurs de connexion, lenteurs, erreurs 5xx'
            - Intervention sur incident bloquant et coordination avec vos équipes infra
        - icone: pencil-clipboard
          titre: Conseil & accompagnement
          points:
            - 'Revue régulière des paramètres de sécurité : MFA, mots de passe, timeouts'
            - Recommandations pour l’onboarding de nouvelles applications
            - Bonnes pratiques IAM appliquées à votre architecture
      banner:
        - texte: |
            Une plateforme **toujours à jour et sécurisée**
        - texte: |
            **Moins de risque d’arrêt du SSO** en heures ouvrées
        - texte: |
            Des **upgrades planifiés, testés et documentés**
        - texte: |
            L’accès à des **experts Keycloak sans recruter**
        - texte: |
            Des **rapports réguliers** : incidents, actions, recommandations
    - label: RUN+/RUN PREMIUM
      eyebrow: Offre Keycloak RUN+/RUN PREMIUM
      titre: 'Quand Keycloak devient critique, la disponibilité attendue est de 24 h sur 24'
      titreAccent: 24 h sur 24
      intro: 'Portails clients, espaces collaborateurs, accès partenaires : une interruption du SSO à 22 h coûte autant qu’à 10 h du matin. RUN+ reprend l’intégralité des services de RUN et y ajoute la supervision temps réel, l’alerting proactif et une astreinte experte — opérée depuis notre plateforme de supervision mutualisée et industrialisée.'
      items:
        - icone: computeur-pc-4
          titre: Supervision avancée
          points:
            - 'Sondes sur les endpoints critiques : login, token, introspection'
            - Taux de succès et d’échec des authentifications
            - 'Temps de réponse, charge, consommation de ressources'
            - Tableaux de bord temps réel et historiques
        - icone: windows-speedtest
          titre: Alerting proactif
          points:
            - Seuils warning / major / critical définis avec vous
            - Alertes routées automatiquement vers notre exploitation et l’astreinte
            - Première analyse traitée sans solliciter vos équipes
        - icone: clock-1
          titre: Astreinte Keycloak
          points:
            - 'Soir, nuit, week-end ou 24/7 selon l’option retenue'
            - Équipe formée à votre contexte et à votre configuration
            - Escalade vers des experts seniors en cas de crise
        - icone: money-graph-bar
          titre: Gestion de crise & reporting
          points:
            - Bridge de crise en cas d’incident majeur
            - Communication régulière jusqu’au rétablissement
            - Rapport d’incident (RCA) et plan d’actions préventives
      banner:
        - texte: |
            Une plateforme **toujours à jour et sécurisée**
        - texte: |
            \*\*Moins de risque d’arrêt du SSO \*\*en heures ouvrées
        - texte: |
            Des **upgrades planifiés, testés et documentés**
        - texte: |
            L’accès à des **experts Keycloak sans recruter**
        - texte: |
            Des **rapports réguliers** : incidents, actions, recommandations
chronologie:
  eyebrow: Chronologie d’un incident bloquant
  titre: 'Un vendredi, 21 h 40 : plus personne ne se connecte.'
  intro: 'Le même incident, vécu sous les deux offres.'
  run:
    label: Avec RUN
    image: /uploads/offre/keycloak-chrono-1.svg
  runPlus:
    label: Avec RUN+
    image: /uploads/offre/keycloak-chrono-2.svg
plans:
  eyebrow: Comment nous travaillons ensemble ?
  titre: 2 offres pour maintenir votre KEYCLOAK
  titreAccent: 2 offres
  intro: Pour les organisations qui veulent déléguer l’exploitation applicative et les mises à jour ou brique critique.
  items:
    - categorie: OFFRE KEYCLOAK
      titre: RUN
      texte: Déléguez l’exploitation de Keycloak à des experts et gardez un SSO fiable au quotidien
      icone: illus_audit
      points:
        - 'Mises à jour Keycloak, versions mineures et majeures'
        - Prototype fonctionnelPatchs de sécurité et veille vulnérabilités
        - 'Support et diagnostic, intervention niveau 3'
        - Conseil IAM et onboarding d’applications
      ctaLabel: Choisir cette offre
      note: Abonnement mensuel
    - categorie: OFFRE KEYCLOAK
      titre: RUN+/RUN PREMIUM
      texte: 'Ajoutez une supervision temps réel, une astreinte et des SLA renforcés pour garantir la disponibilité de votre SSO.'
      icone: illus_maintenance
      points:
        - 'L’offre RUN, avec en plus : '
        - Supervision temps réel des instances Keycloak
        - 'Alerting proactif sur les anomalies : perf, erreurs, dispo'
        - Prise en charge des incidents critiques hors heures ouvrées
        - ' Gestion de crise, rapports d’incident (RCA) et actions préventives'
      ctaLabel: Choisir cette offre
      note: Abonnement mensuel
      highlight: true
temoignage:
  citation: 'Avec Sedona FORGE, nous avons complètement refondu notre portail client, en remplaçant l''ancienne technologie par les dernières innovations. Après un travail documentaire avec BRIEFF, les experts techniques ont rapidement livré un portail fonctionnel, que nous adaptons facilement selon les besoins métiers, sans contraintes ni coûts supplémentaires.'
  role: 'Directeur des Systèmes d''Information, d''un client grand compte'
ctaFinal:
  titre: Prêt à tester KEYCLOAK ?
  titreAccent: KEYCLOAK ?
  description: 'Décrivez-nous votre environnement Keycloak et vos contraintes de disponibilité : nous vous proposons le périmètre RUN ou RUN+ adapté, et les engagements de service correspondants.'
  ctaLabel: Parlons de votre projet
  ctaHref: /contact
  ctaLabel2: DEMANDER UN AUDIT PRE-RUN
  ctaHref2: /contact
  illustration: /uploads/offre/illus_keycloak_mini.svg
_template: keycloakRun
---

