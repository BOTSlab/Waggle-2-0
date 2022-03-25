import React from 'react';
import SignInOutContainer from '../Login/SignInOutContainer';
import { AuthProvider } from '../Contexts/AuthContext';

const SignInOutWrapper = () => {
	return (
	
		<AuthProvider>
			<div className="App">
				<SignInOutContainer/>
			</div>
		</AuthProvider>
	);
}

export default SignInOutWrapper;