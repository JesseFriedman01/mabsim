import React, { Component } from 'react';
import ProgressBar from 'react-customizable-progressbar'
import './progressbar.css'
import Modal from '@material-ui/core/Modal';

class ProgressBarAPI extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_progress_value: this.props.current_progress_value,
        };
    }

    componentDidUpdate(prevProps) {
      if(prevProps.current_progress_value !== this.props.current_progress_value){
        this.setState({current_progress_value: this.props.current_progress_value});
        }
    }

    render(){
        if (this.state.current_progress_value === null)
            return null

        return (
                <ProgressBar
                    progress={this.state.current_progress_value}
                    radius={100}
                >
                <div>
                   <div class="indicator" >{this.state.current_progress_value}%</div>
                </div>
                </ProgressBar>

        )
    }
}

export default ProgressBarAPI;