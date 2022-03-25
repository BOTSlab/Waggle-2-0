import React from 'react';
import ProfilePage from '../Profile/ProfilePage';
import { AuthProvider } from '../Contexts/AuthContext';

const ProfilePageWrapper = () => {
	return (
		<AuthProvider>
			<div className="App">
				<ProfilePage/>
			</div>
		</AuthProvider>
		
	
	);
}

export default ProfilePageWrapper;