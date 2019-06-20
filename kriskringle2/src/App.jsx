import React, { Component } from 'react';
import './App.css';
import DefaultAppBar from './Navigation/NavDefault.jsx'
import UserAppBar from './Navigation/NavUser.jsx'
import * as firebase from 'firebase';
import SignInWidget from './SignIn.jsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import GroupView from './MainView/GroupView/GroupView';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { GroupsDB, UserDB } from './Interface';
import Profile from './MainView/Profile';
import { Slide } from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: 25,
    maxWidth: 400,
    minWidth: 350
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  group_card: {
    margin: 25,
    maxWidth: 400
  },
  fab: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: theme.spacing.unit * 6,
    right: theme.spacing.unit * 6,
  },
  content: {
    marginTop: 56,
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firebase: props.firebase,
      userAuth: false,
      userDB: new UserDB(props.firebase),
      SignInVisible: false,
      showContent: false,
      profileanchorEl: null,
      profileModalVisible: false,
      groupMode:'view', // GroupMode can be view or add
    }
    firebase.auth().onAuthStateChanged(
      (user) => this.changeAuthState(user))
    this.showSignIn = this.showSignIn.bind(this);
    this.changeAuthState = this.changeAuthState.bind(this);
    this.showProfileModal = this.showProfileModal.bind(this);
    this.addGroupHandler = this.addGroupHandler.bind(this);
  }
  changeAuthState(user) {
    this.setState({ userAuth: user, showContent: true });
    if (!!user) { this.setState({ SignInVisible: false }) }
  }
  showSignIn() {
    // Shows sign in dialog box
    this.setState({ SignInVisible: true });
  }
  showProfileModal(bool) {
    this.setState({ profileModalVisible: bool })
  }
  addGroupHandler(){
    this.setState({groupMode:'add'})
  }
  render() {
    const { classes } = this.props;
    // const { profileanchorEl } = this.state;
    // const open = Boolean(profileanchorEl);
    //Placeholders
    let appbar = null;
    let content = null;
    let view = null;
    if (this.state.userAuth) { 
      // Show views restricted to an authenticated user
      appbar = (
        // Render Top App Bar
        <UserAppBar user={this.state.userAuth} firebase={this.state.firebase} showProfileModal={this.showProfileModal}></UserAppBar>
      )
      // Check whether to show profile view or to display normal groups view
      if (this.state.profileModalVisible) { 
        // Show profile modal
        view = (<Profile showProfileModal={this.showProfileModal} userDB = {this.state.userDB} user={this.state.userAuth} />)
      }
      else {
        // Show normal groups view
        view = (<GroupView firebase={this.state.firebase} mode={this.state.groupMode}/>)
      }
      let fabIcon = (<div></div>);
      if (this.state.groupMode == 'view'){
        fabIcon = (<AddIcon/>)
      }
      else if(this.state.groupMode == 'add'){
        fabIcon = (<CloseIcon/>) 
      }
      content = (
        <div className={classes.content}>
          {view /*display view in here */}
          <Slide direction='left' in={true}>
            <Fab color = "primary" aria-label="Add" className={classes.fab} onClick={this.addGroupHandler}>
              {fabIcon}
            </Fab>
          </Slide>
        </div>
      )
    }
    else { 
      // Show views that an non-authenticated visitor will see - namely prompt to sign in.
      appbar = (<div><DefaultAppBar showSignIn={this.showSignIn}></DefaultAppBar>
        <Grid container justify="center">
          <Grid item>
            <Paper className={classes.paper}>
              <SignInWidget visible={this.state.SignInVisible} />
            </Paper>
          </Grid>
        </Grid>
      </div>)
      content = null;
    }
    // Content has to be Loaded Show Loader
    if (!this.state.showContent) {
      return (
        <div>
          <Grid container justify="center">
            <Grid item alignItems={'center'} alignContent={'center'}>
              <div className={classes.paper}><CircularProgress className={classes.progress} /></div>
            </Grid>
          </Grid>
        </div> /* Loading Content */
      );
    }
    // Content has been loaded, show screen
    else {
      return (
        <div className="App">{/* Load Normal Content */}
          {appbar}
          {content}
        </div>
      )
    }
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);
