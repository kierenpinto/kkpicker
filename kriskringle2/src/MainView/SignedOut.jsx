
import React, { Component } from "react";
import SignIn from "./SignIn"
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

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
class SignedOut extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {classes} = this.props
        return (
        <Grid container justify="center">
            <Grid item>
                <Paper className={classes.paper}>
                    <div><p>Welcome to Secret Santa! Sign in required.</p></div>
                    <SignIn visible={true} />
                </Paper>
            </Grid>
        </Grid>)

    }
}
SignedOut.propTypes = {
    classes: PropTypes.object.isRequired
  }
  
export default withStyles(styles)(SignedOut);