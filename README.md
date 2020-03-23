# Project-03-Front-End

## Installation Instructions

1. ``` npx create-react-app .```
2. ``` npm install axios react-router react-router-dom```
3. Created a components sub-directory under src
4. Created a App directory under components
5. Moved  App.* files under App sub-directory
6. Deleted stock README.md file
7. Index.js   
  a. Imported BrowserRouter from react-router-dom  
  b. Updated the import App, App.css to /components/App  
  c. Wrapped App component in BrowserRouter  

```
    import {BrowserRouter} from 'react-router-dom';
    import App from './components/App/App';
    import './components/App/App.css'

    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('root')
    );
```
8. App.js  
 a. Imported {Component} from React  
 b. Converted App into a Class Component  
 c. Created contructor with empty state  
 d. Added the render function above return  
 ```
    class App extends Component {
     constructor (){
       super();
    
       this.state = {
        
       }
     }
    
     render (){
       return (
         <div className="App">
           <header className="App-header">
             <h1>Inside App component</h1>
           </header>
         </div>
       );
     }
```