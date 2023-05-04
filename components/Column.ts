import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { IColumn, ITask } from "../domain";

import { ColumnActions, ColumnsContext } from "../contexts/Column";

import { TaskActions, TasksContext } from "../contexts/Task";
import { Task } from "./Task";


const ColumnTitle = ({ id, title, editing, dispatch }: any) => {
  const updateTitle = (event: any) => {
    dispatch(ColumnActions.Update(id, {
      title: event.target.value,
      editing: false
    }));
  }

  const setEditing = () => {
    dispatch(ColumnActions.Update(id, { editing: true }));
  };

  if (editing) {
    return html`
      <input
        autoFocus
        type="text"
        onBlur=${updateTitle}
        class="column__title h2"
        value=${title}
      />`;
  }

  return html`
    <h2 class="column__title" onClick=${setEditing}>
      ${title}
    </h2>
  `;
};

export const Column = ({ id, title, editing }: IColumn) => {
  const [tasks, dispatchTasks] = useContext(TasksContext);
  const [_, dispatch] = useContext(ColumnsContext);

  const newTask = () => {
    dispatchTasks(TaskActions.New(id));
  };

  const testOnDrop = (e: any) => {
    const taskId = e.dataTransfer.getData("text/plain");

    dispatchTasks(TaskActions.Move(taskId, id));
  };

  const testOnDragOver = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return html`
    <li class="column" onDrop=${testOnDrop} onDragOver=${testOnDragOver}>
      <${ColumnTitle}
        id=${id}
        title=${title}
        editing=${editing}
        dispatch=${dispatch}
      />
      <button class="column__add-task-button" onClick=${newTask}>
        + Add Task
      </button>
      <ul class="column__tasks">
        ${tasks
        .filter((t: ITask) => t.columnId === id)
        .map(t => html`<${Task} key=${t.id} ...${t} />`)}
      </ul>
    </li>
  `;
};
