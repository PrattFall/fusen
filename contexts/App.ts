import { createContext } from "preact";
import { useEffect, useReducer, Reducer } from "preact/hooks";
import { html } from "htm/preact";

import { App, Board } from "../domain/index";

const newApp = (): App.T => ({
  board: null
});

export const AppReducer: Reducer<App.T, App.Operation> =
  (state: App.T, action: App.Operation) => {
  switch(action.type) {
    case App.OperationType.Init:
      return action.app;

    case App.OperationType.New:
      return newApp();

    case App.OperationType.SetBoard:
      return { ...state, board: action.board };

    default:
      throw new Error(`Unknown App Operation: ${action}`);
  }
};

export const AppActions = {
  Init: (app: App.T): App.OperationInit => ({
    type: App.OperationType.Init,
    app
  }),
  New: (): App.OperationNew => ({ type: App.OperationType.New }),
  SetBoard: (board: Board.Id) => ({
    type: App.OperationType.SetBoard,
    board
  })
};

export const AppContext =
  createContext<[App.T, (action: App.Operation) => void]>([newApp(), null]);

export const AppProvider = (props: any) => {
  const [app, dispatchApp] = useReducer(AppReducer, newApp());

  useEffect(() => {
    const app = JSON.parse(window.localStorage.getItem("app"));
    dispatchApp(AppActions.Init(app));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("app", JSON.stringify(app));
  }, [app]);

  return html`
    <${AppContext.Provider} value=${[app, dispatchApp]} ...${props}>
      ${props.children}
    </>
  `;
};
