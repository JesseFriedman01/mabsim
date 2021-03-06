import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import Box from '@material-ui/core/Box';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

class NewCampaignSummary extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const cellStyle = {
            borderWidth: 1,
            borderColor: 'black',
            borderStyle: 'solid',
            width: '100px'
        }

        return (
         <React.Fragment>
            <Container component={Paper} style={{padding:"20px", marginBottom:"20px"}} >
            <Typography variant="body1">
                <div>
                    <b>Campaign Name: </b> {this.props.campaignName}
                </div>
                <br />
                <div>
                    <b>Num. Recipients: </b> {this.props.numRecipients}
                </div>
                <br />
                <div>
                    <b>Num. Rounds: </b> {this.props.numRounds}
                </div>
                <br />
            </Typography>
            <b>Test Cells:</b>
            <TableContainer style={{width:"600px"}}>
                <Table aria-label="a dense table">
                        <TableRow style={{backgroundColor:"#c9c9c9"}}>
                            <TableCell style={cellStyle}><b>Name</b></TableCell>
                            <TableCell style={cellStyle}><b>Open Rate (%)</b></TableCell>
                            <TableCell style={cellStyle}><b>Percent Allocation (%)</b></TableCell>
                        </TableRow>

                    <TableBody>
                         {this.props.testCells.map( item =>
                            <TableRow key={item.id.toString()}>
                                <TableCell style={cellStyle}>{item.name}</TableCell>
                                <TableCell style={cellStyle}>{item.open_rate}</TableCell>
                                <TableCell style={cellStyle}>{item.percent_allocation}</TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </TableContainer>
            </Container>
         </React.Fragment>
        )
    }
}

export default NewCampaignSummary;