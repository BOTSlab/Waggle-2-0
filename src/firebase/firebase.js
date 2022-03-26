import firebase from 'firebase/compat/app';
import "firebase/compat/auth"
import { getFirestore } from "firebase/firestore";


const config = {
	apiKey: "AIzaSyBOfLRiOe0cqwIWig4Tf2Nhd5UCq5s_1GU",
	authDomain: "waggle-2-0.firebaseapp.com",
	projectId: "waggle-2-0",
	storageBucket: "waggle-2-0.appspot.com",
	messagingSenderId: "206978201932",
	appId: "1:206978201932:web:31d381499dfa62df9b77e9",
	measurementId: "G-EVMH98VL5D"
	// apiKey: "AIzaSyBOfLRiOe0cqwIWig4Tf2Nhd5UCq5s_1GU",
	// authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	// projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	// storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	// messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	// appId: process.env.REACT_APP_FIREBASE_APP_ID,
	// measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


const app = firebase.initializeApp(config);
export default app;
export const auth = app.auth();
export const db = getFirestore();
//export const database = firebase.firestore();