import React, { Component } from 'react';
import io from 'socket.io-client';

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

class APIFetch extends Component {

 constructor(props) {
        super(props);

        this.state = {
            test_cell_list: this.props.test_cell_list,
            num_rounds: this.props.num_rounds,
            num_recipients: this.props.num_recipients,
            current_round: this.props.current_round
        }

        this.createJSONforPost = this.createJSONforPost.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidUpdate(prevProps) {
//        if(prevProps.num_rounds !== this.props.num_rounds)
//            this.setState({num_rounds: this.props.num_rounds});
//        if(prevProps.num_recipients !== this.props.num_recipients)
//            this.setState({num_recipients: this.props.num_recipients});
//        if(prevProps.test_cell_list !== this.props.test_cell_list)
//            this.setState({test_cell_list: this.props.test_cell_list});
//        if(prevProps.current_round !== this.props.current_round)
//            this.setState({current_round: this.props.current_round});
    }

    createJSONforPost(){
        let json_post = {};
        json_post["test_cells"] = this.state.test_cell_list;
        json_post["num_rounds"] = this.state.num_rounds;
        json_post["num_recipients"] = this.state.num_recipients;
        json_post["current_round"] = this.state.current_round;
        return json_post;
    }

    getData(){
        this.props.getAPIData(null)
        socket.on('new_results', (result) => {
            this.props.getAPIData(JSON.parse(result));
        });
        socket.on('progress', (result) => {
            this.props.getAPIProgress(result);
        });
    }

  sendRequest() {
    if (this.props.name === "Submit")
        socket.emit("new_mab_request", this.createJSONforPost())
    else if (this.props.name === "Fluctuate")
        socket.emit("fluctuate_mab_request", this.createJSONforPost())
  };

  componentDidMount(){
    this.sendRequest();
    this.getData();
  }

   render(){
        const summaryDiv = {
            backgroundColor: 'white'

        }
        return(
            <div></div>
        )
    }
}


export default APIFetch;
