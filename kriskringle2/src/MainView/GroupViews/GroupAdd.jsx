import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Zoom } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    card: {
        color: theme.palette.text.secondary,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

class GroupAdd extends Component {
    constructor(props) {
        super(props);
        this.state = { groupName: "" };
        this.state.firebase = this.props.firebase;
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleAddGroup = this.handleAddGroup.bind(this);
    }
    handleChangeName(event) {
        this.setState({ groupName: event.target.value });
    }
    handleAddGroup(event) {
        let name = String(this.state.groupName);
        if (name.length > 0) {
            alert('Group was sent')
            let addMessage = this.state.firebase.functions().httpsCallable('createGroup');
            addMessage({ groupName: name }).then(function (result) {
                alert('Group was added')
            })
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Zoom in={true}>
                <div>
                    <Card className={classes.card}>
                        <form>
                            <CardContent>
                                <Typography variant="headline" component="h2">
                                    Add a new group
                                </Typography>
                                <TextField
                                    id="outlined-name"
                                    label="Name"
                                    className={classes.textField}
                                    value={this.state.value}
                                    onChange={this.handleChangeName}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={this.handleAddGroup}>Save</Button>
                            </CardActions>
                        </form>
                    </Card>
                </div>
            </Zoom>
        )
    }
}

export default withStyles(styles)(GroupAdd)
