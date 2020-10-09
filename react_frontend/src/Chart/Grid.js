import React from 'react';
import GridLayout from 'react-grid-layout';
import PlotChart from './Plotchart';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import Box from '@material-ui/core/Box';
import InputSlider from './Slider';

const num_cols = 3
const chart_margin = 30

const total_width = window.innerWidth - 20
const chart_width = window.innerWidth/num_cols
const chart_height = chart_width *.4

const chart_specs = [
    {
      'data_type': 'MAB detailed',
      'parent_key': 'Test Cell Data',
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
      'data_type': 'MAB detailed',
      'parent_key': 'Test Cell Data',
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
      'data_type': 'MAB detailed',
      'parent_key': 'Test Cell Data',
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
      'data_type': 'MAB detailed',
      'parent_key': 'Test Cell Data',
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
      'data_type': 'MAB detailed',
      'parent_key': 'Test Cell Data',
      'data_to_plot': 'beta_distribution',
      'chart_title': 'Beta distribution',
      'x_pos': 0,
      'y_pos': 3,
      'width': chart_width * 2,
      'height': chart_height,
      'slice_y_axis': false,
      'grid_width': 2
    },
    {
      'data_type': 'Summary Data',
      'parent_key': 'Total Reward',
      'data_to_plot': 'total_reward_history',
      'chart_title': 'Total Reward',
      'x_axis_title': 'Round',
      'y_axis_title': 'Reward',
      'x_pos': 3,
      'y_pos': 3,
      'width': chart_width * 1,
      'height': chart_height,
      'grid_width': 1,
    },
]

const layout = [
      {i: '0', x: 0, y: 0, w: 2, h: 1},
      {i: '1', x: 2, y: 0, w: 1, h: 1},
      {i: '2', x: 0, y: 1, w: 2, h: 1},
      {i: '3', x: 2, y: 1, w: 1, h: 1},
      {i: '4', x: 0, y: 3, w: 2, h: 1},
      {i: '5', x: 3, y: 3, w: 1, h: 1},
    ];

let layout_history = []

class ChartGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chart_specs: chart_specs,
            layout: layout,
            current_round: localStorage.getItem('current_round'),
            num_rounds: this.props.num_rounds,
            API_output: this.props.API_output,
            pause_slider: this.props.pause_slider
        };

        this.onResizeChange = this.onResizeChange.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.getCurrentRound = this.getCurrentRound.bind(this);
        this.checkIfLayoutIsUnique = this.checkIfLayoutIsUnique.bind(this);
    }

    componentDidMount(){
        if (layout_history.length < 2) {
            this.setState({layout:layout})
        }
        else {
            layout_history = JSON.parse(localStorage.getItem('layout'))
            this.setState({layout:layout_history[layout_history.length - 1]})
        }
    }

    componentDidUpdate(prevProps) {
      if(prevProps.API_output !== this.props.API_output){
        this.setState({API_output: this.props.API_output});
      }

      if(prevProps.current_round !== this.props.current_round){
        this.setState({current_round: this.props.current_round});
      }

      if(prevProps.num_rounds !== this.props.num_rounds){
        this.setState({num_rounds: this.props.num_rounds});
      }

      if(prevProps.pause_slider !== this.props.pause_slider){
        this.setState({pause_slider: this.props.pause_slider});
      }

    }

    onResizeChange(new_layout: LayoutItem, resized_chart_old_specs: LayoutItem)  {
        const prev_chart_specs = this.state.chart_specs
        const chart_specs_index_changed = parseInt(resized_chart_old_specs['i'])
        prev_chart_specs[chart_specs_index_changed]['width'] = (new_layout[chart_specs_index_changed]['w'] * chart_width)
        prev_chart_specs[chart_specs_index_changed]['height'] = (new_layout[chart_specs_index_changed]['h'] * chart_width *.4) + ( (new_layout[chart_specs_index_changed]['h']-1) * chart_margin )
        this.setState({chart_specs:prev_chart_specs})
     }

    checkIfLayoutIsUnique(new_layout){
        new_layout = JSON.stringify(new_layout)

        for (var key in layout_history){
            let existing_layout = JSON.stringify(layout_history[key])
            if (new_layout === existing_layout)
                return false
        }
        return true
    }

    onLayoutChange(layout: Layout) {
        if (this.checkIfLayoutIsUnique(layout) === true){
            layout_history.push(layout)
            localStorage.setItem('layout', JSON.stringify(layout_history));
        }
     }

    getCurrentRound(data){
        this.setState({ current_round: data })
        localStorage.setItem('current_round', data);
    }

    getDataToPlot(item_data_type, item_parent_key){
        if (item_data_type === 'MAB detailed')
            return this.state.API_output['Detailed Data']['mab']

        if (item_data_type ==='Summary Data')
            return this.state.API_output['Summary Data']
    }

    render() {
      return (
           <div>
           <InputSlider
                getCurrentRound={this.getCurrentRound}
                current_round={this.state.current_round}
                num_rounds={this.state.num_rounds}
                pause_slider={this.state.pause_slider}
            />
            <GridLayout
                className="layout"
                layout={this.state.layout}
                cols={num_cols}
                rowHeight={chart_width*.4}
                width={total_width}
                onResizeStop={this.onResizeChange}
                onLayoutChange={this.onLayoutChange}
                margin={[chart_margin, chart_margin]}
                containerPadding={[20,10]}
                autoSize={true}
            >
                {this.state.chart_specs.map( (item,i) =>
                    <Box
                      key={i}
                      style={{overflow: 'hidden'}}
                      boxShadow={2}
                    >
                        <PlotChart
                            current_round={this.state.current_round}
                            num_rounds={this.state.num_rounds}
                            API_output={this.getDataToPlot(item.data_type, item.parent_key)}
                            data_to_plot={item.data_to_plot}
                            chart_title={item.chart_title}
                            x_axis_title={item.x_axis_title}
                            y_axis_title={item.y_axis_title}
                            width={item.width}
                            height={item.height}
                            slice_y_axis={item.slice_y_axis}
                            show_legend={item.show_legend}
                        />
                    </Box>
                )}
            </GridLayout>
            </div>
        )
  }
}

export default ChartGrid;