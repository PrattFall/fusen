import { useContext, useEffect, useState } from "preact/hooks";
import { html } from "htm/preact";
import { useOutsideClick } from "../lib";
import { ITask } from "../domain";
import { TaskActions, TasksContext } from "../contexts/Task";

const EditableTask = ({ id, title, description }: ITask) => {
  const [_, dispatch] = useContext(TasksContext);

  const outsideRef = useOutsideClick(() => {
    dispatch(TaskActions.Update(id, { editing: false }));
  });

  const removeClicked = () => {
    dispatch(TaskActions.Delete(id));
  };

  const updateTitle = (event: any) => {
    dispatch(TaskActions.Update(id, { title: event.target.value }))
  };

  const updateDescription = (event: any) => {
    dispatch(TaskActions.Update(id, { description: event.target.value }));
  };


  return html`
  <li class="task editable-task task-${id}" ref=${outsideRef}>
    <div class="task__bar">
      <div class="task__drag-surface"></div>
      <button class="task__remove-button" onClick=${removeClicked}>
        ❌︎
      </button>
    </div>
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
  </li>`;
};

const ViewTask = ({ id, title, description }: any) => {
  const [_, dispatch] = useContext(TasksContext);

  const makeEditable = () => {
    dispatch(TaskActions.Update(id, { editing: true }));
  };

  const setDragData = (event: any) => {
    event.dataTransfer.clearData();
    event.dataTransfer.setData("text/plain", id);
  };

  return html`
    <li
      class="task view-task task-${id}" onClick=${makeEditable}
      draggable="true"
      onDragStart=${setDragData}
    >
      <h3 class="task__title">${title}</h3>
      <small class="task__description">${description}</small>
    </li>
  `;
};

export const Task = (task: ITask) =>
  task.editing
    ? html`<${EditableTask} ...${task} />`
    : html`<${ViewTask} ...${task} />`;
