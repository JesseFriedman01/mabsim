import React, { Component } from 'react';

class NavButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_round: this.props.current_round,
            num_rounds: this.props.num_rounds,
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
        if (increment > 0 && this.state.current_round < this.state.num_rounds) {
              new_round += increment;

        // decrement chart by 1 round and not at beginning
        } else if (increment < 0 && this.state.current_round > 2) {
            new_round +=increment;
        } else if (value == "end") {
            new_round = this.state.num_rounds - 1;
        } else if (value == "first") {
            new_round = 1;
        }

        this.state.current_round = new_round
        this.props.getData(this.state.current_round)
    }

    render(){
        return(
            <div>
                <button onClick={() => this.handleClick({value:'first'})}>First</button>
                <button onClick={() => this.handleClick({increment:-1})}>Previous</button>
                <button onClick={() => this.handleClick({increment:1})}>Next</button>
                <button onClick={() => this.handleClick({value:'end'})}>End</button>
            </div>
        );
    }
}

export default NavButtons;