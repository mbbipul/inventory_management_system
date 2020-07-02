import React, { useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

export default function MaterialUIPickers(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(props.date)
  );

  useEffect(()=> {
    props.onChange(selectedDate);

  },[selectedDate]);

  const handleDateChange = (date) => {
    console.log(new Date(date.toString()));
    setSelectedDate(date);
  };


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        margin="normal"
        id="date-picker-dialog"
        label={props.label}
        format="dd-MM-yyyy"
        required={props.required}
        value={selectedDate}
        onChange={(date) => {handleDateChange(date);props.onChange(date)}}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
