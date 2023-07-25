import { createContext } from "preact";
import { useEffect, useReducer, Reducer } from "preact/hooks";
import { html } from "htm/preact";

import { Board, Column } from "../domain";
import { makeUniqueId, repositionColumn } from "../lib";

const newColumn = (boardId: Board.Id, position: number): Column.T => ({
  id: makeUniqueId(),
  title: "Todo",
  editing: false,
  boardId,
  position,
});

export const ColumnsReducer: Reducer<Column.T[], Column.Operation> = (
  state: Column.T[],
  action: Column.Operation
) => {
  switch (action.type) {
    case Column.OperationType.Init:
      return action.columns
    case Column.OperationType.New:
      return [newColumn(action.boardId, state.length), ...state];
    case Column.OperationType.Update:
      return state.map(
        (column: Column.T) => column.id === action.id
          ? { ...column, ...action.values }
          : column
      );
    case Column.OperationType.Delete:
      return state.filter(column => column.id !== action.id);
    case Column.OperationType.Reposition:
      return repositionColumn(state, action.id, action.position);
    default:
      throw new Error(`Unknown Column Operation: ${action}`);
  }
};

export const ColumnActions = {
  Init: (columns: Column.T[]): Column.OperationInit => ({
    type: Column.OperationType.Init,
    columns
  }),
  New: (boardId: Board.Id): Column.OperationNew => ({
    type: Column.OperationType.New,
    boardId
  }),
  Update: (id: Column.Id, values: Partial<Column.T>): Column.OperationUpdate => ({
    type: Column.OperationType.Update,
    id,
    values
  }),
  Delete: (id: Column.Id): Column.OperationDelete => ({
    type: Column.OperationType.Delete,
    id
  }),
  Reposition: (id: Column.Id, position: number): Column.OperationMove => ({
    type: Column.OperationType.Reposition,
    id,
    position
  })
};

export const ColumnsContext =
  createContext<[Column.T[], (action: Column.Operation) => void]>([[], null]);

export const ColumnsProvider = (props: any) => {
  const [columns, dispatchColumns] = useReducer(ColumnsReducer, []);

  useEffect(() => {
    const columns = JSON.parse(window.localStorage.getItem("columns"));
    dispatchColumns(ColumnActions.Init(columns || []));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  return html`
    <${ColumnsContext.Provider} value=${[columns, dispatchColumns]} ...${props}>
      ${props.children}
    </>
  `;
};

