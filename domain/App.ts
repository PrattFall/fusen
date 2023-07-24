import * as Board from "./Board";

export interface T {
  board?: Board.Id
}

export enum OperationType {
  Init,
  New,
  SetBoard,
}

export type OperationInit = {
  type: OperationType.Init,
  app: T,
}

export type OperationNew = {
  type: OperationType.New,
}

export type OperationSetBoard = {
  type: OperationType.SetBoard,
  board: Board.Id
}

export type Operation =
  OperationInit
  | OperationNew
  | OperationSetBoard;
