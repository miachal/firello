import React, { createContext, useReducer, useContext, useEffect } from 'react';
import uniqid from 'uniqid';
import { findItemIndexById } from './utils/findItemIndexById';
import { moveItem } from './moveItem';
import { DragItem } from './DragItem';
import { withData } from './withData';
import { database } from 'firebase';

interface AppStateContextProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

export const AppStateProvider = withData(
  ({
    children,
    initialState,
    fdbReference,
  }: React.PropsWithChildren<{
    initialState: AppState;
    fdbReference: database.Reference;
  }>) => {
    const [state, dispatch] = useReducer(appStateReducer, initialState);

    useEffect(() => {
      fdbReference.set(JSON.stringify(state));
    }, [fdbReference, state]);

    return (
      <AppStateContext.Provider value={{ state, dispatch }}>
        {children}
      </AppStateContext.Provider>
    );
  }
);

export const useAppState = () => useContext(AppStateContext);

interface Task {
  id: string;
  text: string;
}

interface List {
  id: string;
  text: string;
  tasks: Task[];
}

export interface AppState {
  lists: List[];
  draggedItem: DragItem | undefined;
}

type Action =
  | {
      type: 'ADD_LIST';
      payload: string;
    }
  | {
      type: 'ADD_TASK';
      payload: { text: string; listId: string };
    }
  | {
      type: 'MOVE_LIST';
      payload: { dragIndex: number; hoverIndex: number };
    }
  | {
      type: 'MOVE_TASK';
      payload: {
        dragIndex: number;
        hoverIndex: number;
        sourceColumn: string;
        targetColumn: string;
      };
    }
  | {
      type: 'SET_DRAGGED_ITEM';
      payload: DragItem | undefined;
    };

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_LIST':
      if (!action.payload) return state;

      return {
        ...state,
        lists: [
          ...state.lists,
          { id: uniqid(), text: action.payload, tasks: [] },
        ],
      };

    case 'ADD_TASK': {
      if (!action.payload.text) return state;

      const targetLaneIndex = findItemIndexById(
        state.lists,
        action.payload.listId
      );
      state.lists[targetLaneIndex].tasks.push({
        id: uniqid(),
        text: action.payload.text,
      });
      return {
        ...state,
      };
    }

    case 'MOVE_LIST': {
      const { dragIndex, hoverIndex } = action.payload;
      state.lists = moveItem(state.lists, dragIndex, hoverIndex);
      return { ...state };
    }

    case 'MOVE_TASK': {
      const {
        dragIndex,
        hoverIndex,
        sourceColumn,
        targetColumn,
      } = action.payload;
      const sourceLaneIndex = findItemIndexById(state.lists, sourceColumn);
      const targetLaneIndex = findItemIndexById(state.lists, targetColumn);
      const item = state.lists[sourceLaneIndex].tasks.splice(dragIndex, 1)[0];
      state.lists[targetLaneIndex].tasks.splice(hoverIndex, 0, item);
      return { ...state };
    }

    case 'SET_DRAGGED_ITEM':
      return {
        ...state,
        draggedItem: action.payload,
      };

    default:
      return state;
  }
};
