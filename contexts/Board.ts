import { createContext } from "preact";
import { useEffect, useReducer, Reducer } from "preact/hooks";
import { html } from "htm/preact";

import { makeUniqueId } from "../lib";
import { Board } from "../domain/index";

export const newBoard = (): Board.T => ({
  id: makeUniqueId(),
  title: "New Board",
  editing: false,
});

export const BoardsReducer: Reducer<Board.T[], Board.Operation> = (
  state: Board.T[],
  action: Board.Operation
) => {
  switch (action.type) {
    case Board.OperationType.Init:
      return action.boards;
    case Board.OperationType.New:
      return [newBoard(), ...state];
    case Board.OperationType.Update:
      return state.map(
        (board: Board.T) => board.id === action.id
          ? { ...board, ...action.values }
          : board
      );
    case Board.OperationType.Delete:
      return state.filter(board => board.id !== action.id);
    default:
      throw new Error(`Unknown Board Operation: ${action}`);
  }
};

export const BoardActions = {
  Init: (boards: Board.T[]): Board.OperationInit => ({
    type: Board.OperationType.Init,
    boards
  }),
  New: (): Board.OperationNew => ({ type: Board.OperationType.New }),
  Update: (id: Board.Id, values: Partial<Board.T>): Board.OperationUpdate => ({
    type: Board.OperationType.Update,
    id,
    values
  }),
  Delete: (id: Board.Id): Board.OperationDelete => ({
    type: Board.OperationType.Delete,
    id
  })
};

export const BoardsContext =
  createContext<[Board.T[], (action: Board.Operation) => void]>([[], null]);

export const BoardsProvider = (props: any) => {
  const [boards, dispatchBoards] = useReducer(BoardsReducer, []);

  useEffect(() => {
    const boards = JSON.parse(window.localStorage.getItem("boards"));

    dispatchBoards(BoardActions.Init(
      (!!boards && boards.length > 0 ? boards : [newBoard()])
    ));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  return html`
    <${BoardsContext.Provider} value=${[boards, dispatchBoards]} ...${props}>
      ${props.children}
    </>
  `;
};
