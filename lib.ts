import { useEffect, useRef, MutableRef } from "preact/hooks";
import { ITask, ColumnId, TaskId } from "./domain";

export const repositionTask = (
  tasks: ITask[],
  taskId: TaskId,
  columnId: ColumnId,
  position: number
): ITask[] => {
  const task = tasks.find(t => t.id === taskId);
  const others = tasks.filter(t => t.id !== taskId);
  let inColumn = others.filter(t => t.columnId === columnId);

  // Make sure to add it to the column even if the column is empty
  if (inColumn.length === 0) {
    return tasks.map((t: ITask) =>
      t.id === taskId ? ({ ...t, columnId, position: 0 }): t
    );
  }

  inColumn.splice(position, 0, { ...task, columnId, position });

  const colMap = inColumn
    .map((t: ITask, i) => ({ ...t, position: i }))
    .reduce(
      (acc: { [key: TaskId]: ITask }, x: ITask) =>
        ({ ...acc, [x.id]: x }),
      {}
    );

  return tasks.map((t: ITask) => t.id in colMap ? colMap[t.id] : t);
};

export const inRect = (x: number, y: number, rect: DOMRect): boolean =>
  x >= rect.left && x < rect.right &&
  y <= rect.bottom && y > rect.top;

export const useOutsideClick =
  (callback: any): MutableRef<HTMLElement | null> => {
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
