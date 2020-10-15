import React, { useEffect } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Drawer from "@material-ui/core/Drawer";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LaunchIcon from '@material-ui/icons/Launch';
import HistoryIcon from '@material-ui/icons/History';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom"
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 250,
  },
}));


export default function SideDrawer(props) {
    const [shouldBeOpen, setShouldBeOpen] = React.useState(props.openSideBar)
    const classes = useStyles();

    useEffect(() => {
      setShouldBeOpen(props.openSideBar);
    }, [props.openSideBar]);

    const handleClose = () => {
        setShouldBeOpen(false)
        props.setStatus(false)
    }

    return (
          <div className={classes.root}>
              <Drawer
                anchor="left"
                open={shouldBeOpen}
                onBackdropClick={handleClose}
              >
                <div className={classes.root}>
                 <List component="nav">
                    <ListItem button onClick={handleClose} component={Link} to="/">
                      <ListItemIcon>
                        <HelpOutlineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Getting Started" />
                     </ListItem>
                  </List>
                  <Divider />
                  <List component="nav">
                    <ListItem button onClick={handleClose} component={Link} to="/create">
                      <ListItemIcon>
                        <LaunchIcon />
                      </ListItemIcon>
                      <ListItemText primary="Create New Sim" />
                     </ListItem>
                  </List>
                  <List component="nav">
                    <ListItem button onClick={handleClose} component={Link} to="/load">
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      <ListItemText primary="Load Existing Sim" />
                     </ListItem>
                  </List>
                </div>
              </Drawer>
          </div>
    );
}
