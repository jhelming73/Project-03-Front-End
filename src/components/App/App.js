import React, { Component } from 'react';
import { Route, Link, Redirect, Switch, withRouter} from "react-router-dom";
import './App.css';
import Products from '../Products/Products';
import ManageProduct from '../ManageProduct/ManageProduct';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);

    this.backendURL = process.env.REACT_APP_BACKEND_APP_URL || "http://localhost:8080/api";

    this.state = {        
        dbProducts:   []
      , dbOrder:      []  // The order we just created in the db
      , dbOrders:     []
      , currentOrder: []
      , currentProduct: []
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

    /* if (this.props.location.pathname === '/order-details' && this.state.currentOrder.length === 0) {
      this.props.history.push('/');  // Redirect to '/' 
    } */
  }
 
  handleAddProductToOrder = (product) => {
    console.log("Inside App.handleAddProductToOrder(), product =", product);
    this.addProductToOrder(product);
    this.resetCurrentProduct();  
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
    for (let i = 0; i < currentOrder.length; i++){ 
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

handleAddDetailsToProduct = (event, product) => {
  event.preventDefault();
  console.log("Inside App.handleAddDetailsToProduct(), product =", product);    
  this.addDetailsToProduct(product); 
}

handleOnChange = (event) => {
  console.log("Inside App.handleOnChange(), event.target.value =", event.target.value);
  this.setState({ [event.target.name]: event.target.value });  
}

addDetailsToProduct = (product) => {
  console.log("Inside App.addDetailsToProduct(), product =", product);
  this.setState(({currentProduct: product })); 
}

handleDeleteProduct = (event, product) => {
  event.preventDefault();
  console.log("Inside App.handleDeleteProduct(), product =", product);    
  this.deleteProduct(product); 
}

deleteProduct = (product) => {
  console.log("Inside App.deleteProduct(), product =", product);  
  this.resetCurrentProduct();
}

 handleSubmitOrder = () => {
  //event.preventDefault(); <== We need the event default here to go to /submit-order route!
  console.log("Inside App.handleSubmitOrder(), state = ", this.state);    
  
 const currentOrderId = async () => {
    currentOrderId = this.getMaxOrderIdDb() + 1;
    this.setState({ currentOrderId: currentOrderId});
  };
  
  this.createOrderDb(this.state.currentOrder,this.state.currentOrderTotal, this.state.currentOrderId); 
}

handleCreateProduct = event => {
    event.preventDefault();
    console.log("Inside App.handleCreateProduct(), state = ", this.state);
    this.createProduct();
    this.props.history.push('/Admin');
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
    .then( product => {
      this.setState( (prevState) => ({
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
    this.setState({currentProduct: product});
    console.log("Inside App.updateCurrentProduct(), state = ", this.state);    
  }

  resetCurrentProduct = () => {
    this.setState({currentProduct: [] });  
  }


  // handleUpdateProduct = (product) => {
  //   console.log("Inside App.handleUpdateProduct(), state = ", this.state);
  //   this.updateProduct();
  //   this.props.history.push('/Admin');
  // }

  // updateProduct = () => {
  //   console.log("Inside App.updateProduct(), state = ", this.state);
  //   console.log(`${this.backendURL}/products/${this.state.currentProduct._id}`);
     
  //   /*  axios({
  //     method: "put",
  //     url: `${this.backendURL}/products/${this.state.currentProduct._id}`,
  //     data: {
  //         description: this.state.description
  //       , imageURL:    this.state.imageURL
  //       , price:       this.state.price
  //     }
  //   })
  //   .then( product => {
  //     this.getProducts(); // update dbProducts     
  //     console.log("Inside App.createProduct.axios.then(), state = ", this.state, " product = ", product);
  //   });  */

  // }

  handleUpdateProduct = event => {
    event.preventDefault();
    console.log("Inside App.handleUpdateProduct(), state = ", this.state);
    this.updateProduct();
    this.props.history.push('/manage-products');
  }

  updateProduct = () => {
    console.log("Inside App.updateProduct(), state = ", this.state);    
    
    let updatedDescription = '';
    let updatedImageURL = '';
    let updatedPrice = '';

    updatedDescription = this.state.description 
    ? this.state.description 
    : this.state.currentProduct.description;
    
    updatedImageURL = this.state.imageURL 
    ? this.state.imageURL 
    : this.state.currentProduct.imageURL;

    updatedPrice = this.state.price 
    ? this.state.price 
    : this.state.currentProduct.price.$numberDecimal;    
    
    axios({
      method: "put",
      url: `${this.backendURL}/products/${this.state.currentProduct._id}`,
      data: {
          description: updatedDescription 
        , imageURL: updatedImageURL
        , price: updatedPrice
      }
    })
    .then( product => {
     this.getProducts(); // Reset products from database
     console.log("Inside App.createProduct.axios.then(), state = ", this.state, " product = ", product);
     this.resetCurrentProduct();
    }); 
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

  // Get highest order ID in database
  getMaxOrderIdDb = () => { 
    axios({
      method: 'get'
      , url: `${this.backendURL}/orders`
    })
      .then(dbOrders => {
        console.log("dbOrders = ", dbOrders);

        // Get an array of orderIds converted to integers
        let orderIds = dbOrders.data.map((dbOrder) => {
          return parseInt(dbOrder.orderId);
        });

        // Get the highest integer in the array
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
        return Math.max(...orderIds);
      });
  }
  
 createOrderDb( currentOrder, currentOrderTotal, currentOrderId) {
    console.log("Inside App.createOrderDb(), currentOrder =", currentOrder);

    // Create an order in the db with the current order info
    axios({ 
        method: 'post'
      , url: `${this.backendURL}/orders`
      , data: {
          orderId:   currentOrderId
        , lineItems: currentOrder
        , total:     currentOrderTotal
      }
    })
    .then(dbOrder => {
      console.log("dbOrder = ", dbOrder);
      this.setState({
          // Reset current order state but save the dbOrder state for the Order receipt
          currentOrder: [] 
        , currentOrderTotal: 0.00
        , dbOrder: dbOrder.data
      });
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

    switch (this.props.location.pathname) {

      case '/':
        linkTo = '/manage-products';
        linkText = 'Admin';
        break;

      case '/manage-products':
        linkTo = '/';
        linkText = 'Home';
        break;

      case '/manage-product':
        linkTo = '/manage-products';
        linkText = 'Admin';
        break;

        case '/add-product':
          linkTo = '/manage-products';
          linkText = 'Admin';
          break;
        
        case '/update-product':
          linkTo = '/manage-products';
          linkText = 'Admin';
          break;         

          case '/delete-product':
            linkTo = '/manage-products';
            linkText = 'Admin';
            break;

      case '/order-details':
      case '/submit-order':
        linkTo = '/';
        linkText = 'Home';
        break;

      case '/order-confirmation':
        linkTo = '/';
        linkText = 'Home';
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
              <Link to={linkTo} onClick={this.handleLinkUpdate}>{linkText}</Link>
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
            handleUpdateCurrentProduct={this.handleUpdateCurrentProduct}/>}
          />

          <Route path="/add-product" render={(props) => <ManageProduct
            {...props} {...this.state}
            handleCreateProduct={this.handleCreateProduct}
            handleOnChange={this.handleOnChange} />}
          />

          <Route path="/update-product" render={(props) => <ManageProduct
            {...props} {...this.state}
            handleUpdateProduct={this.handleUpdateProduct}
            handleOnChange={this.handleOnChange} />}
          />

          <Route path="/order-details" render={(props) => <Products
            {...props} {...this.state}
            handleRemoveProductFromOrder={this.handleRemoveProductFromOrder}
            handleSubmitOrder={this.handleSubmitOrder} 
            handleUpdateCurrentProduct={this.handleUpdateCurrentProduct}/>}
          />

        <Route path="/delete-product" render={(props) => <Products
            {...props} {...this.state}
            handleRemoveProductFromOrder={this.handleRemoveProductFromOrder}
            handleSubmitOrder={this.handleSubmitOrder} 
            handleUpdateCurrentProduct={this.handleUpdateCurrentProduct}
            backendURL={this.backendURL} /> }
          />

          <Route path="/order-confirmation" render={(props) => <Products
            {...props} {...this.state}
          />} />
          
          {/* <Route path="/delete-product" render={() => <Redirect to="/manage-products" />} /> */}
          <Route path="/submit-order" render={() => <Redirect to="/order-confirmation" />} />         
          <Route path="/*" render={() => <Redirect to="/" />} />

        </Switch>
        </div>
    );
  }
}

export default withRouter(App);
