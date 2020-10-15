import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DndProvider } from 'react-dnd';
import { HTML5Backend as Backend } from 'react-dnd-html5-backend';
import { AppStateProvider } from './AppStateContext';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <DndProvider backend={Backend}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </DndProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
