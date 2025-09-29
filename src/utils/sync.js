import { getAllTasks, addTask } from "../db";
import { addTaskToFirebase, deleteTaskFromFirebase } from "./firebase";

export async function syncTasks() {
    const tasks = await getAllTasks();
    const unsyncedTasks = tasks.filter(task => !task.synced);
    let syncedCount = 0;

    for (const task of unsyncedTasks) {
        try {
            await addTaskToFirebase(task);
            console.log("Tarefa sincronizada: true", task);
            task.synced = true;
            await addTask(task); // Atualiza no IndexedDB
            syncedCount++;
        } catch (error) {
            console.error("Erro ao sincronizar tarefa:", error);
        }
    }

    // Sincronizar exclusões
    const tasksToDelete = tasks.filter(task => task.deleted && !task.synced);
    let deletedCount = 0;

    for (const task of tasksToDelete) {
        try {
        await deleteTaskFromFirebase(task.id);
        // Remove do IndexedDB após excluir do Firebase
        await deleteTask(task.id);
        deletedCount++;
        } catch (error) {
        console.error("Erro ao sincronizar exclusão:", error);
        }
    }

    if (syncedCount > 0) {
        if(Notification.permission === 'granted') {
            new Notification('Sincronização concluída', {
                body: `${syncedCount} tarefa(s) sincronizada(s) com sucesso.`,
                icon: '/vite.svg'
            });
        }
    }

}