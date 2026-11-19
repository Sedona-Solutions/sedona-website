---
titre: 'LangChain4j : intégrer l''IA dans vos applications Java'
date: 2026-11-10T01:00:00.000Z
couverture: /uploads/articles/langchain4j-ia-applications-java.jpg
extrait: >-
  Appeler un LLM, c'est une requête HTTP. Mais c'est à peine 10 % du travail :
  mémoire, outils, RAG, garde-fous, agents. Retour sur notre présentation
  interne consacrée à LangChain4j, la boîte à outils qui rend tout cela simple
  dans l'écosystème Java.
auteur: content/auteurs/mathieu-b.json
tempsLecture: 11 min de lecture
tags:
  - IA
  - Java
  - MCP
  - Technos
statut: Publié
faq:
  - question: Qu'est-ce que LangChain4j ?
    reponse: >-
      LangChain4j est une bibliothèque Java open source qui simplifie
      l'intégration des LLM dans les applications. Elle reprend le nom du projet
      Python LangChain, mais a été conçue pour Java, avec sa propre API et des
      intégrations pour Spring Boot, Quarkus et Jakarta CDI. Elle prend en
      charge les appels aux modèles, la mémoire, les outils, le RAG, les
      garde-fous, MCP et les agents.
  - question: LangChain4j est-il prêt pour la production ?
    reponse: >-
      Oui pour son cœur. Le projet est apparu en 2023 et reste très actif, avec
      des versions publiées régulièrement. Il est bien intégré aux frameworks
      Java du marché et, selon notre retour d'expérience, il est stable. Les
      modules les plus récents, comme les agents et les garde-fous, sont encore
      marqués expérimentaux : leur API peut évoluer. Côté fonctionnalités, il
      couvre l'essentiel de LangChain en Python, qui évolue un peu plus vite.
  - question: Comment empêcher l'envoi de données sensibles à un LLM ?
    reponse: >-
      LangChain4j propose des garde-fous (guardrails) en entrée et en sortie.
      En entrée, ils bloquent un message, ou le réécrivent pour masquer une
      information comme un IBAN ou un mot de passe, avant qu'il ne parte vers
      le LLM. En sortie, ils contrôlent la réponse. LangChain4j en fournit
      quelques-uns de génériques, mais les règles propres à chaque métier
      restent à définir, en implémentant une simple interface.
  - question: Peut-on faire du RAG sur des documents en français avec Easy RAG ?
    reponse: >-
      Oui, mais mieux vaut changer le modèle d'embedding. Easy RAG est livré
      avec un modèle anglais prédéfini, moins performant sur du français. Mieux
      vaut le remplacer par un modèle multilingue, comme multilingual-e5-small,
      idéalement téléchargé à l'avance : il pèse environ 130 Mo dans sa
      version quantifiée.
seo:
  titre: 'LangChain4j : intégrer un LLM dans une application Java'
  description: >-
    Modèles, mémoire, tools, RAG, garde-fous, MCP et agents : découvrez comment
    LangChain4j simplifie l'intégration de l'IA dans vos applications Java.
---

## Appeler un LLM, c'est facile en apparence

Chez Sedona, nous utilisons presque tous Claude Code au quotidien, en ligne de commande ou en version desktop. Mais comment intégrer un LLM dans nos propres applications ? C'est la question à laquelle j'ai répondu lors de notre dernier mercredi technique, en m'appuyant sur LangChain4j, un outil utilisé sur un projet client.

À première vue, parler à un LLM est simple : c'est une requête HTTP comme on en fait depuis des années. Une URL, une clé d'API pour l'authentification, le nom du modèle et les messages à envoyer ; en retour, une réponse JSON à exploiter.

Sauf que cet appel ne représente qu'environ 10 % du travail. Tout le reste se passe autour :

* la mémoire : si j'envoie plusieurs messages, le dernier doit pouvoir faire référence aux précédents ;
* les documents : comment discuter avec un LLM à partir de fichiers Word ou PDF ?
* les garde-fous : comment éviter d'envoyer un IBAN ou une information sensible à un fournisseur de LLM, le plus souvent situé aux États-Unis ?
* les pré-traitements et post-traitements des messages.

Cet ensemble porte un nom : le ***harness*** (le « harnais »), c'est-à-dire tout ce qu'on construit autour du modèle pour en faire une application fiable. C'est pour construire ce harness en Java qu'est né LangChain4j.

## D'où vient LangChain4j

