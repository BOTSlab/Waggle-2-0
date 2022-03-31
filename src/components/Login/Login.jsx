import React, { useRef, useState } from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link, withStyles } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material'
import { paperStyle, avatarStyle, btnstyle } from './loginStyles'

import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";




const Login = ({ handleChange }) => {
	const emailRef = useRef();
	const passwordRef = useRef();
	
	const { login } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	
	const history = useNavigate();
	
	const provider = new GoogleAuthProvider();
	
	const signInwithGoogle = () => {
		const { user }  = signInWithPopup(auth, provider);
		console.log(user)
		
		history('/');
	}
	
	
	async function handleSubmit(event){
		event.preventDefault();
			try {
				setError('')
				setLoading(true);
				await login(emailRef.current.value, passwordRef.current.value);
				history('/');
		} catch(error){
			setError(error.message);
		}
		setLoading(false);
	}
	return (
		<Grid>
			<Paper style={paperStyle} >
				<Grid align='center'>
					<Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
					<h2>Sign In</h2>
				</Grid>
				{console.log(error)}
				{error && <Alert  severity="error"> {error} </Alert>}
				<form onSubmit={handleSubmit}>
				<TextField label='Email' inputRef={emailRef} placeholder='Enter email' fullWidth required/>
				<TextField label='Password' inputRef={passwordRef} placeholder='Enter password' type='password' fullWidth required/>
				<FormControlLabel
					control={
					<Checkbox
						name="checkedB"
						color="primary"
					/>
					}
					label="Remember me"
				/>
				<Button disabled={loading} type='submit' color='primary' fullWidth>Sign in</Button>
				<Button onClick={signInwithGoogle}>
						<img
							src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
							alt="google icon"
						/>
						Sign In with Google</Button>
				
				</form>
				<Typography > Do you have an account?
					<Link href="#" onClick={()=>handleChange("event",1)} >
						Sign Up 
				</Link>
				</Typography>
			</Paper>
		</Grid>
	)
}

export default Login;