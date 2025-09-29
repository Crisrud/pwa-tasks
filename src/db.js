import { openDB } from "idb";

const DB_NAME = "tasksDB";
const STORE_NAME = "tasks";


export async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
  return db;
}

export async function getAllTasks() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}

export async function addTask(task) {
  const db = await initDB();
  return await db.put(STORE_NAME, task);
}

export async function updateTask(task) {
  const db = await initDB();
  return await db.put(STORE_NAME, task);
}

export async function deleteTask(id) {
    const db = await initDB();
    return await db.delete(STORE_NAME, id);
}

export async function clearAllTasks() {
    const db = await initDB();
    return await db.clear(STORE_NAME);
}

export async function getTask(id) {
    const db = await initDB();
    return await db.get(STORE_NAME, id);
}

