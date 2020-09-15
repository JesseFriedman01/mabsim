import React, { Component } from 'react';
import './App.css';
import TestCell from './Testcell';
import APIFetch from './APIfetch_socketio';
import NavButtons from './Chart/Navbuttons';
import ChartSlider from './Chart/Slider';
import PlotChart from './Chart/Plotchart';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num_rounds: 100,
      num_recipients: 100,
      test_cell_list:null,
      unique_cell_id: 2,
      API_status: null,
      API_output: null,
      slider_value: 2,
      current_round: 1
    };

//    this.state.current_round = this.state

    this.getAPIData = this.getAPIData.bind(this);
    this.getTestCellData = this.getTestCellData.bind(this);
    this.getCurrentRoundFromNavButton = this.getCurrentRoundFromNavButton.bind(this);
    this.getCurrentRoundFromSlider = this.getCurrentRoundFromSlider.bind(this);
    this.handleChangeRounds = this.handleChangeRounds.bind(this);
    this.handleChangeRecipients = this.handleChangeRecipients.bind(this);
  }

  handleChangeRounds(event){
    this.setState({num_rounds:event.target.value})
  }

  handleChangeRecipients(event){
    this.setState({num_recipients:event.target.value})
  }

  getTestCellData(data){
    this.setState({test_cell_list:data})
  }

  getAPIData(data){
    this.setState({ API_status: "Loading..." })
    this.setState({ API_output: data });
    this.setState({ current_round: this.state.num_rounds-1});
  }

 getCurrentRoundFromNavButton(data){
    this.setState({ current_round: data })
 }

 getCurrentRoundFromSlider(data){
    this.setState({ current_round: data })
 }


  render() {
    return (
      <div className="App">
      <br></br>
        Num members per round:
        <input type="text" name="num_recipients" defaultValue={this.state.num_recipients} onChange={this.handleChangeRecipients}></input>
        <br></br>
        Num rounds:
        <input type="text" name="num_rounds" defaultValue={this.state.num_rounds} onChange={this.handleChangeRounds}></input>
        <br></br> <br></br>
        <TestCell getData={this.getTestCellData} API_output={this.state.API_output} current_round={this.state.current_round}/>
        <br></br> <br></br>
        { this.state.test_cell_list ?
            [
                <APIFetch getAPIData={this.getAPIData} name={'Submit'} test_cell_list={this.state.test_cell_list} num_rounds={this.state.num_rounds}
                           num_recipients={this.state.num_recipients} />,

                <APIFetch getAPIData={this.getAPIData} current_round={this.state.current_round} name={'Fluctuate'} test_cell_list={this.state.test_cell_list} num_rounds={this.state.num_rounds}
                           num_recipients={this.state.num_recipients} />
            ]
            :null
        }
        <br></br> <br></br>
        {this.state.API_output ?
                        [
                            [
                                <NavButtons getData={this.getCurrentRoundFromNavButton} name="First" value="First"
                                    current_round={this.state.current_round} num_rounds={this.state.num_rounds}/>,

                                <NavButtons getData={this.getCurrentRoundFromNavButton} name="Previous" increment="-1"
                                    current_round={this.state.current_round} num_rounds={this.state.num_rounds}/>,

                                <NavButtons getData={this.getCurrentRoundFromNavButton} name="Next" increment="1"
                                    current_round={this.state.current_round} num_rounds={this.state.num_rounds}/>,

                                <NavButtons getData={this.getCurrentRoundFromNavButton} name="Last" value="Last"
                                    current_round={this.state.current_round} num_rounds={this.state.num_rounds}/>
                            ],

                            <ChartSlider getData={this.getCurrentRoundFromSlider} current_round={this.state.current_round}
                                num_rounds={this.state.num_rounds}/>,

                            [

                                <PlotChart current_round={this.state.current_round} num_rounds={this.state.num_rounds}
                                    API_output={this.state.API_output} data_to_plot="allocation_percentage_history"
                                    chart_title="Test cell selection"
                                    x_axis_title="Round" y_axis_title="Allocation Percentage"/>,

                                <PlotChart current_round={this.state.current_round} num_rounds={this.state.num_rounds}
                                    API_output={this.state.API_output} data_to_plot="actual_open_rate"
                                    chart_title="Actual open rate"
                                    x_axis_title="Round" y_axis_title="Open Rate"/>,

                                <PlotChart current_round={this.state.current_round} num_rounds={this.state.num_rounds}
                                    API_output={this.state.API_output} data_to_plot="estimated_open_rate"
                                    chart_title="Estimated open rate"
                                    x_axis_title="Round" y_axis_title="Open Rate"/>,

                                <PlotChart current_round={this.state.current_round} num_rounds={this.state.num_rounds}
                                    API_output={this.state.API_output} data_to_plot="beta_distribution"
                                    chart_title="Beta distribution"
                                    slice_y_axis="False"
                                 />
                            ]
                        ]
                        : this.state.API_status
        }
      </div>
    );
  }
}

export default App;