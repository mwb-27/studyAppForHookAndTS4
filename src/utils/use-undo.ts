import { useCallback, useState } from "react";

export const useUndo = <T>(initPresent: T) => {
  const [state, setState] = useState<{ past: T[]; present: T; future: T[] }>({
    past: [],
    present: initPresent,
    future: [],
  });
  const { past, future, present } = state;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    setState((currentState) => {
      const { past, future } = currentState;
      const canUndo = past.length > 0;
      if (canUndo) return currentState;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        present: previous,
        past: newPast,
        future: [previous, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      const { past, future, present } = currentState;
      const canRedo = future.length > 0;
      if (!canRedo) return currentState;
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        present: next,
        past: [...past, present],
        future: newFuture,
      };
    });
  }, []);

  const set = useCallback((newPresent: T) => {
    setState((currentState) => {
      const { past, present } = currentState;
      if (newPresent === present) {
        return currentState;
      }

      return {
        present: newPresent,
        past: [newPresent, ...past],
        future: [],
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setState({
      present: newPresent,
      past: [],
      future: [],
    });
  }, []);

  return [
    { past, present, future },
    { set, reset, undo, redo, canUndo, canRedo },
  ] as const;
};
