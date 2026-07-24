---
titre: Spécificité des sélecteurs CSS
date: 2025-12-15T01:00:00.000Z
extrait: La spécificité reste l'une des notions CSS les plus mal comprises. On démêle le calcul des poids et les bonnes pratiques pour garder une feuille de styles maintenable.
auteur: Nicolas T.
avatar: /uploads/articles/avatar-11.png
tempsLecture: 2 min de lecture
categorie: ''
tags:
  - App Web
  - CSS
statut: Publié
---

Le poids, ou spécificité, détermine quelle règle CSS s’applique lorsqu’une balise HTML est ciblée par plusieurs sélecteurs. Plus un sélecteur est spécifique (lourd), plus il aura la priorité.

### **Voici la hiérarchie des poids, du plus léger au plus lourd :**

* **Éléments** `div,p,span`
  * son poids : 1
  * Le plus faible. À utiliser sans crainte.

<!---->

* **Classes** `.light`
  * son poids : 10
  * Un bon équilibre. À privilégier pour un code flexible.

<!---->

* **ID** `#Dark`
  * son poids : 100
  * Lourd. Acceptable, mais à utiliser avec précaution.

<!---->

* **Style** `Inline` (style= “…” dans la balise HTML)
  * son poids : 1000
  * Dangereux car très lourd et va à l’encontre de la bonne pratique de séparer le style (CSS) du contenu (HTML).

<!---->

* **La règle** `!important`
  * son poids : 10 000
  * Le plus puissant. Écrase toutes les autres règles sans exception.

### 🚨 L’Usage du !important L’utilisation du !important est considérée comme un dernier recours absolu car :

**Il « écrase TOUS » les autres styles, y compris le style `inline`.**

Une fois utilisé, il devient extrêmement difficile de le contrer plus tard dans le code, car il faudrait utiliser une combinaison de sélecteurs encore plus lourde, ce qui conduit à des pratiques de code non recommandées.

dans de très rares cas (par exemple, pour neutraliser une règle trop puissante héritée d’une librairie CSS externe), utiliser !important pourrait être préférable à la création d’une règle CSS démesurément longue (avec trop de sélecteurs).

### Conclusion 

L’objectif est de **rester maître de ses outils en écrivant des règles CSS cohérentes et réfléchies**, en privilégiant les sélecteurs de faible poids (comme les classes) pour maintenir un code propre et maintenable.