À l'origine, il y avait LangChain, un projet Python très réussi. LangChain4j en reprend le nom, mais ce n'est pas un portage : la bibliothèque a été conçue pour Java, avec sa propre API et son propre rythme de versions.

La première version est sortie en 2023, suivie d'intégrations dans les frameworks que nous utilisons : Spring Boot, Quarkus et Jakarta CDI. Le projet reste très actif, avec des versions publiées régulièrement.

Côté fonctionnalités, LangChain4j couvre aujourd'hui l'essentiel de ce que propose LangChain, dont le projet Python évolue un peu plus vite. Son cœur (modèles, AI Services, tools, RAG) est stable ; les agents et les garde-fous sont encore marqués expérimentaux.

## Les briques de base

Les extraits de code qui suivent mettent en scène un assistant commercial qui suit la facturation du client Cyberdyne Systems.

### Le modèle, point de départ de tout

Tout part du modèle que l'on souhaite utiliser : OpenAI, Mistral, Ollama, Claude, etc. LangChain4j fournit une vingtaine d'implémentations prêtes à l'emploi, et on peut ajouter un modèle personnalisé. D'un fournisseur à l'autre, les API se ressemblent beaucoup : une clé d'API si besoin, le nom du modèle, puis on construit une instance de *chat model*, le cœur de LangChain4j.

Ce modèle expose une méthode `chat` qui envoie du texte et renvoie une réponse. LangChain4j prend en charge l'authentification, l'appel HTTP et la lecture de la réponse :

```java
ChatModel model = MistralAiChatModel.builder()
        .apiKey(System.getenv("MISTRAL_API_KEY"))
        .modelName("mistral-large-latest")
        .build();

String mail = model.chat("""
        Rédige un mail de suivi court pour Miles Dyson, directeur
        des projets spéciaux de Cyberdyne Systems, rencontré au
        salon DevOps de Lyon.""");
```

Chaque fournisseur a son module Maven, ici `langchain4j-mistral-ai`. Pour passer à OpenAI ou à un modèle local avec Ollama, seul le builder change.

### Une interface propre avec AI Services

En Java, on aime les interfaces bien définies. LangChain4j permet de déclarer sa propre interface de chat : l'annotation `@SystemMessage` fixe les consignes permanentes données au LLM (le message système), et le paramètre de la méthode porte la demande de l'utilisateur (le message utilisateur). Ce point d'entrée, AI Services, est le fil rouge de la bibliothèque : c'est là que se branchent toutes les pièces du harness, qu'il s'agisse des outils, du RAG ou de MCP.

```java
interface SalesAssistant {

    @SystemMessage("Tu es l'assistant commercial de Sedona. "
                 + "Réponds en français, de façon concise.")
    String chat(String message);
}

SalesAssistant assistant = AiServices.builder(SalesAssistant.class)
        .chatModel(model)
        .build();

assistant.chat("Rédige un mail de suivi pour Cyberdyne Systems");
```

On ne code aucune implémentation de l'interface : LangChain4j la génère.

### La mémoire de conversation

Un LLM ne garde rien d'un appel à l'autre : sans mémoire, chaque message repart d'une conversation neuve. C'est LangChain4j qui conserve l'historique et le renvoie avec chaque message. Par défaut, il le garde en mémoire vive, et propose une interface, `ChatMemoryStore`, pour le persister dans la base de son choix ; de notre côté, nous privilégions PostgreSQL ou Elasticsearch.

L'identifiant annoté `@MemoryId` distingue les conversations, et le `chatMemoryProvider` crée une mémoire pour chacune, ici limitée aux 20 derniers messages. Le dernier message peut ainsi faire référence aux précédents :

```java
interface SalesAssistant {

    @SystemMessage("Tu es l'assistant commercial de Sedona. "
                 + "Réponds en français, de façon concise.")
    String chat(@MemoryId String conversationId, @UserMessage String message);
}

SalesAssistant assistant = AiServices.builder(SalesAssistant.class)
        .chatModel(model)
        // une fenêtre des 20 derniers messages, par conversation
        .chatMemoryProvider(id -> MessageWindowChatMemory.withMaxMessages(20))
        .build();

assistant.chat("conv-42", "Rédige un mail de suivi pour Cyberdyne Systems.");
assistant.chat("conv-42", "Propose-leur plutôt un créneau mardi.");
```

Pour rester lisibles, les extraits suivants omettent la configuration de la mémoire.

### Des sorties structurées

