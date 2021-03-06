import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import TestCell from '../Testcell'
import ErrorIcon from '@material-ui/icons/Error';
import NewCampaignSummary from './newCampaignSummary';
import Modal from '@material-ui/core/Modal';
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    marginTop:'5%'
  },
  paper: {
    position: 'absolute',
    boxShadow: theme.shadows[5],
    borderRadius: '6px'
  },
  text_field: {
    width: '96%',
    marginBottom: theme.spacing(3),
    marginLeft:'2%',
    marginRight:'2%',
    backgroundColor:'#edebeb'
  },
  title_box: {
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    fontFamily: 'Segoe UI',
    fontSize: "1.1rem",
    borderRadius: '4px 4px 0px 0px'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepper:{
    backgroundColor: '#ffe6ff',
    borderRadius: '6px'
  },
  error:{
    color:'red',
    maxWidth:'70vh',
    marginBottom: theme.spacing(2),
    marginLeft: '2%'
  },
  button_div:{
    padding: theme.spacing(2)
  },
}));

const list = [{
                name: 'test_cell_1',
                open_rate: 10,
                percent_allocation: 50,
                id: 0
              },
              {
                name: 'test_cell_2',
                open_rate: 20,
                percent_allocation: 50,
                id: 1
              }];

function getSteps() {
  return ['Enter sim name',
          'Select number of recipients per round',
          'Select number of rounds',
          'Create test cells',
          'Summary'];
}

export default function NewCampaignStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [campaignName, setCampaignName] = React.useState('');
  const [numRecipients, setNumRecipients] = React.useState('');
  const [numRounds, setNumRounds] = React.useState('');
  const [testCells, setTestCells] = React.useState(list);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [testCellInterval, setTestCellInterval] = React.useState(2)
  const [isAutoAllocate, setIsAutoAllocate] = React.useState(true)
  const [open, setOpen] = React.useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.setShowCreateWindow(false)
  };

  const submitData = () => {
    props.getCampaignName(campaignName)
    props.getNumRecipients(numRecipients)
    props.getNumRounds(numRounds)
    props.getTestCells(testCells)
    props.getStatus('data collected')
    setOpen(false)
    props.setShowCreateWindow(false)
    if (props.setSideDrawerShouldBeOpen)
        props.setSideDrawerShouldBeOpen(false)
  }

  const validateData = () => {
    setErrorMsg(null)
    if (activeStep === 0 && campaignName === ''){
        setErrorMsg(<div className={classes.error}><ErrorIcon style={{verticalAlign: 'bottom'}} /> A sim name is required.</div>)
        return 'error'
    }
    else if (activeStep === 1 && numRecipients === ''){
        setErrorMsg(<div className={classes.error}><ErrorIcon style={{verticalAlign: 'bottom'}} /> Number of recipients is required.</div>)
        return 'error'
    }
    else if (activeStep === 2 && numRounds === '')
    {
        setErrorMsg(<div className={classes.error}><ErrorIcon style={{verticalAlign: 'bottom'}} /> Number of rounds is required.</div>)
        return 'error'
    }
    else if (activeStep === 3)
    {
        if (testCells.length === 0){
            setErrorMsg(<div className={classes.error}><ErrorIcon style={{verticalAlign: 'bottom'}} />You must have at least one test cell</div>)
            return 'error'
        }

        let test_cell_errors = '';
        let row_counter = 1
        for (var key in testCells){
            if (testCells[key]['name'] === "")
                test_cell_errors += 'An ID is required for the test cell in row ' + row_counter + '. '
            if (testCells[key]['open_rate'] === "" || isNaN(testCells[key]['open_rate']))
                test_cell_errors += 'Open rate is required for the test cell in row ' +  row_counter +  '. '
            if (testCells[key]['percent_allocation'] === "" || isNaN(testCells[key]['percent_allocation']))
                test_cell_errors += 'Percentage allocation is required for the test cell in row ' +  row_counter + '. '
            row_counter += 1
        }
        if (test_cell_errors !== ''){
            setErrorMsg(<div className={classes.error}><ErrorIcon style={{verticalAlign: 'bottom'}} />{test_cell_errors}</div>)
            return 'error'
        }
    }

    return 'no errors'
  }

  const handleNext = () => {
    if (validateData() === 'no errors'){
        if (activeStep === steps.length - 1){
            submitData()
            localStorage.setItem('current_round', parseInt(numRounds)-1);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
     }
   }

  const handleBack = () => {
    setErrorMsg(null)
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getTestCellData = (data) => {
    setTestCells(data['test_cells'])
    setTestCellInterval(data['cell_id'])
    setIsAutoAllocate(data['isAutoAllocate'])
  };

  const getStepContent = (step) => {
      switch (step) {
        case 0:
          return <TextField
                  className={classes.text_field}
                  id="campaignName"
                  label="Sim Name"
                  variant="filled"
                  value={campaignName}
                  onChange={event => setCampaignName(event.target.value)}/>
        case 1:
          return <TextField
                  className={classes.text_field}
                  type="number"
                  id="numRecipients"
                  label="Num Recipients"
                  variant="filled"
                  value={numRecipients}
                  onChange={event => setNumRecipients(event.target.value)}/>
        case 2:
          return <TextField
                  className={classes.text_field}
                  type="number"
                  id="numRounds"
                  label="Num Rounds"
                  variant="filled"
                  value={numRounds}
                  onChange={event => setNumRounds(event.target.value)}/>
        case 3:
          return <TestCell
                  display_type='create'
                  getData={getTestCellData}
                  testCells={testCells}
                  cell_id={testCellInterval}
                  auto_allocation={isAutoAllocate}
                  auto_update="true"
                  />
        case 4:
            return <NewCampaignSummary
                    testCells={testCells}
                    campaignName={campaignName}
                    numRecipients={numRecipients}
                    numRounds={numRounds}/>
        }
  }

  const test=(event)=>{

    console.log(event.key)
  }

  return (
        <Modal open={open} onClose={handleClose} id='modal' onKeyUp={ (event ) => {if (event.key === 'Enter') handleNext()} }>
            <Grid className={classes.main} >
                <div className={classes.paper}>
                  <Grid item className={classes.stepper}>
                    <div className={classes.title_box}>
                        Create Sim
                    </div>
                    <div className={classes.root}>
                      <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label, index) => {
                          const stepProps = {};
                          const labelProps = {};
                          return (
                            <Step key={label} {...stepProps}>
                              <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>
                      <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                      {errorMsg}
                      <Divider />
                      <div className={classes.button_div}>
                          <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                      </div>
                    </div>
                  </Grid>
                </div>
             </Grid>
         </Modal>
  );
}
