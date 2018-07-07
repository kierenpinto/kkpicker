import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit*50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    }
})
function getModalStyle() {
    const top = 0;
    const left = 40;
    return {
        alignSelf: 'center',
        top:'35%',
        left: '39.5%',
        margin: 'auto',
        // top: `${top}%`,
        // left: `${left}%`,
      };    
}

class SimpleModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: props.visible,
        }
    }
    handleClose = () => this.props.showProfileModal(false)
    render() {
        const { classes } = this.props;
    
        return (
          <div>
            <Modal
              aria-labelledby="Profile Pop Up"
              open={this.props.visible}
              onClose={this.handleClose}
            >
              <div style={getModalStyle()} className={classes.paper}>
                <Typography variant="title" id="modal-title">
                  Profile
                </Typography>
                <Typography variant="subheading" id="simple-modal-description">
                  Welcome Kieren Pinto
                </Typography>
                <h1>
                </h1>
              </div>
            </Modal>
          </div>
        );
      }
    }

SimpleModal.propTypes = {
    classes: PropTypes.object.isRequired,
  };
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;