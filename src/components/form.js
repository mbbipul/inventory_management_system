import React from 'react';
import {TextField ,Grid , MenuItem , Divider , Button} from '@material-ui/core';

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

    handleInputChange = (event,validation)  => {
        const target = event.target;
        const value = target.value;
        const name = target.name.replace(/\s/g, '');

        if (validation[0] === 0){
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
        }
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
        let state = this.state;
        let product = {
            "productName" : state.ProductName,
            "productCode" : state.ProductCode,
            "productType" : state.ProductType,
            "productQuantity" : parseInt(state.ProductQuantity),
            "productPrice" : parseInt(state.ProductPrice),
        }
        console.log(product);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(product);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://localhost:5001/api/Products", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    
    }
    render(){
        return(
            <form  autoComplete="off" style={{padding:20,paddingBottom:50}} onSubmit={this.handleSubmit}>
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
                                    item =<Grid item xs={12}>
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
                                case 999:
                                    item = <Grid key={i} item xs={12}>
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
                <Button type="submit" style={{float:"right"}} variant="contained" color="primary">
                    Add Product
                </Button>
        </form>
        )
    }
}

export default Form;