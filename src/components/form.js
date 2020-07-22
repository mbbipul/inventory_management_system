import React from 'react';
import {TextField ,Grid , MenuItem , Divider , Button, Paper, Card, Chip} from '@material-ui/core';
import AsyncAutoComplete from './asyncAutoComplete';
import submitForm from '../utils/fetchApi';
import MaterialUIPickers from './datePicker';


class Form extends React.Component {

    constructor(props){
        super(props);
        this.apiUrl = "https://localhost:5001/api/";
        this.state = {
            hasAnyError: [],
        };
    }

    updateDependsOnValue = (name,dependsValue) => {
        this.setState({[name+"dpendsOnValue"] : dependsValue});
    }

    handleOnDependsError = (error,fieldIndex) => {
        var errorArray = this.state.hasAnyError;
        errorArray[fieldIndex] = error;
        this.setState({
            hasAnyError : errorArray,
        });
    }
    handleInputChange = (event,fieldIndex,field)  => {
        const target = event.target;
        const value = target.value;
        const name = target.name.replace(/\s/g, '');

        const validation = field.validation;
        const fetchUrl = field.fetchUrl;
        var errorArray = this.state.hasAnyError;
     
        console.log("call by "+field.label);
        switch (validation[0]) {

            case 0://only number valid

                if (!this.isNormalInteger(value)){
                    errorArray[fieldIndex] = true;
                    this.setState({
                        hasAnyError : errorArray,
                        [name+"HasError"] : true,
                        [name+"helperText"] : target.name+" must be a integer number"
                    });
                }else{
                    errorArray[fieldIndex] = false;
                    this.setState({
                        hasAnyError : errorArray,
                        [name+"HasError"] : false,
                        [name+"helperText"] : ""
                    });
                }
                break;
            case 1 ://check if exists to db
                errorArray = this.state.hasAnyError;

                let isDataExists = (result) => {
                    if( result === "true"){
                        errorArray[fieldIndex] = true;
                        this.setState({
                            hasAnyError : errorArray,
                            [name+"HasError"] : true,
                            [name+"helperText"] : target.name+" already exists !"
                        });
                    }else{
                        errorArray[fieldIndex] = false;
                        this.setState({
                            hasAnyError : errorArray,
                            [name+"HasError"] : false,
                            [name+"helperText"] : ""
                        });
                    }
                }
                submitForm(fetchUrl+value,"GET","",isDataExists);
                break;

            default:
                break;
        }

        this.setState({
          [name]: value,
        });
    }

    handleAutoComplete = (field,value) => {

        const name = field.label.replace(/\s/g, '');

        if (field.hasOwnProperty("dependOnThis")){
            this.setState({
                [field.dependOnThis+"show"]: value === null ? false : true,
            });
        }
        this.setState({
            [name]: value,
        });
    }

