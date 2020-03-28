import React, { Component } from 'react';
import { Route, Link, Redirect, Switch, withRouter } from "react-router-dom";
import './App.css';
import Products from '../Products/Products';
import ManageProduct from '../ManageProduct/ManageProduct';
import axios from 'axios';
import _ from 'underscore'; // http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html

class App extends Component {

  constructor(props) {
    super(props);

   this.backendURL = process.env.REACT_APP_BACKEND_APP_URL || "http://localhost:8080/api";
   
    this.state = {
      dbProducts: []
      , dbOrder: []  // The order we just created in the db
      , dbOrders: []
      , currentOrder: []
      , currentProduct: [] // Used in calculating current 'customer' order total 
      , currentOrderTotal: 0.00
      , currentOrderId: 0
    };
    console.log("Inside App.constructor(), props =", this.props, "state =", this.state);
  }

  componentDidMount() {
    this.getProducts();
    // this.getOrders(); => We want to create an order not get them 
    console.log("Inside App.componentDidMount(), props =", this.props, "state =", this.state);
  }

  componentDidUpdate() {
    console.log("Inside App.componentDidUpdate(), props =", this.props, "state =", this.state);
  }
  
   resetManageProductState = () => {
     console.log("Inside resetManageProductState()");
      // Reset state for form fields in the Admin add-product and update-product routes (ManageProduct component)
     this.setState({ description: '', imageURL: '', price: '' });
  }

 // Reset currentOrder
resetCurrentOrder = (event) => {
    event.preventDefault();
    console.log("Inside App.resetCurrentOrder()");
    this.setState({ currentOrder: [], currentOrderTotal: 0.00, orderId: '' });
    this.props.history.push('/');
}

  handleAddProductToOrder = (event, product) => {
    console.log("Inside App.handleAddProductToOrder(), product =", product);
    this.addProductToOrder(product);
    this.resetCurrentProduct(event);
  }

  addProductToOrder = (product) => {
    console.log("Inside App.addProductToOrder(), product =", product);

    let currentOrderTotal = this.getCurrentOrderTotal(this.state.currentOrder, product);

    this.setState(({
      currentOrder: [...this.state.currentOrder, product]
      , currentOrderTotal: currentOrderTotal
    }));
  }

  handleRemoveProductFromOrder = (event, product) => {
    event.preventDefault();
    console.log("Inside App.handleRemoveProductFromOrder(), product =", product);
    this.removeProductFromOrder(product);
  }

