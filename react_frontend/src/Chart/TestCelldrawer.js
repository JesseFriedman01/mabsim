import React, { useEffect } from 'react';
import Drawer from "@material-ui/core/Drawer";
import Button from '@material-ui/core/Button';
import TestCell from '../Testcell'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles((theme) => ({
    paper: {
        background: "#bdbbbb",
        maxHeight: "70%",
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

const test_list = [{
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
          },
         ];

export default function TestCellDrawer(props) {
    const [shouldBeOpen, setShouldBeOpen] = React.useState(props.shouldBeOpen)
//    const [testCellsOriginal, setTestCellsOriginal] = React.useState(test_list)

    const [testCellsOriginal, setTestCellsOriginal] = React.useState(props.testCells)
    const [testCellsFromDrawer, setTestCellsFromDrawer] = React.useState(0)

    useEffect(() => {
      setTestCellsOriginal(props.testCells);
    }, [props.testCells]);

    const getTestCellDataFromDrawer = (data) => {
        setTestCellsFromDrawer(data)
    }

    const buttonCancelClick = () => {
        props.getTestCellDrawerClicked(true)
        setTestCellsOriginal(testCellsOriginal)
    }

    const buttonSubmitClick = () => {
//        props.getTestCellDrawerClicked(true)
//        props.getTestCells(testCellsFromDrawer)
//        console.log(data)
//        setTestCells(data)
    }

    const clickAway = () => {
        console.log('here')
        props.getTestCellDrawerClicked(true)
    }

    const classes = useStyles();

    return (

              <Drawer
              classes={{ paper: classes.paper }}
                anchor="bottom"
                open={props.shouldBeOpen}
                onClose={props.shouldBeOpen}
              >
              <Container style={{padding:"20px", marginBottom:"20px", marginTop:"20px"}} >
              <h2>Modify open rate(s):</h2>
                 <TestCell
                    display_type='modify'
                    testCells={testCellsOriginal}
                    getTestCellDataFromDrawer={getTestCellDataFromDrawer}
                    auto_update={false}
                  />
                  <hr style={{marginTop: '20px'}}/>
                 <Button variant="contained" onClick={buttonSubmitClick} className={classes.submitButtonStyle}>Submit</Button>
                 <Button variant="contained" onClick={buttonCancelClick} className={classes.cancelButtonStyle}>Close</Button>
               </Container>
              </Drawer>

        );
}