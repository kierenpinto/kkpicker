import React, { Component } from 'react';
import './App.css';
import DefaultAppBar from './NavDefault.jsx'
import UserAppBar from './NavUser.jsx'
import * as firebase from 'firebase';
import SignInWidget from './SignIn.jsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import GroupView from './GroupView';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { GroupsDB, UserDB } from './Interface';
import Profile from './Profile';
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
      SignInVisible: false,
      showContent: false,
      profileanchorEl: null,
      userProfile: new UserDB(props.firebase),
      profileModalVisible: false,
    }
    firebase.auth().onAuthStateChanged(
      (user) => this.changeAuthState(user))
    this.showSignIn = this.showSignIn.bind(this);
    this.changeAuthState = this.changeAuthState.bind(this);
    this.showProfileModal = this.showProfileModal.bind(this);
  }
  changeAuthState(user) {
    this.setState({ userAuth: user, showContent: true });
    if (!!user) { this.setState({ SignInVisible: false }) }
  }
  showSignIn() {
    this.setState({ SignInVisible: true });
  }
  showProfileModal(bool) {
    this.setState({ profileModalVisible: bool })
  }
  render() {
    const { classes } = this.props;
    // const { profileanchorEl } = this.state;
    // const open = Boolean(profileanchorEl);
    //Placeholders
    let appbar = null;
    let content = null;
    let view = null;
    if (this.state.userAuth) { // Signed In State
      appbar = (
        <UserAppBar user={this.state.userAuth} firebase={this.state.firebase} showProfileModal={this.showProfileModal}></UserAppBar>
      )
      if (this.state.profileModalVisible) {
        view = (<Profile showProfileModal={this.showProfileModal} user={this.state.userAuth} />)
      }
      else {
        view = (<GroupView firebase={this.state.firebase} />)
      }
      content = (
        <div className={classes.content}>
          {view}
          <Slide direction='left' in={true}>
            <Button variant="fab" color="primary" aria-label="add" className={classes.fab}>
              <AddIcon />
            </Button>
          </Slide>
        </div>
      )
    }
    else { // Not Signed In State
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
App.PropTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(App);
