import { createContext } from "preact";
import { useEffect, useReducer, Reducer } from "preact/hooks";
import { html } from "htm/preact";

import { makeUniqueId } from "../lib";
import { BoardId, BoardOperationType, IBoard, IBoardOperation, IDeleteBoardOperation, IInitBoardOperation, INewBoardOperation, IUpdateBoardOperation } from "../domain";

export const newBoard = (): IBoard => ({
  id: makeUniqueId(),
  title: "New Board",
  editing: false,
});

export const BoardsReducer: Reducer<IBoard[], IBoardOperation> = (
  state: IBoard[],
  action: IBoardOperation
) => {
  switch (action.type) {
    case BoardOperationType.Init:
      return action.boards;
    case BoardOperationType.New:
      return [newBoard(), ...state];
    case BoardOperationType.Update:
      return state.map(
        (board: IBoard) => board.id === action.id
          ? { ...board, ...action.values }
          : board
      );
    case BoardOperationType.Delete:
      return state.filter(board => board.id !== action.id);
    default:
      throw new Error(`Unknown Board Operation: ${action}`);
  }
};

export const BoardActions = {
  Init: (boards: IBoard[]): IInitBoardOperation => ({
    type: BoardOperationType.Init,
    boards
  }),
  New: (): INewBoardOperation => ({ type: BoardOperationType.New }),
  Update: (id: BoardId, values: Partial<IBoard>): IUpdateBoardOperation => ({
    type: BoardOperationType.Update,
    id,
    values
  }),
  Delete: (id: BoardId): IDeleteBoardOperation => ({
    type: BoardOperationType.Delete,
    id
  })
};

export const BoardsContext =
  createContext<[IBoard[], (action: IBoardOperation) => void]>([[], null]);

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
