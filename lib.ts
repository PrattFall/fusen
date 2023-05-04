import { useEffect, useRef, MutableRef } from "preact/hooks";

export const inRect = (x: number, y: number, rect: DOMRect): boolean =>
  x >= rect.left && x < rect.right &&
  y <= rect.bottom && y > rect.top;

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
