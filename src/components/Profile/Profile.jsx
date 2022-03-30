import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Fab from '@mui/material/Fab';
import { useAuth } from '../Contexts/AuthContext';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";


const Profile = () => {
	const [name, setName] = useState('');
	onAuthStateChanged(auth, currentUser => {
		if(currentUser)
		{
			setName(currentUser.displayName)
		}
	})
	return (
		<ul className='right'>
      <Fab color="primary" aria-label="add"> {name}
      </Fab>	
		</ul>
	)
}

export default Profile