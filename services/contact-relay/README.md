# Relais du formulaire de contact → Brevo

Le site sedona.fr est statique (GitHub Pages) : il ne peut pas détenir la clé API Brevo,
qui serait lisible par n'importe quel visiteur. Ce micro-service, hébergé sur le
Kubernetes Sedona, reçoit le formulaire de `/contact`, le valide, puis envoie l'e-mail
via l'API transactionnelle de Brevo. La clé reste dans un Secret Kubernetes.

```
Formulaire (sedona.fr) ──POST JSON──▶ contact-api.sedona.fr/contact ──▶ API Brevo ──▶ contact@sedona.fr
```

- Node 22, **aucune dépendance npm** (`fetch` natif).
- Protections : CORS limité à sedona.fr, champ piège anti-robot, limite par IP,
  validation et taille max des champs, HTML échappé dans l'e-mail.
- « Répondre » dans la messagerie écrit directement au visiteur (`replyTo`).
- Optionnel : ajout des prospects (demandes « projet ») dans une liste Brevo.

## Pré-requis Brevo

1. **Clé API** : Brevo → *Paramètres → SMTP & API → Clés API → Générer*.
2. **Expéditeur validé** : l'adresse `CONTACT_FROM_EMAIL` (ex. `noreply@sedona.fr`) doit être
   validée dans Brevo → *Expéditeurs, domaines et IP dédiées* (idéalement domaine sedona.fr
   authentifié par DKIM/DMARC, sinon les e-mails risquent de finir en spam).

## Déploiement

```bash
# 1. Image (depuis ce dossier)
docker build -t registry.example.com/sedona/contact-relay:1.0.0 .
docker push registry.example.com/sedona/contact-relay:1.0.0

# 2. Secret : la clé est saisie dans le terminal, jamais écrite dans un fichier du dépôt
kubectl -n sedona-site create secret generic contact-relay-brevo \
  --from-literal=BREVO_API_KEY='xkeysib-...'

# 3. Configuration + déploiement (adapter les valeurs « À ADAPTER » avant)
kubectl apply -f k8s/configmap.yaml -f k8s/deployment.yaml -f k8s/ingress.yaml

# 4. Vérification
kubectl -n sedona-site rollout status deploy/contact-relay
curl -i -X OPTIONS https://contact-api.sedona.fr/contact -H 'Origin: https://sedona.fr'   # => 204
```

Puis, côté site : renseigner l'URL publique dans `PUBLIC_CONTACT_ENDPOINT`
(`.github/workflows/deploy.yml` et `.env` en local).

## Configuration (ConfigMap `k8s/configmap.yaml`)

| Variable | Rôle |
|---|---|
| `BREVO_API_KEY` | **Secret** `contact-relay-brevo` — clé API Brevo |
| `ALLOWED_ORIGINS` | Origines autorisées (CORS), séparées par des virgules |
| `CONTACT_FROM_EMAIL` / `CONTACT_FROM_NAME` | Expéditeur (validé dans Brevo) |
| `CONTACT_TO` | Destinataire(s) par défaut |
| `CONTACT_TO_PROJET` / `_POSTULER` / `_AUTRE` | Routage optionnel par type de demande |
| `BREVO_LIST_ID` | Optionnel : liste Brevo des prospects |
| `BREVO_ATTR_NOM` / `BREVO_ATTR_PRENOM` | Noms des attributs contact Brevo (défaut `NOM` / `PRENOM`) |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_S` | Anti-spam : demandes max par IP sur la fenêtre (défaut 5 / 600 s) |

## Développement

```bash
npm test                      # tests (Brevo simulé, aucun envoi réel)

# Lancer en local contre le vrai Brevo :
BREVO_API_KEY=... CONTACT_FROM_EMAIL=noreply@sedona.fr CONTACT_TO=moi@sedona.fr \
ALLOWED_ORIGINS=http://localhost:4321 node server.mjs
# puis dans sedona-website/.env : PUBLIC_CONTACT_ENDPOINT=http://localhost:8080/contact
```

## API

`POST /contact` — `Content-Type: application/json`

```json
{ "type": "projet|postuler|autre", "nom": "", "prenom": "", "email": "", "telephone": "",
  "entreprise": "", "budget": "", "offre": "", "poste": "", "linkedin": "", "message": "",
  "page": "/contact", "website_url": "" }
```

Réponses : `200 {ok:true}` · `400/413/415 {erreur}` (saisie) · `403` (origine) · `429` (trop de
demandes) · `502 {erreur}` (Brevo indisponible). `GET /healthz` pour les sondes Kubernetes.
