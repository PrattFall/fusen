import { createContext } from "preact";
import { useReducer, Reducer, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import {
  ColumnId,
  IDeleteTaskOperation,
  IInitTaskOperation,
  IMoveTaskOperation,
  INewTaskOperation,
  ITask,
  ITaskOperation,
  IUpdateTaskOperation,
  TaskId,
  TaskOperationType,
} from "../domain";
import { makeUniqueId, repositionTask } from "../lib";

const newTask = (columnId: ColumnId, position: number): ITask => ({
  id: makeUniqueId(),
  title: "New Task",
  editing: true,
  description: "none",
  columnId,
  position,
});

export const TasksReducer: Reducer<ITask[], ITaskOperation> = (
  state: ITask[],
  action: ITaskOperation
) => {
  switch (action.type) {
    case TaskOperationType.Init:
      return action.tasks;
    case TaskOperationType.New:
      return [newTask(action.columnId, state.length), ...state];
    case TaskOperationType.Update:
      return state.map(
        (task: ITask) => task.id === action.id
          ? { ...task, ...action.values }
          : task
      );
    case TaskOperationType.Delete:
      return state.filter(task => task.id !== action.id);
    case TaskOperationType.Move:
      return repositionTask(state, action.id, action.columnId, action.position)
    default:
      throw new Error(`Unknown Task Operation: ${action}`);
  }
};

export const TaskActions = {
  Init: (tasks: ITask[]): IInitTaskOperation => ({
    type: TaskOperationType.Init,
    tasks
  }),
  New: (columnId: ColumnId): INewTaskOperation => ({
    type: TaskOperationType.New,
    columnId
  }),
  Update: (id: TaskId, values: Partial<ITask>): IUpdateTaskOperation => ({
    type: TaskOperationType.Update,
    id,
    values
  }),
  Delete: (id: TaskId): IDeleteTaskOperation => ({
    type: TaskOperationType.Delete,
    id
  }),
  Move: (id: TaskId, columnId: ColumnId, position: number): IMoveTaskOperation => ({
    type: TaskOperationType.Move,
    id,
    columnId,
    position
  })
};

export const TasksContext =
  createContext<[ITask[], (action: ITaskOperation) => void]>([[], null]);

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

