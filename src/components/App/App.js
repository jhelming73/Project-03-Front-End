import React, { Component } from 'react';
import { Route, Link, Redirect, Switch, withRouter} from "react-router-dom";
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {

    }
  }

  render() {
    return (
      <div className="App">
        <nav>
          <div>
          <h1>Jared &amp; Seamus's Grubhub</h1>
          <Link to="/Admin">Admin</Link>
          </div>
          <hr />
        </nav>
        </div>
    );
  }
}

export default App;
