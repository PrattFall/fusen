import { useEffect, useRef, MutableRef } from "preact/hooks";
import { ITask, ColumnId, TaskId } from "./domain";

export const inRect = (x: number, y: number, rect: DOMRect): boolean =>
  x >= rect.left && x < rect.right &&
  y <= rect.bottom && y > rect.top;

export const repositionTask = (
  tasks: ITask[],
  taskId: TaskId,
  columnId: ColumnId,
  position: number
): ITask[] => {
  const task = tasks.find(t => t.id === taskId);
  const others = tasks.filter(t => t.id !== taskId);
  let inColumn = others.filter(t => t.columnId === columnId);

  if (inColumn.length === 0) {
    return tasks.map((t: ITask) => {
      if (t.id === taskId) {
        return { ...t, columnId, position: 0 };
      }

      return t;
    });
  }

  inColumn
    .splice(position, 0, { ...task, columnId, position });

  const colMap =
    inColumn
      .map((t: ITask, i) => ({ ...t, position: i }))
      .reduce(
        (acc: { [key: TaskId]: ITask }, x: ITask) =>
          ({ ...acc, [x.id]: x }),
        {}
      );


  return tasks.map((t: ITask) => {
    if (t.id in colMap) {
      return colMap[t.id];
    }

    return t;
  });
};

export const useOutsideClick = (callback: any): MutableRef<HTMLElement | null> => {
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
