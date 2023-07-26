import { useEffect, useRef, MutableRef } from "preact/hooks";

interface Repositionable<Id> {
  id: Id,
  position: number
}

const finsert = <T>(arr: T[], v: T, pos: number): T[] => {
  const result = [...arr];
  result.splice(pos, 0, v);
  return result;
}

// I did it, but I'm not required to like it
export const reposition = <
  T extends Repositionable<Id>,
  Id extends string,
  ContainerId
>(
  items: T[],
  id: Id,
  containerId: ContainerId,
  containerIdKey: string,
  position: number
): T[] => {
  const item = items.find(t => t.id === id);
  const others = items.filter(t => t.id !== id);

  let inContainer = others.filter(t => t[containerIdKey] === containerId);

  // Make sure to add it to the container even if the container is empty
  if (inContainer.length === 0) {
    return items.map((t: T) =>
      t.id === id? ({ ...t, [containerIdKey]: containerId, position: 0 }) : t
    );
  }

  inContainer
    .sort((a, b) => {
      if(a.position < b.position) return -1;
      if(b.position < a.position) return 1;
      return 0;
    }).splice(position, 0, {
      ...item,
      [containerIdKey]: containerId,
      position
    });

  const containerMap = [...inContainer]
    .map((t: T, i) => ({ ...t, position: i }))
    .reduce(
      (acc: { [key: string]: T }, x: T) =>
        ({ ...acc, [x.id]: x }),
      {}
    );

  return items.map((t: T) => t.id in containerMap ? containerMap[t.id] : t);
}

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
