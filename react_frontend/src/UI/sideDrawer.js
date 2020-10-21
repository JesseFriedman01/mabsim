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

const useStyles = makeStyles((theme) => ({
  root: {
    width: 250,
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
    const classes = useStyles();

    useEffect(() => {
      setShouldBeOpen(props.openSideBar);
    }, [props.openSideBar]);

    const handleClose = () => {
        setShouldBeOpen(false)
        props.setStatus(false)
    }

    const handleGettingStartedClick = () => {
        setGettingStartedOpen(!gettingStartedOpen);
    };

    return (
          <div className={classes.root}>
              <Drawer
                anchor="left"
                open={shouldBeOpen}
                onBackdropClick={handleClose}
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
                    <ListItem button onClick={handleClose} component={Link} to="/create">
                      <ListItemText disableTypography className={classes.mainListItem} primary="Create Sim" />
                     </ListItem>
                    <ListItem button onClick={handleClose} component={Link} to="/load">
                      <ListItemText disableTypography className={classes.mainListItem} primary="Load Sim" />
                     </ListItem>
                  </List>
                </div>
              </Drawer>
          </div>
    );
}
