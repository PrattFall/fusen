import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { ColumnId, IColumn, ITask } from "../domain";
import { ignoreDragEvent } from "../lib";

import { ColumnActions, ColumnsContext } from "../contexts/Column";
import { TaskActions, TasksContext } from "../contexts/Task";

import { ActionBar } from "./ActionBar";
import { AddButton, RemoveButton } from "./Buttons";
import { EditableInput } from "./EditableInput";
import { Task } from "./Task";

const tasksForColumn = (tasks: ITask[], columnId: ColumnId) => {
  const taskOrder = (a: ITask, b: ITask) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    else return 0;
  }

  return [...tasks.filter((t: ITask) => t.columnId === columnId)]
    .sort(taskOrder)
    .map((t: ITask, i: number) =>
      html`<${Task} key=${t.id} index=${i} ...${t} />`
    );
}

export const Column = ({ id, title }: IColumn) => {
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
