import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";

const MODULOS = [
  { ico:"🐄", nombre:"Control Ganadero",       desc:"Registro completo de cada animal con trazabilidad total desde nacimiento hasta venta." },
  { ico:"🧬", nombre:"Reproducción y Genética", desc:"Gestión de servicios, gestaciones y partos con cálculo automático de fechas." },
  { ico:"💉", nombre:"Salud y Sanidad",          desc:"Vacunaciones, tratamientos y eventos sanitarios con alertas de próximas fechas." },
  { ico:"📦", nombre:"Inventario Inteligente",   desc:"Control de alimentos, medicamentos e insumos con alertas de stock mínimo." },
  { ico:"🌿", nombre:"Potreros",                 desc:"Gestión de potreros, rotación de pasturas y capacidad de carga por hectárea." },
  { ico:"💰", nombre:"Cockpit Financiero",        desc:"Ventas, facturación automática e ingresos consolidados por período." },
  { ico:"🌾", nombre:"Alimentación",             desc:"Raciones diarias por animal con control de consumo y observaciones." },
  { ico:"🎛️", nombre:"Mando Central",            desc:"Vista ejecutiva con KPIs clave, alertas activas y resumen de la operación." },
];

const EQUIPO = [
  { ico:"💻", nombre:"Área de Desarrollo", rol:"Ingeniería de Software", desc:"Arquitectura backend Node.js + MySQL con triggers y vistas optimizadas." },
  { ico:"🐄", nombre:"Área Agropecuaria",  rol:"Ganadería y Zootecnia",  desc:"Validación de flujos productivos, reproductivos y sanitarios del sistema." },
  { ico:"🎨", nombre:"Área de Diseño",     rol:"UX / UI Product Design", desc:"Interfaces funcionales centradas en el usuario ganadero colombiano." },
];

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("gc-animate-in"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".home-reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="home-nav">
        <div className="home-nav__logo">
          <div className="home-nav__logo-icon">🐂</div>
          <div>
            <span className="home-nav__logo-name">GanaControl</span>
            <span className="home-nav__logo-tag">Gestión Ganadera</span>
          </div>
        </div>
        <ul className="home-nav__links">
          <li><a href="#modulos">Módulos</a></li>
          <li><a href="#mision">Misión y Visión</a></li>
          <li><a href="#equipo">Equipo</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <button className="gc-btn gc-btn--primary" onClick={() => navigate("/login")}>Iniciar Sesión</button>
      </nav>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero__grid"></div>
        <div className="home-hero__inner">
          <div>
            <div className="home-hero__badge">
              <span className="home-hero__badge-dot"></span>
              Plataforma Ganadera Profesional
            </div>
            <h1 className="home-hero__h1">La plataforma que su<span>finca necesitaba</span></h1>
            <p className="home-hero__p">GanaControl integra ganado, reproducción, sanidad, inventario, pasturas y finanzas en un solo sistema robusto diseñado para ganaderos colombianos que exigen precisión y control total.</p>
            <div className="home-hero__btns">
              <button className="home-hero__btn-main" onClick={() => navigate("/login")}>Iniciar Sesión →</button>
              <button className="home-hero__btn-ghost" onClick={() => document.getElementById("modulos")?.scrollIntoView({ behavior:"smooth" })}>Ver módulos</button>
            </div>
            <div className="home-hero__stats">
              {[["8","Módulos"],["100%","Colombiano"],["0","Errores"]].map(([n,l]) => (
                <div key={l}>
                  <div className="home-hero__stat-num">{n}</div>
                  <div className="home-hero__stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="home-hero__card">
            <div className="home-hero__card-bar">
              <div className="home-hero__card-dots">
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} className="home-hero__card-dot" style={{ background:c }}></div>)}
              </div>
              <span className="home-hero__card-title">GanaControl — Dashboard</span>
              <span></span>
            </div>
            <div className="home-hero__card-body">
              <div className="home-hero__card-kpis">
                {[["1,247","Ganado activo"],["$47.8M","Ingresos"],["94%","Al día"]].map(([v,l]) => (
                  <div key={l} className="home-hero__card-kpi">
                    <div className="home-hero__card-kpi-val">{v}</div>
                    <div className="home-hero__card-kpi-lbl">{l}</div>
                  </div>
                ))}
              </div>
              <table className="home-hero__card-table">
                <thead><tr><th>Animal</th><th>Estado</th><th>Cat.</th></tr></thead>
                <tbody>
                  {[["GN-001 · Cara Blanca","ok","Vaca"],["GN-002 · La Negra","warn","Vaca"],["GN-007 · Lucero","ok","Novillo"],["GN-012 · Torito Rey","info","Toro"]].map(([a,e,c]) => (
                    <tr key={a}><td>{a}</td><td><span className={`home-pill home-pill--${e}`}>{e==="ok"?"Activo":e==="warn"?"Gestante":"Vacunar"}</span></td><td>{c}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <div className="home-section--bg" id="modulos">
        <div className="home-section">
          <div className="home-center home-reveal">
            <span className="home-eyebrow">El sistema completo</span>
            <h2 className="home-h2">8 módulos integrados</h2>
          </div>
          <div className="home-modulos-grid">
            {MODULOS.map((m,i) => (
              <div key={i} className="home-modulo-card home-reveal">
                <div className="home-modulo-card__ico">{m.ico}</div>
                <div className="home-modulo-card__name">{m.nombre}</div>
                <div className="home-modulo-card__desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MISIÓN */}
      <div id="mision">
        <div className="home-section">
          <div className="home-center home-reveal">
            <span className="home-eyebrow">Quiénes somos</span>
            <h2 className="home-h2">Misión y Visión</h2>
          </div>
          <div className="home-mv-grid">
            {[
              { ico:"🎯", t:"Misión", txt:"Proveer a los ganaderos colombianos una plataforma tecnológica integral que digitalice y optimice cada proceso de la producción bovina — desde el nacimiento hasta la comercialización — reduciendo errores, mejorando la trazabilidad y aumentando la rentabilidad de cada finca." },
              { ico:"🔭", t:"Visión", txt:"Ser la plataforma de gestión ganadera líder en Colombia y Latinoamérica, reconocida por su robustez técnica, facilidad de uso y compromiso con la modernización del sector agropecuario hacia un modelo de agricultura de precisión sostenible y competitivo." },
            ].map(({ ico,t,txt }) => (
              <div key={t} className="home-mv-card home-reveal">
                <div className="home-mv-ico">{ico}</div>
                <h3 className="home-mv-title">{t}</h3>
                <div className="home-mv-line"></div>
                <p className="home-mv-text">{txt}</p>
              </div>
            ))}
          </div>
          <div className="home-valores">
            {[["💡","Innovación","Tecnología agropecuaria de vanguardia"],["🤝","Confiabilidad","Datos íntegros y siempre disponibles"],["🌱","Sostenibilidad","Apoyo al campo colombiano a largo plazo"],["🎯","Precisión","Cero errores en facturación y trazabilidad"]].map(([ico,v,d]) => (
              <div key={v} className="home-valor home-reveal">
                <div className="home-valor__ico">{ico}</div>
                <div className="home-valor__name">{v}</div>
                <div className="home-valor__desc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EQUIPO */}
      <div className="home-section--bg" id="equipo">
        <div className="home-section">
          <div className="home-center home-reveal">
            <span className="home-eyebrow">El equipo</span>
            <h2 className="home-h2">Quiénes construyen GanaControl</h2>
          </div>
          <div className="home-equipo-grid">
            {EQUIPO.map((e,i) => (
              <div key={i} className="home-equipo-card home-reveal">
                <div className="home-equipo-ico">{e.ico}</div>
                <div className="home-equipo-name">{e.nombre}</div>
                <div className="home-equipo-rol">{e.rol}</div>
                <p className="home-equipo-desc">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="home-cta" id="contacto">
        <div className="home-cta__ico">🐂</div>
        <h2 className="home-cta__h2">Acceda al sistema ahora</h2>
        <p className="home-cta__p">Ingrese a GanaControl y gestione su finca de forma profesional.</p>
        <button className="home-hero__btn-main" onClick={() => navigate("/login")}>Iniciar Sesión →</button>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-footer__brand">
          <div className="home-nav__logo-icon">🐂</div>
          <span className="home-footer__brand-name">GanaControl</span>
        </div>
        <ul className="home-footer__links">
          <li><a href="#modulos">Módulos</a></li>
          <li><a href="#mision">Misión</a></li>
          <li><a href="#equipo">Equipo</a></li>
        </ul>
        <span className="home-footer__copy">© 2025 GanaControl — Hecho en Colombia 🇨🇴</span>
      </footer>

    </div>
  );
}