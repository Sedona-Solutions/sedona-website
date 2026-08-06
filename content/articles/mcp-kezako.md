---
titre: MCP Kezako ?
date: 2025-12-05T01:00:00.000Z
extrait: |-
  Une introduction simple au Model Context Protocol et à ce qu'il change concrètement.MCP est sur toutes les lèvres, mais de quoi parle-t-on vraiment ? On reprend
  les bases du protocole et ses cas d'usage les plus parlants.
auteur: Véran R.
avatar: /uploads/articles/collab/veran-r.png
tempsLecture: 6 min de lecture
categorie: ''
tags:
  - IA
  - MCP
statut: Publié
---

###### ![](/uploads/articles/wp/67daad2ef3660093645d72ac_model-context-protocol-mcp-ai.jpg)&#xA;&#xA;

## ⁉️ MCP Kezako ?

Le MCP (Model Context Protocol) est un protocole open-source développé par Anthropic qui permet de connecter de manière standardisée et simple les modèles de langage — en particulier les grands modèles (LLM) — à des sources de données ou à des outils externes. Pour simplifier, on peut considérer MCP comme l’équivalent des API pour les modèles de langage, offrant une façon unifiée de leur fournir des informations fiables et des capacités d’action.

**Le protocole repose sur deux concepts fondamentaux :**

➡️ Le serveur MCP, qui expose des fonctionnalités, données ou outils. ➡️ Le client MCP, généralement un agent IA, qui consomme ce que le serveur expose.

## 🤖 MCP et les Agents

Avec l’essor des agents IA, les clients MCP deviennent des éléments centraux. L’un des principaux avantages d’un serveur MCP est de réduire les hallucinations : l’IA n’invente plus de données, mais s’appuie sur des sources contrôlées, validées et cohérentes.

**Les serveurs peuvent exposer différents types :**

– Ressources – Outils – Documents – Prompts

Chaque type à son utilité, mais aujourd’hui, les outils représentent le point d’entrée principal. En effet, gràce aux outils, les agents peuvent effectuer de vraies actions.

La plupart des grandes entreprises ont développé leurs propres serveurs MCP, grace auxquels vous pouvez interagir avec leurs services.

## 💻 MCP et les langages de programmation

Anthropic propose des SDK officiels permettant de déveloper son propre serveur MCP, dans les langages suivants :

• Python • Java • Kotlin • TypeScript • C# • PHP

Ces SDK simplifient considérablement la mise en place d’un serveur dédié à son application ou à son infrastructure interne.

Vous pouvez retrouver toutes les informations concernant le MCP sur : https\://link.sedona.fr/MCP-Intro

De plus, il y a un Github bien maintenu avec des exemples de serveurs : [https://link.sedona.fr/MCP-Servers](https://link.sedona.fr/MCP-Servers)

###### Et si ce sujet vous intéresse, n’hésitez pas à venir échanger avec nous !&#xA;&#xA;©Crédit Photo : MyPrivateLab
