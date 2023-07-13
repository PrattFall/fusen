import { html } from "htm/preact";

export const ActionBar = (props: any) => html`
  <ul class="action-bar">
    ${props.children}
  </ul>
`;
