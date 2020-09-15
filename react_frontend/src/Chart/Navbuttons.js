import React, { Component } from 'react';

class NavButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_round: this.props.current_round,
            num_rounds: this.props.num_rounds,
            name: this.props.name,
            increment: parseInt(this.props.increment),
            value: this.props.value
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidUpdate(prevProps) {
      if(prevProps.current_round !== this.props.current_round){
//        console.log('update found button', this.props.current_round)
        this.setState({current_round: this.props.current_round});
        }
    }

    handleClick({increment, value}={}){
        let new_round = this.state.current_round

       // increment chart by 1 round and not at end
        if (this.state.increment > 0 && this.state.current_round < this.state.num_rounds-1) {
              new_round += increment;
        // decrement chart by 1 round and not at beginning
        } else if (this.state.increment < 0 && this.state.current_round > 2) {
            new_round +=this.state.increment;
        } else if (this.state.value == "Last") {
            new_round = this.state.num_rounds - 1;
        } else if (this.state.value == "First") {
            new_round = 1;
        }

        this.state.current_round = new_round
        this.props.getData(this.state.current_round)
    }

    render(){
        return(
            <>
               <button onClick={() => this.handleClick({increment: this.state.increment, value: this.state.value})}>
                   {this.state.name}
               </button>
            </>
        );
    }
}

export default NavButtons;