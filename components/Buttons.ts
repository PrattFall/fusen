import { html } from "htm/preact";

export const AddButton = (props: any) => html`
  <button class="add-button" ...${props}>
    <span class="add-button__plus">+</span>
    <span class="add-button__content">${props.children}</span>
  </button>
`;

export const RemoveButton = (props: any) => html`
  <button class="remove-button" ...${props}>❌︎</button>
`;
