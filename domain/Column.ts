import * as Board from "./Board";

export type Id = string;

export type T = {
  id: Id,
  boardId: Id,
  editing: boolean,
  position: number,
  title: string,
};

export enum OperationType {
  Init,
  New,
  Update,
  Delete,
  Reposition
}

export type OperationNew = {
  type: OperationType.New,
  boardId: Board.Id
}

export type OperationUpdate = {
  type: OperationType.Update,
  id: Id,
  values: Partial<T>
}

export type OperationDelete = {
  type: OperationType.Delete,
  id: Id
}

export type OperationMove = {
  type: OperationType.Reposition,
  id: Id,
  boardId: Board.Id,
  position: number
}

export type OperationInit = {
  type: OperationType.Init,
  columns: T[],
}

export type Operation =
  OperationNew
  | OperationUpdate
  | OperationDelete
  | OperationMove
  | OperationInit;
