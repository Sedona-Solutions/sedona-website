import React, { useEffect, useRef } from "react";
import { useField } from "react-final-form";
import { wrapFieldWithNoHeader } from "tinacms";

// Ligne de démarcation en début de libellé (voir tina/config.ts) — sert à
// repérer la bonne rangée de champ sans dépendre d'un id/attribut stable,
// puisque Tina n'en expose pas pour les champs de type liste.
const SHOW_WHEN_IMAGE = "Sélection";
const SHOW_WHEN_TEXTE = "Cartes";

/**
 * Champ invisible : bascule l'affichage de « Sélection (4 projets max) » et
 * « Cartes » selon la valeur du champ voisin « layout », sans jamais toucher
 * au rendu de ces listes elles-mêmes (leur DnD reste géré nativement par Tina —
 * un ui.component qui les re-rendait directement faisait planter le
 * drag-and-drop de Tina).
 */
export const ProjectsLayoutToggle = wrapFieldWithNoHeader(({ field }: any) => {
  const layoutFieldName = field.name.replace(/[^.]+$/, "layout");
  const { input } = useField(layoutFieldName, { subscription: { value: true } });
  const layout = input.value ?? "image";
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope =
      markerRef.current?.parentElement?.parentElement ?? markerRef.current?.closest(".relative.w-full.flex-1");
    if (!scope) return;
    const rows = Array.from(scope.querySelectorAll<HTMLElement>(":scope > div.relative.w-full.px-2"));
    for (const row of rows) {
      const text = row.textContent ?? "";
      if (text.startsWith(SHOW_WHEN_IMAGE)) {
        row.style.display = layout === "texte" ? "none" : "";
      } else if (text.startsWith(SHOW_WHEN_TEXTE)) {
        row.style.display = layout === "texte" ? "" : "none";
      }
    }
  }, [layout]);

  return <div ref={markerRef} style={{ display: "none" }} />;
});
