import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Zoom, IconButton, TextField, Grid, CardHeader, Avatar, Dialog, DialogContent } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import MoreVertIcon from "@material-ui/icons/MoreVert"
import MuiDialogTitle from '@material-ui/core/DialogTitle';

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
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
});

class GroupCard extends Component {
    constructor(props) {
        super(props)
        this.submitTitle = this.submitTitle.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.state = {
            editVisible: false,
            titleText: this.props.group_data.groupName
        }
    }
    submitTitle(event) {
        let renameGroup = this.props.firebase.functions().httpsCallable('renameGroup')
        let name = this.state.titleText
        //alert("GroupID: " + this.props.group_data.groupid + " name: " + name);
        renameGroup({ groupName: name, groupID: this.props.group_data.groupid }).then((result) => {
            //alert('Group Name was changed to ' + name)
            this.setState({ editVisible: false })
        })
    }
    toggleEdit(event) {
        this.setState({ editVisible: !this.state.editVisible })
    }
    handleEditTitle(event) {
        let newText = event.target.value
        this.setState({ titleText: newText })
    }
    render() {
        const { classes, group_data } = this.props;
        return (
            <Zoom in={true}>
                <div>
                    <Card className={classes.card}>

                        <Dialog open={this.state.editVisible} onClose={this.toggleEdit}>
                            <MuiDialogTitle disableTypography>
                                <Typography variant="h6">
                                    Rename Group
                                </Typography>
                                <IconButton onClick={this.toggleEdit} className={classes.closeButton}>
                                        <CloseIcon />
                                </IconButton>
                            </MuiDialogTitle>
                            <DialogContent>
                                <TextField fontSize='large' value={this.state.titleText} onChange={this.handleEditTitle} />
                                    <IconButton onClick={this.submitTitle}>
                                        <SaveIcon />
                                    </IconButton>
                            </DialogContent>
                        </Dialog>

                        <CardHeader
                            avatar={
                                <Avatar aria-label="Recipe" /* className={classes.avatar} */>
                                    {group_data.groupName[0]}
                                </Avatar>
                            }
                            action={
                                <React.Fragment>
                                    <IconButton onClick={this.toggleEdit}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton aria-label="Settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                </React.Fragment>
                            }
                            title={group_data.groupName}
                            subheader="September 14, 2016"
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                            </Grid>
                            <Typography className={classes.pos} color="textSecondary">
                                You must get a gift for Big Shaq
                            </Typography>
                        </CardContent>

                        <CardActions>
                            <Button size="small">Extend</Button>
                        </CardActions>
                    </Card>
                </div>
            </Zoom>
        )
    }
}

export default withStyles(styles)(GroupCard)
