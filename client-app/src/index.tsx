import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import App from './app/layout/App';
import './app/layout/styles.css';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { store, StoreContext } from './app/stores/store';

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);