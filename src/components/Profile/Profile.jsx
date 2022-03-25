import React from 'react'
import { Link } from 'react-router-dom'
import Fab from '@mui/material/Fab';


const Profile = () => {
	return (
		<ul className='right'>
			<Link to="/profilepage">
				<Fab color="primary" aria-label="add"> WA
				</Fab>
			</Link>
				
		</ul>
	)
}

export default Profile