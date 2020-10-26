import React, { Component } from 'react';
import Header from './UI/header'
import HorizontalLinearStepper from './UI/stepper'
import {ThemeProvider } from '@material-ui/styles';
import theme from './UI/theme'
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import APIFetch from './APIfetch_socketio';
import PlotChart from './Chart/Plotchart';
import ProgressBarAPI from './Progressbar';
import TestCellDrawer from './Chart/TestCelldrawer';
import ChartGrid from './Chart/Grid';
import Home from './home'
//import ChartTest from './charttest';
import io from 'socket.io-client';

const endPoint = "http://localhost:5000";
const socket = io.connect(`${endPoint}`);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            campaign_name: null,
            num_recipients: null,
            num_rounds: null,
            current_round: null,
            test_cells: null,
            status: null,
            api_data: null,
            api_progress: null,
            disable_test_cell_button: true,
            test_cell_drawer_button_clicked: null,
            test_cell_drawer_open: false,
            pause_slider: true,
            side_drawer_open: false,
            sim_description: null
        };

        this.getCampaignName = this.getCampaignName.bind(this);
        this.getNumRecipients = this.getNumRecipients.bind(this);
        this.getNumRounds = this.getNumRounds.bind(this);
        this.getTestCells = this.getTestCells.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.getAPIData = this.getAPIData.bind(this);
        this.getAPIProgress = this.getAPIProgress.bind(this);
        this.getTestCellButtonVisible = this.getTestCellButtonVisible.bind(this);
        this.getTestCellDrawerClicked = this.getTestCellDrawerClicked.bind(this);
        this.getCurrentRound = this.getCurrentRound.bind(this);
        this.getSimDescription = this.getSimDescription.bind(this);
    }

    getCampaignName(data){
        this.setState({ campaign_name: data })
    }

    getNumRecipients(data){
        this.setState({ num_recipients: data })
    }

    getNumRounds(data){
        this.setState({ num_rounds: data })
    }

    getTestCells(data){
        this.setState({ test_cells: data })
    }

    getStatus(data){
        this.setState({ status: data })
    }

    getAPIData(data){
        console.log('api_data', data)
//        var d = new Date();
//        var n = d.getTime();
//        console.log(data, n)
        this.setState({ api_data: data })
        this.setState({ disable_test_cell_button: false })
        this.setState({ status: 'idle' })
    }

    getAPIProgress(data){
        this.setState({ api_progress: data })
        if (data===100)
            this.setState({ api_progress: 0 })
    }

    getTestCellButtonVisible(data){
        this.setState({ disable_test_cell_button: data })
    }

    getTestCellDrawerClicked(data){
        this.setState({ test_cell_drawer_button_clicked: data })
        this.setState({ pause_slider: true })
        if (this.state.test_cell_drawer_open === true)
            this.setState({test_cell_drawer_open: false})
        else
            this.setState({test_cell_drawer_open: true})
    }

    getCurrentRound(data){
        this.setState({ current_round: data })
    }

    getOpenSideDrawer(data){
        this.setState({side_drawer_open:data})
    }

    getSimDescription(data){
        this.setState({sim_description:data})
    }

    render(){
        return (
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Header
                 openSideDrawer={this.state.side_drawer_open}
                 setOpenSideDrawer={this.getOpenSideDrawer}
                 setStatus={this.getStatus}
                 disableTestCellButton={this.state.disable_test_cell_button}
                 getTestCellDrawerClicked={this.getTestCellDrawerClicked}
                 getTestCellButtonVisible={this.getTestCellButtonVisible}
                 endPoint={endPoint}
                 socket={socket}
                 setAPIData={this.getAPIData}
                 numRounds={this.state.num_rounds}
                 setNumRounds={this.getNumRounds}
                 campaignName={this.state.campaign_name}
                 setCampaignName={this.getCampaignName}
                 testCells={this.state.test_cells}
                 setTestCells={this.getTestCells}
                 simDescription={this.state.sim_description}
                 setSimDescription={this.getSimDescription}
                 setNumRecipients={this.getNumRecipients}
                />

               <Switch>
                    <Route exact path="/" component={() =>
                        <Home
                         endPoint={endPoint}
                         socket={socket}
                         setAPIData={this.getAPIData}
                         setNumRounds={this.getNumRounds}
                         setCampaignName={this.state.getCampaignName}
                         setTestCells={this.getTestCells}/>}
                        />

                    { this.state.api_data ?
                        <Route exact path="/charts" component={() =>
                            <ChartGrid
                             API_output={this.state.api_data}
                             num_rounds={this.state.num_rounds}
                             pause_slider={this.state.pause_slider}
                            />
                         }/> : null
                     }

                </Switch>
            </BrowserRouter>

            { this.state.api_progress !==0 ?
              <ProgressBarAPI current_progress_value={this.state.api_progress}/> : null
            }

            { this.state.status === 'data collected' ?
                <APIFetch
                 getAPIData={this.getAPIData}
                 getAPIProgress={this.getAPIProgress}
                 name={'Submit'}
                 test_cell_list={this.state.test_cells}
                 num_rounds={this.state.num_rounds}
                 num_recipients={this.state.num_recipients}
                 getStatus={this.getStatus}
                 endPoint={endPoint}
                 socket={socket}/>
                :null
            }

            { this.state.status === 'modify test cells' ?
                <APIFetch
                 getAPIData={this.getAPIData}
                 getAPIProgress={this.getAPIProgress}
                 name={'Fluctuate'}
                 test_cell_list={this.state.test_cells}
                 num_rounds={this.state.num_rounds}
                 num_recipients={this.state.num_recipients}
                 current_round={parseInt(localStorage.getItem('current_round'))}
                 getStatus={this.getStatus}
                 endPoint={endPoint}
                 socket={socket}/>
                :null
            }

            { this.state.test_cell_drawer_button_clicked === true ?
               <TestCellDrawer
                shouldBeOpen ={this.state.test_cell_drawer_open}
                getTestCellDrawerClicked={this.getTestCellDrawerClicked}
                testCells={this.state.test_cells}
                getTestCells={this.getTestCells}
                getStatus={this.getStatus}
                api_data={this.state.api_data}
               />:null
            }

            </ThemeProvider>
        );
    }
}

export default App;