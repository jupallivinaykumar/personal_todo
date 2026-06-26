import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import type { Task } from '../types/task';

const tasksCollection = collection(firestore, 'tasks');

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  const newTask = {
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(tasksCollection, newTask);
    return { id: docRef.id, ...newTask } as Task;
  } catch (error) {
    console.error('Firestore createTask failed:', error);
    throw new Error('Failed to save task to Firestore. Check your Firebase configuration and network connection.');
  }
}

export async function fetchUserTasks(userId: string) {
  const tasksQuery = query(tasksCollection, where('ownerId', '==', userId));
  const snapshot = await getDocs(tasksQuery);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Task));
}

export async function updateTask(taskId: string, patch: Partial<Task>) {
  const taskRef = doc(firestore, 'tasks', taskId);

  try {
    await updateDoc(taskRef, { ...patch, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Firestore updateTask failed:', error);
    throw new Error('Failed to update task in Firestore. Check your Firebase configuration and network connection.');
  }
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(firestore, 'tasks', taskId);
  await deleteDoc(taskRef);
}
