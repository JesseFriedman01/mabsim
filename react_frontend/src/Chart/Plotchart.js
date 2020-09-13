import React, { Component } from 'react';

import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

class PlotChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_round: this.props.current_round,
            num_rounds: this.props.num_rounds,
            API_output: this.props.API_output
        };
    }

    componentDidUpdate(prevProps) {
      if(prevProps.current_round !== this.props.current_round)
        this.setState({current_round: this.props.current_round});
    }

    createPlots(){
        var plots = [];
        const x_axis_vals = [...Array(parseInt(this.state.num_rounds)).keys()]
        for (var key in this.state.API_output){
            const plot = {
                x: x_axis_vals,
                y: this.state.API_output[key]["allocation_percentage_history"].slice(0, this.state.current_round),
                name: key,
                type: 'scatter',
                mode: 'lines'
            }
            plots.push(plot)
        }
        return plots;
    }

    render(){
        return (
           <Plot
            data={ this.createPlots() }
            layout={ {width: 1000, height: 400, title: 'Test cell selection over time', xaxis:{title:"Round", range:[0, parseInt(this.state.num_rounds)]}, yaxis:{title:"Allocation Percentage", range:[-0, 1.05]},} }
            />
        )
    }
}

export default PlotChart;