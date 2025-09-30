import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { addTask, getAllTasks, deleteTask } from './db';
import { useAuth } from './contexts/AuthContext';
import { syncTasks  } from './utils/sync';
import { deleteTaskFromFirebase, getTasksCountFromFirebase } from './utils/firebase';
import { useNavigate } from 'react-router-dom';
import { getUserLocation, exportTasksToJson, copyTask, listenTaskByVoice  } from './utils/native';
import { getGoogleCalendarUrl } from './utils/calendar';
import OfflineIndicator from './components/OfflineIndicator';
import { useRegisterSW } from 'virtual:pwa-register/react';

import './App.css'

function App() {
  
  const {logout} = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [hora, setHora] = useState("");
  const [done, setDone] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [firebaseTaskCount, setFirebaseTaskCount] = useState(0); // Novo state para contagem

  const navigate = useNavigate(); // Adicione esta linha

  // PWA Update Logic
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registrado: ' + r)
    },
    onRegisterError(error) {
      console.log('Erro no registro do SW', error)
    },
  })


  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  }

  // Adicione esta função
  function handleDashboard() {
    navigate('/dashboard');
  }


  useEffect(() => {
    loadTasks();
    loadFirebaseTaskCount(); // Carrega a contagem do Firebase

    if(navigator.onLine){
      syncAndReload();
    }
    window.addEventListener("online", syncAndReload);
    window.addEventListener("offline", loadTasks);
    return () => {
      window.removeEventListener("online", syncAndReload);
      window.removeEventListener("offline", loadTasks);
    };
  }, []);

  // FUNÇÃO PARA CARREGAR A CONTAGEM DO FIREBASE
  async function loadFirebaseTaskCount() {
    if (!navigator.onLine) return;
    
    try {
      const count = await getTasksCountFromFirebase();
      setFirebaseTaskCount(count);
    } catch (error) {
      console.error('Erro ao carregar contagem do Firebase:', error);
      // Tenta a abordagem alternativa
      try {
        const tasks = await getTasksFromFirebase();
        setFirebaseTaskCount(tasks.length);
      } catch (error2) {
        console.error('Erro na abordagem alternativa:', error2);
      }
    }
  }

  async function syncAndReload() {
   await syncTasks();
   await loadTasks();
   await loadFirebaseTaskCount();
  }


  async function handleAddTask() {
    
    const location = await getUserLocation().catch(err => {
      console.error(err);
      return "Localização indisponível";
    });
    
    console.log("Localização obtida:", location);
    const task = {
      id: uuidv4(),
      title,
      hora,
      done,
      lastUpdated: Date.now(),
      synced: false,
      location
    };

    await addTask(task);
    
    setTasks([...tasks, task]);
    setTitle("");
    setHora("");
    setDone(false);

    await loadTasks();

    let notifyPromise = Promise.resolve();
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Tarefa adicionada com sucesso!', {
          body: `Tarefa: ${task.title} - Hora: ${task.hora}`,
          icon: '/vite.svg'
        });
        notifyPromise = new Promise(res => setTimeout(res, 350)); 
      } else if (Notification.permission !== 'denied') {
        notifyPromise = Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Tarefa adicionada com sucesso!', {
              body: `Tarefa: ${task.title} - Hora: ${task.hora}`,
              icon: '/vite.svg'
            });
            return new Promise(res => setTimeout(res, 350));
          }
        })
      }
    }
   
    if(navigator.onLine){
      await notifyPromise;
      await syncAndReload();
    }

  };

  // FUNÇÃO PARA EXCLUIR TAREFA
  async function handleDeleteTask(taskId, taskData) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    try {
      await deleteTask(taskId); // Exclui do IndexedDB

      // Se estiver online e a tarefa estava sincronizada, exclui do Firebase
      if (navigator.onLine && taskData.synced) {
        try {
          await deleteTaskFromFirebase(taskId);
          console.log('Tarefa excluída do Firebase:', taskId);
        } catch (firebaseError) {
          console.error('Erro ao excluir do Firebase:', firebaseError);
          // Mesmo se falhar no Firebase, continua a exclusão local
        }
      }
      
      // Atualiza a lista localmente
      setTasks(tasks.filter(task => task.id !== taskId));
      
      // Mostra notificação
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Tarefa excluída com sucesso!');
      }

      // Sincroniza se estiver online
      if (navigator.onLine) {
        await syncAndReload();
      }

    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      alert('Erro ao excluir tarefa. Tente novamente.');
    }
  }

  // FUNÇÃO PARA SINCRONIZAÇÃO MANUAL
  async function handleManualSync() {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      await syncAndReload();
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Sincronização manual concluída!', {
          body: 'Todas as tarefas foram sincronizadas.',
          icon: '/vite.svg'
        });
      }
      
      alert('Sincronização concluída com sucesso!');
    } catch (error) {
      console.error('Erro na sincronização manual:', error);
      alert('Erro ao sincronizar. Tente novamente.');
    } finally {
      setIsSyncing(false);
    }
  }


  async function loadTasks() {
    const allTasks = await getAllTasks();
    allTasks.sort((a, b) => b.lastUpdated - a.lastUpdated);
    setTasks(allTasks);
  }


  return (
    <>
    <div className="modern-container">
      {/* Header */}
      <div className="header">
        <OfflineIndicator />
      <button onClick={handleDashboard} className="logout-btn">
          <span>📊 Dashboard</span>
        </button>
        <h1 className="app-title">📝 Minhas Tarefas</h1>
        <button onClick={handleLogout} className="logout-btn">
          <span>🚪 Sair</span>
        </button>
      </div>

      {/* Add Task Form */}
      <div className="add-task-card">
        <div className="input-group">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="modern-input"
            placeholder="O que precisa ser feito?" 
          />
        </div>

        <div className="task-options">
          <div className="time-input-wrapper">
            <span className="time-icon">⏰</span>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="time-input large-time"
            />
          </div>

          <label className="checkbox-label">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => setDone(e.target.checked)}
                className="modern-checkbox"
              />
              <span className="checkmark"></span>
            </div>
            <span className="checkbox-text">Concluído</span>
          </label>
        </div>

        <button onClick={handleAddTask} className="add-task-btn">
          <span className="btn-icon">+</span>
          Adicionar Tarefa
        </button>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => exportTasksToJson(tasks)} className="styled-input" style={{ background: '#2196f3', color: '#fff', fontWeight: 'bold' }}>Exportar JSON</button>
          <button onClick={handleVoiceAdd} className="styled-input" style={{ background: '#ff9800', color: '#fff', fontWeight: 'bold' }}>Adicionar por voz</button>
        </div>

      </div>

      {/* Tasks List */}
      <div className="tasks-section">
        <h2 className="section-title">Suas Tarefas ({tasks.length})</h2>
        
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.done ? 'completed' : ''}`}>
              <div className="task-content">
                <div className="task-main">
                  <span className="task-title">{task.title}</span>
                  <div className="task-meta">
                    <span className="task-time">⏰ {task.hora}</span>
                    
                    <span className={`task-status ${task.done ? 'status-done' : 'status-pending'}`}>
                      {task.done ? "✅ Concluído" : "⏳ Pendente"}
                      {!task.synced && (
                        <span style={{ color: 'red', fontWeight: 'bold', marginLeft: 12, border: '1px solid red', borderRadius: 4, padding: '2px 6px', fontSize: '0.85em' }}>
                          Não sincronizada
                        </span>
                      )}
                    </span>
                  </div>
                  

                   {/* BOTÃO DE EXCLUIR */}
                  <div>
                    {/* Localização - Versão com linhas separadas */}
                    {task.location && typeof task.location === 'object' && task.location.latitude && (
                      <div className="task-location-container">
                        <div className="location-row">
                          <span className="location-label">Latitude:</span>
                          <span className="location-value">{task.location.latitude.toFixed(5)}</span>
                        </div>
                        <div className="location-row">
                          <span className="location-label">Longitude:</span>
                          <span className="location-value">{task.location.longitude.toFixed(5)}</span>
                        </div>
                      </div>
                    )}
                    {/* Localização indisponível */}
                    {(!task.location || task.location === "Localização indisponível") && (
                      <div className="task-location-container unavailable">
                        <div className="location-row">
                          <span className="location-label">Local:</span>
                          <span className="location-unavailable">📍 Localização indisponível</span>
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: 6, marginBottom: 2 }}>
                      <button onClick={() => copyTask(task)} style={{ fontSize: '0.9em', background: '#eee', color: '#000', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Copiar</button>
                    </div>
                    <div style={{ marginBottom: 2 }}>
                      <a
                        href={getGoogleCalendarUrl(task)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.9em', background: '#4285F4', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', textDecoration: 'none' }}
                        title="Adicionar ao Google Agenda"
                      >Google Agenda</a>
                    </div>
                    <button 
                      onClick={() => handleDeleteTask(task.id, task)}
                      className="delete-btn"
                      title="Excluir tarefa"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>Nenhuma tarefa cadastrada</p>
            <small>Adicione sua primeira tarefa acima!</small>
          </div>
        )}
      </div>
      {/* Botão de Sincronização no Rodapé */}
      <div className="sync-footer">
        <button 
          onClick={handleManualSync} 
          className="sync-btn"
          disabled={isSyncing}
        >
          <span className="sync-icon">
            {isSyncing ? '🔄' : '🔄'}
          </span>
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Tudo'}
        </button>
        
        <div className="sync-info">
          <small>
            {navigator.onLine ? '✅ Online' : '❌ Offline'} | 
            Local: {tasks.length} tarefas | 
            Firebase: {firebaseTaskCount} tarefas
          </small>
        </div>
      </div>
    </div>
  </>
  )

  // Adicionar tarefa por voz
  function handleVoiceAdd() {
    listenTaskByVoice(
      (transcript) => {
        setTitle(transcript);
        // Foca no input de título se possível
        setTimeout(() => {
          const el = document.querySelector('input.modern-input');
          console.log("Elemento encontrado para foco:", el);
          if (el) el.focus();
        }, 100);
      },
      (err) => {
        alert('Erro no reconhecimento de voz: ' + err);
      }
    );
  }


}

export default App
