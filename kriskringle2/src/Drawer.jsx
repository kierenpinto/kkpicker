import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SubjectIcon from'@material-ui/icons/Subject';


const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};
const mailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SubjectIcon />
      </ListItemIcon>
      <ListItemText primary="Current" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SubjectIcon />
      </ListItemIcon>
      <ListItemText primary="Archived" />
    </ListItem>
  </div>
);

class MainDrawer extends React.Component {
  setDrawer = (open) => () =>{
    this.props.setDrawer(open)
  }
  render() {
    const { classes } = this.props;
    var visible = this.props.visible;
    const sideList = (
      <div className={classes.list}>
        <List>{mailFolderListItems}</List>
      </div>
    );

    return (
      <div>
        <Drawer open={visible} onClose={this.setDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.setDrawer(false)}
            onKeyDown={this.setDrawer( false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

MainDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainDrawer);