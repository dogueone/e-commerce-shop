import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import ProductsPage from './pages/Products';
import AddProductPage from './pages/AddProduct';


// <Redirect from='/' to='/auth' exact />
// <Route path='/auth' component={AuthPage} />

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' component={ProductsPage} exact/>    
          <Route path='/add-product' component={AddProductPage}/>  
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
