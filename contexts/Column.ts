import { createContext } from "preact";
import { useEffect, useReducer, Reducer } from "preact/hooks";
import { html } from "htm/preact";

import {
  BoardId,
  ColumnId,
  ColumnOperationType,
  IColumn,
  IDeleteColumnOperation,
  IInitColumnOperation,
  INewColumnOperation,
  IUpdateColumnOperation,
  IRepositionColumnOperation,
  IColumnOperation
} from "../domain";

import { makeUniqueId } from "../lib";

const newColumn = (boardId: BoardId, position: number): IColumn => ({
  id: makeUniqueId(),
  title: "Todo",
  editing: false,
  boardId,
  position,
});

export const ColumnsReducer: Reducer<IColumn[], IColumnOperation> = (
  state: IColumn[],
  action: IColumnOperation
) => {
  switch (action.type) {
    case ColumnOperationType.Init:
      return action.columns
    case ColumnOperationType.New:
      return [newColumn(action.boardId, state.length), ...state];
    case ColumnOperationType.Update:
      return state.map(
        (column: IColumn) => column.id === action.id
          ? { ...column, ...action.values }
          : column
      );
    case ColumnOperationType.Delete:
      return state.filter(column => column.id !== action.id);
    case ColumnOperationType.Reposition:
      return state.map(
        (t) => t.id === action.id ? { ...t, position: action.position } : t
      );
    default:
      throw new Error(`Unknown Column Operation: ${action}`);
  }
};

export const ColumnActions = {
  Init: (columns: IColumn[]): IInitColumnOperation => ({
    type: ColumnOperationType.Init,
    columns
  }),
  New: (boardId: BoardId): INewColumnOperation => ({
    type: ColumnOperationType.New,
    boardId
  }),
  Update: (id: ColumnId, values: Partial<IColumn>): IUpdateColumnOperation => ({
    type: ColumnOperationType.Update,
    id,
    values
  }),
  Delete: (id: ColumnId): IDeleteColumnOperation => ({
    type: ColumnOperationType.Delete,
    id
  }),
  Reposition: (id: ColumnId, position: number): IRepositionColumnOperation => ({
    type: ColumnOperationType.Reposition,
    id,
    position
  })
};

export const ColumnsContext =
  createContext<[IColumn[], (action: IColumnOperation) => void]>([[], null]);

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

