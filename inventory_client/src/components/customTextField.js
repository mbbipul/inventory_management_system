import { TextField } from "@material-ui/core";
import React, { useState } from "react";

const FormComponent = ({ setState, state, }) => (
  <form>
      <TextField
        type="text"
        value={state}
        onChange={e => setState(e.target.value)}
      />
  </form>
);

export default function useTextField(defaultState) {
  const [state, setState] = useState(defaultState);

  return [
    state,
    <FormComponent state={state} setState={setState} />,
    setState
  ];
}
