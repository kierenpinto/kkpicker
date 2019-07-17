import React, { Component } from 'react';
import './App.css';

import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { UserDB } from './Interface';

import MainView from './MainView/MainView';
import AppBar from './Navigation/AppBar';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: 25,
    maxWidth: 400,
    minWidth: 350
  },
  progress: {
    margin: theme.spacing(2),
  },
  group_card: {
    margin: 25,
    maxWidth: 400
  },
  fab: {
    margin: theme.spacing(),
    position: 'fixed',
    bottom: theme.spacing(6),
    right: theme.spacing(6),
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
      MainViewMode: 'ViewGroups',
    }
    firebase.auth().onAuthStateChanged(
      (user) => this.changeAuthState(user))
    this.changeAuthState = this.changeAuthState.bind(this);
    this.addGroupHandler = this.addGroupHandler.bind(this);
    this.changeMainViewMode = this.changeMainViewMode.bind(this)
  }
  changeAuthState(user) {
    this.setState({ userAuth: user, showContent: true });
    if (!!user) { this.setState({ SignInVisible: false }) }
  }
  addGroupHandler() {
    this.setState({ groupMode: 'add' })
  }
  changeMainViewMode(mode){
    this.setState({MainViewMode:mode})
  }
  render() {
    const { classes } = this.props;
    // Content has to be Loaded Show Loader
    if (!this.state.showContent) {
      return (
        <div>
          <Grid container justify="center" alignContent='center' alignItems={'center'}>
            <Grid item>
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
          <AppBar appObj = {this}/>
          <MainView appObj = {this}/>
        </div>
      )
    }
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);