  removeProductFromOrder = (product) => {
    console.log("Inside App.removeProductFromOrder(), product =", product);

    let currentOrder = this.state.currentOrder.slice();
    let index = null;

    // Find the product in the current order
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i]._id === product._id) {
        index = i;
        break;
      };
    }

    currentOrder.splice(index, 1);

    let currentOrderTotal = this.getCurrentOrderTotal(currentOrder);

    if (index !== null) {
      this.setState(({
        currentOrder: currentOrder
        , currentOrderTotal: currentOrderTotal
      }));
    }
  }

  handleOnChange = (event) => {
    console.log("Inside App.handleOnChange(), event.target.value =", event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDeleteProduct = (event, product) => {
    event.preventDefault();
    console.log("Inside App.handleDeleteProduct(), product =",
      product, "event.target =", event.target, "event.target.id =", event.target.id);
    let productIdToDelete = event.target.id;
    this.deleteProduct(event, product, productIdToDelete);
  }

  deleteProduct = (event, product, productIdToDelete) => {
    console.log("Inside App.deleteProduct(), product =", product,
      "productIdToDelete =", productIdToDelete);
    axios({
      method: 'delete'
      , url: `${this.backendURL}/products/${productIdToDelete}`
    })
      .then(deletedProduct => {
        console.log("deletedProduct = ", deletedProduct);
        this.getProducts(); // Retrieve the list of products from the database
      });
  }

  handleSubmitOrder = (event, order) => {
    console.log("Inside App.handleSubmitOrder(), order = ", order);
    if (order.length !== 0) this.createOrderDb(order);
  }

  handleCreateProduct = event => {
    event.preventDefault();
    console.log("Inside App.handleCreateProduct(), state = ", this.state);
    this.createProduct();
    this.props.history.push('/manage-products');
  }

  createProduct = () => {
    console.log("Inside App.createProduct(), state = ", this.state);
    axios({
      method: "post",
      url: `${this.backendURL}/products`,
      data: {
        description: this.state.description
        , imageURL: this.state.imageURL
        , price: this.state.price
      }
    })
      .then(product => {
        this.setState((prevState) => ({
          dbProducts: [...prevState.dbProducts, product.data]
        })
        );
        console.log("Inside App.createProduct.axios.then(), state = ", this.state, " product = ", product);
      });
  }

  handleUpdateCurrentProduct = (product) => {
    console.log("Inside App.handleUpdateCurrentProduct(), state = ", this.state);
    this.updateCurrentProduct(product);
    this.props.history.push('/manage-products');
  }

  updateCurrentProduct = (product) => {
    this.setState({ currentProduct: product });
    console.log("Inside App.updateCurrentProduct(), state = ", this.state);
  }

  handleResetCurrentProduct = (event) => {
    event.preventDefault();
    console.log("Inside App.handleResetCurrentProduct() event.target =", event.target,
      "event.target.id =", event.target.id,
      "props =", this.props,
      "state=", this.state);
    this.resetCurrentProduct(event);
  }

  resetCurrentProduct = (event) => {
    event.preventDefault();
    console.log("Inside App.resetCurrentProduct() event.target =", event.target,
      "event.target.id =", event.target.id,
      "props =", this.props,
      "state=", this.state);
    this.setState({ currentProduct: [] });
  }

  handleUpdateProductRoute = (event, product) => {
    event.preventDefault();
    console.log("Inside App.handleUpdateProductRoute(), props =", this.props,
      "state =", this.state, "product =", product, "event.target =", event.target,
      "event.target.id =", event.target.id);
    this.updateProductRoute(event, product);
  }

  updateProductRoute = (event, product) => {
    console.log("Inside App.updateProductRoute(), product =", product);
    this.props.history.push({ pathname: '/update-product', state: { product: product } });
  }

  handleUpdateProductSubmit = (event, currentProduct, updatedProduct) => {
    event.preventDefault();
    console.log("Inside App.handleUpdateProductSubmit(), currentProduct =", currentProduct,
      "updatedProduct =", updatedProduct);
    this.updateProductSubmit(event, currentProduct, updatedProduct);
    this.props.history.push('/manage-products');
  }

  updateProductSubmit = (event, currentProduct, updatedProduct) => {
    console.log("Inside App.updateProductSubmit(), currentProduct =", currentProduct,
      "updatedProduct =", updatedProduct);

    this.resetManageProductState(); // Reset manage product state

    if (!_.isEqual(currentProduct, updatedProduct)) {
      console.log("Inside if statement, updatedProduct = ", updatedProduct);

      axios({
        method: "put",
        url: `${this.backendURL}/products/${updatedProduct._id}`,
        data: {
          description: updatedProduct.description
          , imageURL: updatedProduct.imageURL
          , price: updatedProduct.price
        }
      })
        .then(updatedProduct => {
          this.getProducts(); // Reset products from database
        });
    }
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

  async createOrderDb(order) {
    console.log("Inside App.createOrderDb(), order =", order);
    
   

    let orderTotal = 0.00;
    
    // Get the total for the order
    order.forEach(product => {
      console.log(product);
      orderTotal += parseFloat(product.price.$numberDecimal);
    });

    orderTotal = orderTotal.toFixed(2);

    console.log("Order Total = ", orderTotal);
    
    // Get the max orderId in the database and increment by 1
    let allOrders = await axios.get(`${this.backendURL}/orders`);
    console.log("allOrders.data = ", allOrders.data);

    // Get an array of orderIds converted to integers
    let orderIds = allOrders.data.map((order) => {
        return parseInt(order.orderId);
    });

    // Get the highest integer in the array
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
    let maxOrderId = Math.max(...orderIds) + 1;   
    maxOrderId = maxOrderId.toString().padStart(6, '0');

    // https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
    this.setState({...this.state.currentOrder, orderId: maxOrderId});
    
    //Create an order in the db with the current order info
     await axios({
       method: 'post'
       , url: `${this.backendURL}/orders`
       , data: {
         orderId: maxOrderId
         , lineItems: order
         , total: orderTotal
       }
     });     
  }

  getCurrentOrderTotal = (currentOrder, currentProduct = null) => {
    let total = 0;

    currentOrder.forEach((product) => {
      total += parseFloat(product.price.$numberDecimal);
    });

    console.log("Inside getCurrentOrderTotal, currentProduct = ", currentProduct);

    if (currentProduct) {
      total += parseFloat(currentProduct.price.$numberDecimal);
    }

    return total;
  }

  render() {
    console.log("Inside App.render(), props =", this.props, "state =", this.state);

    let linkTo = '';
    let linkText = '';
    let headerLink = '';

    switch (this.props.location.pathname) {

      case '/':
        linkTo = '/manage-products';
        linkText = 'Admin';
        headerLink = <Link to={linkTo} onClick={() => this.resetManageProductState}>{linkText}</Link>;
        break;

      case '/manage-products':
        linkTo = '/';
        linkText = 'Home';
        headerLink = <Link to={linkTo} onClick={() => this.resetManageProductState}>{linkText}</Link>;
        break;

      case '/manage-product':
        linkTo = '/manage-products';
        linkText = 'Admin';
        break;

      case '/add-product':
        linkTo = '/manage-products';
        linkText = 'Admin';
        headerLink = <Link to={linkTo} onClick={() => this.resetManageProductState}>{linkText}</Link>;
        break;

      case '/update-product':
        linkTo = '/manage-products';
        linkText = 'Admin';
        headerLink = <Link to={linkTo} onClick={() => this.resetManageProductState}>{linkText}</Link>;
        break;

      case '/delete-product':
        linkTo = '/manage-products';
        linkText = 'Admin';
        break;

      case '/order-details':
      case '/submit-order':
        linkTo = '/';
        linkText = 'Home';
        headerLink = <Link to={linkTo} onClick={() => this.resetManageProductState}>{linkText}</Link>;
        break;

      case '/order-confirmation':
        linkTo = '/';
        linkText = 'Home';
        headerLink = <Link to={linkTo} onClick={(event) => this.resetCurrentOrder(event)}>{linkText}</Link>;
        break;

      default: linkText = 'There is no default - this is a dummy';
    }
    return (
      <div className="App">
        <header>
          <div className="HeaderInfo">
            <div className="SiteTitle">
              <h1>Jared &amp; Seamus' Grubhub</h1>
            </div>
            <div className="SiteNav">
              {headerLink}
            </div>
          </div>
          <hr />
        </header>
        <Switch>

          <Route exact path="/" render={(props) => <Products
            {...props} {...this.state}
            handleAddProductToOrder={this.handleAddProductToOrder}
            handleUpdateCurrentProduct={this.handleUpdateCurrentProduct}/>}
          />

          <Route exact path="/manage-products" render={(props) => <Products
            {...props} {...this.state}
            handleAddProductToOrder={this.handleAddProductToOrder}
            handleUpdateProductRoute={this.handleUpdateProductRoute}
            handleDeleteProduct={this.handleDeleteProduct} />}
          />

          <Route path="/add-product" render={(props) => <ManageProduct
            {...props} {...this.state}
            handleCreateProduct={this.handleCreateProduct} s
            handleOnChange={this.handleOnChange} />}
          />

          <Route path="/update-product" render={(props) => <ManageProduct
            {...props} {...this.state}
            handleUpdateProductSubmit={this.handleUpdateProductSubmit}
            handleOnChange={this.handleOnChange} />}
          />

          <Route path="/order-details" render={(props) => <Products
            {...props} {...this.state}
            handleRemoveProductFromOrder={this.handleRemoveProductFromOrder}
            handleSubmitOrder={this.handleSubmitOrder}
            handleUpdateCurrentProduct={this.handleUpdateCurrentProduct} />}
          />

          <Route path="/order-confirmation" render={(props) => <Products
            {...props} {...this.state} />}
            />

          <Route path="/delete-product" render={() => <Redirect to="/manage-products" />} />
          <Route path="/submit-order" render={() => <Redirect to="/order-confirmation" />} />
          <Route path="/*" render={() => <Redirect to="/" />} />

        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
