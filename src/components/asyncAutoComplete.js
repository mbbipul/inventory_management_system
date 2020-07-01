import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

export default function AsyncAutoComplete(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  

  const [inputData, setInputData] = React.useState("");
  const [showButton, setAdd] = React.useState(false);

  const loading = open && options.length === 0;

  React.useEffect(() => {
    console.log("hasNoData");
   }, [showButton]);

  useEffect ( () => {
    
    if(options.some( e => e[props.selectName] === inputData) && options.length !== 0){
      setAdd(false);
    }else{
      setAdd(true);
    }
  },[inputData]);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch(
        props.fetchUrl
      );
      await sleep(4); // For demo purposes.
      const datas = await response.json();
      if (datas.length == 0){
        setAdd(true);
        setOptions([{[props.selectName] : "No Data to Show"}]);
      }
      if (active) {
        setOptions(datas);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setAdd(false);
      setOptions([]);
    }
  }, [open]);

  const handleAutoComplete = (name,value) => {
    console.log(value);
    props.onDataChange(name,value);
  }
  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      name={props.name}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event,value) => handleAutoComplete(props.name,value)} // prints the selected value
      getOptionSelected={(option, value) => option[props.selectName] === option[props.selectName]}
      getOptionLabel={option => option[props.selectName]}
      getOptionDisabled={(option) => option[props.selectName] === "No Data to Show"}
      options={options}
      loading={loading}
      renderInput={params => (
        <div>
          <TextField
            {...params}
            label={props.label}
            name={props.name}
            variant="outlined"
            required={props.required}
            onChange={e => setInputData(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : () => alert("not found")}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
         { showButton && <Button size="small" style={{marginTop:"-28%",marginLeft:"105%"}} variant="outlined" color="primary">
            Add
          </Button>
          }
        </div>
      )}
    />
  );
}
