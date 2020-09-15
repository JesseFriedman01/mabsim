import React, { Component } from 'react';

class TestCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [
              {
                subject_line: 'A',
                open_rate: 10,
                percent_allocation: 50,
                id: 0
              },
              {
                subject_line: 'B',
                open_rate: 20,
                percent_allocation: 50,
                id: 1
              },
             ],
             API_output: this.props.API_output,
             current_round: this.props.current_round
        }

        this.addTestCell = this.addTestCell.bind(this);
        this.removeTestCell = this.removeTestCell.bind(this);
        this.updateTestCell = this.updateTestCell.bind(this);
        this.handleChangeTestCell = this.handleChangeTestCell.bind(this);
        this.unique_cell_id = 1
    }

    componentDidMount(){
        this.props.getData(this.state.list)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.API_output !== this.props.API_output){
            this.setState({API_output: this.props.API_output});
            this.updateTestCell()
        }
        if (prevProps.current_round !== this.props.current_round){
            this.setState({current_round: this.props.current_round});
            this.updateTestCell()
        }
    }

    addTestCell() {
        this.unique_cell_id++;
        this.setState({ list: this.state.list.concat({subject_line:"", open_rate:50, id:this.unique_cell_id}) });
        this.props.getData(this.state.list)
    }

    removeTestCell(id){
        function isNotId(test_cell){
            return test_cell.id !== id;
        }

        this.setState({ list: this.state.list.filter(isNotId)})
    }

    updateTestCell(){
         function getTestCellByID(id){
            return function(test_cell){
                return test_cell.id === parseInt(id)
            }
          }

         for (var key in this.props.API_output){
              const prev_list = [...this.state.list]
              prev_list.filter(getTestCellByID(key))[0].open_rate = this.props.API_output[key]["actual_open_rate"][this.props.current_round] * 100
              this.setState({ list: prev_list })
        }
    }

    handleChangeTestCell(event) {
        function getElem(elem){
            return elem.id===parseInt(event.target.id)
        }
        const prev_list = [...this.state.list]

        let target_value = event.target.value

        if (event.target.name === "open_rate")
            target_value = parseInt(target_value)

        prev_list.filter(getElem)[0][event.target.name] = target_value

        this.setState({ list: prev_list })
        this.props.getData(this.state.list)
   }

   render(){
    return(
        <div>
          {this.state.list.map(item =>
              <div>
                Subject line:
                <input type="text" id={item.id} name="subject_line" defaultValue={item.subject_line} onChange={this.handleChangeTestCell}></input>
                Open rate:
                <input type="text" id={item.id} name="open_rate" defaultValue={item.open_rate} value={item.open_rate} onChange={this.handleChangeTestCell}></input>
                Percent allocation:
                <input type="text" id={item.id} name="percent_allocation" defaultValue={item.percent_allocation} onChange={this.handleChangeTestCell}></input>
                <button onClick={() => this.removeTestCell(item.id)} type="button">
                   Remove
                </button>
              </div>)}
              <button onClick={() => this.addTestCell()} type="button">
                Add test cell
              </button>
        </div>
    );
   }
}

export default TestCell;