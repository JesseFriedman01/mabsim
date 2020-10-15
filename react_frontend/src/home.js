import React, { useEffect } from 'react';
import logo from './MABlogoBasic.png'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {Link} from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  img: {
      paddingTop:'50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
  },
  title: {
    fontSize:'50px',
    fontFamily: "Palatino Linotype"
  },
  button_group:{
      marginTop:'30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  }
}));


export default function Home(props) {
    const classes = useStyles();

    return(
        <div>
            <div className={classes.img}>
                <img src={logo} width="20%" alt="Logo" />
            </div>
            <div className={classes.button_group}>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                    <Button style={{minWidth: '180px'}} component={Link} to="/">Getting started</Button>
                    <Button component={Link} to="/create">Create a sim</Button>
                    <Button component={Link} to="/load">Load a sim</Button>
                </ButtonGroup>
            </div>
        </div>

    )

}