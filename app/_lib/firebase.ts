import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: 'AIzaSyAYe2tCdCuYoEPi0grZ1PkHTHgScw19LpA',
    authDomain: 'cookster-12ac8.firebaseapp.com',
    databaseURL: 'https://cookster-12ac8-default-rtdb.firebaseio.com',
    projectId: 'cookster-12ac8',
    storageBucket: 'gs://cookster-12ac8.appspot.com/',
    messagingSenderId: '755799855022',
    appId: '1:755799855022:web:69a08acd3c948e72cf023f',
};

// Prevent duplicate initialization during Next.js hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

export { database };