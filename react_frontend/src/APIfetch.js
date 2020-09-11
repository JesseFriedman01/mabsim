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

        this.createAPIString = this.createAPIString.bind(this);
        this.fetchAPIData = this.fetchAPIData.bind(this);
    }

    componentDidUpdate(prevProps) {
          if(prevProps.test_cell_list !== this.props.test_cell_list)
            this.setState({test_cell_list: this.props.test_cell_list});
      }

    createAPIString(){
        const PATH_BASE = 'http://127.0.0.1:5000/sim'
        let query = "?"
        this.state.test_cell_list.forEach(function (item, index) {
            let open_rate = item['open_rate']/100
            let percent_allocation = item['percent_allocation']/100
            query += 'test_cell_' + index + '=' + item['subject_line'] + ',' + open_rate + ',' + percent_allocation + ',' + '&'
        });

        query += 'recipients=' + this.state.num_recipients + '&' + 'num_rounds=' + this.state.num_rounds
        return PATH_BASE + query
    }

      fetchAPIData(){
        const APIString = this.createAPIString()
        fetch(APIString).then(response => response.json()).then(result=>this.props.getData(result))
      }

      render(){
        return(
            <div>
                 <button
                      onClick={() => {
                          this.createAPIString();
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