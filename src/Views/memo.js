import React from "react";
import Form from "../components/form";
import { memoFormFields } from "../utils/appFormsFileds";

function SalesMemo(){

    const submitForms = (state) => {

    }
    return (
        <div>
            <Form onSubmit={submitForms}  submitButton="Print Memo" fields={memoFormFields}/>
        </div>
    );
}

export default SalesMemo;