import React from 'react';
import './App.css';
import AppDrawer from './layouts/MainLayout/AppDrawer';

import {BrowserRouter as Router,Switch,Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AppDrawer />
      <Switch>
          <Route path="/dashboard">
            <h1>{
              [1,2,3,4,5,6,6,7,8,8].map(()=>(
                "Hello world"
              ))
            }</h1>
          </Route>
          <Route path="/sells">
            sells
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
