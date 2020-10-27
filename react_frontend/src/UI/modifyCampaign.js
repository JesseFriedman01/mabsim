import React, { useEffect } from 'react';
import Drawer from "@material-ui/core/Drawer";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import ModifyCampaignStepper from './modifyCampaignStepper'
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    marginTop:'5%'
  },
  paper: {
    position: 'absolute',
    backgroundColor: '#ffe6ff',
    boxShadow: theme.shadows[5],
    borderRadius: '6px'
  },
  title_box: {
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    fontFamily: 'Segoe UI',
    fontSize: "1.1rem",
    marginBottom:"20px",
    borderRadius: '4px 4px 0px 0px'
  },
  submitButtonStyle: {
        backgroundColor: '#039112',
        color: 'white',
        marginTop:'10px',
        marginRight:'5px'
  },
  cancelButtonStyle: {
        backgroundColor: '#ff001e',
        color: 'white',
        marginTop:'10px',
//        float:"right"
  }
}));

//const test_list = [{
//            name: 'test_cell_1',
//            open_rate: 10,
//            percent_allocation: 50,
//            id: 0
//          },
//          {
//            name: 'test_cell_2',
//            open_rate: 20,
//            percent_allocation: 50,
//            id: 1
//          },
//         ];

export default function ModifyCampaign(props) {
//    const [testCellsOriginal, setTestCellsOriginal] = React.useState(test_list)

    const [testCellsOriginal, setTestCellsOriginal] = React.useState(props.testCells)
    const [testCellsFromDrawer, setTestCellsFromDrawer] = React.useState(0)
    const [validationErrorMsg, setValidationErrorMsg] = React.useState('')
    const [apiData, setApiData] = React.useState(props.api_data)
    const [open, setOpen] = React.useState(true);

    useEffect(() => {
      setTestCellsOriginal(props.testCells);
    }, [props.testCells]);

    useEffect(() => {
      setApiData(props.api_data);
    }, [props.api_data]);

    const getTestCellDataFromDrawer = (data) => {
        setTestCellsFromDrawer(data)
    }

    const classes = useStyles();

    return (
            <ModifyCampaignStepper
                testCells={testCellsOriginal}
                apiData={apiData}
                setTestCells={props.getTestCells}
                setStatus={props.getStatus}
                setShowModifyWindow={props.setShowModifyWindow}
                setSideDrawerShouldBeOpen={props.setSideDrawerShouldBeOpen}
            />

        );
}