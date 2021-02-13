import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Card, createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import MaterialTable from 'material-table';
import { exportCsv } from '../utils/apiInfo';
import { useReactToPrint } from 'react-to-print';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    flexBasis: '30%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(14),
    flexBasis: '30%',
    flexShrink: 0,
  },

 
}));

export default function AccordionsTable(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const printRef = useRef();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const Theme = (theme) => createMuiTheme({
    palette: {
      type: theme,
    },
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <ThemeProvider theme={Theme(props.theme)}>
        <Button
          style={{marginBottom: 20}} color='primary' variant='contained' onClick={handlePrint}>
          Print 
        </Button>
        <div ref={printRef}>
          <Card style={{padding : 20 , marginBottom : 20}}>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                {
                    props.headers.map((h,i) => (
                        <Grid item xs>
                            <Typography className={i === 0 ? classes.heading : classes.secondaryHeading}>{h}</Typography>
                        </Grid>
                    ))
                }
                
            </Grid>
        </Card>
       
        {
            props.accordions.map((acc,i) => (
                <ThemeProvider theme={Theme(expanded === 'panel'+i ? 'light' : 'dark')}>
                    <Accordion expanded={expanded === 'panel'+i} onChange={handleChange('panel'+i)}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel"+i+"bh-content"}
                        id={"panel"+i+"bh-header"}
                        >
                        {
                            acc.headers.map((h,i) => (
                                <Typography className={i === 0 ? classes.heading : classes.secondaryHeading}>{h}</Typography>
                            ))
                        }

                        </AccordionSummary>
                        
                        <AccordionDetails>
                            <ThemeProvider theme={Theme(props.theme)}>
                                <MaterialTable 
                                    options={{exportButton : true,exportCsv}}
                                    title={props.title+acc.key}
                                    columns={props.columns}
                                    data={acc.data}/>
                            </ThemeProvider>
                        </AccordionDetails>
                    </Accordion>
                </ThemeProvider>
            ))
        }
        </div>
    </ThemeProvider>
  );
}
