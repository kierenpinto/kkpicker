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
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: 25,
  },
  progress:{
    margin: theme.spacing.unit * 2,
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    let firebaseAuth = firebase.auth();
    this.state = { db: this.props.firebase.firestore(), userAuth: false, SignInVisible: false, showContent: false }
    firebase.auth().onAuthStateChanged(
      (user) => this.changeAuthState(user))
    this.showSignIn = this.showSignIn.bind(this);
    this.changeAuthState = this.changeAuthState.bind(this);

  }

  changeAuthState(user) {
    this.setState({ userAuth: user, showContent: true });
    if (!!user) { this.setState({ SignInVisible: false }) }
  }
  showSignIn() {
    this.setState({ SignInVisible: true });
  }
  render() {
    let docRef = this.state.db.collection('users').doc('state');
    const {classes} = this.props;
    let appbar;
    if (this.state.userAuth) {
      appbar=(<div>
      <UserAppBar user={this.state.userAuth}></UserAppBar>
      <div className={classes.root}>
      <Grid container>
        <Grid item xs>
          <Paper className={classes.paper}>Yayy Signed In!</Paper>
        </Grid>
      </Grid>
      </div>
      </div>
      )
    }
    else {
      appbar = (<div><DefaultAppBar showSignIn={this.showSignIn}></DefaultAppBar>
        <Grid container>
          <Grid item xs>
            <Paper className={classes.paper}>
            <SignInWidget visible={this.state.SignInVisible}/>
            </Paper>
          </Grid>
        </Grid>
      </div>)
    }
    if (!this.state.showContent) {
      return (
        <div>
        <Grid container>
          <Grid item xs alignItems={'center'} alignContent={'center'}>
          <div className={classes.paper}><CircularProgress className={classes.progress} /></div>
          </Grid>
        </Grid>
         </div> /* Loading Content */
      );
    } else {
      return (
        <div className="App">{/* Load Normal Content */}
          {appbar}
        </div>
      )
    }

  }
}

App.PropTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(App);
