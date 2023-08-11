import { useContext } from "preact/hooks";
import { html } from "htm/preact";
import { AppActions, AppContext } from "../contexts/App";
import { ActionBar } from "./ActionBar";

export const CancelPopupButton = () => {
  const [_app, dispatch] = useContext(AppContext);

  const cancel = () => {
    dispatch(AppActions.ClosePopup());
  };

  return html`
      <button class="popup-button" onClick=${cancel}>Cancel</button>
  `;
}

export const Popup = () => {
  const [app, dispatch] = useContext(AppContext);

  const closePopup = () => {
    dispatch(AppActions.ClosePopup());
  };

  const PopupActions = !!app.popup?.actions
    ? html`
        <div class="popup__actions">
          <${ActionBar}>
            ${app.popup.actions.map(a => html`<${a} />`)}
          </>
        </div>
      `
    : html``;

  const PopupContent = html`
    <div class="popup" onClick=${closePopup}>
      <div class="popup__inner">
        <div class="popup__content">
          ${app.popup?.value}
        </div>
        ${PopupActions}
      </div>
    </div>
  `;

  return !!app.popup ? PopupContent : html``;
};
