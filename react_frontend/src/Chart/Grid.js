import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import PlotChart from './Plotchart';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const test_api_output = {"0": {"name": "test_cell_1", "allocation_percentage_history": [0.5, 0.2, 0.4, 0.1, 0.0, 0.0, 0.1, 0.1, 0.0, 0.0]}, "1": {"name": "test_cell_2", "allocation_percentage_history": [0.5, 0.8, 0.6, 0.9, 1.0, 1.0, 0.9, 0.9, 1.0, 1.0]}}

//console.log(test_api_output["0"]["allocation_percentage_history"])

const num_cols = 3
const chart_margin = 30

const total_width = window.innerWidth
const chart_width = window.innerWidth/num_cols
const chart_height = chart_width *.4 * 1

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const chart_specs = [
    {
      'data_to_plot': 'allocation_percentage_history',
      'chart_title': 'Test cell allocation by percentage',
      'x_axis_title': 'Round',
      'y_axis_title': 'Allocation Percentage',
      'x_pos': 0,
      'y_pos': 0,
      'width': chart_width * 2,
      'height': chart_height,
      'grid_width': 2
    },
    {
      'data_to_plot': 'allocation_num_members',
      'chart_title': 'Test cell allocation by number',
      'x_axis_title': 'Round',
      'y_axis_title': 'Num Allocation',
      'x_pos': 2,
      'y_pos': 0,
      'width': chart_width,
      'height': chart_height,
      'grid_width': 1
    },
    {
      'data_to_plot': 'estimated_open_rate',
      'chart_title': 'Estimated open rate',
      'x_axis_title': 'Round',
      'y_axis_title': 'Open Rate',
      'x_pos': 0,
      'y_pos': 1,
      'width': chart_width * 2,
      'height': chart_height,
      'grid_width': 2
    },
    {
      'data_to_plot': 'actual_open_rate',
      'chart_title': 'Actual open rate',
      'x_axis_title': 'Round',
      'y_axis_title': 'Open Rate',
      'x_pos': 2,
      'y_pos': 1,
      'width': chart_width,
      'height': chart_height,
      'grid_width': 1
    },

    {
      'data_to_plot': 'beta_distribution',
      'chart_title': 'Beta distribution',
      'x_pos': 0,
      'y_pos': 3,
      'width': chart_width * 2,
      'height': chart_height,
      'slice_y_axis': false,
      'grid_width': 2
    },
]

class ChartGrid extends React.Component {
        constructor(props) {
        super(props);

        this.state = {
            chart_specs: chart_specs,
            current_round: this.props.current_round,
            num_rounds: this.props.num_rounds,
            API_output: this.props.API_output,
//            API_output: test_api_output,

        };

        this.onResizeChange = this.onResizeChange.bind(this);
        this.test = this.test.bind(this);
     }

    componentDidMount(){
        console.log('mount')
    }

    componentDidUpdate(prevProps) {
      if(prevProps.API_output !== this.props.API_output){
//      this.setState({chart_specs:chart_specs_orig})
        this.setState({API_output: this.props.API_output});
      }
    }

     onResizeChange(new_layout: LayoutItem, resized_chart_old_specs: LayoutItem)  {
        console.log('resize')
        const prev_chart_specs = this.state.chart_specs
        const chart_specs_index_changed = parseInt(resized_chart_old_specs['i'])
        prev_chart_specs[chart_specs_index_changed]['width'] = (new_layout[chart_specs_index_changed]['w'] * chart_width)
        prev_chart_specs[chart_specs_index_changed]['height'] = (new_layout[chart_specs_index_changed]['h'] * chart_width *.4) + ( (new_layout[chart_specs_index_changed]['h']-1) * chart_margin )
        this.setState({chart_specs:prev_chart_specs})
     }

     test(layout:Layout, oldItem: LayoutItem, newItem: LayoutItem) {
        console.log(layout, oldItem, newItem)
     }

      render() {
        return (
                <GridLayout
                    className="layout"
                    cols={num_cols}
                    rowHeight={chart_width*.4}
                    width={total_width}
                    onResizeStop={this.onResizeChange}
                    onLayoutChange={this.test}
                    margin={[chart_margin, chart_margin]}
                    containerPadding={[20,10]}
                    autoSize={true}
                >
                    {this.state.chart_specs.map( (item,i) =>
                        <div
                          key={i}
                          data-grid={{ x: item.x_pos, y: item.y_pos, w: item.grid_width, h: 1 }}
                          style={{overflow: 'hidden'}}

                        >
                            <PlotChart
                                current_round={99}
                                num_rounds={100}
                                API_output={this.state.API_output}
                                data_to_plot={item.data_to_plot}
                                chart_title={item.chart_title}
                                x_axis_title={item.x_axis_title}
                                y_axis_title={item.y_axis_title}
                                width={item.width}
                                height={item.height}
                                slice_y_axis={item.slice_y_axis}
                            />
                        </div>
                    )}
                </GridLayout>
            )
      }
}

export default ChartGrid;