En Java, on préfère aussi les données structurées. Une méthode de l'interface peut renvoyer un objet Java, par exemple un bon de commande : LangChain4j explique au LLM comment formater sa réponse pour qu'elle corresponde à la structure attendue, puis la convertit. Ici, on extrait un bon de commande de l'e-mail envoyé par un client, contenu dans la variable `orderEmail`. L'annotation `@V` injecte ce texte à la place de `{{email}}` dans la consigne :

```java
record PurchaseOrder(String number, String client, String consultant,
                     LocalDate startDate, int days, BigDecimal dailyRate) {}

interface PurchaseOrderExtractor {
    @UserMessage("Extrais le bon de commande de ce mail : {{email}}")
    PurchaseOrder extract(@V("email") String email);
}

var extractor = AiServices.create(PurchaseOrderExtractor.class, model);
PurchaseOrder order = extractor.extract(orderEmail);
```

## Donner du contexte métier : les tools

Le LLM ne connaît rien de nos données, ni de nos clients. Si je lui demande où en est la facturation de mon client Cyberdyne Systems, il ne saura pas répondre.

C'est le rôle des tools : de simples méthodes Java annotées `@Tool`, accompagnées d'une description, que l'on met à disposition du LLM. Par exemple « donne-moi les factures impayées de tel client », avec le nom du client en paramètre. Dans l'extrait, `billing` et `crm` sont les objets qui donnent accès à notre outil de facturation et à notre CRM.

```java
class BillingTools {

    @Tool("Liste les factures impayées d'un client")
    List<InvoiceView> unpaidInvoices(@P("nom du client") String client) {
        return billing.unpaid(client);
    }

    @Tool("Recherche des factures : numéro même partiel, ou nom de client")
    List<InvoiceView> searchInvoices(@P("numéro ou nom de client") String query) {
        return billing.search(query);
    }
}

AiServices.builder(SalesAssistant.class)
        .chatModel(model)
        .tools(new BillingTools(billing), new CrmTools(crm))
        .build();
```

La description passée à `@Tool` compte : c'est elle que lit le LLM pour décider quel outil appeler.

Le LLM **n'accède jamais directement** à la base de données ou à l'outil de facturation. Il formule une demande structurée ; c'est notre application qui va chercher l'information dans le SI et la lui renvoie, sous forme textuelle ou structurée.

Nous avons appliqué ce principe sur un projet client d'analyse de la voix du client : un chatbot doté de plusieurs outils, qui répond aussi bien à des questions générales qu'à des questions très spécifiques, avec un vrai contexte métier.

## Interroger ses documents : le RAG

Autre besoin fréquent : interroger des documents, par exemple des contrats PDF. C'est le rôle du RAG (*Retrieval-Augmented Generation*), qui fonctionne en trois temps :

1. Indexer les documents : les découper en passages et transformer chacun en vecteur, une suite de nombres qui représente son sens. C'est le rôle d'un modèle dit d'embedding. Deux passages de sens proche ont des vecteurs proches, ce qui permet de retrouver un passage même s'il ne contient pas les mots exacts de la question.
2. Rechercher, pendant la conversation, les passages dont le vecteur est le plus proche de celui de la question.
3. Répondre en fournissant au LLM ces extraits comme contexte.

Si un contrat précise que « les factures sont payables à 30 jours fin de mois », le LLM retrouvera ce passage dès qu'on l'interrogera sur les délais de paiement.

LangChain4j propose une version simplifiée, Easy RAG (module `langchain4j-easy-rag`), qui fournit par défaut le lecteur de documents, le découpage et le modèle d'embedding. En quelques lignes, on charge tout un dossier de documents, on choisit où stocker l'index (en mémoire avec un `InMemoryEmbeddingStore`, ou de façon persistante, en base vectorielle ou sur le disque), puis on fournit à l'AI Service un *content retriever*, le composant qui va chercher dans l'index les passages les plus proches de chaque question.

```java
List<Document> docs = FileSystemDocumentLoader.loadDocuments("contracts/");

InMemoryEmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();
EmbeddingStoreIngestor.ingest(docs, store);

SalesAssistant assistant = AiServices.builder(SalesAssistant.class)
        .chatModel(model)
        .contentRetriever(EmbeddingStoreContentRetriever.from(store))
        .build();
```

### Retour d'expérience

Sur une centaine de documents réels, les réglages par défaut d'Easy RAG montrent vite leurs limites. Trois changements ont fait la différence :

