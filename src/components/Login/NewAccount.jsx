import React, { useRef, useState } from 'react'
import { Grid, Paper, Avatar, Typography, TextField, Button, FormControl } from '@material-ui/core'
import { Alert } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom'

import { paperStyleLogin, headerStyle, avatarStyleLogin, marginTop } from './loginStyles'

import { auth, db} from "../../firebase/firebase"
import { doc, setDoc, collection } from "firebase/firestore"; 

import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const NewAccount = () => {
	
	let usersRef = collection(db, 'users');


	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const { signup } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const history = useNavigate();
	const nameRef = useRef();

	const provider = new GoogleAuthProvider();

	const signInwithGoogle = () => {
		const { user }  = signInWithPopup(auth, provider);
		console.log(user)
		
		history('/');
	}
	
	onAuthStateChanged(auth, user => {
		if(user != null)
		{
			setDoc(doc(db, "users", user.uid),
			{
				uid: user.uid,
				name: user.displayName,
				email: user.email
			}, {merge:true});
		}
		
	})
	
	
	async function handleSubmit(event){
		event.preventDefault();
		if(passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError('Passwords do not match');
		}
		try {
			setError('')
		//	setLoading(true);
			const { user } = await auth.createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
			user.updateProfile({
				displayName: nameRef.current.value
			})
			
			setDoc(doc(usersRef, user.uid), {
				uid: user.uid,
				name: nameRef.current.value,
				email: user.email
			}, {merge:true});
			
			
			
			history('/');
		} catch(error) {
			setError(error.message);
		}
	}
	
	return (
		<Grid>
			<Paper style={paperStyleLogin}>
				<Grid align='center'>
					<Avatar style={avatarStyleLogin}>
						<AddCircleOutlineOutlinedIcon />
					</Avatar>
					<h2 style={headerStyle}>Sign Up</h2>
					<Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
				</Grid>
				
				{error && <Alert variant="outlined" severity="error"> {error} </Alert>}
				<form onSubmit={handleSubmit}>
				
					<TextField fullWidth label='Name' inputRef={nameRef} placeholder="Enter your name" />
					<TextField fullWidth label='Email' inputRef={emailRef} placeholder="Enter your email" required/>

					<TextField fullWidth label='Password' inputRef={passwordRef} placeholder="Enter your password" type='password' required/>
					<TextField fullWidth label='Confirm Password' inputRef={passwordConfirmRef} placeholder="Confirm your password" type='password' required/>
					<FormControlLabel
						control={<Checkbox name="checkedA" required />}
						label="I accept the terms and conditions."
					/>
					<Button disabled={loading} type='submit' variant='contained' color='primary'>Sign Up</Button>
					

				</form>
				<button onClick={signInwithGoogle}>
						<img
							src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
							alt="google icon"
						/>
						Sign In with Google</button>
			</Paper>
			
		</Grid>
	)
}

export default NewAccount;