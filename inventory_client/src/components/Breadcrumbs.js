import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import '../App.css';

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.3),
    width: 20,
    height: 20,
  },
}));

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function IconBreadcrumbs(props) {
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link color="inherit" href="/" onClick={handleClick} className={classes.link}>
        <HomeIcon className={classes.icon} />
        Home
      </Link>
      {
        props.crumbs.map((crumb,i) => {
          let item = <Link
              color="inherit"
              href="/getting-started/installation/"
              onClick={handleClick}
              className={classes.link}
            >
              <i className="material-icons md-20 md-dark">{crumb.icon}</i>
              {crumb.title}
            </Link> ;
          if (i===props.crumbs.length-1){
            item =  <Typography color="textPrimary" className={classes.link}>
              <i className="material-icons md-20 md-dark">{crumb.icon}</i>
              {crumb.title}
            </Typography> ;
          }
          return item;
        })
      }
      </Breadcrumbs>

  );
}
