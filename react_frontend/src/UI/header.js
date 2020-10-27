import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom"
import Box from '@material-ui/core/Box';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import SideDrawer from './sideDrawer'
import logo from '../MABlogoBasic_white.png'
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header(props) {

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSideDrawer, setOpenSideDrawer] = React.useState(false);
  const [disableTestCellButton, setDisableTestCellButton] = React.useState(props.disableTestCellButton)
  const [campaignName, setCampaignName] = React.useState(props.campaignName)
  const open = Boolean(anchorEl);

//  const [drawerOpened, setDrawerOpened] = React.useState(false)

  useEffect(() => {
      setDisableTestCellButton(props.disableTestCellButton);
  }, [props.disableTestCellButton]);

  useEffect(() => {
      setCampaignName(props.campaignName);
  }, [props.campaignName]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenSideDrawer(true)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const toggleDrawer = () => () => {
    props.getTestCellDrawerClicked(true)
  };

  const getSideDrawerStatus = (status) => {
    setOpenSideDrawer(status)
  }

  return (
    <div className={classes.root}>
      <Box pb={3}>
      <AppBar position="static">
        <Toolbar>
            <IconButton
                edge="start"
                className={classes.menuButton}
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>
            {window.location.pathname !== '/' ?
                <IconButton
                    edge="start"
                    color="inherit"
                    component={Link} to="/"
                >
                    <HomeIcon />
                </IconButton>: null
            }
            <Typography className={classes.title} />

        </Toolbar>
      </AppBar>
      </Box>
      <SideDrawer
        openSideDrawer={openSideDrawer}
        setOpenSideDrawer={setOpenSideDrawer}
        setSideDrawerStatus={getSideDrawerStatus}
        getTestCellButtonVisible={props.getTestCellButtonVisible}
        endPoint={props.endPoint}
        socket={props.socket}
        setAPIData={props.setAPIData}
        numRounds={props.numRounds}
        setNumRounds={props.setNumRounds}
        campaignName={props.campaignName}
        setCampaignName={props.setCampaignName}
        testCells={props.testCells}
        setTestCells={props.setTestCells}
        getTestCellDrawerClicked = {props.getTestCellDrawerClicked}
        simDescription={props.simDescription}
        setSimDescription={props.setSimDescription}
        setSimStatus={props.setStatus}
        setNumRecipients={props.setNumRecipients}
      />
    </div>
  );
}