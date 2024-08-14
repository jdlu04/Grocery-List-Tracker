import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
 apiKey: "AIzaSyDC1HDj0ZtaVnIi4WeF-W7G0ffsvswCIPQ",
 authDomain: "judyl-inventory-management-app.firebaseapp.com",
 projectId: "judyl-inventory-management-app",
 storageBucket: "judyl-inventory-management-app.appspot.com",
 messagingSenderId: "977546163223",
 appId: "1:977546163223:web:c7a0c4470540b626435852",
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
