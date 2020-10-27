import React, { useEffect } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Drawer from "@material-ui/core/Drawer";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import LaunchIcon from '@material-ui/icons/Launch';
import HistoryIcon from '@material-ui/icons/History';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom"
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import SaveCampaign from './saveCampaign';
import LoadCampaign from './loadCampaign';
import NewCampaignStepper from './newCampaignStepper'
import ModifyCampaign from './modifyCampaign';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 250,
  },
  saveWindow: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  mainListItem: {
    fontWeight: '550',
    fontFamily: 'Arial',
    fontSize: '16px'

  },
  nestedListItem: {
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(5),
    fontFamily: 'Arial',
    fontSize: '16px'
  },
}));

export default function SideDrawer(props) {
    const [shouldBeOpen, setShouldBeOpen] = React.useState(props.openSideBar)
    const [gettingStartedOpen, setGettingStartedOpen] = React.useState(false)
    const [simOptionsOpen, setSimOptionsOpen] = React.useState(false)
    const [showCreateWindow, setShowCreateWindow] = React.useState(false)
    const [showSaveWindow, setShowSaveWindow] = React.useState(false)
    const [showLoadWindow, setShowLoadWindow] = React.useState(false)
    const [showModifyWindow, setShowModifyWindow] = React.useState(false)

    const classes = useStyles();

    useEffect(() => {
      setShouldBeOpen(props.openSideDrawer);
    }, [props.openSideDrawer]);

    const handleCloseClickAway = () => {
        setShouldBeOpen(false)
        props.setSideDrawerStatus(false)
    }

    const handleMenuClick = () => {
        setShouldBeOpen(false)
        props.setSideDrawerStatus(false)
        props.setDisableTestCellButton(true)
        props.getTestCellButtonVisible(true)
    }

    const handleGettingStartedClick = () => {
        setGettingStartedOpen(!gettingStartedOpen);
    };

    const handleSimOptionsClick = () => {
        setSimOptionsOpen(!simOptionsOpen);
    };

    const handleSaveClick = () => {
        setShowSaveWindow(true)
    };

    const handleLoadClick = () => {
        setShowLoadWindow(true)
    };

    const handleCreateClick = () => {
        props.setSimDescription(null)
        setShowCreateWindow(true)
    }

    const handleModifyClick = () => {
        setShowModifyWindow(true)
    }

    const toggleDrawer = () => () => {
        props.getTestCellDrawerClicked(true)
        setShouldBeOpen(false)
        props.setOpenSideDrawer(false)
    };

    return (
        <>
         {showCreateWindow===true ? <NewCampaignStepper
                                     setShowCreateWindow={setShowCreateWindow}
                                     getCampaignName={props.setCampaignName}
                                     getNumRecipients={props.setNumRecipients}
                                     getNumRounds={props.setNumRounds}
                                     getTestCells={props.setTestCells}
                                     getStatus={props.setSimStatus}
                                     setSideDrawerShouldBeOpen={props.setOpenSideDrawer}
                                    />
                                  : null
         }
         {showSaveWindow===true ? <SaveCampaign
                                   setCampaignName={props.setCampaignName}
                                   setShowSaveWindow={setShowSaveWindow}
                                   setSideDrawerShouldBeOpen={props.setOpenSideDrawer}
                                   endPoint={props.endPoint}
                                   socket={props.socket}
                                   numRounds={props.numRounds}
                                   campaignName={props.campaignName}
                                   testCells={props.testCells}
                                   simDescription={props.simDescription}
                                  />
                                  : null
         }
         {showLoadWindow===true ? <LoadCampaign
                                   setCampaignName={props.setCampaignName}
                                   setShowLoadWindow={setShowLoadWindow}
                                   setSideDrawerShouldBeOpen={props.setOpenSideDrawer}
                                   endPoint={props.endPoint}
                                   socket={props.socket}
                                   setAPIData={props.setAPIData}
                                   setNumRounds={props.setNumRounds}
                                   setTestCells={props.setTestCells}
                                   setSimDescription={props.setSimDescription}
                                   />
                                  : null
         }
          {showModifyWindow===true ? <ModifyCampaign
                                       setShowModifyWindow={setShowModifyWindow}
                                       setSideDrawerShouldBeOpen={props.setOpenSideDrawer}
                                       testCells={props.testCells}
                                       getTestCells={props.setTestCells}
                                       getStatus={props.setSimStatus}
                                       api_data={props.APIData}
                                       />
                                       : null

         }
         <div className={classes.root}>
              <Drawer
                anchor="left"
                open={shouldBeOpen}
                onBackdropClick={handleCloseClickAway}
              >
                <div className={classes.root}>
                 <List component="nav">
                    <ListItem button onClick={handleGettingStartedClick}>
                      <ListItemText disableTypography className={classes.mainListItem} primary="Getting Started"/>
                       {gettingStartedOpen ? <ExpandLess /> : <ExpandMore />}
                     </ListItem>
                     <Collapse in={gettingStartedOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItem button className={classes.nestedListItem}>
                            <ListItemText disableTypography primary="Usage" />
                          </ListItem>
                          <ListItem button className={classes.nestedListItem}>
                            <ListItemText disableTypography primary="Learn" />
                          </ListItem>
                          <ListItem button className={classes.nestedListItem}>
                            <ListItemText disableTypography primary="Support" />
                          </ListItem>
                        </List>
                     </Collapse>
                  </List>

                  <Divider />

                  <List component="nav">
                      <ListItem button onClick={handleSimOptionsClick}>
                          <ListItemText disableTypography className={classes.mainListItem} primary="Simulation"/>
                           {simOptionsOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={simOptionsOpen} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            <ListItem button onClick={handleCreateClick} className={classes.nestedListItem}>
                              <ListItemText disableTypography primary="New" />
                            </ListItem>
                            <ListItem button onClick={handleLoadClick} className={classes.nestedListItem}>
                              <ListItemText disableTypography primary="Load" />
                            </ListItem>
                            <ListItem button disabled={window.location.pathname === '/charts' ? false : true} onClick={handleModifyClick} className={classes.nestedListItem}>
                              <ListItemText disableTypography primary="Modify" />
                            </ListItem>
                            <ListItem button disabled={window.location.pathname === '/charts' ? false : true} onClick={handleSaveClick} className={classes.nestedListItem}>
                              <ListItemText disableTypography primary="Save" />
                            </ListItem>
                          </List>
                      </Collapse>
                  </List>

                </div>

              </Drawer>

          </div>
          </>
    );
}
