import { useState } from 'react';
import { login } from './utils/firebase';
import { Link } from 'react-router-dom';
import OfflineIndicator from "./components/OfflineIndicator"
import { useOnlineStatus } from './hooks/useOnlineStatus'
import './index.css';



function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isOnline } = useOnlineStatus();


    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(email, password);
            // Deu certo, redireciona para pagina principal
            window.location.href = '/';
            
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }

        
    }

    return(
        <>
            <OfflineIndicator />
            <div className="modern-login-container">
                <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <h1 className="login-title">🔐 Bem-vindo de volta!</h1>
                    <p className="login-subtitle">Faça login na sua conta</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                    <label className="modern-label">📧 Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="modern-input large-input"
                        placeholder="seu@email.com"
                        required
                    />
                    </div>

                    <div className="input-group">
                    <label className="modern-label">🔒 Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="modern-input large-input"
                        placeholder="Sua senha"
                        required
                    />
                    </div>

                    {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                    )}

                    <button 
                    type="submit" 
                    disabled={loading || !isOnline} 
                    style={{
                        opacity: !isOnline ? 0.6 : 1,
                        cursor: !isOnline ? 'not-allowed' : 'pointer'
                     }}
                    className="login-button"
                    >
                    {loading ? (
                        <>
                        <span className="loading-spinner"></span>
                        Entrando...
                        </>
                    ) : (
                        <>
                        <span className="btn-icon">🚀</span>
                        Entrar na Conta
                        </>
                    )}
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    <p className="footer-text">
                    Não tem uma conta? { isOnline ? ( 
                        <Link to="/register" className="register-link">
                            Crie uma conta agora
                        </Link>
                    ) : (
                        <span style={{ 
                            color: '#999', 
                            cursor: 'not-allowed',
                            textDecoration: 'line-through' 
                        }} >
                            Cadastro não disponível offline

                        </span>
                    )}

                    </p>
                </div>
                </div>
            </div>
        </>
        
    )
}


export default Login;
