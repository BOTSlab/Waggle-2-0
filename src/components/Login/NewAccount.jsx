import React, { useRef, useState } from 'react'
import { Grid, Paper, Avatar, Typography, TextField, Button, FormControl } from '@material-ui/core'
import { Alert } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useAuth } from '../Contexts/AuthContext';

const NewAccount = () => {
	
	const paperStyle = { padding: 20, width: 300,height:'60vh', margin: "0 auto" }
	const headerStyle = { margin: 0 }
	const avatarStyle = { backgroundColor: '#1bbd7e' }
	const marginTop = { marginTop: 5 }
	
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const { signup } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	
	
	const handleSubmit = (event) => {
		event.preventDefault();
		console.log('PASWORDS',passwordConfirmRef.current.value, passwordRef.current.value);
		
		if(passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError('Passwords do not match');
		}
		
		try {
			setError('')
			setLoading(true);
			signup(emailRef.current.value, passwordRef.current.value);
		} catch {
			setError('failed to create an account');
		}
	}
	
	return (
		<Grid>
			<Paper style={paperStyle}>
				<Grid align='center'>
					<Avatar style={avatarStyle}>
						<AddCircleOutlineOutlinedIcon />
					</Avatar>
					<h2 style={headerStyle}>Sign Up</h2>
					<Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
				</Grid>
				
				{error && <Alert variant="outlined" severity="error"> {error} </Alert>}
				<form onSubmit={handleSubmit}>
				
					<TextField fullWidth label='Name' placeholder="Enter your name" />
					<TextField fullWidth label='Email' inputRef={emailRef} placeholder="Enter your email" required/>

					<TextField fullWidth label='Password' inputRef={passwordRef} placeholder="Enter your password" type='password' required/>
					<TextField fullWidth label='Confirm Password' inputRef={passwordConfirmRef} placeholder="Confirm your password" type='password' required/>
					<FormControlLabel
						control={<Checkbox name="checkedA" required />}
						label="I accept the terms and conditions."
					/>
					<Button disabled={loading} type='submit' variant='contained' color='primary'>Sign Up</Button>
				</form>
			</Paper>
		</Grid>
	)
}

export default NewAccount;