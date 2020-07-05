import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FullWidthTabs from './tab';
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import '../App.css'
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const useStyles = makeStyles((theme) => ({
  root: {
    padding : 20,
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(30),
    color : "green",
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default function HistoryVisual(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    props.handleTabs(value);
  },[value]);

  return (
    <div className={classes.root}>
      <MuiAccordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              {
                props.tabs.map( (tab,i) => (
                  <Tab label={tab.tab} {...a11yProps(i)} />

                ))
              }
            
            </Tabs>
         </AppBar>
        </AccordionSummary>
     
        <AccordionDetails style={{backgroundColor : "#c7d1d1"}}>
            {
              props.tabs.map( (tab,i) => (
                <TabPanel value={value} index={i}>
                  {tab.tabPanel}
                </TabPanel>

              ))
            }
       
        </AccordionDetails>
      </MuiAccordion>
    
    </div>
  );
}
