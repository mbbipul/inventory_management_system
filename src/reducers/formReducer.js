const initialState = {
    formValues: {},
    formSubmitTo : "",
    message: ""
  };
  
  const formReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_FORMVALUES":
        return {
          ...state,
          formValues: action.payload
        };
      case "SUBMIT_FORM":
        console.log("--- Triggered Form submission ---");
        console.log("Form Data - ", state.formValues);
        return {
          ...state,
          message: "Form submitted!!"
        };
      default:
        return state;
    }
  };
  
  export default formReducer;