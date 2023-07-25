import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { Board, Column } from "../domain";

import { ColumnActions, ColumnsContext } from "../contexts/Column";

import { AddButton } from "./Buttons";
import { View as ColumnView } from "./Column";
import { BoardActions, BoardsContext } from "../contexts/Board";
import { EditableInput } from "./EditableInput";

const columnsForBoard = (columns: Column.T[], boardId: Board.Id) => {
  const columnOrder = (a: Column.T, b: Column.T) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    else return 0;
  }

  return [...columns.filter((t: Column.T) => t.boardId === boardId)]
    .sort(columnOrder)
    .map((t: Column.T, i: number) =>
      html`<${ColumnView} key=${t.id} index=${i} ...${t} />`
    );
}

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

  const filteredColumns = columnsForBoard(columns, board.id);

  return html`
    <div class="board">
      <${EditableInput}
        class="board__title h1"
        view="h1"
        onInput=${updateBoardTitle}
        value=${board.title} />
      <${AddButton} onClick=${addColumn}>Add Column</>
      <ul class="board__columns">
        ${filteredColumns}
      </ul>
    </div>
  `;
}
