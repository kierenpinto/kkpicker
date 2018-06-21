import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './index.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={db: this.props.firebase.firestore()}
  }
  render() {
    return (
      <div className="App">
        <Nav db={this.state.db}></Nav>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: ['hi', 'bye'],
      item: 'test',
    };
  }
  componentDidMount(props){
    let docRef = this.props.db.collection('users').doc("message");
    docRef.onSnapshot((doc)=>{
      console.log(doc.data().message)
      this.setState({
        menuItems: doc.data().message,
      })
    })
  }
  render() {
    const itemList = this.state.menuItems.map((item, index) => {
      return <li> {item} </li>
    })
    return (
      <ul className="Nav">
        {itemList}
      </ul>
    )
  };
}
export default App;
