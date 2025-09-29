import { useState } from "react";
import { register } from "./utils/firebase";
import { Link } from "react-router-dom";
import "./register.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError("");


        if (password.length < 6) {
            setError("A senha deve ter no mínimo 6 caracteres.");
            setLoading(false);
            return;
        }

        if (!email.includes("@")) {
            setError("Email inválido.");
            setLoading(false);
            return;
        }
    
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }
    
        try {
            await register(email, password);
            // Deu certo, redireciona para pagina principal
            window.location.href = "/";
        } catch (err) {
            setError("Falha no cadastro. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    // Funções auxiliares para o indicador de força da senha
    const getPasswordStrength = () => {
        if (password.length === 0) return '';
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        return 'strong';
    };
    
    const getStrengthText = () => {
        const strength = getPasswordStrength();
        switch (strength) {
        case 'weak': return 'Senha Fraca';
        case 'medium': return 'Senha Média';
        case 'strong': return 'Senha Forte';
        default: return 'Digite uma senha';
        }
    };
    
    return (
        <>
  <div className="modern-register-container">
    <div className="register-card">
      {/* Header */}
      <div className="register-header">
        <h1 className="register-title">🚀 Criar Nova Conta</h1>
        <p className="register-subtitle">Junte-se a nós e organize suas tarefas</p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="register-form">
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
            placeholder="Crie uma senha segura"
            required
          />
        </div>

        <div className="input-group">
          <label className="modern-label">✅ Confirmar Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="modern-input large-input"
            placeholder="Digite a senha novamente"
            required
          />
        </div>

        {/* Password Strength Indicator */}
        <div className="password-strength">
          <div className="strength-bar">
            <div className={`strength-fill ${getPasswordStrength()}`}></div>
          </div>
          <span className="strength-text">{getStrengthText()}</span>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          className="register-button"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Criando Conta...
            </>
          ) : (
            <>
              <span className="btn-icon">✨</span>
              Criar Minha Conta
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="register-footer">
        <p className="footer-text">
          Já tem uma conta? 
          <Link to="/login" className="login-link">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  </div>
</>
    );
}

export default Register;