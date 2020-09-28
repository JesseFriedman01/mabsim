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
import ChartGrid  from './Chart/Grid'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            campaign_name: null,
            num_recipients: null,
            num_rounds: null,
            test_cells: null,
            status: null,
            api_data: null,
            api_progress: null,
//            disable_test_cell_button: true
            disable_test_cell_button: false,
            test_cell_drawer_button_clicked: null,
            test_cell_drawer_open: false
        };

        this.getCampaignName = this.getCampaignName.bind(this);
        this.getNumRecipients = this.getNumRecipients.bind(this);
        this.getNumRounds = this.getNumRounds.bind(this);
        this.getTestCells = this.getTestCells.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.getAPIData = this.getAPIData.bind(this);
        this.getAPIProgress = this.getAPIProgress.bind(this);
        this.getTestCellDrawerClicked = this.getTestCellDrawerClicked.bind(this);
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
        console.log('app', data)
        this.setState({ test_cells: data })
    }

    getStatus(data){
        this.setState({ status: data })
        this.setState({ api_data: null })
    }

    getAPIData(data){
        this.setState({ api_data: data })
        this.setState({ input_data_status: null })
        this.setState({ disable_test_cell_button: false })
    }

    getAPIProgress(data){
        this.setState({ api_progress: data })
    }

    getTestCellDrawerClicked(data){
        this.setState({ test_cell_drawer_button_clicked: data })
        if (this.state.test_cell_drawer_open === true)
            this.setState({test_cell_drawer_open: false})
        else
            this.setState({test_cell_drawer_open: true})
    }

    render(){
        return (
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Header getStatus={this.getStatus}
                        disableTestCellButton={this.state.disable_test_cell_button}
                        getTestCellDrawerClicked={this.getTestCellDrawerClicked}

                />

                <Switch>

                    <Route exact path="/load" component={() => <div>Under Construction</div>} />

                    <Route exact path="/charts" component={() => <ChartGrid API_output={this.state.api_data} />} />

                    { this.state.status !== 'data collected' ?
                        <Route exact path="/create" component={() =>
                            <HorizontalLinearStepper
                            getCampaignName={this.getCampaignName}
                            getNumRecipients={this.getNumRecipients}
                            getNumRounds={this.getNumRounds}
                            getTestCells={this.getTestCells}
                            getStatus={this.getStatus}
                            />}
                        /> :<Redirect to='/charts' />
                    }
                </Switch>
            </BrowserRouter>

            {!this.state.api_data && this.state.status === 'data collected' ?
              <ProgressBarAPI current_progress_value={this.state.api_progress}/> : null
            }

            {this.state.status === 'data collected' ?
                <APIFetch getAPIData={this.getAPIData} getAPIProgress={this.getAPIProgress} name={'Submit'}
                          test_cell_list={this.state.test_cells} num_rounds={this.state.num_rounds}
                          num_recipients={this.state.num_recipients} />
                :null
            }

            {this.state.test_cell_drawer_button_clicked === true ?
               <TestCellDrawer
                shouldBeOpen ={this.state.test_cell_drawer_open}
                getTestCellDrawerClicked={this.getTestCellDrawerClicked}
                testCells={this.state.test_cells}
                getTestCells={this.getTestCells}
               />:null
            }

            </ThemeProvider>
        );
    }
}


export default App;
