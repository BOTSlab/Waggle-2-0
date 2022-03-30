import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material';
import { useAuth } from '../Contexts/AuthContext';
import { TextField } from '@material-ui/core';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db} from "../../firebase/firebase"
import { useNavigate } from 'react-router-dom'

import { doc, collection, serverTimestamp, onSnapshot, query, where } from "firebase/firestore"; 
import { getStorage, ref, listAll } from "firebase/storage";


const ProfilePage = () => {
	
	const nameRef = useRef();
	const { currentUser, logout, resetPassword } = useAuth();
	const [error, setError] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [codeSubmissions, setCodeSubmissions] = useState([]);

	const history = useNavigate();

	let submissionsRef = collection(db, 'submissions');
	const storage = getStorage();


	// Create a reference under which you want to list
	const listRef = ref(storage, email );
	
	const handleReset = () => {
		try {
			setError('')
			auth.sendPasswordResetEmail(email);
		}
		catch(error) {
			setError(error.message)
		}
	}
	const handleLogout = () => {
		logout();
		history('/');
	}
	onAuthStateChanged(auth, currentUser => {
		if(currentUser)
		{
			setName(nameRef.current.value ? nameRef.current.value : currentUser.displayName)
			setEmail(currentUser.email)
		}
	})
	
	const showCodeSubmissions = () =>{
		console.log(listRef)
		// Find all the prefixes and items.
		listAll(listRef)
		.then((res) => {
			res.prefixes.forEach((folderRef) => {
			//console.log(folderRef)
			});
			res.items.forEach((itemRef) => {
			setCodeSubmissions(arr => [...arr, itemRef.name])
			});
		}).catch((error) => {
			console.log(error.message)
			// Uh-oh, an error occurred!
		});
	}
		
	const handleNameChange = (event) => {
		event.preventDefault();
			if(currentUser){
				try {
					setError('')
					setName(nameRef.current.value)
					currentUser.updateProfile({
						displayName: nameRef.current.value
					})
					setDoc(doc(db, "users", currentUser.uid),
					{
						name: currentUser.displayName,
					}, {merge:true});
				}
				catch(error) {
					setError(error.message)
				}
			}
		}
	return (
			<div>
			<p>
				PROFILE PICTURE
			</p>
				Currently logged in as: {email}
			<p>
				Name: {name}
			</p>
			<form onSubmit={handleNameChange}>
				Add Name:
				<TextField inputRef={nameRef}/>
				<Button type='submit' color='primary'>Change Name</Button>
			</form>
			<div>
				<Button onClick={ handleLogout}> Log out </Button>
				<Button onClick={handleReset}> Send reset password link </Button>
			</div>
				<Button onClick={showCodeSubmissions}>
					VIEW CODE SUBMISSIONS
				</Button>
			<div>
				{codeSubmissions.map((val) => (
					<h3 key={val}>{val}</h3>
				))}
			</div>
		</div>
	)
}

export default ProfilePage