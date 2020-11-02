import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, LinearProgress, MenuItem, Select } from '@material-ui/core';
import ProfileList from '../../components/profileList';
import { event } from 'jquery';
import { userService } from '../../services/userServices';
import Alert from '@material-ui/lab/Alert';
import { green, grey, purple, yellow } from '@material-ui/core/colors';

import signInSuccessImage from '../../assets/signin_success.jpg';
import breakImage from '../../assets/break.png';
import { decode } from 'js-base64';
import { getStoreInfo } from '../../utils/storeInfo';
import AppContext from '../../context/appContext';
import submitForm from '../../utils/fetchApi';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="textSecondary" href="#/">
	  	Multidimensional It Solution
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
			padding : 170,
			backgroundImage: 'url(https://miro.medium.com/max/3840/1*x0sK7t8o1vhbaIBx5uWYWg.jpeg)',
			backgroundRepeat: 'no-repeat',
			backgroundColor:
				theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
			backgroundSize: 'cover',
			backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	overFlowY : {
		maxHeight : '100vh',
		overflowY : 'scroll'
	},
	signInSuccess : {
		minHeight : 250,
		minWidth: 250,
		backgroundImage: `url("${signInSuccessImage}")`,
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	showSignInSuccess : {
		backgroundColor : '#1998CF'  ,
		color : '#fff',
	
	},
	showSignInNotSuccess : {
		backgroundColor : '#1998CF'  ,
		color : '#fff',
	
	},
	signInNotSuccess : {
		minHeight : 250,
		minWidth: 250,
		backgroundImage: `url("${breakImage}")`,
		backgroundRepeat: 'no-repeat',
		backgroundColor: 'tranparent',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	}
}));


