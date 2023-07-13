import { html } from "htm/preact";

export const AddButton = (props: any) => html`
    <button class="add-button" ...${props}>+ ${props.children}</>
`;

export const RemoveButton = (props: any) => html`
    <button class="remove-button" ...${props}>❌︎</>
`;
