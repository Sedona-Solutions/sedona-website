// Configuration Matomo (Matomo Cloud : https://sedona.matomo.cloud/).
// Valeurs fournies au build par .env ou deploy.yml (PUBLIC_MATOMO_URL, PUBLIC_MATOMO_SITE_ID).
import { estIndexable } from "./seo";

export const MATOMO_URL: string | undefined = import.meta.env.PUBLIC_MATOMO_URL;
export const MATOMO_SITE_ID: string | undefined = import.meta.env.PUBLIC_MATOMO_SITE_ID;

/**
 * Matomo n'est actif qu'en production (même règle que l'indexation) :
 * la preview et le dev local n'envoient aucune visite dans les statistiques.
 */
export const matomoActif = (site?: URL) => Boolean(MATOMO_URL && MATOMO_SITE_ID && estIndexable(site));

/** Matomo Cloud sert matomo.js depuis son CDN ; une instance auto-hébergée le sert elle-même. */
export function matomoScriptUrl(url: string) {
  const host = new URL(url).hostname;
  return host.endsWith(".matomo.cloud") ? `https://cdn.matomo.cloud/${host}/matomo.js` : `${url}matomo.js`;
}
