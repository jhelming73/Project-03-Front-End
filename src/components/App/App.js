import React, { Component } from 'react';
import { Route, Link, Redirect, Switch, withRouter} from "react-router-dom";
import './App.css';
import Products from '../Products/Products';
import ManageProduct from '../ManageProduct/ManageProduct';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);

    this.backendURL = "http://localhost:8080/api";

    this.state = {        
        dbProducts:   []
      , dbOrders:     []
      , currentOrder: []      
    };
    console.log("Inside App.constructor(), props =", this.props, "state =", this.state);
    this.removeProductFromOrder = this.removeProductFromOrder.bind(this);
 }

  componentDidMount() {
    this.getProducts();
    // this.getOrders(); => We want to create an order not get them 
    console.log("Inside App.componentDidMount(), props =", this.props, "state =", this.state);
  }

  componentDidUpdate() {
    console.log("Inside App.componentDidUpdate(), props =", this.props, "state =", this.state);

    if (this.props.location.pathname === '/order-details' && this.state.currentOrder.length === 0) {
      this.props.history.push('/');  // Redirect to '/' 
    }
  }
 
  handleAddProductToOrder = (product) => {
    console.log("Inside App.handleAddProductToOrder(), product =", product);
    this.addProductToOrder(product);  
  }

  addProductToOrder = (product) => {
    console.log("Inside App.addProductToOrder(), product =", product);
    this.setState(({
      currentOrder: [...this.state.currentOrder, product]
    }));
  }

  handleRemoveProductFromOrder = (event, product) => {
    event.preventDefault();
    console.log("Inside App.handleRemoveProductFromOrder(), product =", product);    
    this.removeProductFromOrder(product); 
  }

  removeProductFromOrder = (product) => {    
    console.log("Inside App.removeProductFromOrder(), product =", product);
    
    let arrCpy = this.state.currentOrder.slice();
    let index = null;

    for (let i = 0; i < arrCpy.length; i++){
      console.log("arrCpy[i]._id = ", arrCpy[i]._id, " product._id = ", product._id); 
      if (arrCpy[i]._id == product._id) {
        index = i;
        break;
      };
    }    

    console.log("index = ", index); 
    arrCpy.splice(index, 1);
    console.log("arrCpy after splice = ", arrCpy);
    console.log("this.state.currentOrder = ", this.state.currentOrder);
    
    if (index !== null) {
      this.setState(({
        currentOrder: arrCpy
      }));
    }
 }

 handleSubmitOrder = (event, currentOrder) => {
  event.preventDefault();
  console.log("Inside App.handleSubmitOrder(), currentOrder =", currentOrder);    
  this.submitOrder(currentOrder); 
}

submitOrder = (currentOrder) => {
  console.log("Inside App.submitOrder(), currentOrder =", currentOrder);   
}

 handleCreateProduct = event => {
    event.preventDefault();
    this.createProduct();
    this.props.history.push('/Admin');
  }
  
  getProducts() {
    axios({ 
      method: 'get',
      url: `${this.backendURL}/products`
    })
    .then(dbProducts => {
      this.setState({
        dbProducts: dbProducts.data
      });
      console.log("Inside App.getProducts.axios.then(), props =", this.props, "state =", this.state);
    });
  }

  getOrders() {
    axios({ 
      method: 'get',
      url: `${this.backendURL}/orders`
    })
    .then(dbOrders => {
      this.setState({
        dbOrders: dbOrders.data
      });
      console.log("Inside App.getOrders.axios.then(), props =", this.props, "state =", this.state);
    });
  }

  render() {
    console.log("Inside App.render(), props =", this.props, "state =", this.state);
    return (
      <div className="App">
        <header>
          <div>
            <h1>Jared &amp; Seamus' Grubhub</h1>
            <Link to='/Products' onClick={this.handleLinkUpdate}>Header Link Text</Link>
          </div>
          <hr />          
        </header>
        <Switch>
            
            <Route exact path ="/" render={(props) => <Products {...props} {...this.state} 
              handleAddProductToOrder={this.handleAddProductToOrder} />} />
            
            <Route path="/ManageProduct" render={ (props) => <ManageProduct {...props} {...this.state}
              backendURL={this.backendURL} />} />

            <Route path="/order-details" render={ (props) => <Products {...props} {...this.state}
               handleRemoveProductFromOrder={this.handleRemoveProductFromOrder} />} />

            <Route path="/submit-order" render={ (props) => <Products {...props} {...this.state}
               handleSubmitOrder={this.handleSubmitOrder} />} />
            
            <Route path="/*" render={() => <Redirect to="/" />} />

        </Switch>
        </div>
    );
  }
}

export default withRouter(App);
