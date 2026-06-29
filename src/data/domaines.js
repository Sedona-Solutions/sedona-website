// Contenu structurel par domaine (sections Projets / Méthode / Ce que nous faisons).
// Le hero (accroche, illustration, tags du nuage) reste dans le frontmatter des fiches expertise.

const T = (nom, logo) => ({ nom, logo: `/technos/${logo}` });

export const domaines = {
  "produits-digitaux": {
    projets: { eyebrow: "Cas concrets client", titre: [{ t: "Quelques " }, { t: "exemples", pill: true }, { t: " d'applications" }] },
    methode: {
      eyebrow: "Notre méthode",
      titre: [{ t: "Une approche éprouvée " }, { br: true }, { t: "en " }, { t: "5 phases", pill: true }],
      sousTitre: "Nous travaillons en cycles courts et itératifs pour livrer de la valeur rapidement, tout en gardant le cap sur vos objectifs business.",
      phases: [
        { titre: "Découverte & Cadrage", texte: "Ateliers de co-conception, interviews utilisateurs, analyse de la concurrence, découverte des problématiques métier : nous posons les fondations d'un projet réussi." },
        { titre: "Design & Prototypage", texte: "Nos designers UX/UI créent des maquettes interactives que nous testons auprès d'utilisateurs réels, pour valider les choix ergonomiques avant le développement." },
        { titre: "Développement agile", texte: "Nos équipes construisent votre produit par incréments fonctionnels, en sprints de 1 à 2 semaines, avec un avancement suivi en temps réel." },
        { titre: "Déploiement & monitoring", texte: "Mise en production progressive, mise en place du monitoring et maintenance évolutive pour garder un produit fiable dans le temps." },
        { titre: "Analytics & personnalisation", texte: "Suivi détaillé des usages et segmentation des audiences pour itérer en continu et faire grandir le produit." },
      ],
      technosTitre: "…dans des technos qu'on utilise au quotidien !",
      technos: [
        { ...T("Liferay", "liferay.svg"), badge: "Gold partner" }, T("Svelte", "svelte.svg"), T("Angular", "angular.svg"),
        T("Elastic", "elastic.svg"), T("PHP", "php.svg"), T("Sylius", "sylius.svg"), T("Symfony", "symfony.svg"),
        T("WordPress", "wordpress.svg"), T("SwiftUI", "swiftui.svg"), T("Kotlin", "kotlin.svg"), T("Flutter", "flutter.svg"), T("React Native", "react-native.svg"),
      ],
    },
    cqnf: {
      eyebrow: "Ce que nous faisons",
      titre: [{ t: "Des " }, { t: "solutions", pill: true }, { br: true }, { t: "pensées pour durer" }],
      intro: "Nous créons des expériences digitales de qualité, centrées sur l'UX, le code propre et la durabilité.",
      items: [
        { label: "Applications mobiles natives & cross-platform", icone: "cqnf-mobile", texte: "iOS, Android, Flutter ou React Native : nous choisissons la bonne approche pour votre usage et votre budget." },
        { label: "Applications web & SaaS", icone: "cqnf-web", texte: "Des plateformes web performantes et évolutives, du MVP au produit à grande échelle." },
        { label: "UX/UI Design", icone: "cqnf-uxui", texte: "Recherche utilisateur, maquettes et prototypes testés pour des interfaces claires et efficaces." },
        { label: "Design Systems", icone: "cqnf-design-system", texte: "Des composants cohérents et documentés pour accélérer le design et le développement." },
        { label: "Logiciels métier sur mesure", icone: "cqnf-logiciel", texte: "Des outils internes taillés pour vos process, qui font gagner du temps à vos équipes." },
        { label: "Product Management", icone: "cqnf-product", texte: "Cadrage, priorisation et pilotage produit pour livrer ce qui compte vraiment." },
        { label: "TMA & Évolutions", icone: "cqnf-tma", texte: "Maintenance, support et évolutions continues pour garder un produit fiable dans la durée." },
      ],
    },
  },

  "data-ia": {
    hero: { pillWord: "Data", pillVariant: "ovni" },
    projets: { eyebrow: "Cas concrets client", titre: [{ t: "Comment l'IA peut " }, { t: "transformer", pill: true }, { t: " votre métier ?" }] },
    methode: {
      eyebrow: "Notre méthode",
      titre: [{ t: "De l'idée au " }, { t: "modèle", pill: true }, { br: true }, { t: "en production" }],
      sousTitre: "Pas de bullshit IA : on vous dit franchement si c'est pertinent, puis on industrialise ce qui crée vraiment de la valeur.",
      phases: [
        { titre: "Cadrage métier & faisabilité", texte: "Comprendre votre problématique, identifier les données disponibles, valider la faisabilité technique et définir les métriques de succès." },
        { titre: "Exploration & POC", texte: "Phase d'expérimentation rapide (2-4 semaines) pour valider l'approche technique, tester différents modèles et évaluer les performances sur un jeu de données réel." },
        { titre: "Développement & intégration", texte: "Industrialisation du modèle, création des pipelines de données, développement de l'API ou de l'interface, et intégration dans votre SI existant." },
        { titre: "Déploiement & monitoring", texte: "Mise en production progressive (A/B testing), monitoring (performances, coûts, data drift) et formation de vos équipes." },
      ],
      technosTitre: "…dans des technos qu'on utilise au quotidien !",
      technos: [
        T("Open AI", "openai.svg"), T("Anthropic Claude", "claude.svg"), T("Mistral AI", "mistral.svg"), T("Hugging Face", "huggingface.svg"),
        T("LlamaIndex", "llamaindex.svg"), T("Vertex AI", "vertex-ai.svg"), T("Elastic Stack", "elastic.svg"), T("Metabase", "metabase.svg"),
        T("Superset", "superset.svg"), T("Power BI", "powerbi.svg"),
      ],
    },
    cqnf: {
      eyebrow: "Ce que nous faisons",
      titre: [{ t: "Des " }, { t: "solutions", pill: true }, { br: true }, { t: "pragmatiques et opérationnelles" }],
      intro: "Nous valorisons vos données et industrialisons des cas d'usage d'IA réellement utiles.",
      items: [
        { label: "IA Générative & Assistants Intelligents", icone: "cqnf-ia-generative", texte: "Assistants, chatbots et génération de contenus connectés à vos données via RAG." },
        { label: "Intégration LLM & Orchestration", icone: "cqnf-llm", texte: "Intégration de grands modèles de langage et orchestration de workflows IA dans vos applications." },
        { label: "Machine Learning & Modèles Prédictifs", icone: "cqnf-ml", texte: "Modèles sur mesure : prévision, scoring, recommandation, détection d'anomalies." },
        { label: "Data Engineering & Pipelines", icone: "cqnf-data-eng", texte: "Collecte, transformation et industrialisation de vos flux de données." },
        { label: "Business Intelligence & DataViz", icone: "cqnf-bi", texte: "Tableaux de bord et visualisations pour piloter votre activité avec vos données." },
        { label: "Audit & Stratégie Data", icone: "cqnf-audit-data", texte: "Audit de maturité data, feuille de route et priorisation des cas d'usage." },
        { label: "Rencontrer Koko !", icone: "cqnf-koko", texte: "Notre assistant interne qui accélère nos projets et que nous mettons à votre service." },
      ],
    },
  },

  "infra-securite": {
    projets: { eyebrow: "Cas concrets client", titre: [{ t: "Quelques " }, { t: "exemples", pill: true }, { t: " d'applications" }] },
    methode: {
      eyebrow: "Notre méthode",
      titre: [{ t: "Les " }, { t: "4 piliers", pill: true }, { br: true }, { t: "de notre approche" }],
      sousTitre: "Une infrastructure moderne repose sur quatre fondamentaux que nous appliquons à chaque projet.",
      phases: [
        { titre: "Automatisation", texte: "Tout doit être automatisable : déploiements, tests, rollback, scaling. Nous éliminons les tâches manuelles répétitives, source d'erreurs, et accélérons vos cycles de release." },
        { titre: "Coût maîtrisé", texte: "Le cloud n'est pas une carte bleue illimitée. Nous optimisons vos coûts (right-sizing, réservations, spot) et vous donnons la visibilité sur vos dépenses." },
        { titre: "Observabilité", texte: "Impossible d'optimiser ce qu'on ne mesure pas : métriques, logs, traces distribuées et alertes contextuelles rendent visibles vos systèmes." },
        { titre: "Sécurité", texte: "La sécurité n'est pas une option : chiffrement, authentification forte, moindre privilège et defense in depth, dès la conception." },
      ],
      technosTitre: "…dans des technos qu'on utilise au quotidien !",
      technos: [
        T("AWS", "aws.svg"), T("Azure", "azure.svg"), T("Kubernetes", "kubernetes.svg"), T("Docker", "docker.svg"),
        T("Terraform", "terraform.svg"), T("Ansible", "ansible.svg"), T("Jenkins", "jenkins.svg"), T("Vault", "vault.svg"),
        T("Keycloak", "keycloak.svg"), T("Cloudflare", "cloudflare.svg"), T("Elastic Stack", "elastic.svg"),
      ],
    },
    cqnf: {
      eyebrow: "Ce que nous faisons",
      titre: [{ t: "De l'infrastructure comme code " }, { br: true }, { t: "à la sécurité " }, { t: "zero-trust", pill: true }],
      intro: "Nous concevons et opérons des infrastructures modernes, scalables et sécurisées.",
      items: [
        { label: "Cloud & DevOps", icone: "cqnf-cloud-devops", texte: "Industrialisation des déploiements, CI/CD et culture DevOps de bout en bout." },
        { label: "Migration Cloud", icone: "cqnf-migration", texte: "Migration et modernisation de vos applications vers le cloud, sans interruption." },
        { label: "Gestion des identités (IAM)", icone: "cqnf-iam", texte: "Authentification, autorisation et SSO pour sécuriser l'accès à vos services." },
        { label: "Cybersécurité & Conformité", icone: "cqnf-cyber", texte: "Durcissement, audits de sécurité et mise en conformité (RGPD, ISO)." },
        { label: "Monitoring & Observabilité", icone: "cqnf-monitoring", texte: "Métriques, logs et traces pour détecter et résoudre les incidents au plus tôt." },
        { label: "Performance & Scalabilité", icone: "cqnf-perf", texte: "Optimisation et mise à l'échelle pour tenir la charge en toute sérénité." },
      ],
    },
  },
};
