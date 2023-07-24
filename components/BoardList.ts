import { useContext, useState } from "preact/hooks";
import { html } from "htm/preact";

import { AppActions, AppContext } from "../contexts/App";
import { BoardActions, BoardsContext } from "../contexts/Board";

import { AddButton } from "./Buttons";

import { Board } from "../domain/index";

export const BoardList = () => {
  const [boards, dispatch] = useContext(BoardsContext);
  const [app, dispatchApp] = useContext(AppContext);

  const createNewBoard = () => {
    dispatch(BoardActions.New());
  }

  const changeBoard = (id: Board.Id) => () => {
    dispatchApp(AppActions.SetBoard(id));
  }

  const activeBoard = boards.find((b: Board.T) => b.id === app.board);
  const otherBoards = boards.filter((b: Board.T) => b.id !== app.board);

  return html`
    <div class="board-list" tabindex="-1">
      <div class="board-list__active">
        ${activeBoard?.title}
      </div>
      <ul class="board-list__dropdown">
        ${
          otherBoards.map(b =>
            html`<li
              class="board-list__item"
              key=${b.id}
              onClick=${changeBoard(b.id)}
            >
              ${b.title}
            </li>`
          )
        }
      </ul>
    </div>
    <${AddButton} onClick=${createNewBoard}>Add Board</>
  `;
}
