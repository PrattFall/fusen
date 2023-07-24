export type Id = string;

export type T = {
  id: Id,
  title: string,
  editing: boolean
};

export enum OperationType {
  Init,
  New,
  Update,
  Delete
}

export type OperationInit = {
  type: OperationType.Init,
  boards: T[],
}

export type OperationNew = {
  type: OperationType.New,
}

export type OperationUpdate = {
  type: OperationType.Update,
  id: Id,
  values: Partial<T>,
}

export type OperationDelete = {
  type: OperationType.Delete,
  id: Id,
}

export type Operation =
  OperationNew
  | OperationUpdate
  | OperationDelete
  | OperationInit
