import React, { useEffect, useRef } from "react";
import { useField } from "react-final-form";
import { wrapFieldWithNoHeader } from "tinacms";

type LogoItem = { nom?: string; logo?: string; actif?: boolean };

/**
 * Champ invisible (même principe que ProjectsLayoutToggle) : injecte un
 * interrupteur directement dans chaque rangée de la liste « Logos clients »,
 * entre la poignée de drag-and-drop et le nom, pour activer/désactiver
 * l'affichage du logo sur la home sans avoir à ouvrir la fiche.
 *
 * Fragile par nature (dépend de classes internes non documentées de Tina),
 * comme ProjectsLayoutToggle — à revoir si une mise à jour de Tina casse le
 * markup des listes.
 */
export const LogoActiveToggle = wrapFieldWithNoHeader(({ field }: any) => {
  const listFieldName = field.name.replace(/[^.]+$/, "logos");
  const { input } = useField(listFieldName, { subscription: { value: true } });
  const markerRef = useRef<HTMLDivElement>(null);
  // Le bouton n'est créé qu'une fois (voir `if (!btn)` plus bas) ; son handler
  // de clic doit donc lire `input` via cette ref à chaque clic plutôt que par
  // fermeture directe, sinon il reste bloqué sur la valeur du tout premier rendu.
  const inputRef = useRef(input);
  inputRef.current = input;

  useEffect(() => {
    const scope = markerRef.current?.parentElement?.parentElement;
    if (!scope) return;

    const applyToggles = () => {
      const value: LogoItem[] = inputRef.current.value ?? [];
      const rows = Array.from(scope.querySelectorAll<HTMLElement>(".relative.group.cursor-pointer"));

      rows.forEach((row, i) => {
        if (i >= value.length) return;
        let btn = row.querySelector<HTMLButtonElement>("[data-logo-toggle]");
        if (!btn) {
          btn = document.createElement("button");
          btn.type = "button";
          btn.setAttribute("data-logo-toggle", "");
          btn.title = "Afficher sur la home";
          btn.style.cssText =
            "flex:none;align-self:center;width:32px;height:18px;margin:0 6px;border:none;border-radius:999px;cursor:pointer;position:relative;padding:0;transition:background .15s ease;";
          const knob = document.createElement("span");
          knob.style.cssText =
            "position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:999px;background:#fff;transition:transform .15s ease;";
          btn.appendChild(knob);
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            const idx = Number(btn!.getAttribute("data-idx"));
            const current: LogoItem[] = [...(inputRef.current.value ?? [])];
            if (!current[idx]) return;
            const isActive = current[idx].actif !== false;
            current[idx] = { ...current[idx], actif: !isActive };
            inputRef.current.onChange(current);
          });
          row.insertBefore(btn, row.children[1] ?? null);
        }
        btn.setAttribute("data-idx", String(i));
        const isActive = value[i]?.actif !== false;
        btn.style.background = isActive ? "#3b0800" : "#d1d5db";
        const knob = btn.firstElementChild as HTMLElement | null;
        if (knob) knob.style.transform = isActive ? "translateX(14px)" : "translateX(0)";
      });
    };

    applyToggles();
    const observer = new MutationObserver(applyToggles);
    observer.observe(scope, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [input.value]);

  return <div ref={markerRef} style={{ display: "none" }} />;
});
