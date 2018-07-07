import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GroupCard from './GroupCard';
import { Zoom } from '@material-ui/core';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    groupCardSurround: {
      [theme.breakpoints.up('xs')]:{
        minWidth: theme.spacing.unit*35,
    }, 
    [theme.breakpoints.up('sm')]:{
        maxWidth: theme.spacing.unit*70,
        left: '50%'
    },   
    [theme.breakpoints.up('md')]:{
        maxWidth: theme.spacing.unit*100,
    },
    padding: theme.spacing.unit * 2,
    margin: '25px auto 0px auto',
    },
  });


class GroupView extends Component{

  render(){
        const {classes} = this.props;
        return(
          <div className={classes.root}>
            <Grid container>
            <Grid item xs={12}>
              {/* <Grid container justify="center">
                <Grid item> */}
                <Zoom in={true}>
                  <div className={classes.groupCardSurround}>
                    <GroupCard />
                    </div>
                </Zoom>
                {/* </Grid>
              </Grid> */}
            </Grid> 
          </Grid>
          </div>
        )
    }
}
GroupView.PropTypes = {
    classes: PropTypes.object.isRequired,
  }

export default withStyles(styles)(GroupView);