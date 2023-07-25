import { createContext } from "preact";
import { useReducer, Reducer, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { Column, Task } from "../domain";
import { makeUniqueId, reposition } from "../lib";

const newTask = (columnId: Column.Id, position: number): Task.T => ({
  id: makeUniqueId(),
  title: "New Task",
  editing: true,
  description: "none",
  columnId,
  position,
});

export const TasksReducer: Reducer<Task.T[], Task.Operation> = (
  state: Task.T[],
  action: Task.Operation
) => {
  switch (action.type) {
    case Task.OperationType.Init:
      return action.tasks;
    case Task.OperationType.New:
      return [newTask(action.columnId, state.length), ...state];
    case Task.OperationType.Update:
      return state.map(
        (task: Task.T) => task.id === action.id
          ? { ...task, ...action.values }
          : task
      );
    case Task.OperationType.Delete:
      return state.filter(task => task.id !== action.id);
    case Task.OperationType.Move:
      return reposition(
        state, action.id, action.columnId, "columnId", action.position
      )
    default:
      throw new Error(`Unknown Task Operation: ${action}`);
  }
};

export const TaskActions = {
  Init: (tasks: Task.T[]): Task.OperationInit => ({
    type: Task.OperationType.Init,
    tasks
  }),
  New: (columnId: Column.Id): Task.OperationNew => ({
    type: Task.OperationType.New,
    columnId
  }),
  Update: (id: Task.Id, values: Partial<Task.T>): Task.OperationUpdate => ({
    type: Task.OperationType.Update,
    id,
    values
  }),
  Delete: (id: Task.Id): Task.OperationDelete => ({
    type: Task.OperationType.Delete,
    id
  }),
  Move: (id: Task.Id, columnId: Column.Id, position: number): Task.OperationMove => ({
    type: Task.OperationType.Move,
    id,
    columnId,
    position
  })
};

export const TasksContext =
  createContext<[Task.T[], (action: Task.Operation) => void]>([[], null]);

export const TasksProvider = (props: any) => {
  const [tasks, dispatchTasks] = useReducer(TasksReducer, []);

  useEffect(() => {
    const tasks = JSON.parse(window.localStorage.getItem("tasks"));
    dispatchTasks(TaskActions.Init(tasks || []));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return html`
    <${TasksContext.Provider} value=${[tasks, dispatchTasks]}>
      ${props.children}
    </>
  `;
};

