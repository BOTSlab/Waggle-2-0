import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material';
import { useAuth } from '../Contexts/AuthContext';







const ProfilePage = () => {

	
	const emailRef = useRef();
	const passwordRef = useRef();
	const { currentUser } = useAuth();
	console.log(currentUser)
	
	return (
		
			<div>
			<div>
				PROFILE PICTURE
			</div>
				Currently logged in as: {currentUser.email}
			<div>
				<Button> Log out </Button>
				<Button> Forgot Password </Button>
				
			</div>
			<div> CODE SUBMISSIONS </div>
		</div>
		
	
	)
}

export default ProfilePage