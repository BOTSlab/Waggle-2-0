import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Fab from '@mui/material/Fab';
import { useAuth } from '../Contexts/AuthContext';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";

const getInitials = (name) => {
  const firstInitial = name[0];
  const strings = name.split(' ');
  return firstInitial + strings[strings.length - 1][0];
};

const Profile = () => {
	const [name, setName] = useState('');
	onAuthStateChanged(auth, currentUser => {
		if(currentUser)
		{
			setName(getInitials(currentUser.displayName))
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