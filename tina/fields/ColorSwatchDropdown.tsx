import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { wrapFieldsWithMeta } from "tinacms";

type ColorOption = { value: string; label: string; color?: string };

function Swatch({ color }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 18,
        height: 18,
        borderRadius: "50%",
        flexShrink: 0,
        background: color || "transparent",
        border: color ? "1px solid rgba(0,0,0,0.15)" : "1px dashed rgba(0,0,0,0.3)",
      }}
    />
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      style={{ flexShrink: 0, marginLeft: "auto", transition: "transform 0.15s ease", transform: open ? "rotate(180deg)" : "none" }}
    >
      <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Sélecteur de couleur en dropdown (façon <select> natif) : le contrôle fermé
 * affiche la pastille + le libellé de la valeur choisie, et s'ouvre sur une
 * liste de pastilles rondes (une par couleur) au clic — cf. maquette demandée
 * par l'utilisateur (inspirée de codepen.io/nmcinteer/pen/owZoqe).
 */
export const ColorSwatchDropdown = wrapFieldsWithMeta(({ input, field }: any) => {
  const options: ColorOption[] = (field?.options || []).map((opt: ColorOption | string) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const selected = options.find((opt) => opt.value === input.value);

  // Le menu est un portail dans <body> (position: fixed, calée sur le bouton) plutôt
  // qu'un enfant positionné en absolute : certains groupes de champs Tina (listes
  // triables, panneaux animés…) créent leur propre contexte d'empilement et
  // passaient au-dessus du menu malgré son z-index, le rendant inutilisable.
  const updateMenuRect = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setMenuRect({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  };

  useLayoutEffect(() => {
    if (open) updateMenuRect();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", updateMenuRect, true);
    window.addEventListener("resize", updateMenuRect);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", updateMenuRect, true);
      window.removeEventListener("resize", updateMenuRect);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative", width: "100%" }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "10px 12px",
          borderRadius: 6,
          border: open ? "2px solid #241748" : "1px solid #e1ddec",
          background: "#fff",
          cursor: "pointer",
          textAlign: "left",
          font: "inherit",
        }}
      >
        <Swatch color={selected?.color} />
        <span style={{ color: selected ? "#241748" : "#8b86a3" }}>{selected?.label ?? "—"}</span>
        <Chevron open={open} />
      </button>

      {open &&
        menuRect &&
        createPortal(
          <ul
            ref={menuRef}
            style={{
              position: "fixed",
              zIndex: 9999,
              top: menuRect.top,
              left: menuRect.left,
              width: menuRect.width,
              margin: 0,
              padding: 4,
              listStyle: "none",
              background: "#fff",
              border: "1px solid #e1ddec",
              borderRadius: 6,
              boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
              maxHeight: 260,
              overflowY: "auto",
            }}
          >
            {options.map((opt) => {
              const active = opt.value === input.value;
              return (
                <li
                  key={opt.value}
                  onClick={() => {
                    input.onChange(opt.value);
                    setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                    background: active ? "#f7f6f9" : "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f1f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = active ? "#f7f6f9" : "transparent")}
                >
                  <Swatch color={opt.color} />
                  <span>{opt.label}</span>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
});
