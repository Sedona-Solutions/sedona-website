// Fiche auteur d'un article. Le champ `auteur` est une référence Tina vers
// content/auteurs/<id>.json ; l'ancien format (nom en texte libre + avatar)
// reste accepté pour un article qui n'aurait pas été converti.
import { getEntry } from "astro:content";

export interface Auteur {
  nom: string;
  role?: string | null;
  photo?: string | null;
  linkedin?: string | null;
  expertises?: string[] | null;
  bio?: string | null;
}

export async function ficheAuteur(ref?: string | null, avatar?: string | null): Promise<Auteur | undefined> {
  const valeur = ref?.trim();
  if (!valeur) return undefined;
  const id = valeur.match(/^content\/auteurs\/(.+)\.json$/)?.[1];
  if (!id) return { nom: valeur, photo: avatar };
  const entree = await getEntry("auteur", id);
  if (!entree) throw new Error(`Fiche auteur introuvable : ${valeur}`);
  return entree.data;
}
