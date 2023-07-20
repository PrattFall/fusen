import { createContext } from "preact";
import { useEffect, useReducer, Reducer } from "preact/hooks";
import { html } from "htm/preact";

import { BoardId } from "../domain";

interface IApp {
  board?: BoardId
}

export enum AppOperationType {
  Init,
  New,
  SetBoard,
}

export type IInitAppOperation = {
  type: AppOperationType.Init,
  app: IApp,
}

export type INewAppOperation = {
  type: AppOperationType.New,
}

export type IAppSetBoardOperation = {
  type: AppOperationType.SetBoard,
  board: BoardId
}

export type IAppOperation =
  IInitAppOperation
  | INewAppOperation
  | IAppSetBoardOperation;

const newApp = (): IApp => ({
  board: null
});

export const AppReducer: Reducer<IApp, IAppOperation> =
  (state: IApp, action: IAppOperation) => {
  switch(action.type) {
    case AppOperationType.Init:
      return action.app;

    case AppOperationType.New:
      return newApp();

    case AppOperationType.SetBoard:
      return { ...state, board: action.board };

    default:
      throw new Error(`Unknown App Operation: ${action}`);
  }
};

export const AppActions = {
  Init: (app: IApp): IInitAppOperation => ({
    type: AppOperationType.Init,
    app
  }),
  New: (): INewAppOperation => ({ type: AppOperationType.New }),
  SetBoard: (board: BoardId) => ({
    type: AppOperationType.SetBoard,
    board
  })
};

export const AppContext =
  createContext<[IApp, (action: IAppOperation) => void]>([newApp(), null]);

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
