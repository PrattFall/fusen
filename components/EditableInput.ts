import { html } from "htm/preact";
import {  useState } from "preact/hooks";

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

  const changeEditingMode = (val: boolean) => () => {
    setEditing(val);
  }

  return editing
    ? html`
      <input
        autoFocus
        type="text"
        class=${className}
        onBlur=${changeEditingMode(false)}
        onInput=${onInput}
        value=${value} />
    `
    : html`
      <${view} class=${className} onClick=${changeEditingMode(true)}>
        ${value}
      </>
    `;
};
