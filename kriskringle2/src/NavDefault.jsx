import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import 'typeface-roboto'

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

function DefaultAppBar(props) {
    const { classes } = props;
    function showSignIn(){
        props.showSignIn();
    }
    return (
        <div className={classes.root}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.flex}>
                        <Typography variant="title" color="inherit">
                            Secret Santa
                        </Typography>
                    </div>
                    <Button color="inherit" onClick ={showSignIn}>
                    <Typography variant="button" color="inherit">
                    Sign in</Typography></Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

DefaultAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DefaultAppBar);