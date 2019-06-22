import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GroupCard from './GroupCard';
import GroupAdd from './GroupAdd';

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


class GroupList extends Component{
  
  render(){
        let {classes,mode,firebase} = this.props;
        let cards;
        //Choose View or Add
        if (mode == 'view'){
          cards = (
            <div>
              <div className={classes.groupCardSurround}>
                <GroupCard />
              </div>
              <div className={classes.groupCardSurround}>
                <GroupCard />
              </div>
            </div>
            )
        }else if(mode == 'add'){
          cards = (<div>
              <div className={classes.groupCardSurround}>
                <GroupAdd firebase={firebase}/>
              </div>
          </div>)
        }else{
          cards = (<div></div>)
        }
        return(
          <div className={classes.root}>
            <Grid container>
            <Grid item xs={12}>
              {/* <Grid container justify="center">
                <Grid item> */}
                {cards}
                {/* </Grid>
              </Grid> */}
            </Grid> 
          </Grid>
          </div>
        )
    }
}
GroupList.propTypes = {
    classes: PropTypes.object.isRequired,
  }

export default withStyles(styles)(GroupList);