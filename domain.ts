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
  Init,
  New,
  Update,
  Delete,
  Move
}

export type IInitTaskOperation = {
  type: TaskOperationType.Init,
  tasks: ITask[]
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
  columnId: ColumnId,
  position: number
}

export type ITaskOperation =
  IInitTaskOperation
  | INewTaskOperation
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
  Init,
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

export type IInitColumnOperation = {
  type: ColumnOperationType.Init,
  columns: IColumn[],
}

export type IColumnOperation =
  INewColumnOperation
  | IUpdateColumnOperation
  | IDeleteColumnOperation
  | IRepositionColumnOperation
  | IInitColumnOperation;

export type IBoard = {
  id: BoardId,
  title: string,
  editing: boolean
};

export enum BoardOperationType {
  Init,
  New,
  Update,
  Delete
}

export type IInitBoardOperation = {
  type: BoardOperationType.Init,
  boards: IBoard[],
}

export type INewBoardOperation = {
  type: BoardOperationType.New,
}

export type IUpdateBoardOperation = {
  type: BoardOperationType.Update,
  id: BoardId,
  values: Partial<IBoard>,
}

export type IDeleteBoardOperation = {
  type: BoardOperationType.Delete,
  id: BoardId,
}

export type IBoardOperation =
  INewBoardOperation
  | IUpdateBoardOperation
  | IDeleteBoardOperation
  | IInitBoardOperation
