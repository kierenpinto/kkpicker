import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import firebase from 'firebase';
import 'typeface-roboto'
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MainDrawer from './Drawer';
import { Slide } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

const styles = (theme) => ({
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
    avatar: {
        margin: 5,
    },
    toolbar: theme.mixins.toolbar

});

class UserAppBar extends Component {
    constructor(props) {
        super(props);
        var auth = firebase.auth()
        var user = auth.currentUser;
        var name = user.displayName;
        var photoURL = user.photoURL;
        this.state = { anchorEl: null, auth: auth, name: name, Drawer: false, photoURL: photoURL };
        this.SignOut = this.SignOut.bind(this);
        this.setDrawer = this.setDrawer.bind(this);
    }
    showProfileModal = () => { 
        this.props.showProfileModal(true);
        this.menuClose();
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
    setDrawer(open) {
        this.setState({
            Drawer: open,
        })
    }
    render() {
        const { classes } = this.props; // Destructuring assignment
        const anchorEl = this.state.anchorEl;
        const open = Boolean(anchorEl);
        let drawer = this.state.Drawer;
        let setDrawer = (open) => () => {
            this.setDrawer(open)
        };
        let accountIcon = null;
        if (this.state.photoURL) {
            accountIcon = (<Avatar alt={this.state.name} src={this.state.photoURL} className={classes.avatar} />)
        }
        else {
            accountIcon = (<AccountCircle />)
        }
        return (
            <div className={classes.root}>
                <Slide direction="down" in={true}>
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <IconButton onClick={setDrawer(true)} className={classes.menuButton} color="inherit" aria-label="Menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                Secret Santa
                        </Typography>
                            <Typography variant="button" color="inherit">
                                {this.state.name}</Typography>
                            <IconButton
                                aria-owns={open ? "menu-appbar" : null}
                                aria-haspopup="true"
                                onClick={this.menuOpen}
                                color="inherit">
                                {accountIcon}
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                open={open}
                                onClose={this.menuClose}
                            >
                                <MenuItem onClick={this.showProfileModal}>Profile</MenuItem>
                                <MenuItem onClick={this.SignOut}>Sign out</MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>
                </Slide>
                <MainDrawer visible={drawer} setDrawer={this.setDrawer} />
                {/* <div className={classes.toolbar}></div> */}
            </div>
        );
    }
}

UserAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserAppBar);