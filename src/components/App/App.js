import React, { Component } from 'react';
import { Route, Link, Redirect, Switch} from "react-router-dom";
import './App.css';
import Admin from '../Admin/Admin';
import ManageProduct from '../ManageProduct/ManageProduct';
import axios from 'axios';

const backendURL = "http://localhost:8080/api";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
     productAction: '',
     navLink: 'Admin',
     products: [],
     orders: []
    };
    console.log("Inside App.constructor(), props =", this.props, "state =", this.state);
  }

  componentDidMount() {
    this.getProducts();
    this.getOrders();
    console.log("Inside App.componentDidMount(), props =", this.props, "state =", this.state);
  }

  componentDidUpdate() {
    console.log("Inside App.componentDidUpdate(), props =", this.props, "state =", this.state);
  }

  handleLinkUpdate = () => {
    console.log("Inside App.handleLinkUpdate(), props =", this.props, "state =", this.state);
    
    switch(this.state.navLink) {
      case 'Admin': this.setState({ navLink: 'Home'}); break;
      case 'Home' : this.setState({ navLink: 'Admin'}); break;
      default: this.setState({ navLink: 'Admin'});
    }

  //  this.setState({ navLink: link });
  }

  getProducts() {
    axios({ 
      method: 'get',
      url: `${backendURL}/products`
    })
    .then(products => {
      this.setState({
        products: products.data
      });
      console.log("Inside App.getProducts.axios.then(), props =", this.props, "state =", this.state);
    });
  }

  getOrders() {
    axios({ 
      method: 'get',
      url: `${backendURL}/orders`
    })
    .then(orders => {
      this.setState({
        orders: orders.data
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
            <Link to={`/${this.state.navLink}`} id='App' onClick={this.handleLinkUpdate}>{this.state.navLink}</Link>
          </div>
          <hr />
        </header>
        <Switch>
            <Route exact path ="/" />
            <Route path="/Admin" render={(props) => <Admin {...props} {...this.state} />} />
            <Route path="/ManageProduct" render={ (props) => <ManageProduct {...props} 
              handleLinkUpdate={this.handleLinkUpdate} />} />
            <Route path="/*" render={() => <Redirect to="/" />} />
        </Switch>
        </div>
    );
  }
}

export default App;
