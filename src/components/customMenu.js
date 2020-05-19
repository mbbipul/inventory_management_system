import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function CustomMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(props.hoverMenuAnchorEl);
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {
                props.menuItems.map ( (item,i) => (
                    <MenuItem key={i} onClick={handleClose}>{item}</MenuItem>
                ))
            }
        </Menu>
    );
}
