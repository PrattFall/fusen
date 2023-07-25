import { html } from "htm/preact";

export const ActionBar = (props: any) => html`
  <div class="action-bar" ...${props}>
    ${props.children}
  </div>
`;
