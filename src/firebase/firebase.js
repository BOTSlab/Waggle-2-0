import firebase from "firebase/app";
import "firebase/auth"

const config = {
	apiKey: "AIzaSyBOfLRiOe0cqwIWig4Tf2Nhd5UCq5s_1GU",
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


const app = firebase.initializeApp(config);
export default app;
export const auth = app.auth();
