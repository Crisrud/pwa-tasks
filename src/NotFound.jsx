import { useNavigate } from 'react-router-dom';
import './NotFound.css'; // Opcional - para estilização

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe ou foi movida.</p>
        
        <div className="not-found-actions">
          <button 
            onClick={() => navigate('/')} 
            className="home-btn"
          >
            🏠 Voltar para Home
          </button>
          
          <button 
            onClick={() => navigate(-1)} 
            className="back-btn"
          >
            ↩️ Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;