import React, { Component } from 'react';
import { Route, Link, Redirect, Switch, withRouter} from "react-router-dom";
import './App.css';
import Admin from '../Admin/Admin';
import AddProduct from '../AddProduct/AddProduct';

class App extends Component {
  constructor() {
    super();

    this.state = {
     
    }
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
            <Route path="/Admin" render={() => (<Admin {...this.state} />) } />
            <Route path="/AddProduct" render={(props) => (<AddProduct {...props} />)} />
        </Switch>
        </div>
    );
  }
}

export default App;
