import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import firebase from 'firebase';
import 'typeface-roboto'
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

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

class UserAppBar extends Component {
    constructor(props) {
        super(props);
        var auth = firebase.auth()
        var user = auth.currentUser;
        var name = user.displayName;
        this.state = { anchorEl: null, auth: auth, name: name};
        this.SignOut = this.SignOut.bind(this);
    }
    menuClose = () => {
        this.setState({ anchorEl: null })
    }
    SignOut(e) {
        this.state.auth.signOut();
        this.menuClose()
    }
    
    menuOpen = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    }
    render() {
        const { classes } = this.props; // Destructuring assignment
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
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
                            <Typography variant="button" color="inherit">
                                {this.state.name}</Typography>
                        <IconButton
                            aria-owns={open ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            onClick={this.menuOpen}
                            color="inherit">
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEL={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={this.menuClose}
                        >
                            <MenuItem onClick={this.menuClose}>Profile</MenuItem>
                            <MenuItem onClick={this.SignOut}>Sign out</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

UserAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserAppBar);