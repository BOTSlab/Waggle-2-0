import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material';
import { useAuth } from '../Contexts/AuthContext';
import { TextField } from '@material-ui/core';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db} from "../../firebase/firebase"
import { useNavigate } from 'react-router-dom';

import {
	doc,
	collection,
	serverTimestamp,
	onSnapshot,
	query,
	where, Timestamp } from "firebase/firestore"; 
import { getStorage, ref, listAll } from "firebase/storage";

//import Timestamp = firestore.Timestamp;

const ProfilePage = () => {
	
	const nameRef = useRef();
	const { currentUser, logout, resetPassword } = useAuth();
	const [error, setError] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [codeSubmissions, setCodeSubmissions] = useState([]);
	const [codeSubmissionsShowing, setCodeSubmissionsShowing] = useState(false);
	const [success, setSuccess] = useState('');
	const [color, setColor] = useState('green');
	
	const [level, setLevel] = useState([]);
	const [levelShowing, setLevelShowing] = useState(false);
	const [ levelKey, setLevelKey ] = useState([])
	
	

	const history = useNavigate();

	let submissionsRef = collection(db, 'submissions');
	const storage = getStorage();


	// Create a reference under which you want to list
	const listRef = ref(storage, email );
	
	const handleReset = () => {
		try {
			setError('')
			auth.sendPasswordResetEmail(email);
			setSuccess('email verification sent!')
			setColor('green')
		}
		catch(error) {
			setError(error.message)
			setColor('red')
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
		let i =''
			onSnapshot(query(submissionsRef, where("uid", "==", currentUser.uid )), (querySnapshot) => {
				querySnapshot.forEach((doc) => {
				
					if(i != doc.data().codeName){
							setCodeSubmissions(arr => [...arr, `${doc.data().codeName} created in ${doc.data().level} on ${doc.data().timeCreated.toDate().toDateString()}`])
							i = doc.data().codeName
						}

				})
				
			})
		
		
	}

  const toggleCodeSubmissions = () => {
    if (codeSubmissionsShowing) {
      setCodeSubmissions([]);
	 
    } else {
      showCodeSubmissions();
	
	  
    }
    setCodeSubmissionsShowing(!codeSubmissionsShowing);
    setLevelShowing(!levelShowing);
	
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
					setColor('red')
				}
			}
		}
	return (
			<div>
				Currently logged in as: {email}
			<p>
				Name: {name}
			</p>
			<form onSubmit={handleNameChange}>
				New name:
				<TextField inputRef={nameRef}/>
				<Button type='submit' color='primary'>Change Name</Button>
			</form>
			<div>
				<Button onClick={ handleLogout}> Log out </Button>
				<Button onClick={handleReset}> Send reset password link </Button>
				<p style={{color: color}}>
					{success}
				</p>
			</div>
				<Button onClick={toggleCodeSubmissions}>
					{codeSubmissionsShowing && levelShowing ? 'CLOSE CODE SUBMISSIONS' : 'VIEW CODE SUBMISSIONS'}
					
				</Button>
			<div className="flex-container">
					<div className="flex-submission">
						{codeSubmissions.map((val) => (
							<p key={val[val]}>{val}</p>
						))}
					</div>
			</div>
		</div>
	)
}

export default ProfilePage