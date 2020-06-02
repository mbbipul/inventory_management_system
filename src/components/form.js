import React from 'react';
import {TextField ,Grid , MenuItem , Divider , Button} from '@material-ui/core';

class Form extends React.Component {
    render(){
        return(
            <form  noValidate autoComplete="off" style={{padding:20,paddingBottom:50}}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                    spacing={3}
                >
                    {
                        this.props.fields.map( (field,i) => {
                            let item = "";
                            let options = ["Mobile","Milk","Ice Cream"];

                            switch (field.type) {
                                case 0:
                                    item = <Grid key={i} item xs={6}>
                                        <TextField
                                            label={field.label}
                                            fullWidth
                                            placeholder={field.placeholder}
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            />  
                                    </Grid>    ;
                                    break;
                                case 1:
                                    item = <Grid key={i} item xs={6}>
                                        <TextField
                                            select
                                            label={field.label}
                                            value={options[0]}
                                            helperText={field.placeholder}
                                            variant="outlined"
                                        >
                                            {options.map((option) => (
                                            <MenuItem key={option} value={option}>
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
                                                multiline
                                                rows={4}
                                                placeholder={field.placeholder}
                                                variant="outlined"
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