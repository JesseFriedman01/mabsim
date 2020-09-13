import React, { Component } from 'react';
import './App.css';
import TestCell from './Testcell';
import APIFetch from './APIfetch';
import NavButtons from './Chart/Navbuttons';
import ChartSlider from './Chart/Slider';
import PlotChart from './Chart/Plotchart';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num_rounds: 100,
      num_recipients: 10000,
      test_cell_list:null,
      unique_cell_id: 2,
      API_status: null,
      API_output: null,
      slider_value: 2,
      current_round: 1
    };

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
    this.setState({ current_round: 1 });
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
        Num recipients:
        <input type="text" name="num_recipients" defaultValue={this.state.num_recipients} onChange={this.handleChangeRecipients}></input>
        <br></br>
        Num rounds:
        <input type="text" name="num_rounds" defaultValue={this.state.num_rounds} onChange={this.handleChangeRounds}></input>
        <br></br> <br></br>
        <TestCell getData={this.getTestCellData}/>
        <br></br> <br></br>
        { this.state.test_cell_list &&
        <APIFetch getData={this.getAPIData} test_cell_list={this.state.test_cell_list} num_rounds={this.state.num_rounds}
                           num_recipients={this.state.num_recipients} />
        }
        <br></br>
        <br></br>
        {this.state.API_output ?
                        [
                         <NavButtons getData={this.getCurrentRoundFromNavButton} current_round={this.state.current_round} num_rounds={this.state.num_rounds}/>,
                         <ChartSlider getData={this.getCurrentRoundFromSlider} current_round={this.state.current_round} num_rounds={this.state.num_rounds}/>,
                         <PlotChart current_round={this.state.current_round} num_rounds={this.state.num_rounds} API_output={this.state.API_output}/>
                        ]
                        : this.state.API_status
        }
      </div>
    );
  }
}

export default App;