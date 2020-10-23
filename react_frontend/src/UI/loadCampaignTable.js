import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Tooltip from '@material-ui/core/Tooltip';

function createDataArray(data) {
//    console.log('data', data[0])
    let dataArray = []
    for (var i = 0; i < data.length; i++){
        const rowDict = {}
        rowDict['id'] = data[i][0]
        rowDict['creation_date'] = data[i][1]
        rowDict['sim_name'] = data[i][2]
        rowDict['description'] = data[i][3]
        dataArray.push(rowDict)
    }
    return dataArray
}

//const rows = [
//  createData("Cupcake", 305, 3.7, 67, 4.3),
//  createData("Donut", 452, 25.0, 51, 4.9),
//  createData("Eclair", 262, 16.0, 24, 6.0),
//  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//  createData("Gingerbread", 356, 16.0, 49, 3.9),
//  createData("Honeycomb", 408, 3.2, 87, 6.5),
//  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//  createData("Jelly Bean", 375, 0.0, 94, 0.0),
//  createData("KitKat", 518, 26.0, 65, 7.0),
//  createData("Lollipop", 392, 0.2, 98, 0.0),
//  createData("Marshmallow", 318, 0, 81, 2.0),
//  createData("Nougat", 360, 19.0, 9, 37.0),
//  createData("Oreo", 437, 18.0, 63, 4.0)
//];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "sim_name", numeric: false, disablePadding: true, label: "Sim Name" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Created" },
  { id: "description", numeric: false, disablePadding: false, label: "Description" }
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 1000
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  button_div:{
    padding: theme.spacing(2)
  }
}));

export default function LoadCampaignTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState(props.dataForTable);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
      setData(props.dataForTable);
  }, [props.dataForTable]);

  const rows = createDataArray(data)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, id, index) => {
    if (selected === id){
        setSelected(null);
        props.setItemSelectedFromTable(null)
    }
    else{
        setSelected(id);
        props.setItemSelectedFromTable(id)
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => {
    if (name === selected) return true;
    return false;
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id, index)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      style={ isItemSelected===true ? {backgroundColor:'#ededed'} : {backgroundColor:'white'}}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">{row.sim_name}</TableCell>
                      <TableCell >{row.creation_date}</TableCell>
                      <TableCell >
                        {row.description && row.description.length > 100 ?
                            <>{row.description.slice(0,99)}...
                            <Tooltip title={row.description}>
                                <Button disableRipple={true} color="primary" size="small">more</Button>
                            </Tooltip>
                            </>
                        : <>{row.description}</>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={2} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={rows.length}
          labelRowsPerPage={""}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
        />
      </Paper>


    </div>
  );
}
