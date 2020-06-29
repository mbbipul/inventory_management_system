import React from 'react';
import {TextField ,Grid , MenuItem , Divider , Button} from '@material-ui/core';
import AsyncAutoComplete from './asyncAutoComplete';
import submitForm from '../utils/fetchApi';

class Form extends React.Component {

    constructor(props){
        super(props);
        this.apiUrl = "https://localhost:5001/api/";
        this.state = {
            currentTarget : null,
            error : false,
            helperText : "",
        };
    }

    handleInputChange = (event,validation,fetchUrl)  => {
        const target = event.target;
        const value = target.value;
        const name = target.name.replace(/\s/g, '');

        switch (validation[0]) {
            case 0://only number valid
                if (!this.isNormalInteger(value)){
                    this.setState({
                        currentTarget : target.name,
                        error : true,
                        helperText : target.name+" must be a integer number"
                    });
                }else{
                    this.setState({
                        helperText : "",
                        error : false
                    });
                }
                break;
            case 1 ://check if exists to db
                let isCompanyExits = (result) => {
                    if( result === "true"){
                        this.setState({
                            currentTarget : target.name,
                            error : true,
                            helperText : target.name+" already exists !"
                        });
                    }else{
                        this.setState({
                            helperText : "",
                            error : false
                        });
                    }
                }
                submitForm(fetchUrl+value,"GET","",isCompanyExits);
                break;

            default:
                break;
        }
        this.setState({
          [name]: value,
        });
    }

    handleAutoComplete = (fieldName,value) => {

        const name = fieldName.replace(/\s/g, '');

        this.setState({
            [name]: value,
        });
    }

    
    isNormalInteger = (str) =>{
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 0;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        this.props.onSubmit(this.state);
    }
    
    render(){
        return(
            <form autoComplete="off" style={{padding:20,paddingBottom:50}} onSubmit={this.handleSubmit}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                    spacing={3}
                >
                    {
                        this.props.fields.map( (field,i) => {

                            let fieldName = field.label.replace(/\s/g, '');
                            let item = "";
                            let options = ["Mobile","Milk","Ice Cream"];
                            let helperText = "";
                            let error = false;
                            if (this.state.currentTarget === field.label ){
                                helperText = this.state.helperText;
                                error = this.state.error;
                            }
                            switch (field.type) {
                                case 0:
                                    item = <Grid key={i} item xs={6}>
                                        <TextField
                                            disabled={field.disabled}
                                            error={error}
                                            label={field.label}
                                            name={field.label}
                                            fullWidth
                                            placeholder={field.placeholder}
                                            margin="normal"
                                            helperText={helperText}
                                            required={field.required}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            onChange={(event) => this.handleInputChange(event,field.validation)}
                                            />  
                                    </Grid>    ;
                                    break;
                                case 1:
                                    item = <Grid key={i} item xs={6}>
                                        <TextField
                                            select
                                            label={field.label}
                                            fullWidth
                                            value={this.state[fieldName] === undefined ? options[0] : this.state[fieldName]}
                                            name={field.label}
                                            required={field.required}
                                            onChange={(event) => this.handleInputChange(event,field.validation)}
                                            helperText={this.state[field.label.replace(/\s/g, '')+"helperText"]}
                                            variant="outlined"
                                            
                                        >
                                            {options.map((option) => (
                                            <MenuItem key={option} value={option}
                                                name={field.label}>
                                                {option}
                                            </MenuItem>
                                            ))}
                                        </TextField>   
                                    </Grid>
                                     ;
                                    break;
                                case 2:
                                    item = <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label={field.label}
                                                required={field.required}
                                                name={field.label}
                                                multiline
                                                helperText={helperText}
                                                rows={4}
                                                placeholder={field.placeholder}
                                                variant="outlined"
                                                onChange={(event) => this.handleInputChange(event,field.validation)}

                                            />
                                        </Grid>;
                                    break;

                                case 3 :
                                    item = <Grid item xs={12}>
                                            <AsyncAutoComplete
                                                label={field.label}
                                                name={field.label}
                                                placeholder={field.placeholder}
                                                margin="normal"
                                                required={field.required}
                                                fetchUrl={field.fetchUrl}
                                                validation={field.validation}
                                                selectKey={field.selectKey}
                                                selectName={field.selectName}
                                                onDataChange={this.handleAutoComplete}

                                            />
                                        </Grid>;
                                    break;
                                case 4 : //for unique value .check to api
                                    item = <Grid key={i} item xs={6}>
                                        <TextField
                                            disabled={field.disabled}
                                            error={error}
                                            label={field.label}
                                            name={field.label}
                                            fullWidth
                                            placeholder={field.placeholder}
                                            margin="normal"
                                            helperText={helperText}
                                            required={field.required}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            onChange={(event) => this.handleInputChange(event,field.validation,field.fetchUrl)}
                                            />  
                                    </Grid>    ;
                                    break;          
                                case 999:
                                    item = <Grid key={i} item xs={12}>
                                                <br />
                                                <Divider />
                                            </Grid>;
                                    break;
                                default:
                                    break;
                            }  
                            return item;             
                        })
                    }        
                </Grid>
                <br />
                <Button type="submit" disabled={this.state.error} style={{float:"right"}} variant="contained" color="primary">
                    {this.props.submitButton}
                </Button>
        </form>
        )
    }
}

export default Form;