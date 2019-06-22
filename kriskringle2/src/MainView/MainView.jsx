import React, { Component } from "react";
import FAButton from "../Buttons/FAButton"
import { withStyles } from "@material-ui/styles";
import GroupList from "./GroupViews/GroupList";
import Profile from "./Profile"
import { Slide } from '@material-ui/core';
import SignedOut from "./SignedOut";
const styles = (theme) => ({
    content: {
        marginTop: 56,
    }
});
class MainView extends Component {
    constructor(props) {
        super(props)
        this.state = {groupMode:false}
        this.viewGroups = this.viewGroups.bind(this);
        this.addGroup = this.addGroup.bind(this);
    }
    viewGroups(){
        this.props.appObj.changeMainViewMode('ViewGroups')
    }
    addGroup(){
        this.props.appObj.changeMainViewMode('AddGroup')
    }

    render() {
        let { appObj,classes } = this.props;
        let MainViewMode = appObj.state.MainViewMode;
        if (appObj.state.userAuth) {

        if (['ViewGroups','AddGroup'].includes(MainViewMode)) {
            // Show normal groups view or AddGroup
            let modeList = {'ViewGroups':'view','AddGroup':'add'}
            let buttonActionList = {'ViewGroups':this.addGroup,'AddGroup':this.viewGroups}
            let buttonStyleList = {'ViewGroups':'add','AddGroup':'close'}
            return (
                <div className={classes.content}>
                    <GroupList firebase={this.state.firebase} mode={modeList[MainViewMode]} />
                    <Slide direction='left' in={true}>
                        <FAButton type={buttonStyleList[MainViewMode]} action={buttonActionList[MainViewMode]}></FAButton>
                    </Slide>
                </div>
            )
        }
        else if (MainViewMode == 'Profile') {
            //show profile view
            return (
                <div className={classes.content}>
                    <Profile closeProfileModal={this.viewGroups} userDB={appObj.state.userDB} user={appObj.state.userAuth} />
                    <Slide direction='left' in={true}>
                        <FAButton type='close' action={this.viewGroups}/>
                    </Slide>
                </div>
            )
        }
        else {
            return(null)
        }
    }
        else {
            return(<div> <SignedOut></SignedOut> </div>)
        }
    }
}

export default withStyles(styles)(MainView)