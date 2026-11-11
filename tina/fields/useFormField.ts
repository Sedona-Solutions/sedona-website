import { useEffect, useRef, useState } from "react";

/** Sous-ensemble de l'API final-form (FormApi) transmise par Tina aux champs personnalisés (prop `form`). */
type FinalFormApi = {
  registerField: (
    name: string,
    subscriber: (state: { value: any }) => void,
    subscription: { value: boolean },
  ) => () => void;
  change: (name: string, value: any) => void;
};

/**
 * Suit la valeur d'un autre champ du formulaire Tina et permet de la modifier.
 *
 * Remplace `useField` de react-final-form : depuis tinacms 3.15, ce paquet n'est plus
 * installé à la racine de node_modules (dépendance imbriquée de tinacms, et sa
 * version 6.x n'accepte pas React 19 en peer). On passe donc par l'objet `form`
 * (final-form) que Tina fournit à chaque champ personnalisé — c'est l'API sur
 * laquelle repose `useField`.
 */
export function useFormField(form: FinalFormApi, name: string) {
  const [value, setValue] = useState<any>(undefined);
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => form.registerField(name, (state) => setValue(state.value), { value: true }), [form, name]);

  return {
    value,
    onChange: (next: any) => formRef.current.change(name, next),
  };
}