export default function SignInSide() {

  	const classes = useStyles();
	const [switchForm,setSwitchForm] = useState(true);
	const [showSignInSuccess,setShowSignInSuccess] = useState(false);
	const [allUsers,setUsers] = useState([]);

	const [userEmail,setUserEmail] = useState('');
	const [userPassword,setUserPassword] = useState('');
	const [userFirstName,setFirstName] = useState('');
	const [userLastName,setLastName] = useState('');
	const [storeType,setStore] = useState(999);
	const [isUserSuperAdmin,setSuperAdmin] = useState(false);

	const [isSignUpSuccess,setSignUpSuccess] = useState(false);
	const [isSignInSuccess,setSignInSuccess] = useState(false);
	const [isSignInNotSuccess,setSignInNotSuccess] = useState(false);

	const [currentUser,setUserInfo] = useState(null);
	const [userFullName,setUserFullName] = useState('');

	const {  setUserLoginStatus , setUser } = React.useContext(AppContext);
	const [progress, setProgress] = React.useState(0);

	const retryLogin = () => {
		setShowSignInSuccess(!showSignInSuccess);
		setSignInNotSuccess(!isSignInNotSuccess);
	}
	const switchSignInUp = () => {
		setSwitchForm(!switchForm);
	};

	const switchSignInSuceess = () => {
		setShowSignInSuccess(!showSignInSuccess);
		setSignInSuccess(!isSignInSuccess);
		
		const timer = setInterval(() => {
			setProgress((oldProgress) => {
			  if (oldProgress === 100) {
				setUserLoginStatus(true);
				setUser();
				return 0;
			  }
			  const diff = Math.random() * 10;
			  return Math.min(oldProgress + diff, 100);
			});
		}, 100);
		
		return () => {
			clearInterval(timer);
		  
		};
	}

	const handleSuperAdminCheckbox = () => {
		setSuperAdmin(!isUserSuperAdmin);
	}

	const signUpSuccess = () => {
		switchSignInUp();
		setSignUpSuccess(true);
		setTimeout(function() {
			setSignUpSuccess(false);
		}, 1500);
	}

	const signInSuccess = () => {
		switchSignInSuceess();
	}

	const signInNotSuccess = () => {
		setShowSignInSuccess(!showSignInSuccess);
		setSignInNotSuccess(!isSignInNotSuccess);
		setUserLoginStatus(false);
	}

	const handleSignUpSubmit = (e) => {
		e.preventDefault();
		let user = {
			firstName : userFirstName,
			lastName : userLastName,
			userEmail : userEmail,
			password : userPassword,
			adminRole : storeType,
			hasSuperAdminRole : isUserSuperAdmin,
		}
		userService.registerUser(user).then(
			success => { 
				signUpSuccess();
			},
			error => {
				alert(error)
			}
		);
	}

	const handleSignInSubmit = (e) => {
		e.preventDefault();
		let user = {
			userEmail : userEmail,
			password : userPassword,
		}
		
		userService.login(user).then(
			success => { 
			    signInSuccess();
			},
			error => {
				signInNotSuccess();
			}
		);
	}

	const handleSelectChange = ( event ) => {
		const value = event.target.value;
		setStore(value);

	}

	const handleInputChnage = (event) => {
		const value = event.target.value;
		const field = event.target.name;
		switch (field) {
			case 'userEmail':
				setUserEmail(value);
				break;
			case 'userPassword':
				setUserPassword(value);
				break;
			case 'userFirstName':
				setFirstName(value);
				break;
			case 'userLastName':
				setLastName(value);
				break;
			case 'storeType' :
				setStore(value);
				break;
			case 'isUserSuperAdmin' :
				setSuperAdmin(value);
				break;
			default:
				break;
		}
	}
	
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
		  var c = ca[i];
		  while (c.charAt(0) == ' ') {
			c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		  }
		}
		return null;
	}

	const getCurrentUsers = () => {

		if (!isSignInSuccess )
			return null;

		const userCookies = getCookie('user-info');
		if(userCookies !== null ){
			const user = JSON.parse(decode(userCookies));
			return user;
		}

		return null;
	} 

	const getFullName = (user) => {
		if (user === null ){
			return "";
		}
		return user.FirstName + " " + user.LastName;
	}

	useEffect(() => {
		if(isSignInSuccess){
			let user = getCurrentUsers();
			console.log(user);
			setUserFullName(getFullName(user));
			setUserInfo(user);
		}
	},[isSignInSuccess]);

	const ColorButton = withStyles((theme) => ({
		root: {
		  color: theme.palette.getContrastText(yellow['A400']),
		  backgroundColor: yellow['A400'],
		  '&:hover': {
			backgroundColor: yellow['A400'],
		  },
		},
	}))(Button);

	useEffect(() => {
		submitForm("users","GET","", (res) => {
			setUsers(JSON.parse(res));
		});
	},[]);

	const onProfileClick = (user) => {
		setUserEmail(user.userEmail);
	}

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item justify='center' xs={false} sm={4} md={7} className={classes.image} >
				<ProfileList onProfileClick={onProfileClick} users={allUsers}/>
			</Grid>
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={!switchForm ? classes.overFlowY : showSignInSuccess && classes.showSignInSuccess}>
				<LinearProgress variant="determinate" value={progress} style={{width : '100%'}} />

				{
					isSignUpSuccess && switchForm && <Box 
											style={{paddingLeft : 20,paddingTop : 20,paddingRight : 20}} 
											className="shake-image"
										>
											<Paper>
												<Alert 
													style={{backgroundColor : green[200],color : grey[50]}} 
													severity="success"
												>
													Successfully SignUp a new account! Sign In Now.
												</Alert>
											</Paper>
										</Box>
				}
				{
							switchForm ? 
								(
									<div >
										{
											showSignInSuccess ? (
												<div className={classes.paper}>
													<div className={isSignInNotSuccess ? classes.signInNotSuccess : classes.signInSuccess}></div>

													{
														isSignInNotSuccess ? (
															<Box style={{paddingLeft : 80}}>
																<h1>Something Went Wrong</h1>
																<h6 style={{paddingLeft: 30,marginTop : -15}}>Please Check your email and password Correctly</h6>
																<ColorButton style={{marginLeft : 90}} onClick={retryLogin}>Retry Singin</ColorButton>
															</Box>
														) : (
															<Box>
																<h1>Successfully Login</h1>
																<h2 style={{paddingLeft: 100,marginTop : -20}}>As</h2>
																<h2 style={{paddingLeft: 50,marginTop : -20,marginBottom: 30}}>{userFullName} !</h2>
																<p> We are redirecting you to "{currentUser !== null  && getStoreInfo(currentUser.AdminRole) }"</p>
																<p style={{paddingLeft : 70}}>Please Wait.....</p>
															</Box>
														)
													}
												</div>
											) : (
												<div className={classes.paper}>

													<Avatar className={classes.avatar} >
														<LockOutlinedIcon  />
													</Avatar>
													<Typography component="h1" variant="h5">
														Sign in
													</Typography>
													<form className={classes.form} autoComplete onSubmit={handleSignInSubmit}>
														<TextField
															variant="outlined"
															margin="normal"
															required
															fullWidth
															id="email"
															label="Email Address"
															name="userEmail"
															autoComplete="email"
															autoFocus
															value={userEmail}
															onChange={handleInputChnage}
														/>
														<TextField
															variant="outlined"
															margin="normal"
															required
															fullWidth
															name="userPassword"
															label="Password"
															type="password"
															id="password"
															onChange={handleInputChnage}
															autoComplete="password"
														/>
														<Button
															type="submit"
															fullWidth
															variant="contained"
															color="primary"
															className={classes.submit}
														>
															Sign In
														</Button>
														<Grid container justify='flex-end'>
														{/* <Grid item xs>
															<Link href="#" variant="body2">
															Forgot password?
															</Link>
														</Grid> */}
														<Grid item>
															<Link href="#" variant="body2" onClick={switchSignInUp}>
															Don't have an account? Sign Up
															</Link>
														</Grid>
														</Grid>
														<Box mt={5}>
														<Copyright />
														</Box>
													</form>
												</div>
											)
										}
									</div>
								) : 

								(
									<div className={classes.paper}>
										<Avatar className={classes.avatar}>
											<LockOutlinedIcon />
										</Avatar>
										<Typography component="h1" variant="h5">
											Sign Up
										</Typography>
										<form className={classes.form}  onSubmit={handleSignUpSubmit}>
											<TextField
												fullWidth
												variant="outlined"
												required
												label="First Name"
												name="userFirstName"
												onChange={(e) => setFirstName(e.target.value)}
											/>
											<TextField
												fullWidth
												variant="outlined"
												margin="normal"
												required
												id="lastName"
												label="Last Name"
												name="userLastName"
												onChange={(event) => handleInputChnage(event)}
											/>
											<TextField
												variant="outlined"
												margin="normal"
												required
												fullWidth
												id="email"
												type="email"
												label="Email Address"
												name="userEmail"
												autoComplete="email"
												onChange={(event) => handleInputChnage(event)}
												
											/>
											<TextField
											variant="outlined"
											margin="normal"
											required
											fullWidth
											name="userPassword"
											label="Password"
											type="password"
											id="password"
											onChange={(event) => handleInputChnage(event)}
											/>
											<FormControl 
												variant="outlined" 
												fullWidth
												disabled={isUserSuperAdmin}
											>

												<InputLabel id="demo-simple-select-outlined-label">Select Store - Account Controll</InputLabel>
												<Select
													labelId="demo-simple-select-outlined-label"
													id="demo-simple-select-outlined"
													// onChange={handleChange}
													value={storeType}
													name="storeType"
													label="Select Store - Account Controll"
													onChange={(event) => handleSelectChange(event)}
												>
													<MenuItem value={0}>Matrivandar Store</MenuItem>
													<MenuItem value={1}>Radhuni Store</MenuItem>
													<MenuItem value={2}>Square Store</MenuItem>
													<MenuItem value={3}>Bashundhara Store</MenuItem>
												</Select>
											</FormControl>
											<FormControlLabel
												name="isUserSuperAdmin"
												control={<Checkbox checked={isUserSuperAdmin} onChange={handleSuperAdminCheckbox} value="admin" color="primary" />}
												label="Make Super Admin"
											/>
											<Button
											type="submit"
											fullWidth
											variant="contained"
											color="primary"
											className={classes.submit}
											>
											Sign Up
											</Button>
											<Grid container justify="flex-end">
											
												<Grid item>
													<Link href="#" variant="body2" onClick={switchSignInUp}>
													Already have an account? Sign In
													</Link>
												</Grid>
											</Grid>
											<Box mt={5}>
											<Copyright />
											</Box>
										</form>
									</div>
								)
						}
			</Grid>
		</Grid>
	);
}
