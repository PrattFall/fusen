import { useState, useContext } from "preact/hooks";
import { html } from "htm/preact";

import { IBoard, IBoardOperation } from "../domain";

import { ColumnActions, ColumnsContext } from "../contexts/Column";

import { AddButton } from "./Buttons";
import { Column } from "./Column";
import { BoardActions, BoardsContext } from "../contexts/Board";

export const BoardTitle = ({ id, title, editing }: IBoard) => {
  const [_, dispatch] = useContext(BoardsContext);

  const makeEditable = () => {
    dispatch(BoardActions.Update(id, { editing: true }));
  };

  const updateTitle = (event: FocusEvent) => {
    dispatch(BoardActions.Update(id, {
      editing: false,
      title: (event.target as HTMLInputElement).value
    }));
  };

  return editing
    ? html`
      <input
        autoFocus
        type="text"
        class="board__title h1"
        value=${title}
        onBlur=${updateTitle} />
    `
    : html`
      <h1 class="board__title" onClick=${makeEditable}>
        ${title}
      </h1>
    `;
};

export const Board = (board: IBoard) => {
  const [columns, dispatchColumns] = useContext(ColumnsContext);

  const addColumn = () => {
    dispatchColumns(ColumnActions.New(board.id));
  };

  return html`
    <div class="board">
      <${BoardTitle} ...${board} />
      <${AddButton} onClick=${addColumn}>Add Column</>
      <ul class="board__columns">
        ${columns.map(c =>
          html`<${Column} key=${c.id} ...${c} />`
        )}
      </ul>
    </div>
  `;
}
