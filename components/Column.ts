import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { Column, Task } from "../domain";
import { ignoreDragEvent } from "../lib";

import { ColumnActions, ColumnsContext } from "../contexts/Column";
import { TaskActions, TasksContext } from "../contexts/Task";

import { ActionBar } from "./ActionBar";
import { AddButton, RemoveButton } from "./Buttons";
import { EditableInput } from "./EditableInput";
import { View as TaskView } from "./Task";
import { DragType } from "../domain";
import { CancelPopupButton } from "./Popup";
import { AppActions, AppContext } from "../contexts/App";

const tasksForColumn = (tasks: Task.T[], columnId: Column.Id) => {
  const taskOrder = (a: Task.T, b: Task.T) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    else return 0;
  }

  return [...tasks.filter((t: Task.T) => t.columnId === columnId)]
    .sort(taskOrder)
    .map((t: Task.T, i: number) =>
      html`<${TaskView} key=${t.id} index=${i} ...${t} />`
    );
}

export const View = ({ id, boardId, title, position }: Column.T) => {
  const [tasks, dispatchTasks] = useContext(TasksContext);
  const [_app, dispatchApp] = useContext(AppContext);
  const [_, dispatch] = useContext(ColumnsContext);

  const createNewTask = () => {
    dispatchTasks(TaskActions.New(id));
  };

  const setDragData = (event: DragEvent) => {
    event.dataTransfer.clearData();
    event.dataTransfer.setData("text/plain", JSON.stringify({
      type: DragType.Column, id
    }));
  };

  const reorder = (e: DragEvent) => {
    e.stopPropagation();

    const moveData = JSON.parse(e.dataTransfer.getData("text/plain"));

    switch(moveData.type) {
      case DragType.Task:
        return dispatchTasks(TaskActions.Move(moveData.id, id, 0));
      case DragType.Column:
        return dispatch(ColumnActions.Reposition(moveData.id, boardId, position));
      default:
        return;
    }
  };

  const deleteColumnPopup = () => {
    const DeleteColumnButton = () => {
      const deleteColumn = () => {
        dispatch(ColumnActions.Delete(id));
      };

      return html`
        <button class="popup-button" onClick=${deleteColumn}>Delete</button>
      `;
    };

    dispatchApp(AppActions.ShowPopup(
      `Are you sure you want to delete the "${title}" column?`,
      [DeleteColumnButton, CancelPopupButton]
    ));
  };

  const updateTitle = (event: FocusEvent) => {
    dispatch(ColumnActions.Update(id, {
      title: (event.target as HTMLInputElement).value
    }));
  }

  const filteredTasks = tasksForColumn(tasks, id);

  return html`
    <li class="column" onDragOver=${ignoreDragEvent} onDrop=${reorder}>
      <${ActionBar} draggable onDrop=${reorder} onDragStart=${setDragData}>
        <div class="flex-filler" />
        <${RemoveButton} onClick=${deleteColumnPopup} />
      </>
      <${EditableInput}
        class="column__title h2"
        view="h2"
        onInput=${updateTitle}
        value=${title} />
      <${AddButton} onClick=${createNewTask}>Add Task</>
      <ul class="column__tasks">${filteredTasks}</ul>
    </li>
  `;
};
