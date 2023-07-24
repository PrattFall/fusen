import * as Column from "./Column";

export type TagId = string;
export type Id = string;

export type Tag = {
  id: TagId,
  title: string
  color: string
};

export type T = {
  id: Id,
  title: string,
  description: string,
  columnId: Column.Id,
  editing: boolean,
  position: number,
};

export enum OperationType {
  Init,
  New,
  Update,
  Delete,
  Move
}

export type OperationInit = {
  type: OperationType.Init,
  tasks: T[]
}

export type OperationNew = {
  type: OperationType.New,
  columnId: Column.Id
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
  type: OperationType.Move,
  id: Id,
  columnId: Column.Id,
  position: number
}

export type Operation =
  OperationInit
  | OperationNew
  | OperationUpdate
  | OperationDelete
  | OperationMove;

