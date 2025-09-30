import { useEffect, useState } from "react";
import { getAllTasks } from "./db";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";
import { shareTask } from "./utils/native";
import "./Dashboard.css";
import OfflineIndicator from "./components/OfflineIndicator";
/* Ícone Home (SVG) */
function HomeIcon({ className = "", title = "Home icon" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1V10.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Ícone Logout (SVG) */
function LogoutIcon({ className = "", title = "Logout icon" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M16 17l5-5-5-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

async function handleShare(task) {
  try {
      await shareTask(task);
  } catch (err) {
      alert(err.message || 'Não foi possível compartilhar.');
  }
}


function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [task, setTask] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }

  useEffect(() => {
    async function fetchTask() {
      if (currentUser) {
        const allTasks = await getAllTasks();
        setTask(allTasks);
        setCompletedTasks(allTasks.filter((t) => t.done));
        setPendingTasks(allTasks.filter((t) => !t.done));
      } else {
        setTask(null);
        setCompletedTasks([]);
        setPendingTasks([]);
      }
    }
    fetchTask();
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      
      <header className="dashboard-header">
      <OfflineIndicator />
        <div className="header-left">
          <h1>Dashboard</h1>
          <p className="welcome-text">Visão geral das suas tarefas</p>
        </div>

        <nav className="header-nav" aria-label="Ações rápidas">
          <Link to="/" className="nav-link" aria-label="Home">
            <span className="nav-icon" aria-hidden>
              <HomeIcon />
            </span>
            <span className="nav-text">Home</span>
          </Link>

          <button
            className="nav-link nav-logout"
            onClick={handleLogout}
            aria-label="Logout"
            title="Sair"
          >
            <span className="nav-icon" aria-hidden>
              <LogoutIcon />
            </span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>
      </header>

      <main>
        {currentUser ? (
          <div>
            <h2>Bem vindo, {currentUser.email}</h2>

            <div className="task-details">
              <div className="counts">
                <div className="count-card total">
                  <div className="count-number">{task ? task.length : 0}</div>
                  <div className="count-label">Total</div>
                </div>
                <div className="count-card completed">
                  <div className="count-number">{completedTasks.length}</div>
                  <div className="count-label">Concluídas</div>
                </div>
                <div className="count-card pending">
                  <div className="count-number">{pendingTasks.length}</div>
                  <div className="count-label">Pendentes</div>
                </div>
              </div>

              <h3>✅ Concluídas</h3>
              <ul className="task-list">
                {completedTasks.map((t) => (
                  <li key={t.id} className="task-card completed">
                    <div className="task-row">
                      <div className="task-title">{t.title}</div>
                      <div className="task-meta">
                        <time>{t.hora || "—"}</time>
                        <span className="task-status">Concluída</span>
                        {!t.synced && (
                          <span style={{ color: 'red', fontWeight: 'bold', marginLeft: 12, border: '1px solid red', borderRadius: 4, padding: '2px 6px', fontSize: '0.85em' }}>
                            Não sincronizada
                          </span>
                        )}
                        
                      </div>
                    </div>
                    <button
                      className="share-btn"
                      onClick={() => handleShare(task)}
                      title="Compartilhar tarefa"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                          <polyline points="16 6 12 2 8 6"></polyline>
                          <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                    </button>

                  </li>
                ))}
              </ul>

              <h3>⏳ Pendentes</h3>
              <ul className="task-list">
                {pendingTasks.map((t) => (
                  <li key={t.id} className="task-card pending">
                    <div className="task-row">
                      <div className="task-title">{t.title}</div>
                      <div className="task-meta">
                        <time>{t.hora || "—"}</time>
                        <span className="task-status">Pendente</span>
                        {!t.synced && (
                          <span style={{ color: 'red', fontWeight: 'bold', marginLeft: 12, border: '1px solid red', borderRadius: 4, padding: '2px 6px', fontSize: '0.85em' }}>
                            Não sincronizada
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="share-btn"
                      onClick={() => handleShare(t)}
                      title="Compartilhar tarefa"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                          <polyline points="16 6 12 2 8 6"></polyline>
                          <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Carregando informações do usuário...</p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
