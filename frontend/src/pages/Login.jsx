import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import * as authService from "../services/authService";
import "../styles/login.css";
import logo from "../assets/logo.png";

function Login({ onLogin }) {
  const [email, setEmail] = useState("kamanaurbain12@gmail.com");
  const [password, setPassword] = useState("@Kamana123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const loginResult = await authService.login({
        email: email.trim(),
        password,
      });
      setError("");
      await onLogin(loginResult);
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (error) setError("");
  };

  return (
    <main className="login-page">
      <div className="login-shape-left"></div>
      <div className="login-shape-right"></div>

      <section className="login-frame">
        <div className="login-brand-card">
          <img src={logo} alt="Kamana's Bar" className="login-brand-logo" />

          <div className="login-brand-content">
            <h1>
              Kamana&apos;s <br />
              Bar
            </h1>

            <h3>Gestion locale du bistro</h3>

            <p>
              Connectez-vous pour gérer les produits,
              <br />
              les ventes et les petites factures du bar.
            </p>

            <div className="login-pills">
              <span>Produits</span>
              <span>Ventes</span>
              <span>Factures</span>
            </div>
          </div>
        </div>

        <div className="login-form-zone">
          <form className={`login-card ${error ? "login-card-error" : ""}`} onSubmit={handleSubmit}>
            <h2>{error ? "Connexion123" : "Connexion"}</h2>

            {error && <div className="login-error-message">{error}</div>}

            <p className="login-help-text">
              Entrez vos identifiants pour accéder
              <br />
              au système de gestion.
            </p>

            <div className="login-form-group">
              <label htmlFor="email">Adresse email</label>

              <div className={`login-input ${error ? "is-error" : ""}`}>
                <Mail size={15} strokeWidth={2} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Mot de passe</label>

              <div className={`login-input ${error ? "is-error" : ""}`}>
                <Lock size={15} strokeWidth={2.5} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="login-eye-button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label="Afficher ou masquer le mot de passe"
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={2.5} />
                  ) : (
                    <Eye size={16} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-button" disabled={loading}>
              Se connecter
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;
