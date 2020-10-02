import React, { Component } from 'react';
import Box from '@material-ui/core/Box';

import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

class PlotChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chart_width: this.props.width,
            chart_height: this.props.height,
            current_round: parseInt(this.props.current_round),
            num_rounds: parseInt(this.props.num_rounds),
            API_output: this.props.API_output,
            data_to_plot: this.props.data_to_plot,
            chart_title: this.props.chart_title,
            x_axis_title: this.props.x_axis_title,
            y_axis_title: this.props.y_axis_title,
            slice_y_axis: this.props.slice_y_axis
        };
    }

    componentDidUpdate(prevProps) {
      if(prevProps.current_round !== this.props.current_round)
        this.setState({current_round: this.props.current_round});

      if(prevProps.width !== this.props.width)
        this.setState({chart_width: this.props.width});

      if(prevProps.height !== this.props.height)
        this.setState({chart_height: this.props.height});
    }

    createPlots(){
        var plots = [];
        const x_axis_vals = [...Array(this.state.num_rounds).keys()]
        for (var key in this.state.API_output){
            if (this.state.slice_y_axis === false)
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
           <Box>
               <Plot
                data={ this.createPlots() }

                layout={
                        {
                         plot_bgcolor:"#ffffff",
                         paper_bgcolor:"#e3e3e3",
                         width: this.state.chart_width,
                         height: this.state.chart_height,
                         title: this.state.chart_title,
                         xaxis:{
                                title: this.state.x_axis_title,
                                range:[0, parseInt(this.state.num_rounds)-1],
                                },
                         yaxis:{
                                title:this.state.y_axis_title,
                               },
                         margin:{ l:60, r:190, t:50, b:60},
                         legend: {x: 1.01}
                          }

                        }
                    style={{'margin': "0px"}}

                />
            </Box>
        )
    }
}

export default PlotChart;