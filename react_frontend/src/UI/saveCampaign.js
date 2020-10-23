import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

//import io from 'socket.io-client';
//
//const endPoint = "http://localhost:5000";
//const socket = io.connect(`${endPoint}`);

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
    width: 400,
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
  }
}));

export default function SaveCampaign(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const [simDescription, setSimDescription] = React.useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.setShowSaveWindow(false)
  };

  const handleSave = () => {
    props.socket.emit("save", props.campaignName, simDescription, props.numRounds, props.testCells)
    props.setSideDrawerShouldBeOpen(false)
    props.setShowSaveWindow(false)
    setOpen(false)
  }

  return (
   <Modal open={open} onClose={handleClose}>
        <div className={classes.main}>
            <div className={classes.paper}>
                <div className={classes.title_box}>
                    Save Sim
                </div>
                <div style={{marginLeft:'10px', marginRight:'10px'}}>
                    <TextField
                      inputProps={{readOnly:true}}
                      className={classes.text_field}
                      id="simName"
                      label="Sim Name"
                      value={props.campaignName}
                     />
                     <TextField
                      className={classes.text_field}
                      multiline
                      rows={4}
                      id="description"
                      label="Description (optional)"
                      variant="filled"
                      onChange={event => setSimDescription(event.target.value)}
                     />
                </div>
                <Divider />
                <div className={classes.button_div}>
                    <Button variant="text" onClick={handleClose}>Cancel</Button>
                    <Button color="primary" variant="contained" onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>
   </Modal>
  );
}
