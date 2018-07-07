import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
    render() {
        const {classes} = this.props;
        return (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="headline" component="h2">
                            Group Name
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            Date
                        </Typography>
                        <Typography component="p">
                        Partner is: Briana
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">View</Button>
                    </CardActions>
                </Card>
        )
    }
}

export default withStyles(styles)(GroupCard)
