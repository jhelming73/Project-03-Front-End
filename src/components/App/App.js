import React, { Component } from 'react';
import { Route, Link, Redirect, Switch, withRouter} from "react-router-dom";
import './App.css';
import Admin from '../Admin/Admin';
import ManageProduct from '../ManageProduct/ManageProduct';
import axios from 'axios';

const backendURL = "http://localhost:8080/api";

class App extends Component {
  constructor() {
    super();

    this.state = {
     products: [],
     orders: []
    }
  }

  componentDidMount(){
    this.getProducts()
    this.getOrders()
  }

  getProducts() {
    axios({ 
      method: 'get',
      url: `${backendURL}/products`
    })
    .then(products => {
      this.setState({
        products: products.data
      })
      console.log("Inside App.getProducts.then()", this.state)
    })
  }

  getOrders() {
    axios({ 
      method: 'get',
      url: `${backendURL}/orders`
    })
    .then(orders => {
      this.setState({
        orders: orders.data
      })
      console.log("Inside App.getOrders.then()", this.state)
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="AppNav">
          <div>
          <h1>Jared &amp; Seamus' Grubhub</h1>
          <Link to="/Admin">Admin</Link>
          </div>
          <hr />
        </nav>
        <Switch>
            <Route exact path ="/" />
            <Route path="/Admin" render={(props) => (<Admin {...props} {...this.state} />) } />
            <Route path="/ManageProduct" render={(props) => (<ManageProduct {...props} />)} />
        </Switch>
        </div>
    );
  }
}

export default App;
