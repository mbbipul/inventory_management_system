import React, { useEffect } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import submitForm from "../utils/fetchApi";
import { Chip, Box } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'block',
    backgroundColor: theme.palette.background.paper
  },
  tab: {
    color: "#fff",
    background: "#000",
    border: "2px solid #e3142d",
    borderRadius: 50,
    "&:hover": {
      boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)"
    },
    "&:focus": {
      color : "red",
      boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)"
    }
  }
}));

export default function ToggleButtons(props) {


  const [toggle, setToggleAct] = React.useState(99999999);
  const [data, setData] = React.useState([]);

  const handleToggle = (event, act) => {
    if ( act !== null ){
      setToggleAct(act);
    }
  };

  const onFetchDataSuccess = (result) => {
    setData(JSON.parse(result));

  }

  useEffect(() => {
    props.onChange(data[toggle]);
  },[toggle]);

  useEffect(() => {
    props.onChange(data[toggle]);

  },[data]);

  useEffect(() => {
    submitForm("PurchaseHistories/product/"+props.title.productId,"GET","",onFetchDataSuccess);
  },[props.title]);

  const classes = useStyles();

  return (
    <div>
        <Box component="div" style={{margin: 10,marginLeft:"20%",marginBottom: 20,}}>

         <ToggleButtonGroup
            className={classes.root}
            value={toggle}
            exclusive
            onChange={handleToggle}
            aria-label="text alignment"
          >
          {
              data.map((item,i) => {
                let jsx = <ToggleButton
                              className={classes.tab}
                              value={i}
                          >
                              {
                                props.title.productName+ " - "+ item.perProductPurchasePrice+"tk"
                              }
                          </ToggleButton>
                if (item.productQuantity <= 0){
                  jsx = '';
                  return jsx;
                }
                return jsx;
                  
           })
          }
        
          
          
        </ToggleButtonGroup>
        </Box>

        {
         props.field.content.map((c,i) => {
              if ( toggle === 99999999){
                return ;
              }
              let chip ="";
              if(data.length > 0){
                chip = c.label+" : "+data[toggle][c.data]+c.postText
              }

             return(
                 <Chip label={<span style={{color:"green"}}>{chip}</span>} style={{marginRight : 50}} />

             )

           })
         }
    </div>
    
  );
}
