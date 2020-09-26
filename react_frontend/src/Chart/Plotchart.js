import React, { Component } from 'react';

import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

class PlotChart extends Component {

    constructor(props) {
        super(props);

        this.chart_width = 800
        this.chart_height = this.chart_width * .4

        this.state = {
            current_round: this.props.current_round,
            num_rounds: this.props.num_rounds,
            API_output: this.props.API_output,
            data_to_plot: this.props.data_to_plot,
            chart_title: this.props.chart_title,
            x_axis_title: this.props.x_axis_title,
            y_axis_title: this.props.y_axis_title,
            slice_y_axis: this.props.slice_y_axis
        };
    }

    componentDidMount(){
        console.log(this.state.API_output)

    }

    componentDidUpdate(prevProps) {
      if(prevProps.current_round !== this.props.current_round)
        this.setState({current_round: this.props.current_round});
    }

    createPlots(){
        var plots = [];
        const x_axis_vals = [...Array(100).keys()]
        for (var key in this.state.API_output){
            if (this.state.slice_y_axis === "False")
                var y_axis_vals = this.state.API_output[key][this.state.data_to_plot][this.state.current_round]
            else
                var y_axis_vals = this.state.API_output[key][this.state.data_to_plot].slice(0, this.state.current_round + 1)

            const plot = {
                x: x_axis_vals,
                y: y_axis_vals,
                name: this.state.API_output[key]["name"],
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
            layout={
                    {
                     width: this.chart_width,
                     height: this.chart_height,
                     title: this.state.chart_title,
                     xaxis:{
                            title: this.state.x_axis_title,
                            range:[0, parseInt(this.state.num_rounds)-1]
                            },
                     yaxis:{
                            title:this.state.y_axis_title,

                           },
                      }
                    }
            />
        )
    }
}

export default PlotChart;