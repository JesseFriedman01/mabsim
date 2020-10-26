import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import LoadCampaignTable from './loadCampaignTable';
import Divider from '@material-ui/core/Divider';
import {Link} from "react-router-dom"
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height:'100vh',
  },
  text_field: {
    width: '96%',
    marginBottom: theme.spacing(3),
    marginLeft:'2%',
    marginRight:'2%',
    backgroundColor:'#edebeb'
  },
  paper: {
    position: 'absolute',

    backgroundColor: '#ffe6ff',
    boxShadow: theme.shadows[5],
  },
  title_box: {
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    fontFamily: 'Segoe UI',
    fontSize: "1.1rem",
    marginBottom:"20px"
  },
  button_div:{
    padding: theme.spacing(2)
  },
  spinner_div:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2)
  }
}));

export default function LoadCampaign(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [simDescription, setSimDescription] = React.useState(null);
  const [dataForTable, setDataForTable] = React.useState(null);
  const [itemSelectedFromTable, setItemSelectedFromTable] = React.useState(null);
  const [dataFromTableToLoadSim, setDataFromTableToLoadSim] = React.useState(null);

  useEffect(() => {
    props.socket.emit("show_saved_sims")
    props.socket.on('saved_sims', (result) => {
        setDataForTable(result)
    });
     if (dataForTable)
        props.socket.off()
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.setShowLoadWindow(false)
  };

  const loadData = () => {
    props.socket.emit("select_saved_sim", itemSelectedFromTable)
    props.socket.on('data_for_selected_sim', (result) => {
        const numRounds = parseInt(result[0][1])
        props.setNumRounds(numRounds)
        localStorage.setItem('current_round', numRounds - 1);
        props.setAPIData(JSON.parse(result[0][0]))
        props.setTestCells(JSON.parse(result[0][2]))
        props.setCampaignName(result[0][3])
        props.setSimDescription(result[0][4])
    });

    props.setShowLoadWindow(false)

    if (props.setSideDrawerShouldBeOpen)
        props.setSideDrawerShouldBeOpen(false)

    if (dataFromTableToLoadSim)
        props.socket.off()
  }

  return (
   <Modal open={open} onClose={handleClose}>
        <div className={classes.main}>
            <div className={classes.paper}>
                <div className={classes.title_box}>
                    Load Sim
                </div>
                {dataForTable ?
                    <div style={{marginLeft:'10px', marginRight:'10px'}}>
                        <LoadCampaignTable dataForTable={dataForTable} setItemSelectedFromTable={setItemSelectedFromTable}/>
                    </div>
                    :
                    <div className={classes.spinner_div}>
                        <CircularProgress color="primary" />
                    </div>
                }
                <Divider />
                <div className={classes.button_div}>
                    <Button variant="text" onClick={handleClose}>Cancel</Button>
                    <Button color="primary"
                        variant="contained"
                        onClick={loadData}
                        disabled={itemSelectedFromTable ? false : true}
                        component={Link} to="/charts">
                        Load
                    </Button>
                </div>
            </div>
        </div>
   </Modal>
  );
}
