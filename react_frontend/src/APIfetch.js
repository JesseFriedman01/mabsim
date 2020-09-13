import React, { Component } from 'react';

class APIFetch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            test_cell_list: this.props.test_cell_list,
            num_rounds: this.props.num_rounds,
            num_recipients: this.props.num_recipients,
            API_output: null
        }

        this.fetchAPIData = this.fetchAPIData.bind(this);
        this.createJSONforPost = this.createJSONforPost.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.num_rounds !== this.props.num_rounds)
            this.setState({num_rounds: this.props.num_rounds});
        else if(prevProps.num_recipients !== this.props.num_recipients)
            this.setState({num_recipients: this.props.num_recipients});
        else if(prevProps.test_cell_list !== this.props.test_cell_list)
            this.setState({test_cell_list: this.props.test_cell_list});
    }

    fetchAPIData(){
        this.props.getData(null)
        const PATH_BASE = 'http://127.0.0.1:5000/sim';

        fetch(PATH_BASE, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method:'post',
            body:JSON.stringify(this.createJSONforPost())
        }).then(response => response.json()).then(result=>this.props.getData(result))
    }

    createJSONforPost(){
        let json_post = {};
        json_post["test_cells"] = this.state.test_cell_list;
        json_post["num_rounds"] = this.state.num_rounds;
        json_post["num_recipients"] = this.state.num_recipients;
        return json_post;
    }

    render(){
        return(
            <div>
                 <button
                      onClick={() => {
                          this.createJSONforPost();
                          this.fetchAPIData();
                    }}
                    >
                    Submit
                </button>
            </div>
        )
    }
}

export default APIFetch;