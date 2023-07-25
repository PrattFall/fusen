import { useEffect, useRef, MutableRef } from "preact/hooks";

import { Task, Column } from "./domain";

// TODO: I think both reposition functions could be meaningfully combined, but
// for now I don't feel like putting in the effort to make typescript happy here
export const repositionTask = (
  tasks: Task.T[],
  taskId: Task.Id,
  columnId: Column.Id,
  position: number
): Task.T[] => {
  const task = tasks.find(t => t.id === taskId);
  const others = tasks.filter(t => t.id !== taskId);

  let inColumn = others.filter(t => t.columnId === columnId);

  // Make sure to add it to the column even if the column is empty
  if (inColumn.length === 0) {
    return tasks.map((t: Task.T) =>
      t.id === taskId ? ({ ...t, columnId, position: 0 }) : t
    );
  }

  inColumn.splice(position, 0, { ...task, columnId, position });

  const colMap = inColumn
    .map((t: Task.T, i) => ({ ...t, position: i }))
    .reduce(
      (acc: { [key: Task.Id]: Task.T }, x: Task.T) =>
        ({ ...acc, [x.id]: x }),
      {}
    );

  return tasks.map((t: Task.T) => t.id in colMap ? colMap[t.id] : t);
};

export const repositionColumn = (
  columns: Column.T[],
  columnId: Column.Id,
  position: number
) => {
  console.log("Repositioning column:", columnId, "to", position);
  const column = columns.find(c => c.id === columnId);
  const others = columns.filter(c => c.id !== columnId);

  let inBoard = others.filter(c => c.boardId === column.boardId);

  inBoard.splice(position, 0, { ...column, boardId: column.boardId, position });

  const boardMap = inBoard
    .map((c: Column.T, i: number) => ({ ...c, position: i }))
    .reduce(
      (acc: { [key: Column.Id]: Column.T }, x: Column.T) =>
        ({ ...acc, [x.id]: x }),
      {}
    );

  return columns.map((c: Column.T) => c.id in boardMap ? boardMap[c.id] : c);
};

export const useOutsideClick =
  (callback: any): MutableRef<HTMLElement | null> => {

    const inRect = (x: number, y: number, rect: DOMRect): boolean =>
      x >= rect.left && x < rect.right &&
      y <= rect.bottom && y > rect.top;

    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        const clientRect = ref.current?.getBoundingClientRect();

        if (!!clientRect && !inRect(event.x, event.y, clientRect)) {
          callback();
        }
      };

      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
      };
    }, [ref]);

    return ref;
  };

export const makeUniqueId = (): string =>
  window.crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(16);

export const ignoreDragEvent = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
};
