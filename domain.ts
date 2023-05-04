export type TagId = string;
export type TaskId = string;
export type TaskTagId = string;
export type ColumnId = string;
export type BoardId = string;

export type ITaskTag = {
  id: TaskTagId,
  title: string
  color: string
};

export type ITask = {
  id: TaskId,
  title: string,
  description: string,
  columnId: ColumnId,
  editing: boolean,
  position: number,
};

export enum TaskOperationType {
  New,
  Update,
  Delete,
  Move
}

export type INewTaskOperation = {
  type: TaskOperationType.New,
  columnId: ColumnId
}

export type IUpdateTaskOperation = {
  type: TaskOperationType.Update,
  id: TaskId,
  values: Partial<ITask>
}

export type IDeleteTaskOperation = {
  type: TaskOperationType.Delete,
  id: TaskId
}

export type IMoveTaskOperation = {
  type: TaskOperationType.Move,
  id: TaskId,
  columnId: ColumnId
}

export type ITaskOperation =
  INewTaskOperation
  | IUpdateTaskOperation
  | IDeleteTaskOperation
  | IMoveTaskOperation;

export type IColumn = {
  id: ColumnId,
  boardId: BoardId,
  editing: boolean,
  position: number,
  title: string,
};

export enum ColumnOperationType {
  New,
  Update,
  Delete,
  Reposition
}

export type INewColumnOperation = {
  type: ColumnOperationType.New,
  boardId: BoardId
}

export type IUpdateColumnOperation = {
  type: ColumnOperationType.Update,
  id: ColumnId,
  values: Partial<IColumn>
}

export type IDeleteColumnOperation = {
  type: ColumnOperationType.Delete,
  id: ColumnId
}

export type IRepositionColumnOperation = {
  type: ColumnOperationType.Reposition,
  id: ColumnId,
  position: number
}

export type IColumnOperation =
  INewColumnOperation
  | IUpdateColumnOperation
  | IDeleteColumnOperation
  | IRepositionColumnOperation;

export type IBoard = {
  id: BoardId,
  title: string,
};
