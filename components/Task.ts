import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { DragType, Task } from "../domain";
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
    <li class="task editable-task task-${id}" ref=${outsideRef}>
      <${ActionBar}>
        <div class="flex-filler" />
        <${RemoveButton} onClick=${deleteTask} />
      </>
      <input value=${title} onBlur=${updateTitle} class="task__title h3" />
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
    event.stopPropagation();

    event.dataTransfer.clearData();
    event.dataTransfer.setData("text/plain", JSON.stringify({
      type: DragType.Task, id
    }));
  };

  const reorder = (e: DragEvent) => {
    e.stopPropagation();

    const moveData = JSON.parse(e.dataTransfer.getData("text/plain"));

    switch(moveData.type) {
      case DragType.Task:
        dispatch(TaskActions.Move(moveData.id, columnId, index));
      default:
        return;
    }

  };

  return html`
    <li
      class="task view-task task-${id}" onClick=${makeEditable}
      draggable
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
