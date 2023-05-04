import { createContext } from "preact";
import { useReducer, Reducer } from "preact/hooks";
import { html } from "htm/preact";

import {
  BoardId,
  ColumnId,
  ColumnOperationType,
  IColumn,
  IDeleteColumnOperation,
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

export const ColumnsReducer: Reducer<IColumn[], IColumnOperation> = (state: IColumn[], action: any) => {
  switch (action.type) {
    case ColumnOperationType.New:
      return [newColumn(action.columnId, state.length), ...state];
    case ColumnOperationType.Update:
      return state.map(
        (column: IColumn) => column.id === action.id
          ? { ...column, ...action.values }
          : column
      );
    case ColumnOperationType.Delete:
      return state.filter(column => column.id !== action.id);
    case ColumnOperationType.Reposition:
      return state.map((t) => t.id === action.id ? { ...t, position: action.position } : t);
    default:
      throw new Error(`Unknown Column Operation: ${action}`);
  }
};

export const ColumnActions = {
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

export const ColumnsContext = createContext<[IColumn[], (action: any) => void]>([[], null]);

export const ColumnsProvider = (props: any) => {
  const [columns, dispatchColumns] = useReducer(ColumnsReducer, []);

  return html`
    <${ColumnsContext.Provider} value=${[columns, dispatchColumns]}>
      ${props.children}
    </>
  `;
};