* découper selon la structure des documents (par article ou par section) plutôt que par blocs de taille fixe, pour qu'un passage ne soit jamais coupé en deux ;
* remplacer le modèle d'embedding anglais livré avec Easy RAG par un modèle multilingue, `multilingual-e5-small`. Il pèse environ 130 Mo dans sa version quantifiée, et 470 Mo en pleine précision : mieux vaut le télécharger à l'avance plutôt qu'à chaque lancement de l'application ;
* surtout, ne pas compter sur la recherche vectorielle pour trouver le bon client : des documents rédigés sur le même modèle se ressemblent tous. L'application identifie d'abord le client (par exemple via le CRM), puis ne cherche que dans ses documents, grâce aux métadonnées.

## Protéger ses données : les garde-fous

Les messages des utilisateurs peuvent contenir des données critiques, comme un IBAN copié-collé ou un mot de passe, qu'il vaut mieux ne pas transmettre au LLM. LangChain4j permet de définir des garde-fous (*guardrails*), là encore par annotations :

* en entrée, pour contrôler un message avant son envoi : le laisser passer, le réécrire (par exemple pour masquer un IBAN) ou le bloquer ;
* en sortie, pour contrôler la réponse du LLM : la rejeter, la faire régénérer ou la corriger.

LangChain4j fournit quelques garde-fous génériques (modération, détection d'injection de prompt, validation de JSON), mais les règles propres à chaque métier restent à écrire : il suffit d'implémenter une interface, dans laquelle vous décidez de ce qui passe ou non. Par exemple, un garde-fou d'entrée qui bloque tout message contenant un IBAN :

```java
class NoBankDetails implements InputGuardrail {

    @Override
    public InputGuardrailResult validate(UserMessage message) {
        // IBAN : une expression régulière qui reconnaît un numéro IBAN
        if (IBAN.matcher(message.singleText()).find()) {
            return fatal("Merci de ne pas partager d'IBAN avec l'assistant.");
        }
        return success();
    }
}
```

`fatal` bloque l'envoi : le message n'atteint jamais le LLM, et l'application reçoit une erreur portant ce texte. On active ensuite le garde-fou sur la méthode de l'assistant :

```java
interface SalesAssistant {

    @InputGuardrails(NoBankDetails.class)
    String chat(@MemoryId String conversationId, @UserMessage String message);
}
```

Attention : les données renvoyées par les tools ne passent pas par ces garde-fous. Si un outil peut renvoyer une information sensible, c'est à lui de la filtrer.

## Partager ses outils : MCP

Les tools sont définis dans l'application. Que faire si deux applications ont besoin des mêmes outils : dupliquer le code, créer une bibliothèque partagée ? Et pour discuter avec GitHub, Jira ou Google Drive, faut-il tout réécrire à chaque fois ?

Anthropic a répondu à ce besoin avec le Model Context Protocol (MCP) : le même principe que les tools, mais exposés dans un autre processus, local ou distant, via un protocole standard. MCP est en train de s'imposer (voir nos articles [MCP Kezako ?](/blog/mcp-kezako) et [Focus sur les outils MCP](/blog/focus-outils-mcp)).

LangChain4j couvre les deux côtés :

* en client MCP, on déclare où se trouve le serveur (une URL distante ou un process local), puis on le fournit à l'AI Service comme *tool provider*, une source d'outils pour l'assistant. GitHub, par exemple, publie son propre serveur MCP, qui s'intègre ainsi en quelques lignes ;
* en serveur MCP, on expose ses propres tools, qui deviennent utilisables par toute application qui parle MCP : IntelliJ, VS Code, Claude Code, etc.

Côté client, avec le module `langchain4j-mcp` :

```java
McpClient client = DefaultMcpClient.builder()
        .transport(StreamableHttpMcpTransport.builder()
                .url("https://mcp.example.com/mcp").build())
        .build();

AiServices.builder(SalesAssistant.class)
        .chatModel(model)
        .toolProvider(McpToolProvider.builder()
                .mcpClients(client).build())
        .build();
```

Côté serveur, le module communautaire `langchain4j-community-mcp-server` permet de réutiliser les mêmes classes `@Tool` que l'assistant :

```java
McpServer server = new McpServer(List.of(
        new BillingTools(billing),
        new CrmTools(crm)));

new StdioMcpServerTransport(server).awaitClose();
```

Il ne reste plus qu'à déclarer ce serveur dans Claude Code. Claude Code lance lui-même l'application (ici, l'option `--mcp` lui fait démarrer le serveur MCP) et dialogue avec elle par l'entrée et la sortie standard (stdio), sans passer par le réseau :

```bash
claude mcp add --transport stdio billing \
    -- java -jar sales-assistant.jar --mcp
```

## Orchestrer : les agents

À force d'ajouter des outils, une application finit par en compter beaucoup. On peut alors répartir le travail entre plusieurs agents, comme dans une équipe où chacun a sa spécialité. Un agent est une interface comme l'assistant, dédiée à une tâche précise, avec ses propres consignes. Les agents partagent un espace de travail commun : chacun y dépose son résultat sous une clé (`outputKey`), que les suivants récupèrent.

LangChain4j propose pour cela le module `langchain4j-agentic`, encore expérimental. Il gère plusieurs enchaînements (séquence, parallèle, boucle, ou superviseur quand c'est l'IA qui choisit l'ordre) et des étapes de validation humaine. Par exemple, une clôture mensuelle qui rassemble les CRA (comptes rendus d'activité), prépare les factures, les contrôle, attend la validation d'une personne puis rédige les relances :

```java
interface InvoiceDrafter {
    @Agent(description = "Prépare les brouillons de facture", outputKey = "invoices")
    @UserMessage("À partir de ces CRA, prépare les factures : {{timesheets}}")
    String draft(@V("timesheets") String timesheets);
}

UntypedAgent monthlyClosing = AgenticServices.sequenceBuilder()
        .subAgents(collector, drafter, reviewer, humanApproval, reminderWriter)
        .build();
```

## L'écosystème

Côté frameworks, l'extension Quarkus LangChain4j est très aboutie, et Spring Boot est également pris en charge. Pour Jakarta EE et MicroProfile, le projet [LangChain4j CDI](https://github.com/langchain4j/langchain4j-cdi) est particulièrement réussi : il suffit d'annoter une interface avec `@RegisterAIService` pour en faire un bean CDI, que l'on injecte ensuite avec `@Inject`. Il fonctionne sur les serveurs Jakarta EE (WildFly, Payara, GlassFish, Liberty) comme sur Helidon, et très bien avec Quarkus. Pour stocker les vecteurs, on peut utiliser Elasticsearch, qui travaille sur la vectorisation depuis plusieurs années, ou PostgreSQL avec l'extension pgvector. Pour les documents, LangChain4j lit le PDF et le Word, et s'appuie sur Apache Tika pour extraire du texte de nombreux autres formats, y compris des images, à condition d'installer un moteur OCR comme Tesseract.

Enfin, les projets Python de l'écosystème LangChain ne sont pas utilisables directement, mais ils ont souvent un équivalent côté Java.

## Les points de vigilance

* Le choix du modèle : sa taille et son niveau de raisonnement (certains modèles réfléchissent en plusieurs étapes avant de répondre) jouent sur le temps de réponse comme sur la qualité, et il faut trouver le bon curseur.
* Les hallucinations : un LLM peut se tromper sur un simple calcul. Pour les informations structurantes ou calculées, déléguez à un outil : plus on fournit au LLM des informations claires et sûres, mieux il répond.
* La confidentialité : le LLM n'est pas chez nous, il est souvent opéré par une société américaine. Faites attention aux données envoyées, et mettez en place des garde-fous si vous ne maîtrisez pas les entrées.
* Le non-déterminisme : la même question posée deux fois donne deux réponses différentes. Pour tester un LLM, évaluez le fond des réponses, pas leur forme.

La question de la souveraineté a aussi été soulevée. Pour les entreprises qui manipulent des données sensibles, déployer des modèles internes et cloisonnés sera sans doute un sujet important dans les années qui viennent. Des outils comme Ollama simplifient l'exécution locale de modèles, mais demandent une machine robuste, et entraîner des modèles spécifiques reste un autre chantier.

## Ce qu'il faut retenir

* Appeler un LLM ne représente qu'environ 10 % du travail. Le reste, c'est le harness, et LangChain4j en fournit les briques.
* Tout passe par un point d'entrée unique, AI Services, auquel on branche mémoire, tools, RAG, garde-fous et MCP.
* Le LLM n'accède jamais directement au SI : c'est l'application qui exécute les outils.
* Les calculs et les données critiques se délèguent à des outils, pas au LLM.
* LangChain4j est actif et bien intégré à Quarkus, Spring Boot et Jakarta CDI. Son cœur est stable ; les agents et les garde-fous sont encore expérimentaux.

Pour aller plus loin, il y a la [documentation de LangChain4j](https://docs.langchain4j.dev), et son dépôt GitHub contient de nombreux exemples. Mon conseil : lancez-vous sur un petit projet, avec vos propres données et pas celles de vos clients !

Et si ce sujet vous intéresse, n'hésitez pas à venir échanger avec nous !
