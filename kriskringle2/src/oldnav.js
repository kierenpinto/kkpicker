import React, { Component } from 'react';

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

  export default Nav;