import React, { Component } from "react";
import DefaultAppBar from './DefaultAppBar.jsx'
import UserAppBar from './UserAppBar.jsx'
import { withStyles } from "@material-ui/core";

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        margin: 25,
        maxWidth: 400,
        minWidth: 350
      }
})
class AppBar extends Component{
    constructor(props){
        super(props)
        this.showSignIn = this.showSignIn.bind(this);
        this.showProfileModal = this.showProfileModal.bind(this);
    }
    showSignIn(){
        this.props.appObj.changeMainViewMode('');
    }
    showProfileModal(bool){
      this.props.appObj.changeMainViewMode('Profile')
    }
    render(){
        let {appObj} = this.props;
        if (appObj.state.userAuth) {
            // Show views restricted to an authenticated user
            return (
              // Render Top App Bar
              <UserAppBar user={appObj.state.userAuth} firebase={appObj.state.firebase} showProfileModal={this.showProfileModal}></UserAppBar>
            )
          }
          else {
            // Show views that an non-authenticated visitor will see - namely prompt to sign in.
            return(<div><DefaultAppBar showSignIn={this.showSignIn}></DefaultAppBar></div>)
          }
    }
}

export default withStyles(styles)(AppBar)