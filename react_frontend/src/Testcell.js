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

        }
        this.addTestCell = this.addTestCell.bind(this);
        this.handleChangeTestCell = this.handleChangeTestCell.bind(this);
//        this.props.getData(this.state.list)

        this.unique_cell_id = 1
    }

    componentDidMount(){
        this.props.getData(this.state.list)
    }

    addTestCell() {
//        this.setState({unique_cell_id: this.state.unique_cell_id++})
        this.unique_cell_id++;
        this.setState({ list: this.state.list.concat({subject_line:"", open_rate:50, id:this.unique_cell_id}) });
        this.props.getData(this.state.list)
    }

    handleChangeTestCell(event) {
        function getElem(elem){
            return elem.id===parseInt(event.target.id)
        }

//        console.log(this.state.list)

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
                <input type="text" id={item.id} name="open_rate" defaultValue={item.open_rate} onChange={this.handleChangeTestCell}></input>
                Percent allocation:
                <input type="text" id={item.id} name="percent_allocation" defaultValue={item.percent_allocation} onChange={this.handleChangeTestCell}></input>
              </div>)}
              <button onClick={() => this.addTestCell()} type="button">
                Add test cell
              </button>
        </div>
    );
   }
}

export default TestCell;