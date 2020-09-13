import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class ChartSlider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_round: this.props.current_round,
        };

        this.handleSliderChange = this.handleSliderChange.bind(this);
    }

    componentDidUpdate(prevProps) {
      if(prevProps.current_round !== this.props.current_round){
        this.setState({current_round: this.props.current_round});
        }
    }

    handleSliderChange(current_round){
        this.setState({current_round});
        this.props.getData(this.state.current_round)
    }

    render(){
        return (
          <div style={{ margin: 50 }}>
             <p>{this.state.current_round}</p>
             <Slider
                  min={1}
                  max={this.props.num_rounds-1}
                  value={this.props.current_round}
                  onChange={this.handleSliderChange}
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

export default ChartSlider;