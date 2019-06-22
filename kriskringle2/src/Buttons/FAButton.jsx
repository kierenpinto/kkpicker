import React, { Component } from "react";
import { Fab } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from "@material-ui/core/styles";
const styles = (theme) => ({
    fab: {
        margin: theme.spacing.unit,
        position: 'fixed',
        bottom: theme.spacing.unit * 6,
        right: theme.spacing.unit * 6,
    }
});
class FAButton extends Component {
    constructor(props){
        super(props);
        this.buttonActionHandler = this.buttonActionHandler.bind(this)
    }
    buttonActionHandler(){
        this.props.action()
    }
    render(){
        let {type, classes} = this.props;
        let fabIcon = (<div></div>);
        if (type == 'add') {
          fabIcon = (<AddIcon />)
        }
        else if (type == 'close' ||type == 'close') {
          fabIcon = (<CloseIcon />)
        }
        return(
            <Fab color="primary" aria-label={type} className={classes.fab} onClick={this.buttonActionHandler}>
            {fabIcon}
            </Fab> 
        )

    }
}

export default withStyles(styles)(FAButton)