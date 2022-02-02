import React, { useRef, useState } from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material'


const Login = ({ handleChange }) => {

	const paperStyle={padding : 20, height:'60vh', width:300, margin:"0 auto"}
	const avatarStyle={backgroundColor:'#1bbd7e'}
	const btnstyle={margin:'8px 0'}
	
	const emailRef = useRef();
	const passwordRef = useRef();
	
	const { login } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	
	const history = useNavigate();
	
	
	const handleSubmit = (event) => {
		event.preventDefault();		
		
		console.log(emailRef.current.value, passwordRef.current.value)
		try {
			setError('')
			setLoading(true);
			login(emailRef.current.value, passwordRef.current.value);
			history('/');
		} catch {
			setError('failed to log in');
		}
		
		setLoading(false);
	}
	return (
		<Grid>
			<Paper  style={paperStyle}>
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
				<Button disabled={loading} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
				
				</form>
				<Typography >
					<Link href="#" >
						Forgot password?
				</Link>
				</Typography>
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