import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Zoom, IconButton, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';


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

class GroupCard extends Component {
    constructor(props) {
        super(props)
        this.submitTitle = this.submitTitle.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.toggleEditTitle = this.toggleEditTitle.bind(this);
        this.state = {
            titleEditVisible: false,
            titleText: this.props.group_data.groupName
        }
    }
    submitTitle(event) {
        let renameGroup = this.props.firebase.functions().httpsCallable('renameGroup')
        let name = this.state.titleText
        //alert("GroupID: " + this.props.group_data.groupid + " name: " + name);
        renameGroup({ groupName: name, groupID: this.props.group_data.groupid }).then( (result) =>{
            //alert('Group Name was changed to ' + name)
            this.setState({titleEditVisible: false})
        })
    }
    toggleEditTitle(event) {
        this.setState({ titleEditVisible: !this.state.titleEditVisible })
    }
    handleEditTitle(event) {
        let newText = event.target.value
        this.setState({ titleText: newText })
    }
    render() {
        const { classes, group_data } = this.props;
        var title
        if (this.state.titleEditVisible) {
            title = (
                <React.Fragment><TextField value={this.state.titleText} onChange={this.handleEditTitle} />
                    <IconButton onClick={this.toggleEditTitle}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton onClick={this.submitTitle}>
                        <SaveIcon/>
                    </IconButton>
                </React.Fragment>
            )
        } else {
            title = (<React.Fragment>{group_data.groupName}<IconButton onClick={this.toggleEditTitle}><EditIcon /></IconButton></React.Fragment> )
        }
        return (
            <Zoom in={true}>
                <div>
                    <Card className={classes.card}>

                        <CardContent>
                            <Typography variant="headline" component="h2">
                                {title}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                Date
                        </Typography>
                            <Typography component="p">
                                You must get a gift for Big Shaq
                        </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">View</Button>
                        </CardActions>
                    </Card>
                </div>
            </Zoom>
        )
    }
}

export default withStyles(styles)(GroupCard)
