import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc, getCountFromServer } from "firebase/firestore";

const TASKS_COLLECTION = "tasks";


//console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function addTaskToFirebase(task){
    const ref = doc(db, TASKS_COLLECTION, task.id);
    await setDoc(ref, task);

}

export async function getTasksFromFirebase(){
    const ref = collection(db, TASKS_COLLECTION);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc =>({ ...doc.data(), id: doc.id}));
}

export async function deleteTaskFromFirebase(id){
    const ref = doc(db, TASKS_COLLECTION, id);
    await deleteDoc(ref);
}

// NOVA FUNÇÃO: Retorna a quantidade de tarefas no Firebase
export async function getTasksCountFromFirebase() {
    try {
      const coll = collection(db, TASKS_COLLECTION);
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (error) {
      console.error('Erro ao contar tarefas no Firebase:', error);
      throw error;
    }
  }
  
  // FUNÇÃO ALTERNATIVA: Se getCountFromServer não funcionar
  export async function getTasksCountFromFirebaseAlternative() {
    try {
      const tasks = await getTasksFromFirebase();
      return tasks.length;
    } catch (error) {
      console.error('Erro ao contar tarefas no Firebase:', error);
      throw error;
    }
  }