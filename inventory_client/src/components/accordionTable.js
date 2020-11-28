import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { green, grey } from '@material-ui/core/colors';
import { Card, createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import ProductTable from '../components/productTable';
import MaterialTable from 'material-table';

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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const Theme = (theme) => createMuiTheme({
    palette: {
      type: theme,
    },
  });
  return (
    <ThemeProvider theme={Theme(props.theme)}>
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
                            <Typography className={i == 0 ? classes.heading : classes.secondaryHeading}>{h}</Typography>
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
                                <Typography className={i == 0 ? classes.heading : classes.secondaryHeading}>{h}</Typography>
                            ))
                        }

                        </AccordionSummary>
                        
                        <AccordionDetails>
                            <ThemeProvider theme={Theme(props.theme)}>
                                <MaterialTable 
                                    title={props.title+acc.key}
                                    columns={props.columns}
                                    data={acc.data}/>
                            </ThemeProvider>
                        </AccordionDetails>
                    </Accordion>
                </ThemeProvider>
            ))
        }
      
    </ThemeProvider>
  );
}
