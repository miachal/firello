import React, {
  PropsWithChildren,
  ComponentType,
  useEffect,
  useState,
} from 'react';
import { AppState } from './AppStateContext';
import { useHistory, useLocation } from 'react-router-dom';
import firebase from './firebase';
import { useObject } from 'react-firebase-hooks/database';
import { Loading } from './Loading';
import uniqid from 'uniqid';
import { database } from 'firebase';

export const withData = (
  WrappedComponent: ComponentType<
    PropsWithChildren<{
      initialState: AppState;
      fdbReference: database.Reference;
    }>
  >
) => ({ children }: PropsWithChildren<{}>) => {
  const location = useLocation();
  const history = useHistory();
  const fdbRef = firebase.ref(location.pathname);
  const [obj, isLoading, error] = useObject(fdbRef);
  const [initialState, setInitialState] = useState<AppState>({
    lists: [],
    draggedItem: undefined,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      history.push(uniqid());
    }
  }, [history, location]);

  useEffect(() => {
    if (!isLoading) {
      const value = obj?.val();
      if (value) {
        const asObj = JSON.parse(value);
        setInitialState(asObj);
      }
      setReady(true);
    }
  }, [obj, isLoading]);

  if (isLoading || !ready) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <WrappedComponent initialState={initialState} fdbReference={fdbRef}>
      {children}
    </WrappedComponent>
  );
};
