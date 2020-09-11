import React, { Component } from 'react';
import './App.css';
//import Plot from 'react-plotly.js';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import TestCell from './Testcell';
import APIFetch from './APIfetch';

import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

const allocation_plot = null

class App extends Component {
  constructor(props) {
    super(props);

    this.num_rounds = 100;
    this.num_recipients = 10000;

    this.state = {
      test_cell_list:null,
      unique_cell_id: 2,
      API_output: null,
      slider_value: 2,
      current_round:2
    };

    this.getAPIData = this.getAPIData.bind(this);
    this.getTestCellData = this.getTestCellData.bind(this);
    this.handleChangeRounds = this.handleChangeRounds.bind(this);
    this.handleChangeRecipients = this.handleChangeRecipients.bind(this);
    this.plotAllocationChart = this.plotAllocationChart.bind(this);
  }

  handleChangeRounds(event){
    this.num_rounds = event.target.value
   }

  handleChangeRecipients(event){
    this.num_recipients = event.target.value
   }


  plotAllocationChart(slice1, slice2){
    var plots = [];

    if (this.state.API_output !== null){
        const x_axis_vals = [...Array(parseInt(this.num_rounds)).keys()]
        for (var key in this.state.API_output){
            const plot = {
                x: x_axis_vals,
                y: this.state.API_output[key]["allocation_percentage_history"].slice(slice1, slice2),
                name: key,
                type: 'scatter',
                mode: 'lines'
            }
            plots.push(plot)
        }
        this.setState({allocation_plot:
            <Plot
            data={ plots }
            layout={ {width: 1000, height: 400, title: 'Test cell selection over time', xaxis:{title:"Round", range:[0, parseInt(this.num_rounds)+5]}, yaxis:{title:"Allocation Percentage", range:[-0, 1.05]},} }
            />
        })
      }
    }

   chartNavigationButton({name, increment, value}={}){
        if (this.state.API_output !== null){
            let new_round = this.state.current_round
            return(
                <button
                  onClick={() => {
                    // increment chart by 1 round and not at end
                    if (increment > 0 && this.state.current_round < this.num_rounds) {
                          new_round += increment;
//                        this.state.current_round += increment;
                    // decrement chart by 1 round and not at beginning
                    } else if (increment < 0 && this.state.current_round > 2) {
                        new_round += increment;
                    } else if (value == "end") {
                        new_round = this.num_rounds - 1;
                    } else if (value == "first") {
                        new_round = 2;
                    }
                    this.state.current_round = new_round
                    this.plotAllocationChart(0, this.state.current_round)
                    }}>
                  {name}
            </button>)
        }
    }

    onSliderChange = current_round => {
    this.setState(
      {
        current_round
      },
      () => {
            this.plotAllocationChart(0, current_round)
      }
    );
  };

  slider(){
    if (this.state.API_output !== null){

    return (
      <div style={{ margin: 50 }}>
         <p>{this.state.current_round}</p>

        <Slider

          min={2}
          max={this.num_rounds-1}
          value={this.state.current_round}
          onChange={this.onSliderChange}
          railStyle={{
            height: 2
          }}
          handleStyle={{
            height: 28,
            width: 28,
            marginLeft: -14,
            marginTop: -14,
            backgroundColor: "blue",
            border: 0
          }}
          trackStyle={{
            background: "none"
          }}
        />
      </div>
    )
    }
  }

 getTestCellData(data){
    this.setState({test_cell_list:data})
  }

 getAPIData(data){
      this.setState({ API_output: data }, () => {
          console.log(this.state.API_output, 'here');})
 }


  render() {
    return (
      <div className="App">
      <br></br>
        Num recipients:
        <input type="text" name="num_recipients" defaultValue={this.num_recipients} onChange={this.handleChangeRecipients}></input>
        <br></br>
        Num rounds:
        <input type="text" name="num_rounds" defaultValue={this.num_rounds} onChange={this.handleChangeRounds}></input>
        <br></br>
        <br></br>
        <TestCell getData={this.getTestCellData}/>
        <br></br>
        <br></br>
        <div>
            {this.state.test_cell_list &&
            <APIFetch getData={this.getAPIData} test_cell_list={this.state.test_cell_list} num_rounds={this.num_rounds} num_recipients={this.num_recipients} {...this.props}/>
            }
        </div>
        <br></br>
        <br></br>
        {this.chartNavigationButton({name: "First", value:'first'})}
        {this.chartNavigationButton({name: "End", value:'end'})}
        {this.chartNavigationButton({name: "Previous", increment:-1})}
        {this.chartNavigationButton({name: "Next", increment:1})}

        {this.slider()}

        {this.state.allocation_plot}

      </div>

    );
  }
}

export default App;