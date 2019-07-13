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
  constructor(props){
    super(props)
    this.state = {
      group_array: []
    }
  }
  render(){
        let {classes,mode,firebase,uid} = this.props;
        let db = firebase.firestore();
        let userdoc = db.collection("users").doc(uid);
        let cards;
        //Choose View or Add
        if (mode === 'view'){
          userdoc.onSnapshot((doc)=>{
            let group_array = doc.data().groups
            this.setState({'group_array':group_array})
          })
          let groupList = this.state.group_array.map((group) =>
            <div className={classes.groupCardSurround}>
            <GroupCard group_data={group}/>
          </div>
          )
          cards = (
            <div>
                {groupList}
            </div>
            )
        }else if(mode === 'add'){
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