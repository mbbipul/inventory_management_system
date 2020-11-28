import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, tk) {
  return { name, tk };
}



const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
});

export default function CustomizedTables(props) {
  const classes = useStyles();
  const rows = [
    createData('Total Sales', props.rows.todaysSales),
    createData('Total Purchase', props.rows.todaysPurchase),
    createData('Total Cost Amount', props.rows.totalCostAmount),
    createData('Total Salary Amount', props.rows.totalSalaryAmount),
    createData('Total Damage Return Amount', props.rows.totalDamageReturnAmount),
    createData('Total Damage Return Company Amount', props.rows.totalDamgeReturnFromCompanyAmount),

  ];
  
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{props.title} Report</StyledTableCell>
            <StyledTableCell align="left">Taka</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="left">{row.tk} tk</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
