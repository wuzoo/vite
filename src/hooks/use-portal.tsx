import { useEffect, useRef } from "react";

export default function usePortal(id: string) {
  const container = useRef<Element | null>(null);

  useEffect(() => {
    let parentElement = document.querySelector(`#${id}`) as HTMLElement | null;

    if (!parentElement) {
      parentElement = document.createElement("div");
      parentElement.setAttribute("id", id);
      document.body.appendChild(parentElement);
    }

    container.current = parentElement;

    return () => {
      if (parentElement) {
        parentElement.remove();
      }
    };
  }, [id]);

  return container.current;
}
