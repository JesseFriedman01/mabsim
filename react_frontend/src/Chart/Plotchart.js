import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
//import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';
import Collapse from '@material-ui/core/Collapse';
import Slide from '@material-ui/core/Slide';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import createPlotlyComponent from 'react-plotly.js/factory';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

let helpIcon = {
  'width': 500,
  'height': 500,
  'path': "M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z",
}

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
            slice_y_axis: this.props.slice_y_axis,
            show_legend: this.props.show_legend,
            help_button_clicked: false
        };

        this.modeBarButtons = [[{
            name: 'Help',
            icon: helpIcon,
            click: () => { this.setState({help_button_clicked:true}) }
          }, "toImage"]];

        this.helpText = this.helpText.bind(this);
    }

    componentDidUpdate(prevProps) {
      if(prevProps.current_round !== this.props.current_round)
        this.setState({current_round: this.props.current_round});

      if(prevProps.width !== this.props.width)
        this.forceUpdate()

      if(prevProps.height !== this.props.height)
        this.setState({chart_height: this.props.height});
    }

    getLineColors(counter){
        if (this.props.line_colors)
            return this.props.line_colors[counter]
        return null
    }

    createPlots(){
        var plots = [];
        const x_axis_vals = [...Array(this.state.num_rounds).keys()]

        let counter = 0
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
                mode: 'lines',
                line: {
                    dash: this.props.line_style,
                    color: this.getLineColors(counter)
                }
            }
            plots.push(plot)
            counter++
        }

        return plots;
    }

   helpText() {
        return (
             <Slide in={true} direction="up">
                   <Card variant="outlined"  style={{ height:this.state.chart_height, overflowY: 'scroll', border:'solid', borderWidth:'thin', borderColor: '#c7c7c7'}}>
                      <CardContent>
                        <Typography variant="h5" component="h2">
                            {this.state.chart_title}
                        </Typography>
                        <br />
                        <Typography color="textSecondary">
                            What does this chart illustrate?
                        </Typography>
                        {this.props.help_text['What does this chart illustrate?']}
                        <br /><br />
                        <Typography color="textSecondary">
                            Why is it important?
                        </Typography>
                        {this.props.help_text['Why is it important?']}
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" onClick={() => { this.setState({help_button_clicked:false}) }} >Return to Chart</Button>
                      </CardActions>
                    </Card>
             </Slide>
            )
    }

    render(){
        console.log('here')
        return (
           <Box>
               {this.state.help_button_clicked ? this.helpText() :
               <Plot
                data={ this.createPlots() }
                layout={
                        {
                         plot_bgcolor:"#ffffff",
                         paper_bgcolor:"#e3e3e3",
                         autosize:true,
                         height: this.state.chart_height,
                         title: this.state.chart_title,
                         xaxis:{
                                title: this.state.x_axis_title,
                                range:[0, parseInt(this.state.num_rounds)-1],
                                },
                         yaxis:{
                                title:this.state.y_axis_title,
                                range:this.props.y_axis_range
                               },
                               margin:{ l:60, t:50, b:60},
                               legend: {x: 1.01}
                          }
                        }
                    config={{"modeBarButtons": this.modeBarButtons, "displayModeBar": true, "displaylogo": false}}
                    style={{'margin': "0px"}}
                />}
            </Box>
        )
    }
}

export default PlotChart;