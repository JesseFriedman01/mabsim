import React from 'react';
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
import Button from '@material-ui/core/Button';
import SideDrawer from './sideDrawer'

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
  const [openSideBar, setOpenSideBar] = React.useState(false);
  const open = Boolean(anchorEl);

//  const [drawerOpened, setDrawerOpened] = React.useState(false)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenSideBar(true)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

//  const handleMenuClick = () => {
//    setAnchorEl(null);
//    props.getStatus(null);
//
//  };

  const toggleDrawer = () => () => {
    props.getTestCellDrawerClicked(true)
  };

  const getSideDrawerStatus = (status) => {
    setOpenSideBar(status)
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
            <Typography className={classes.title} />
            <Button variant="contained"
                    disabled={props.disableTestCellButton}
                    onClick={toggleDrawer()}
            >
              Modify Open Rates
            </Button>

        </Toolbar>
      </AppBar>
      </Box>
      <SideDrawer openSideBar={openSideBar} setStatus={getSideDrawerStatus} />
    </div>
  );
}