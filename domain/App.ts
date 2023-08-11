import { VNode } from "preact";
import * as Board from "./Board";

type PopupT = {
  value: string;
  actions: (() => VNode<{}>)[];
};

export type T = {
  board?: Board.Id;
  popup?: PopupT;
};

export enum OperationType {
  Init,
  New,
  SetBoard,
  ShowPopup,
  ClosePopup
}

export type OperationInit = {
  type: OperationType.Init,
  app: T,
};

export type OperationNew = {
  type: OperationType.New,
};

export type OperationSetBoard = {
  type: OperationType.SetBoard,
  board: Board.Id
};

export type OperationShowPopup = {
  type: OperationType.ShowPopup,
} & PopupT;

export type OperationClosePopup = {
  type: OperationType.ClosePopup
};

export type Operation =
  OperationInit
  | OperationNew
  | OperationSetBoard
  | OperationShowPopup
  | OperationClosePopup;
