import React, { useEffect } from 'react';
import Drawer from "@material-ui/core/Drawer";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import TestCellDrawerStepper from './TestCellDrawerStepper'
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    paper: {
        background: "#bdbbbb",
        maxHeight: "90%",
        minHeight: "50%",
        elevation:3,
        borderStyle: 'solid',
        borderTopWidth:1,
        borderBottomWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderColor: '#404040'

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

export default function TestCellDrawer(props) {
//    const [testCellsOriginal, setTestCellsOriginal] = React.useState(test_list)

    const [testCellsOriginal, setTestCellsOriginal] = React.useState(props.testCells)
    const [testCellsFromDrawer, setTestCellsFromDrawer] = React.useState(0)
    const [validationErrorMsg, setValidationErrorMsg] = React.useState('')
    const [apiData, setApiData] = React.useState(props.api_data)

    useEffect(() => {
      setTestCellsOriginal(props.testCells);
    }, [props.testCells]);

    useEffect(() => {
      setApiData(props.api_data);
    }, [props.api_data]);

    const getTestCellDataFromDrawer = (data) => {
        setTestCellsFromDrawer(data)
    }

    const buttonCancelClick = () => {
        setValidationErrorMsg('')
        props.getTestCellDrawerClicked(true)
        setTestCellsOriginal(testCellsOriginal)
    }

    const handleClickAway = () => {
        props.getTestCellDrawerClicked(true)
    }

    const classes = useStyles();

    return (

              <Drawer
                variant="temporary"
                classes={{ paper: classes.paper }}
                anchor="bottom"
                open={props.shouldBeOpen}
                onBackdropClick={handleClickAway}
              >
              <IconButton
                style={{marginLeft:'auto'}}
                onClick={handleClickAway}
                color="inherit"
               >
                <CancelIcon />
              </IconButton>
              <Container justify="center" style={{ marginTop:'20px', marginBottom:'50px'}}>
                 <TestCellDrawerStepper
                    testCells={testCellsOriginal}
                    apiData={apiData}
                    drawerClicked={props.getTestCellDrawerClicked}
                    setTestCells={props.getTestCells}
                    setStatus={props.getStatus}
                 />
               </Container>
              </Drawer>
        );
}