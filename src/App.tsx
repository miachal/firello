import React from 'react';
import { Column } from './Column';
import { CustomDragLayer } from './CustomDragLayer';
import { AppContainer } from './styles';
import { AddNewItem } from './AddNewItem';
import { useAppState } from './AppStateContext';

const App = () => {
  const { state, dispatch } = useAppState();

  return (
    <AppContainer>
      <CustomDragLayer />
      {state.lists.map((list, j) => (
        <Column id={list.id} text={list.text} key={list.id} index={j} />
      ))}
      <AddNewItem
        toggleButtonText='+ Add another list'
        onAdd={(payload) => dispatch({ type: 'ADD_LIST', payload })}
      />
    </AppContainer>
  );
};

export default App;
