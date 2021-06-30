import { useCallback, useReducer, useState } from "react";

const UNDO = "UNDO";
const REDO = "REDO";
const SET = "SET";
const RESET = "RESET";

type State<T> = {
  past: T[];
  present: T;
  future: T[];
};

type Action<T> = {
  newPresent?: T;
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET;
};

const undoReducer = <T>(state: State<T>, action: Action<T>) => {
  const { past, present, future } = state;
  const { newPresent } = action;
  switch (action.type) {
    case UNDO: {
      const canUndo = past.length > 0;
      if (canUndo) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        present: previous,
        past: newPast,
        future: [previous, ...future],
      };
    }
    case REDO: {
      const canRedo = future.length > 0;
      if (!canRedo) return state;
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        present: next,
        past: [...past, present],
        future: newFuture,
      };
    }
    case SET: {
      if (newPresent === present) {
        return state;
      }

      return {
        present: newPresent,
        past: [newPresent, ...past],
        future: [],
      };
    }
    case RESET: {
      return {
        present: newPresent,
        past: [],
        future: [],
      };
    }
    default:
      return state;
  }
};

export const useUndo = <T>(initPresent: T) => {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initPresent,
    future: [],
  } as State<T>);

  // const [state, setState] = useState<State<T>>({
  //   past: [],
  //   present: initPresent,
  //   future: [],
  // });
  const { past, future, present } = state;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    dispatch({ type: UNDO });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: REDO });
  }, []);

  const set = useCallback((newPresent: T) => {
    dispatch({ type: SET, newPresent });
  }, []);

  const reset = useCallback((newPresent: T) => {
    dispatch({ type: RESET, newPresent });
  }, []);

  return [
    { past, present, future },
    { set, reset, undo, redo, canUndo, canRedo },
  ] as const;
};
