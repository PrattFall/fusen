import { useState, useContext } from "preact/hooks";
import { html } from "htm/preact";

import { IBoard } from "../domain";

import { ColumnActions, ColumnsContext } from "../contexts/Column";

import { AddButton } from "./Buttons";
import { Column } from "./Column";

export const Board = ({ id, title }: IBoard) => {
  const [getTitle, _setTitle] = useState(title);
  const [columns, dispatchColumns] = useContext(ColumnsContext);

  const addColumn = () => {
    dispatchColumns(ColumnActions.New(id))
  };

  return html`
    <div class="board">
      <h1 class="board__title">${getTitle}</h1>
      <${AddButton} onClick=${addColumn}>Add Column</>
      <ul class="board__columns">
        ${columns.map(c =>
          html`<${Column} key=${c.id} ...${c} />`
        )}
      </ul>
    </div>
  `;
}
