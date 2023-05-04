import { render } from "preact";
import { useState, useContext } from "preact/hooks";
import { html } from "htm/preact";

import { IBoard } from "./domain";

import { ColumnActions, ColumnsContext, ColumnsProvider } from "./contexts/Column";
import { Column } from "./components/Column";

import { TasksProvider } from "./contexts/Task"

// const TaskTag = ({ title, color }: ITaskTag) =>
//   html`<div class="task-tag" style="background-color: ${color}">
//     <span class="task-tag__title">${title}</span>
//   </div>`;


const Board = ({ id, title }: IBoard) => {
  const [getTitle, _setTitle] = useState(title);
  const [columns, dispatchColumns] = useContext(ColumnsContext);

  const addColumn = () => {
    dispatchColumns(ColumnActions.New(id))
  };

  return html`<div class="board">
    <h1 class="board__title">${getTitle}</h1>
    <button class="board__add-column-button" onClick=${addColumn}>
      + Add Column
    </button>
    <ul class="board__columns">
      ${columns.map(c => html`<${Column} key=${c.id} ...${c} />`)}
    </ul>
  </div>`;
}

// const columnsContext = createContext();
// const boardsContext = createContext();

const App = () => {
  return html`
    <${ColumnsProvider}>
      <${TasksProvider}>
        <${Board} title="New Board" columns=${[]} tags=${{}} />
      </>
    </>
  `;
};

render(html`<${App} />`, document.body);
