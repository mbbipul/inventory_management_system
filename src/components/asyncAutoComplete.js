import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

export default function AsyncAutoComplete(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch(
        props.fetchUrl
      );
      await sleep(1e3); // For demo purposes.
      const datas = await response.json();

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
      setOptions([]);
    }
  }, [open]);

  const handleAutoComplete = (name,value) => {
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
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label={props.label}
          name={props.name}
          variant="outlined"
          required={props.required}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}
