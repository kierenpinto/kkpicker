import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import { Typography, Grid, Button, Card, CardContent, CardActions, Zoom } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
    surrounds: {
        [theme.breakpoints.up('xs')]: {
            minWidth: theme.spacing.unit * 35,
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: theme.spacing.unit * 70,
            left: '50%'
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: theme.spacing.unit * 100,
        },
        padding: theme.spacing.unit * 2,
        margin: '25px auto',
    },
    card: {
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing.unit,
    },

})

class Profile extends Component {
    handleClose = () => this.props.closeProfileModal()
    render() {
        const { classes } = this.props;
        var userDB=this.props.userDB;
        let name = userDB.name;
        let email = userDB.email;
        return (
            <Grid container justify="center">
                <Grid item xs={12} justify="center">
                    <div className={classes.surrounds}>
                        <Zoom in={true}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography component="h2" variant="title" id="modal-title">
                                        Profile</Typography>
                                    <Typography variant="subheading" id="simple-modal-description">
                                        Edit your profile</Typography>
                                    <Grid container justify='space-around'>
                                        <Grid item>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="name-simple">Display Name</InputLabel>
                                                <Input id="name-simple" value={name}/>
                                            </FormControl></Grid><Grid item>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="name-simple">Email</InputLabel>
                                                <Input id="name-simple" value={email}/>
                                            </FormControl>
                                        </Grid></Grid>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={this.handleClose}>Close</Button>
                                    <Button>Save</Button>
                                </CardActions>
                            </Card>
                        </Zoom>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);