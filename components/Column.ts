import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { IColumn, IColumnOperation, ITask } from "../domain";

import { ColumnActions, ColumnsContext } from "../contexts/Column";
import { TaskActions, TasksContext } from "../contexts/Task";

import { Task } from "./Task";
import { ActionBar } from "./ActionBar";
import { AddButton, RemoveButton } from "./Buttons";

type IColumnUpdateable = IColumn & { dispatch: (action: IColumnOperation) => void };

const ColumnTitle = ({ id, title, editing, dispatch }: IColumnUpdateable) => {
  const updateTitle = (event: FocusEvent) => {
    dispatch(ColumnActions.Update(id, {
      title: (event.target as HTMLInputElement).value,
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
      />
    `;
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

  const taskOrder = (a: ITask, b: ITask) => {
    if(a.position < b.position) return -1;
    if(a.position > b.position) return 1;
    else return 0;
  }

  const filteredTasks =
    [
      ...tasks
      .filter((t: ITask) => t.columnId === id)
    ].sort(taskOrder)
    .map((t: ITask, i: number) =>
       html`<${Task} key=${t.id} index=${i} ...${t} />`
    );

  const testOnDrop = (e: DragEvent) => {
    const taskId = e.dataTransfer.getData("text/plain");

    dispatchTasks(TaskActions.Move(taskId, id, 0));
  };

  const testOnDragOver = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const deleteColumn = () => {
    dispatch(ColumnActions.Delete(id));
  };

  return html`
    <li class="column" onDrop=${testOnDrop} onDragOver=${testOnDragOver}>
      <${ActionBar}>
        <${RemoveButton} onClick=${deleteColumn} />
      </>
      <${ColumnTitle}
        id=${id}
        title=${title}
        editing=${editing}
        dispatch=${dispatch}
      />
      <${AddButton} onClick=${newTask}>Add Task</>
      <ul class="column__tasks">
        ${filteredTasks}
      </ul>
    </li>
  `;
};
