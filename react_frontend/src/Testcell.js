import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class TestCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
            list: this.props.testCells,
            API_output: this.props.API_output,
            current_round: this.props.current_round,
            unique_cell_id: this.props.cell_id,
            auto_allocation: this.props.auto_allocation,
        }

        this.addTestCell = this.addTestCell.bind(this);
        this.removeTestCell = this.removeTestCell.bind(this);
        this.updateTestCell = this.updateTestCell.bind(this);
        this.autoAllocatePercentages = this.autoAllocatePercentages.bind(this);
        this.allocationCheckboxChange = this.allocationCheckboxChange.bind(this);
        this.handleChangeTestCell = this.handleChangeTestCell.bind(this);

        if (this.props.display_type === 'create'){
            this.table_type = "a dense table"
            this.id_cell_variant = "outlined"
            this.open_rate_cell_variant = "outlined"
            this.pct_allo_cell_variant = "outlined"
        }
        else{
            this.table_type = "simple table"

            this.id_cell_variant = "standard"
            this.open_rate_cell_variant = "outlined"
            this.pct_allo_cell_variant = "standard"

            this.id_cell_read_only = true
            this.pct_allo_cell_read_only = true

            if (this.props.display_type === 'summary')
                this.open_rate_cell_read_only = true

            if (this.props.display_type === 'modify')
                this.open_rate_cell_read_only = false
        }
    }

//    componentDidMount(){
//        this.setState({list:this.props.testCells})
//        this.
////        this.props.getData(this.state.list)
//    }

    componentDidUpdate(prevProps) {
//        if (prevProps.API_output !== this.props.API_output){
//            this.setState({API_output: this.props.API_output});
//            this.updateTestCell()
//        }
//        if (prevProps.current_round !== this.props.current_round){
//            this.setState({current_round: this.props.current_round});
//            this.updateTestCell()
//        }
    }

    autoAllocatePercentages(list){
        console.log('here', list.length)
        const percentagePerTestCell = Number((100/list.length).toFixed(2))
        for (var key in list){
            list[key]['percent_allocation'] = percentagePerTestCell
        }
          return list
    }

    addTestCell() {
        let unique_cell_id_incremented = this.state.unique_cell_id + 1;
        let new_list = this.state.list.concat({name:'test_cell_' + unique_cell_id_incremented, open_rate:this.open_rate, id:unique_cell_id_incremented, percent_allocation:this.percent_allocation});

        if (this.state.auto_allocation === true)
            new_list = this.autoAllocatePercentages(new_list)

        this.setState({ list: new_list, unique_cell_id:unique_cell_id_incremented});
        this.props.getData({test_cells:new_list, cell_id:unique_cell_id_incremented, isAutoAllocate: this.state.auto_allocation})
    }

    removeTestCell(id){
        function isNotId(test_cell){
            return test_cell.id !== id;
        }

        var new_list = this.state.list.filter(isNotId)

        if (this.state.auto_allocation === true)
            new_list = this.autoAllocatePercentages(new_list)

        this.setState({ list: new_list})
        this.props.getData({test_cells:new_list, cell_id:this.state.unique_cell_id, isAutoAllocate: this.state.auto_allocation})
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
              this.props.getData({test_cells:prev_list, cell_id:this.state.unique_cell_id, isAutoAllocate: this.state.auto_allocation})
        }
    }

    handleChangeTestCell(event) {
        function getElem(elem){
            return elem.id===parseInt(event.target.id)
        }

            const prev_list = JSON.parse(JSON.stringify(this.state.list));

            let target_value = event.target.value

            if (event.target.name === "open_rate")
                target_value = parseInt(target_value)


            prev_list.filter(getElem)[0][event.target.name] = target_value

       if (this.props.auto_update === "true"){
            this.setState({ list: prev_list })
            this.props.getData({test_cells:prev_list, cell_id:this.state.unique_cell_id, isAutoAllocate: this.state.auto_allocation})
        }
        else{
            this.props.getTestCellDataFromDrawer(prev_list)
        }
   }

   allocationCheckboxChange(event){
        if (event.target.checked === true)
            this.autoAllocatePercentages(this.state.list)
        this.setState({ auto_allocation: event.target.checked })
        this.props.getData({test_cells:this.state.list, cell_id:this.state.unique_cell_id, isAutoAllocate: event.target.checked})
   }

    render(){
      const addButtonStyle = {
        backgroundColor: '#039112',
        color: 'white',

//        marginLeft:'10%',
//        marginRight:'10%',
        marginTop: '20px',
        marginBottom: '10px'
      };

      const removeButtonStyle = {
        backgroundColor: '#ff001e',
        color: 'white'
      };

      const hrStyle = {
        marginBottom: '20px'
      };

      const checkbox = {
//        marginLeft:'10%',
//        marginRight:'10%',
        marginTop: '20px',
        marginBottom: '10px',
        float:"right"
      };

      const table = {
//        width: '80%',
//        marginLeft:'10%',
//        marginRight:'10%',
      }

    return(
            <div>
            <TableContainer style={table} component={Paper}>
                <Table aria-label={this.table_type}>
                    {this.state.list.map( (item, i) =>
                      <TableRow key={item.id} style={{backgroundColor:"#white"}}>
                        <TableCell>
                            <TextField
                               inputProps={{
                                 readOnly:this.id_cell_read_only
                                }}
                                variant={this.id_cell_variant}
                                helperText="name"
                                label="ID"
                                id={item.id}
                                name="name"
                                defaultValue={item.name}
                                onChange={this.handleChangeTestCell} />
                        </TableCell>
                        <TableCell>
                            <TextField
                                inputProps={{
                                 readOnly:this.open_rate_cell_read_only
                                }}
                                type="number"
                                variant={this.open_rate_cell_variant}
                                helperText="%"
                                label="Open rate"
                                id={item.id}
                                name="open_rate"
                                defaultValue={item.open_rate}
//                                value={item.open_rate}
                                onChange={this.handleChangeTestCell} />
                        </TableCell>
                        <TableCell>
                            <TextField
                                inputProps={{
                                 readOnly:this.pct_allo_cell_read_only
                                }}
                                type="number"
                                variant={this.pct_allo_cell_variant}
                                helperText="%"
                                label="Pct Allocation"
                                id={item.id}
                                name="percent_allocation"
                                defaultValue={item.percent_allocation}
                                value={item.percent_allocation}
                                onChange={this.handleChangeTestCell} />
                        </TableCell>
                        { this.props.display_type === 'create' ?
                            <TableCell>
                                <Button style={removeButtonStyle} variant="contained" color="secondary" onClick={() => this.removeTestCell(item.id)} type="button">
                                    Remove
                                </Button>
                            </TableCell> : null }
                    </TableRow>)}
                </Table>
            </TableContainer>

            { this.props.display_type === 'create' ?
                <>
                <Button style={addButtonStyle} variant="contained" onClick={() => this.addTestCell()} type="button">
                    Add test cell
                </Button>

                <FormControlLabel style={checkbox} control={
                    <Checkbox
                    checked={this.state.auto_allocation}
                    onChange={this.allocationCheckboxChange}
                    name="autoAllocateCheckbox"
                    color="primary" />}
                    label="Auto allocate">
                </FormControlLabel>

                <hr style={hrStyle} />
              </> : null }
        </div>
    );
   }
}

export default TestCell;