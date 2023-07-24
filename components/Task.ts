import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { Task } from "../domain/index";
import { ignoreDragEvent, useOutsideClick } from "../lib";

import { TaskActions, TasksContext } from "../contexts/Task";
import { ActionBar } from "./ActionBar";
import { RemoveButton } from "./Buttons";

const EditableTask = ({ id, title, description }: Task.T) => {
  const [_, dispatch] = useContext(TasksContext);

  const outsideRef = useOutsideClick(() => {
    dispatch(TaskActions.Update(id, { editing: false }));
  });

  const deleteTask = () => {
    dispatch(TaskActions.Delete(id));
  };

  const updateTitle = (event: FocusEvent) => {
    dispatch(TaskActions.Update(
      id, { title: (event.target as HTMLInputElement).value }
    ));
  };

  const updateDescription = (event: FocusEvent) => {
    dispatch(TaskActions.Update(
      id, { description: (event.target as HTMLInputElement).value }
    ));
  };

  return html`
    <li class="task editable-task task-${id}" ref=${outsideRef} onDrop=$>
      <${ActionBar}>
        <div class="flex-filler" />
        <${RemoveButton} onClick=${deleteTask} />
      </>
      <input
        value=${title}
        onBlur=${updateTitle}
        class="task__title h3"
      />
      <textarea
        value=${description}
        onBlur=${updateDescription}
        class="task__description"
      />
    </li>
  `;
};

type IViewTask = Task.T & { index: number };

const ViewTask = ({ id, index, columnId, title, description }: IViewTask) => {
  const [_, dispatch] = useContext(TasksContext);

  const makeEditable = () => {
    dispatch(TaskActions.Update(id, { editing: true }));
  };

  const setDragData = (event: DragEvent) => {
    event.dataTransfer.clearData();
    event.dataTransfer.setData("text/plain", id);
  };

  const reorder = (e: DragEvent) => {
    e.stopPropagation();

    const taskId = e.dataTransfer.getData("text/plain");

    dispatch(TaskActions.Move(taskId, columnId, index));
  };

  return html`
    <li
      class="task view-task task-${id}" onClick=${makeEditable}
      draggable="true"
      onDragStart=${setDragData}
      onDragOver=${ignoreDragEvent}
      onDrop=${reorder}
    >
      <h3 class="task__title">${title}</h3>
      <small class="task__description">${description}</small>
    </li>
  `;
};

export const View = (task: Task.T) =>
  task.editing
    ? html`<${EditableTask} ...${task} />`
    : html`<${ViewTask} ...${task} />`;