    handleDatePiker = (field,value) => {
        const name = field.label.replace(/\s/g, '');
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
        e.stopPropagation();
        // e.target.reset();
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
                            console.log(this.state[fieldName+"HasError"]);
                            if (  this.state[fieldName+"HasError"] === true ){
                                helperText = this.state[fieldName+"helperText"];
                                error = true;
                            }
                            switch (field.type) {
                                case 0: //textfield
                                    item = <Grid key={i} item xs={6}>
                                        <TextField
                                            disabled={field.disabled}
                                            error={error}
                                            label={field.label}
                                            name={fieldName}
                                            fullWidth
                                            placeholder={field.placeholder}
                                            margin="normal"
                                            helperText={helperText}
                                            required={field.required}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            onChange={(event) => this.handleInputChange(event,i,field)}
                                            />  
                                    </Grid>    ;
                                    break;
                                case 1: //selct options
                                    item = <Grid key={i} item xs={6}>
                                        <TextField
                                            select
                                            error={error}
                                            label={field.label}
                                            fullWidth
                                            value={this.state[fieldName] === undefined ? options[0] : this.state[fieldName]}
                                            name={field.label}
                                            required={field.required}
                                            onChange={(event) => this.handleInputChange(event,i,field)}
                                            helperText={helperText}
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
                                case 2: // text area
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
                                                onChange={(event) => this.handleInputChange(event,i,field)}

                                            />
                                        </Grid>;
                                    break;

                                case 3 : //async select option
                                    item = <Grid item xs={6}>
                                            <AsyncAutoComplete
                                                label={field.label}
                                                name={field.label}
                                                placeholder={field.placeholder}
                                                margin="normal"
                                                dialogContent={field.dialogFormContent}
                                                required={field.required}
                                                fetchUrl={field.fetchUrl}
                                                validation={field.validation}
                                                selectKey={field.selectKey}
                                                selectName={field.selectName}
                                                onDataChange={(fieldName,value)=>this.handleAutoComplete(field,value)}

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
                                            onChange={(event) => this.handleInputChange(event,i,field)}
                                            />  
                                    </Grid>    ;
                                    break;      
                                case 5: // TextField with subtitle
                                    item = <Grid key={i} item xs={6}>
                                        <TextField
                                            disabled={field.disabled}
                                            error={error}
                                            label={field.label+field.labelExtra}
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
                                            onChange={(event) => this.handleInputChange(event,i,field)}
                                            />  
                                    </Grid>    ;
                                    break;

                                case 6: // date pickers
                                    item = <Grid key={i} item xs={6}>
                                        <MaterialUIPickers 
                                            label={field.label}
                                            date={field.placeholder}
                                            name={field.label}
                                            required={field.required}
                                            onChange={(date) => this.handleDatePiker(field,date)}
                                        />
                                    </Grid>    ;
                                    break;
                                case 7: // value from others
                                    var dependsValue = 0; 
                                    var textfield = "";
                                    let dError = false;

                                    switch(field.dependsOn.operation){
                                        
                                        case 3 : 
                                            dependsValue = (this.state[field.dependsOn.field[0].replace(/\s/g, '')] -this.state[field.dependsOn.field[1].replace(/\s/g, '')]) /
                                                this.state[field.dependsOn.field[2].replace(/\s/g, '')] ;
                                                if(Number.isNaN(dependsValue)){
                                                        dependsValue = 0.00;
                                                }
                                                textfield = <TextField
                                                    disabled={field.disabled}
                                                    label={field.label+field.labelExtra}
                                                    name={field.label}
                                                    error={error}
                                                    helperText={helperText}
                                                    fullWidth
                                                    placeholder={field.placeholder}
                                                    margin="normal"
                                                    required={field.required}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={dependsValue}
                                                    variant="outlined"
                                                    onChange={(event) => this.handleInputChange(event,i,field)}
                                            />  
                                            break;

                                        case 4 : 
                                            dependsValue = this.state[field.dependsOn.field[0].replace(/\s/g, '')] -
                                                this.state[field.dependsOn.field[1].replace(/\s/g, '')] ;
                                            console.log(dependsValue);
                                            if(this.state[field.label.replace(/\s/g, '')] > dependsValue ){

                                                dError = true;
                                                helperText = field.label + " Cannot greater than actual "+field.dependsOn.field[0];
                                            }else{
                                                dError = false;

                                            }
                                            textfield =  <TextField
                                                disabled={field.disabled}
                                                label={field.label}
                                                name={field.label}
                                                error={dError}
                                                helperText={helperText}
                                                fullWidth
                                                placeholder={field.placeholder}
                                                margin="normal"
                                                required={field.required}
                                                InputLabelProps={{
                                                }}
                                                variant="outlined"
                                                onKeyUp={() => this.handleOnDependsError(dError,i)}
                                                onChange={(event) => {this.handleInputChange(event,i,field);}}
                                            />  

                                            break;
                                        case 5 : 
                                            dependsValue = this.state[field.dependsOn.field[0].replace(/\s/g, '')] ;
                                            dError = false;
                                            if(this.state[field.label.replace(/\s/g, '')] > dependsValue[field.dependsOn.field[1]] ){

                                                dError = true;
                                                helperText = field.label + " Cannot greater than actual "+field.dependsOn.field[0];
                                            }else{
                                                dError = false;

                                            }
                                            textfield =  <TextField
                                                disabled={field.disabled}
                                                label={field.label}
                                                name={field.label}
                                                error={dError}
                                                helperText={helperText}
                                                fullWidth
                                                placeholder={field.placeholder}
                                                margin="normal"
                                                required={field.required}
                                                InputLabelProps={{
                                                }}
                                                variant="outlined"
                                                onKeyUp={() => this.handleOnDependsError(dError,i)}
                                                onChange={(event) => {this.handleInputChange(event,i,field);}}
                                            />  

                                            break;
                                        case 6 : 
                                            dependsValue = this.state[field.dependsOn.field[0].replace(/\s/g, '')]*this.state[field.dependsOn.field[1].replace(/\s/g, '')] -
                                                this.state[field.dependsOn.field[2].replace(/\s/g, '')] ;  
                                            dError = false;
                                            console.log(dependsValue);
                                            if(parseInt(this.state[field.label.replace(/\s/g, '')]) > dependsValue ){

                                                dError = true;
                                                helperText = field.label + " Cannot greater than actual "+field.dependsOn.field[0];
                                            }else{
                                                dError = false;

                                            }
                                            textfield =  <TextField
                                                disabled={field.disabled}
                                                label={field.label}
                                                name={field.label}
                                                error={dError}
                                                helperText={helperText}
                                                fullWidth
                                                placeholder={field.placeholder}
                                                margin="normal"
                                                required={field.required}
                                                InputLabelProps={{
                                                }}
                                                variant="outlined"
                                                onKeyUp={() => this.handleOnDependsError(dError,i)}
                                                onChange={(event) => {this.handleInputChange(event,i,field);}}
                                            />  

                                            break;

                                        default:
                                            break;
                                    }
                                    
                                    item = <Grid key={i} item xs={6}>
                                       {textfield}
                                    </Grid>    ;
                                    break;
                                case 8 : //depends on many
                                    dependsValue = 0.00;
                                    let content = "";
                                    switch(field.dependsOn.operation){
                                        case 1 : //subs
                                            dependsValue = this.state[field.dependsOn.field[0].replace(/\s/g, '')] -
                                                this.state[field.dependsOn.field[1].replace(/\s/g, '')] ;
                                            if(Number.isNaN(dependsValue)){
                                                    dependsValue = 0.00;
                                            }
                                            content = 
                                                    <Paper  elevation={3} style={{color:"green",padding:1,textAlign:"center",marginTop:13}}>
                                                            <h3>
                                                            {
                                                                field.label+" : "+
                                                                dependsValue
                                                            }
                                                            </h3>
                                                    </Paper>;
                                            break;

                                        case 2 :
                                            let dError = false;

                                            dependsValue = 0 ;
                                            if(typeof this.state[field.dependsOn.field[0].replace(/\s/g, '')] !== 'undefined' && this.state[field.dependsOn.field[0].replace(/\s/g, '')] !== null){
                                                dependsValue = this.state[field.dependsOn.field[0].replace(/\s/g, '')][field.dependsOn.field[1]];
                                            
                                                if(this.state[field.label.replace(/\s/g, '')] > dependsValue ){

                                                    dError = true;
                                                    helperText = "Only " + this.state[field.dependsOn.field[0].replace(/\s/g, '')][field.dependsOn.field[1]] + " Products are in stock! ";
                                                }else if(dependsValue === 0 ){
                                                    dError = true;
                                                    helperText = "Product out of stock! ";
                                                }
                                                else{
                                                    dError = false;
                                                    if(this.state[field.label.replace(/\s/g, '')]==""){
                                                        dError = true;
                                                    }

                                                }
                                            }

                                            content =  <TextField
                                                disabled={field.disabled}
                                                label={field.label}
                                                name={field.label}
                                                error={dError}
                                                helperText={helperText}
                                                fullWidth
                                                placeholder={field.placeholder}
                                                margin="normal"
                                                required={field.required}
                                                InputLabelProps={{
                                                }}
                                                variant="outlined"
                                                onKeyUp={() => this.handleOnDependsError(dError,i)}
                                                onChange={(event) => {this.handleInputChange(event,i,field);}}
                                            />  
                                            break;
                                        case 3 : 
                                            dependsValue = this.state[field.dependsOn.field[0].replace(/\s/g, '')]*this.state[field.dependsOn.field[1].replace(/\s/g, '')] -
                                                this.state[field.dependsOn.field[2].replace(/\s/g, '')] ;
                                            if(Number.isNaN(dependsValue)){
                                                    dependsValue = 0.00;
                                            }
                                            content = 
                                                    <Paper  elevation={3} style={{color:"green",padding:1,textAlign:"center",marginTop:13}}>
                                                            <h3>
                                                            {
                                                                field.label+" : "+
                                                                dependsValue
                                                            }
                                                            </h3>
                                                    </Paper>;
                                            break;
                                        default:
                                            break;
                                    }
                                    item = <Grid key={i} item xs={6}>
                                                {content}
                                            </Grid>;
                                    break;

                                case 9:
                                    if(this.state.hasOwnProperty(field.label+"show") && this.state[field.label+"show"]){
                                        item = <Grid key={i} item xs={12}>
                                                <div >
                                                    {
                                                        field.content.map((c,i) => {
                                                            let data = c.label+" : "+this.state[field.dependsOn][c.data]+c.postText;
                                                            if(i===0){
                                                                data = c.label+" : "+this.state[field.dependsOn][c.data]/this.state[field.dependsOn].totalProducts+c.postText;
                                                            }
                                                            return(
                                                                <Chip label={<span style={{color:"green"}}>{data}</span>} style={{marginRight : 50}} />

                                                            )

                                                        })
                                                    }
                                                </div>
                                            </Grid>;
                                    }
                                    
                                    break;
                                case 999:// break line
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
                <Button type="submit" disabled={this.state.hasAnyError.includes(true)} style={{float:"right"}} variant="contained" color="primary">
                    {this.props.submitButton}
                </Button>
        </form>
        )
    }
}

export default Form;