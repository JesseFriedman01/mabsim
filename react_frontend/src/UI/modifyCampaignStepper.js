import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import TestCell from '../Testcell'
import ErrorIcon from '@material-ui/icons/Error';
import ModifyCampaignSummary from './modifyCampaignSummary';
import Modal from '@material-ui/core/Modal';
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
    marginRight: theme.spacing(1),
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
  return ['Choose round to modify open rates',
          "Modify test cells' open rates",
          'Summary'];
}

export default function ModifyCampaignStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [roundChoice, setRoundChoice] = React.useState(localStorage.getItem('current_round'));
  const [status, setStatus] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [testCellsOriginal, setTestCellsOriginal] = React.useState(props.testCells)
  const [testCellsFromDrawer, setTestCellsFromDrawer] = React.useState(0)
  const [validationErrorMsg, setValidationErrorMsg] = React.useState('')
  const [apiData, setApiData] = React.useState(props.apiData)
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    setApiData(props.apiData);
  }, [props.apiData]);

   const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.setShowModifyWindow(false)
  };

  const isStepOptional = (step) => {
    return null;
  };

  const getTestCellDataFromDrawer = (data) => {
    setTestCellsFromDrawer(data)
  }

  const checkTestCellsAreEmpty = () => {
        for (var key in testCellsFromDrawer){
            if (Number.isNaN(testCellsFromDrawer[key]['open_rate']))
                return true
        }
        return false
   }

  const checkTestCellsHaveNotChanged = () => {
        for (var key in testCellsFromDrawer){
            if (testCellsFromDrawer[key]['open_rate'] !== testCellsOriginal[key]['open_rate'])
                return false
        }
        return true
   }

  const validateData = () => {
    setErrorMsg(null)
    if (activeStep === 0 && roundChoice === ''){
        setErrorMsg(<div className={classes.error}><ErrorIcon style={{verticalAlign: 'bottom'}} /> A round must be chosen.</div>)
        return 'error'
    }
    else if (activeStep === 1){
        if (checkTestCellsHaveNotChanged()){
            setErrorMsg(<div className={classes.error}><ErrorIcon style={{verticalAlign: 'bottom'}} /> You did not change any open rates. </div>)
            return 'error'
        } else if (checkTestCellsAreEmpty()){
            setErrorMsg(<div className={classes.error}><ErrorIcon style={{verticalAlign: 'bottom'}} /> Open rates cannot be empty. </div>)
            return 'error'
        }
    }

    return 'no errors'
  }

  const submitData = () => {
      setOpen(false)
      props.setShowModifyWindow(false)
      props.setSideDrawerShouldBeOpen(false)
      setTestCellsFromDrawer(testCellsFromDrawer)
      setTestCellsOriginal(testCellsFromDrawer)
      props.setTestCells(testCellsFromDrawer)
      props.setStatus('modify test cells')
  }

  const handleNext = () => {
    if (validateData() === 'no errors'){
        if (activeStep === steps.length - 1){
            submitData()
            localStorage.setItem('current_round', parseInt(roundChoice));
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
     }
   }

  const handleBack = () => {
    setErrorMsg(null)
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (step) => {
      switch (step) {
        case 0:
          return <TextField
                  className={classes.text_field}
                  id="Choose round"
                  label="Round number"
                  variant="filled"
                  defaultValue={roundChoice}
                  onChange={event => setRoundChoice(event.target.value)}/>
        case 1:
            return <TestCell
                    display_type='modify'
                    testCells={testCellsOriginal}
                    api_data={apiData}
                    auto_update={false}
                    getTestCellDataFromDrawer={getTestCellDataFromDrawer}/>
        case 2:
            return <ModifyCampaignSummary
                    testCells={testCellsFromDrawer}
                    roundChoice={roundChoice}/>
        }
  }

  return (
  <Modal open={open} onClose={handleClose} id='modal'>
    <Grid className={classes.main}>
    <div className={classes.paper}>
      <Grid item className={classes.stepper}>
        <div className={classes.title_box}>
            Modify Open Rates
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
