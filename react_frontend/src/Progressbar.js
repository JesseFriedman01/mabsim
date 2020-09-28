import React, { Component } from 'react';
import ProgressBar from 'react-customizable-progressbar'
import './progressbar.css'
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';

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
                <Modal open={true}>
                    <div style={{justifyContent: 'center',  alignItems: 'center' }}>
                        <ProgressBar
                            progress={this.state.current_progress_value}
                            radius={200}
                            strokeWidth={30}
                        >
                           <div class="indicator" >{this.state.current_progress_value}%</div>
                        </ProgressBar>
                    </div>
                </Modal>

        )
    }
}

export default ProgressBarAPI;