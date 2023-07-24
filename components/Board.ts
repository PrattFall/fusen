import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { Board, Column } from "../domain/index";

import { ColumnActions, ColumnsContext } from "../contexts/Column";

import { AddButton } from "./Buttons";
import { View as ColumnView } from "./Column";
import { BoardActions, BoardsContext } from "../contexts/Board";
import { EditableInput } from "./EditableInput";

export const View = (board: Board.T) => {
  const [columns, dispatchColumns] = useContext(ColumnsContext);
  const [_, dispatch] = useContext(BoardsContext);

  const addColumn = () => {
    dispatchColumns(ColumnActions.New(board.id));
  };

  const updateBoardTitle = (event: FocusEvent) => {
    dispatch(BoardActions.Update(board.id, {
      title: (event.target as HTMLInputElement).value
    }));
  };

  const filteredColumns = columns.filter((c: Column.T) =>
    c.boardId === board.id
  );

  return html`
    <div class="board">
      <${EditableInput}
        class="board__title h1"
        view="h1"
        onInput=${updateBoardTitle}
        value=${board.title} />
      <${AddButton} onClick=${addColumn}>Add Column</>
      <ul class="board__columns">
        ${filteredColumns.map(c =>
          html`<${ColumnView} key=${c.id} ...${c} />`
        )}
      </ul>
    </div>
  `;
}
