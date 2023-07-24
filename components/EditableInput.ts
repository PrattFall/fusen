import { html } from "htm/preact";
import {  useState } from "preact/hooks";
import { useOutsideClick } from "../lib";

interface EditableInputProps {
  class: string;
  value: string;
  view: string;
  onInput: (e: InputEvent) => void;
}

export const EditableInput = ({
  class: className,
  value,
  onInput,
  view="span"
}: EditableInputProps) => {
  const [editing, setEditing] = useState(false);

  const makeEditable = () => setEditing(true);

  const outsideRef = useOutsideClick(() => {
    setEditing(false);
  });

  return editing
    ? html`
      <input
        ref=${outsideRef}
        autoFocus
        type="text"
        class=${className}
        onInput=${onInput}
        value=${value} />
    `
    : html`
      <${view} class=${className} onClick=${makeEditable}>
        ${value}
      </>
    `;
};
