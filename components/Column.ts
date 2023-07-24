import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { Column, Task } from "../domain/index";
import { ignoreDragEvent } from "../lib";

import { ColumnActions, ColumnsContext } from "../contexts/Column";
import { TaskActions, TasksContext } from "../contexts/Task";

import { ActionBar } from "./ActionBar";
import { AddButton, RemoveButton } from "./Buttons";
import { EditableInput } from "./EditableInput";
import { View as TaskView } from "./Task";

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

export const View = ({ id, title }: Column.T) => {
  const [tasks, dispatchTasks] = useContext(TasksContext);
  const [_, dispatch] = useContext(ColumnsContext);

  const createNewTask = () => {
    dispatchTasks(TaskActions.New(id));
  };

  const moveTaskToColumn = (e: DragEvent) => {
    const taskId = e.dataTransfer.getData("text/plain");

    dispatchTasks(TaskActions.Move(taskId, id, 0));
  };

  const deleteColumn = () => {
    dispatch(ColumnActions.Delete(id));
  };

  const updateTitle = (event: FocusEvent) => {
    dispatch(ColumnActions.Update(id, {
      title: (event.target as HTMLInputElement).value
    }));
  }

  const filteredTasks = tasksForColumn(tasks, id);

  return html`
    <li class="column" onDrop=${moveTaskToColumn} onDragOver=${ignoreDragEvent}>
      <${ActionBar}>
        <div class="flex-filler" />
        <${RemoveButton} onClick=${deleteColumn} />
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
