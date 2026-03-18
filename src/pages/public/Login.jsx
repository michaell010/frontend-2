import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService";
import "../../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [correo,     setCorreo]     = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error,      setError]      = useState("");
  const [cargando,   setCargando]   = useState(false);

  const handleLogin = async () => {
    if (!correo || !contrasena) { setError("Por favor ingresa correo y contraseña."); return; }
    setCargando(true); setError("");
    try {
      const res = await login(correo, contrasena);
      if (res.ok) { navigate("/dashboard"); }
      else { setError(res.mensaje || "Credenciales incorrectas."); }
    } catch (err) {
      setError(err?.mensaje || "Error al conectar con el servidor.");
    } finally { setCargando(false); }
  };

  return (
    <div className="login-page">

      {/* Panel visual izquierdo */}
      <div className="login-visual">
        <div className="login-visual__grid"></div>
        <div className="login-visual__glow"></div>

        <div className="login-visual__logo">
          <div className="login-visual__logo-icon">🐂</div>
          <div>
            <span className="login-visual__logo-name">GanaControl</span>
            <span className="login-visual__logo-tag">Gestión Ganadera</span>
          </div>
        </div>

        <div className="login-visual__content">
          <h1 className="login-visual__h1">
            El control total de<span>su finca, digital.</span>
          </h1>
          <p className="login-visual__p">
            Gestione ganado, reproducción, sanidad, inventario y finanzas
            desde una sola plataforma diseñada para el campo colombiano.
          </p>
          <div className="login-visual__features">
            {[
              ["🐄","Trazabilidad bovina completa"],
              ["💉","Alertas sanitarias automáticas"],
              ["💰","Facturación sin errores"],
              ["📊","Reportes ejecutivos en tiempo real"],
            ].map(([ico,txt]) => (
              <div key={txt} className="login-visual__feature">
                <span className="login-visual__feature-ico">{ico}</span>
                <span className="login-visual__feature-text">{txt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="login-visual__footer">
          © 2025 GanaControl — Hecho en Colombia 🇨🇴
        </div>
      </div>

      {/* Panel formulario derecho */}
      <div className="login-form-panel">
        <div className="login-form-box">

          <button className="login-form-box__back" onClick={() => navigate("/")}>
            ← Volver al inicio
          </button>

          <div className="login-form-box__eyebrow">Bienvenido de nuevo</div>
          <h1 className="login-form-box__h1">Iniciar Sesión</h1>
          <p className="login-form-box__sub">Ingresa tus credenciales para acceder al sistema.</p>

          {/* Campo correo */}
          <div className="login-field">
            <label className="login-label">Correo electrónico</label>
            <div className="login-input-wrap">
              <span className="login-input-ico">📧</span>
              <input
                className="login-input"
                type="email"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                disabled={cargando}
              />
            </div>
          </div>

          {/* Campo contraseña */}
          <div className="login-field">
            <label className="login-label">Contraseña</label>
            <div className="login-input-wrap">
              <span className="login-input-ico">🔒</span>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                disabled={cargando}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Opciones */}
          <div className="login-opts">
            <label className="login-opts__remember">
              <input type="checkbox" /> Recordarme
            </label>
            <span className="login-opts__forgot">¿Olvidaste tu contraseña?</span>
          </div>

          {/* Botón */}
          <button className="login-submit" onClick={handleLogin} disabled={cargando}>
            {cargando
              ? <><div className="login-spinner"></div> Ingresando...</>
              : "Ingresar al sistema →"
            }
          </button>

          {/* Demo */}
          <div className="login-demo">
            <strong>Demo:</strong> admin@ganacontrol.co / 123456
          </div>

        </div>
      </div>
    </div>
  );
}